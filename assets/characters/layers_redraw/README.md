# Camper Redrawn Layer Set

This folder is for the new camper customization layers.

Reference composite:
`../polished/camper_sprite_sheet_polished_all.png`

Required final sheet:
- 896 x 432 px
- 7 columns x 3 rows
- 128 x 144 px per frame

Layer order:
1. body_base
2. eyes
3. nose
4. mouth
5. hair
6. bottoms
7. top

Notes:
- Layers in this folder are intended to be redrawn from the polished reference, not reused from the earlier cut-mask attempt in `../layers`.
- Wood belongs in `body_base`.
- Facial feature layers are overlays; the base face should not contain holes.
- Clothing layers may use masks for body/wood occlusion so the stacked result matches the polished reference.
