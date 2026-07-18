<#
Starts a local serve.js test server on port 5174 and exposes it with a
Cloudflare Quick Tunnel.

Privacy notes:
- The tunnel is public to anyone who has the generated trycloudflare URL.
- This script serves a temporary allowlisted snapshot instead of the repo root.
- The snapshot contains only index.html, assets/, css/, js/, and tools/serve.js.
- While the tunnel is running, index.html, assets/, css/, and js/ are mirrored
  into the snapshot once per second so the public URL stays current.
- The copied serve.js is bound to 127.0.0.1 before starting.
#>

[CmdletBinding()]
param(
  [ValidateRange(1, 65535)]
  [int]$Port = 5174,

  [switch]$CheckOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[quick-tunnel] $Message" -ForegroundColor Cyan
}

function Stop-WithError {
  param([string]$Message)
  Write-Error $Message
  exit 1
}

function Test-LocalPortInUse {
  param([int]$PortToCheck)

  $listener = $null
  try {
    $address = [System.Net.IPAddress]::Parse("127.0.0.1")
    $listener = [System.Net.Sockets.TcpListener]::new($address, $PortToCheck)
    $listener.Start()
    return $false
  } catch {
    return $true
  } finally {
    if ($null -ne $listener) {
      $listener.Stop()
    }
  }
}

function Assert-SafeTempPath {
  param([string]$PathToCheck)

  $tempRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
  $fullPath = [System.IO.Path]::GetFullPath($PathToCheck)
  $leafName = Split-Path -Leaf $fullPath

  if (-not $fullPath.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    Stop-WithError "Refusing to touch a path outside the Windows temp directory."
  }

  if (-not $leafName.StartsWith("camping-idle-quick-tunnel", [System.StringComparison]::OrdinalIgnoreCase)) {
    Stop-WithError "Refusing to touch an unexpected temp directory."
  }

  return $fullPath
}

function Invoke-RobocopyMirror {
  param(
    [string]$Source,
    [string]$Destination,
    [string]$RobocopyPath
  )

  if (-not (Test-Path -LiteralPath $Destination)) {
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
  }

  & $RobocopyPath `
    $Source `
    $Destination `
    /MIR `
    /R:1 `
    /W:1 `
    /COPY:DAT `
    /DCOPY:DAT `
    /XJ `
    /NFL `
    /NDL `
    /NJH `
    /NJS `
    /NP | Out-Null

  $robocopyExitCode = $LASTEXITCODE
  if ($robocopyExitCode -gt 7) {
    throw "robocopy failed for '$Source' with exit code $robocopyExitCode."
  }
}

function Sync-AllowlistedSnapshot {
  param(
    [string]$RepoRoot,
    [string]$PublishRoot,
    [string]$RobocopyPath
  )

  $publishFullPath = Assert-SafeTempPath $PublishRoot
  $indexSource = Join-Path $RepoRoot "index.html"
  $indexDestination = Join-Path $publishFullPath "index.html"

  if (Test-Path -LiteralPath $indexSource) {
    $sourceInfo = Get-Item -LiteralPath $indexSource
    $destinationInfo = Get-Item -LiteralPath $indexDestination -ErrorAction SilentlyContinue
    if ($null -eq $destinationInfo -or
      $sourceInfo.Length -ne $destinationInfo.Length -or
      $sourceInfo.LastWriteTimeUtc -ne $destinationInfo.LastWriteTimeUtc) {
      Copy-Item -LiteralPath $indexSource -Destination $indexDestination -Force
    }
  } elseif (Test-Path -LiteralPath $indexDestination) {
    Remove-Item -LiteralPath $indexDestination -Force
  }

  foreach ($folderName in @("assets", "css", "js")) {
    $sourceFolder = Join-Path $RepoRoot $folderName
    $destinationFolder = Join-Path $publishFullPath $folderName

    if (Test-Path -LiteralPath $sourceFolder) {
      Invoke-RobocopyMirror `
        -Source $sourceFolder `
        -Destination $destinationFolder `
        -RobocopyPath $RobocopyPath
    } elseif (Test-Path -LiteralPath $destinationFolder) {
      Remove-Item -LiteralPath $destinationFolder -Recurse -Force
    }
  }
}

