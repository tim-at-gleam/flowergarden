# Flower Garden

A pixel-art flower garden for Gleam's Framer site. Drop the component at the
very bottom of your page; when the user scrolls to it, the garden plants
itself one flower per second, up to 120 flowers.

Ships as a single self-contained `.tsx` file you can paste into a Framer
Code File, plus a Vite playground so you can preview it locally first.

## What's in the box

| File | Purpose |
|---|---|
| `src/components/FlowerGardenFramer.tsx` | Single-file Framer Code Component — everything (types, SVG renderers, state, CSS, property controls) inlined. |
| `src/` (other files) | The original modular library — `useFlowerGarden`, `FlowerGarden`, `PixelFlower`, etc. Useful as a regular npm-style import; **not** what you paste into Framer. |

## Run the playground

```sh
npm install
npm run dev
```

Then open `http://localhost:5173`. Scroll down past the hero and the spacer
— the garden sits at the bottom of the page and starts blooming when it
crosses into the viewport.

## Paste the component into Framer

Three things broke this last time. Fix them in this order:

### 1. Use the right entry point

In your Framer project:

1. Open the **Assets** panel (sidebar).
2. Choose **Code**.
3. Click **"Create Code File"** — not Code Overrides, not a generic "new file".
4. Name it `FlowerGardenFramer`.
5. Paste the entire contents of `src/components/FlowerGardenFramer.tsx`.
6. Save.

The component appears in the Insert menu under **Code Components** and is
draggable onto the canvas. Place it as the **last item in the vertical
stack** of your page (or inside a fixed-height section at the bottom) so
that "entering the viewport" maps to "user has scrolled to the bottom."

### 2. Don't touch browser APIs at module top level

Framer renders code components in a server-side pass during preview. Any
code that reads `window`, `document`, or constructs an `IntersectionObserver`
at module top level (or in the render body) will crash that pass — and
Framer will silently hide the component from the Insert menu.

`FlowerGardenFramer.tsx` already follows the rule: the observer and the
growth interval both live inside `useEffect`. If you fork it, keep them
there.

### 3. Make sure exactly one component is exported

The file uses both:

```ts
export default function FlowerGardenFramer(props) { … }
export { FlowerGardenFramer }
```

Framer's resolver accepts either, but having both means the component is
findable whether the Insert menu looks for the default export or the named
export.

### If the component still doesn't appear

Open the browser console while in Framer. Look for an identifier like
`code-crash:abc123:def456`. Copy it, hit **Cmd+K** in Framer, and paste —
Framer will jump to the component that crashed and show the error.

## How the animation works

- **Trigger:** an `IntersectionObserver` watches the component's root. When
  any part of it crosses `triggerThreshold` (default 10%) of the viewport,
  the observer fires once, sets state, and disconnects.
- **Growth:** once triggered, a `setInterval` adds one flower every
  `growIntervalMs` (default 1000ms).
- **Cap:** the interval stops adding flowers once `items.length` reaches
  `maxFlowers` (default 120).
- **Placement:** each new flower is positioned in the largest current gap
  between existing flowers (with a small jitter), so the bed stays evenly
  distributed as it fills in — not random-clumpy.
- **Per-flower sprout:** each flower wrapper gets a `scaleY: 0 → 1`
  keyframe with a bouncy cubic-bezier, anchored to `transform-origin:
  bottom center`, so flowers visibly grow up from the ground.
- **Reduced motion:** `prefers-reduced-motion: reduce` disables the
  per-flower sprout. The 1Hz growth pacing is preserved — flowers still
  arrive over time, they just pop in instead of growing.

## Property controls

| Prop | Type | Default | Range | Notes |
|---|---|---|---|---|
| `maxFlowers` | Number | `120` | `1–500` | Hard cap on planted flowers. |
| `growIntervalMs` | Number | `1000` | `100–5000` | Milliseconds between flowers. |
| `colors` | String | 8 pastel hexes | — | Comma-separated hex codes for petal colors. |
| `tinyFlowerProbability` | Number | `0.35` | `0–1` | Chance of tiny flower vs full flower. |
| `zIndex` | Number | `100` | `0–9999` | Stack order for the garden layer. |
| `triggerThreshold` | Number | `0.1` | `0–1` | IntersectionObserver threshold for kickoff. |

## Layout note

The garden's flowers anchor to the **bottom edge of the component's own
box**. Give the component real height in Framer (e.g. 240–320px) so the
flowers have somewhere to sit. The component itself is `pointer-events:
none` and `aria-hidden="true"`; it won't intercept clicks or affect
screen readers.

## Repo layout

```
.
├── README.md
├── CLAUDE.md
├── package.json
├── vite.config.ts       # aliases "framer" → src/shims/framer.ts
├── tsconfig.json
├── index.html
├── examples/            # legacy modular-library examples
└── src/
    ├── main.tsx
    ├── App.tsx          # playground only
    ├── styles.css       # playground only
    ├── shims/
    │   └── framer.ts    # no-op for local dev; real `framer` resolves in Framer
    ├── components/
    │   └── FlowerGardenFramer.tsx  # the file you paste into Framer
    │
    │ # ─── modular library (separate use case from Framer) ───
    ├── index.ts
    ├── flower-garden.tsx
    ├── pixel-flower.tsx
    ├── use-flower-garden.ts
    ├── types.ts
    └── flower-garden.css
```

The Framer shim is the trick that lets a single file work in both places:
locally, `import { addPropertyControls, ControlType } from "framer"`
resolves to harmless stubs via the Vite alias; in Framer, the same line
resolves to the real package and wires up the property controls.

## The modular library (non-Framer use)

If you want to use the garden inside another React app and don't need the
single-file constraint, the original modular API is still exported from
`src/index.ts`:

```tsx
import { FlowerGarden, useFlowerGarden } from "flower-garden"
import "flower-garden/src/flower-garden.css"

function MyComponent() {
  const { items, addFlower } = useFlowerGarden()
  return (
    <div style={{ position: "relative", minHeight: 200 }}>
      <button onClick={addFlower}>Plant a Flower</button>
      <FlowerGarden items={items} />
    </div>
  )
}
```

See `examples/basic-example.tsx` and `examples/footer-example.tsx` for more.
Note that `examples/framer-example.tsx` predates the consolidated single-
file component — for Framer use, prefer `FlowerGardenFramer.tsx` instead.

## License

MIT
