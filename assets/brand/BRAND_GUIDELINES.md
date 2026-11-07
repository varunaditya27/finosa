# FinOSA — Brand identity v1.0

**Working name:** FinOSA (Financial Operating System Agent)

**Positioning:** A grounded personal-finance intelligence system that turns fragmented financial records into a coherent picture, trustworthy calculations, and useful decisions.

**Core brand idea:** From transactions to understanding.

**Primary tagline:** Know where you stand. See what comes next.

**Voice:** Observant, precise, useful, calm. Never overpromise financial outcomes or imply live banking connectivity in a sandbox prototype.

## Why this design

The logomark comprises three layered, flowing ledger strokes: different records becoming one coherent picture. A single warm citrus point represents the user's decision. This abstract mark is deliberately **not** a robot, coin, lock, arrow chart, mountain, or bank emblem.

The ivory-first visual system makes statements and insights readable and gives financial data room to breathe. The warm accent is reserved for a decision, a high-value highlight, or a moment of attention, not decorative noise.

## Palette

| Token | Color | Use |
|---|---|---|
| Ink | `#143C3A` | Main text, strongest strokes |
| Jade | `#1C827A` | Links, positive cues, diagram strokes |
| Jade bright | `#29A79C` | Decorative highlights and data series |
| Mint | `#DDEFE8` | Selection states, soft sections |
| Porcelain | `#F8F6EF` | Main brand background; light only |
| Citrus | `#E3B84E` | Focus point, sparingly |
| Muted | `#546C68` | Secondary text on white/porcelain after contrast testing |
| Hairline | `#DBE6E1` | Borders, dividers |
| White | `#FFFFFF` | Cards |

**Important:** Mint and citrus are backgrounds/highlights, not small-body-text colors. Verify component-level contrast during product implementation; target WCAG 2.2 AA, including 4.5:1 for regular text and 3:1 for meaningful UI graphical objects.

## Type

Use **Inter Display** for the brand wordmark and large headings, **Inter** for UI/body/data. If these are not available in a runtime, use local/system sans fallbacks. Do not redistribute the actual font files in the brand kit.

For numerical data, use tabular numerals, clear currency symbols and explicit periods. Never convey positive/negative states by color alone.

## Components

- Porcelain application background, white cards.
- Cards have rounded corners of 16px, subtle 1px boundaries rather than heavy shadows.
- Accent color reserved for information hierarchy and decision states.
- Monetary values and evidence should be prominent, chart decorations secondary.
- No default dark-mode variant: light theme is the identity.
- Never claim sandbox or sample data is a real-time live bank feed.

## GitHub asset usage

- `finosa-github-social-preview.png` is exactly 1280×640, intended for GitHub Settings → Social preview.
- `finosa-readme-banner.png` is 1600×520, intended for the beginning of README.md.
- `finosa-app-icon.png` is 1024×1024, with a solid light background and mark centered for platform masking.
- `finosa-avatar.png` is a square brand avatar. The GitHub repo itself doesn't offer a separate repo avatar; use as organization/profile avatar, app icon, or documentation icon.
- SVG masters are included for clean scaling.

## Voice examples

Good: “Your food spending increased 18% compared with your three-month average.”

Good: “This forecast excludes your credit card because its statement has not been imported.”

Avoid: “FinOSA knows everything about your money!”

Avoid: “Your spending is totally under control.”

## Sources informing practical specifications

- GitHub Docs, Customizing repository social preview: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview
- Apple Developer, App icons: https://developer.apple.com/design/human-interface-guidelines/app-icons
- W3C, WCAG 2.2: https://www.w3.org/TR/WCAG22/