function Initialize-PublicSnapshot {
  param(
    [string]$RepoRoot,
    [string]$PublishRoot,
    [string]$RobocopyPath
  )

  $publishFullPath = Assert-SafeTempPath $PublishRoot

  if (Test-Path -LiteralPath $publishFullPath) {
    Remove-Item -LiteralPath $publishFullPath -Recurse -Force
  }

  New-Item -ItemType Directory -Path $publishFullPath | Out-Null

  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot "index.html"))) {
    Stop-WithError "Missing index.html."
  }

  Sync-AllowlistedSnapshot `
    -RepoRoot $RepoRoot `
    -PublishRoot $publishFullPath `
    -RobocopyPath $RobocopyPath

  $sourceServe = Join-Path $RepoRoot "tools\serve.js"
  if (-not (Test-Path -LiteralPath $sourceServe)) {
    Stop-WithError "Missing tools\serve.js."
  }

  $tempToolsDir = Join-Path $publishFullPath "tools"
  New-Item -ItemType Directory -Path $tempToolsDir | Out-Null

  $serveText = Get-Content -LiteralPath $sourceServe -Raw
  $serveText = $serveText -replace '\.listen\(port,\s*"0\.0\.0\.0"', '.listen(port, "127.0.0.1"'
  Set-Content -LiteralPath (Join-Path $tempToolsDir "serve.js") -Value $serveText -Encoding UTF8 -NoNewline

  return $publishFullPath
}

function Wait-ForLocalServer {
  param(
    [string]$Url,
    [System.Diagnostics.Process]$Process
  )

  for ($attempt = 0; $attempt -lt 40; $attempt += 1) {
    if ($Process.HasExited) {
      Stop-WithError "serve.js exited before becoming ready."
    }

    try {
      Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 1 | Out-Null
      return
    } catch {
      Start-Sleep -Milliseconds 250
    }
  }

  Stop-WithError "Timed out waiting for $Url."
}

function Wait-ForQuickTunnelUrl {
  param(
    [System.Diagnostics.Process]$Process,
    [string]$StandardOutputLog,
    [string]$StandardErrorLog
  )

  for ($attempt = 0; $attempt -lt 180; $attempt += 1) {
    $Process.Refresh()
    if ($Process.HasExited) {
      Stop-WithError "cloudflared exited before publishing a Quick Tunnel URL."
    }

    $logText = ""
    if (Test-Path -LiteralPath $StandardOutputLog) {
      $logText += Get-Content -LiteralPath $StandardOutputLog -Raw -ErrorAction SilentlyContinue
    }
    if (Test-Path -LiteralPath $StandardErrorLog) {
      $logText += "`n" + (Get-Content -LiteralPath $StandardErrorLog -Raw -ErrorAction SilentlyContinue)
    }

    $urlMatch = [regex]::Match($logText, 'https://[a-zA-Z0-9-]+\.trycloudflare\.com')
    if ($urlMatch.Success) {
      return $urlMatch.Value
    }

    Start-Sleep -Seconds 1
  }

  Stop-WithError "Timed out waiting for the Quick Tunnel URL."
}

$scriptDir = Split-Path -Parent $PSCommandPath
$repoRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path
$publishRoot = Join-Path ([System.IO.Path]::GetTempPath()) "camping-idle-quick-tunnel-public"
$logRoot = Assert-SafeTempPath (Join-Path ([System.IO.Path]::GetTempPath()) "camping-idle-quick-tunnel-logs")
$localUrl = "http://127.0.0.1:$Port/"
$serverProcess = $null
$cloudflaredProcess = $null

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($null -eq $nodeCommand) {
  Stop-WithError "Node.js was not found in PATH. Install Node.js or open a shell where node is available."
}

$cloudflaredCommand = Get-Command cloudflared -ErrorAction SilentlyContinue
if ($null -eq $cloudflaredCommand) {
  if ($CheckOnly) {
    Write-Warning "cloudflared was not found in PATH. Install Cloudflare cloudflared before starting the tunnel."
  } else {
    Stop-WithError "cloudflared was not found in PATH. Install Cloudflare cloudflared before running this script."
  }
}

$robocopyCommand = Get-Command robocopy.exe -ErrorAction SilentlyContinue
if ($null -eq $robocopyCommand) {
  Stop-WithError "robocopy.exe was not found. This script requires robocopy for snapshot mirroring."
}

if (-not $CheckOnly -and (Test-LocalPortInUse $Port)) {
  Stop-WithError "Port $Port is already in use. Stop the existing process or pass a different -Port."
}

