# Visual identity and assets

The redesign follows the user's supplied brand board.

Light palette: #8B1E2D burgundy, #1D1B1A ink, #EDE7DF parchment, #C9C2B7 stone.
Dark palette: #141312 background, #2A2927 surface, #D6D1C7 text, #9F9A91 secondary text, #B23A48 accent.
Fonts: self-hosted Noto Naskh Arabic for headings and reading; IBM Plex Sans Arabic for controls and metadata. OFL licenses accompany the font files in public/fonts.

## Asset provenance and prompts

These assets were produced using the built-in image generation tool, visually inspected, and copied into this workspace. The original generated files were retained. The supplied board was used as a style reference for the wordmark and collage.

### public/brand/wordmark.png
Prompt: Extract/reproduce only the black Arabic calligraphic wordmark «الهامش» with its short deep burgundy slanted underline from the top-right logo panel. Preserve the Arabic lettering, tall ascenders, sweeping baseline, and proportions. Remove grid lines, background, labels, panels, and surrounding content. Single centered wordmark on a genuinely transparent canvas, with a small transparent margin. Black #1D1B1A and red #8B1E2D. No extra text, badge, rectangle, or mockup.

### public/brand/editorial-collage.png
Prompt: One landscape 3:2 editorial collage, using the board only as a style reference. Large grainy monochrome classical sculptural face fragment on the left, layered with tactile torn burgundy #8B1E2D, charcoal #1D1B1A, parchment #EDE7DF and beige #D7BFA3 paper. Ghostly illegible manuscript traces, irregular edges, paper fibers and antique printmaking grain. Quieter parchment and vertical black/red torn paper on the right. Flat scanned collage, no mockup, readable text, logos, icons, modern gradients or green.

### public/brand/editorial-photos.png
Prompt: One 2x2 contact sheet of four different monochrome literary editorial photographs, no borders, gutters, labels or overlap. Overall landscape 3:2. Top left: silent old room, wooden chair, rectangular window light and plaster-wall shadows. Top right: old Levantine rooftops, dome and minaret, cloudy sky. Bottom left: letter and worn envelope on a wooden table, illegible handwriting. Bottom right: olive branch in dark glass vase by a window. Analogue film grain, charcoal blacks, warm highlights, art-book textures. Each image fills its quarter for individual CSS positioning.

The photo-style assets are illustrative generated images, not documentary photographs.

## Verification

TypeScript and production build passed. Isolated Chromium preview checked desktop (1440px) and mobile (390px), fonts, search, category filters, bookmarks, reading, paragraph selection, dark theme, dialogs and horizontal overflow. No browser page errors. Preview reads existing hosted data; writes are disabled. Screenshots are in ignored outputs/.
