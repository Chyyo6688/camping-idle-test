<#
Starts a local serve.js test server on port 5174 and exposes it with a
Cloudflare Quick Tunnel.

Privacy notes:
- The tunnel is public to anyone who has the generated trycloudflare URL.
- This script serves a temporary allowlisted snapshot instead of the repo root.
- The snapshot contains only index.html, assets/, css/, js/, and tools/serve.js.
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

function Copy-PublicSnapshot {
  param(
    [string]$RepoRoot,
    [string]$PublishRoot
  )

  $publishFullPath = Assert-SafeTempPath $PublishRoot

  if (Test-Path -LiteralPath $publishFullPath) {
    Remove-Item -LiteralPath $publishFullPath -Recurse -Force
  }

  New-Item -ItemType Directory -Path $publishFullPath | Out-Null

  $indexPath = Join-Path $RepoRoot "index.html"
  if (-not (Test-Path -LiteralPath $indexPath)) {
    Stop-WithError "Missing index.html."
  }

  Copy-Item -LiteralPath $indexPath -Destination (Join-Path $publishFullPath "index.html") -Force

  foreach ($folderName in @("assets", "css", "js")) {
    $sourceFolder = Join-Path $RepoRoot $folderName
    if (Test-Path -LiteralPath $sourceFolder) {
      Copy-Item -LiteralPath $sourceFolder -Destination (Join-Path $publishFullPath $folderName) -Recurse -Force
    }
  }

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

$scriptDir = Split-Path -Parent $PSCommandPath
$repoRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path
$publishRoot = Join-Path ([System.IO.Path]::GetTempPath()) "camping-idle-quick-tunnel-public"
$logRoot = Assert-SafeTempPath (Join-Path ([System.IO.Path]::GetTempPath()) "camping-idle-quick-tunnel-logs")
$localUrl = "http://127.0.0.1:$Port/"
$serverProcess = $null

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

if (-not $CheckOnly -and (Test-LocalPortInUse $Port)) {
  Stop-WithError "Port $Port is already in use. Stop the existing process or pass a different -Port."
}

$publishFullPath = Copy-PublicSnapshot -RepoRoot $repoRoot -PublishRoot $publishRoot

Write-Step "Prepared privacy-scoped public snapshot."
Write-Step "Included only: index.html, assets/, css/, js/, tools/serve.js."
Write-Step "Excluded repo metadata and private working files such as .git, .claude, .agents, project-info."

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
  $serveScript = Join-Path $publishFullPath "tools\serve.js"

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
  Write-Warning "Close this window or press Ctrl+C when finished; the local server will be stopped."
  Write-Step "Starting Cloudflare Quick Tunnel for $localUrl"

  & $cloudflaredCommand.Source tunnel --url $localUrl
} finally {
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