$publishFullPath = Initialize-PublicSnapshot `
  -RepoRoot $repoRoot `
  -PublishRoot $publishRoot `
  -RobocopyPath $robocopyCommand.Source

Write-Step "Prepared privacy-scoped public snapshot."
Write-Step "Included only: index.html, assets/, css/, js/, tools/serve.js."
Write-Step "Excluded repo metadata and private working files such as .git, .claude, .agents, project-info."
Write-Step "During the tunnel, allowlisted game files will be mirrored every second."

if ($CheckOnly) {
  Write-Step "CheckOnly complete. No server or tunnel was started."
  if (Test-Path -LiteralPath $publishFullPath) {
    Remove-Item -LiteralPath $publishFullPath -Recurse -Force -ErrorAction SilentlyContinue
  }
  exit 0
}

try {
  if (-not (Test-Path -LiteralPath $logRoot)) {
    New-Item -ItemType Directory -Path $logRoot | Out-Null
  }

  $serverOut = Join-Path $logRoot "serve.stdout.log"
  $serverErr = Join-Path $logRoot "serve.stderr.log"
  $cloudflaredOut = Join-Path $logRoot "cloudflared.stdout.log"
  $cloudflaredErr = Join-Path $logRoot "cloudflared.stderr.log"
  $serveScript = Join-Path $publishFullPath "tools\serve.js"

  Remove-Item -LiteralPath $serverOut, $serverErr, $cloudflaredOut, $cloudflaredErr -Force -ErrorAction SilentlyContinue

  Write-Step "Starting serve.js at $localUrl"
  $serverProcess = Start-Process `
    -FilePath $nodeCommand.Source `
    -ArgumentList @($serveScript, $Port) `
    -WorkingDirectory $publishFullPath `
    -WindowStyle Hidden `
    -PassThru `
    -RedirectStandardOutput $serverOut `
    -RedirectStandardError $serverErr

  Wait-ForLocalServer -Url $localUrl -Process $serverProcess

  Write-Warning "Cloudflare Quick Tunnel creates a public URL. Share it only with trusted testers."
  Write-Warning "Close this window or press Ctrl+C when finished; child processes and the temporary snapshot will be cleaned up."
  Write-Step "Starting Cloudflare Quick Tunnel for $localUrl"

  $cloudflaredProcess = Start-Process `
    -FilePath $cloudflaredCommand.Source `
    -ArgumentList @("tunnel", "--url", $localUrl) `
    -WorkingDirectory $publishFullPath `
    -WindowStyle Hidden `
    -PassThru `
    -RedirectStandardOutput $cloudflaredOut `
    -RedirectStandardError $cloudflaredErr

  $quickTunnelUrl = Wait-ForQuickTunnelUrl `
    -Process $cloudflaredProcess `
    -StandardOutputLog $cloudflaredOut `
    -StandardErrorLog $cloudflaredErr
  Write-Step "Quick Tunnel URL: $quickTunnelUrl"
  Write-Step "Watching allowlisted files for changes. Refresh the browser after saving."

  $lastSyncWarning = ""
  while (-not $cloudflaredProcess.HasExited) {
    try {
      Sync-AllowlistedSnapshot `
        -RepoRoot $repoRoot `
        -PublishRoot $publishFullPath `
        -RobocopyPath $robocopyCommand.Source
      $lastSyncWarning = ""
    } catch {
      $syncWarning = $_.Exception.Message
      if ($syncWarning -ne $lastSyncWarning) {
        Write-Warning "Snapshot sync failed: $syncWarning"
        $lastSyncWarning = $syncWarning
      }
    }

    Start-Sleep -Seconds 1
    $cloudflaredProcess.Refresh()
  }

  Stop-WithError "cloudflared exited unexpectedly with code $($cloudflaredProcess.ExitCode)."
} finally {
  if ($null -ne $cloudflaredProcess -and -not $cloudflaredProcess.HasExited) {
    Write-Step "Stopping cloudflared."
    Stop-Process -Id $cloudflaredProcess.Id -Force -ErrorAction SilentlyContinue
  }

  if ($null -ne $serverProcess -and -not $serverProcess.HasExited) {
    Write-Step "Stopping serve.js."
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
  }

  $publishFullPath = Assert-SafeTempPath $publishRoot
  if (Test-Path -LiteralPath $publishFullPath) {
    Remove-Item -LiteralPath $publishFullPath -Recurse -Force -ErrorAction SilentlyContinue
  }

  $logFullPath = Assert-SafeTempPath $logRoot
  if (Test-Path -LiteralPath $logFullPath) {
    Remove-Item -LiteralPath $logFullPath -Recurse -Force -ErrorAction SilentlyContinue
  }
}
