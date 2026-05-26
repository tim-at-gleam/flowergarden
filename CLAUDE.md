# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install
npm run typecheck   # tsc --noEmit
```

There is no test suite, lint config, or build step — the package ships TypeScript source directly (`main: src/index.ts`).

## Architecture

This is a single-purpose React component library that renders pixel-art flowers sprouting from a baseline. The design splits state, rendering, and styling along three deliberate seams; understand all three before changing anything.

### The three-layer split

1. **State (`src/use-flower-garden.ts`)** — `useFlowerGarden()` owns the array of `GardenItem`s. The non-obvious piece is `findOptimalX()`: each new flower is placed in the **largest current gap** between existing flowers (with jitter), not at a uniformly random x. This is why the garden looks evenly distributed even though flowers are added one at a time. `addFlowers(n)` staggers individual `addFlower()` calls 100ms apart so the sprout animations don't all fire on the same frame.

2. **Rendering (`src/flower-garden.tsx` + `src/pixel-flower.tsx`)** — `FlowerGarden` is a thin container that positions each item absolutely at `bottom: 0; left: x%`. `PixelFlower` / `PixelTinyFlower` do the actual SVG drawing. Stems are cubic Bézier paths whose control points (`stemCurve.curve1`, `curve2`) also drive leaf placement via `getCurveOffset()` — leaves ride the curve, they don't sit on a straight line. If you change the stem math, leaves must use the same curve formula or they'll detach visually.

3. **Animation (`src/flower-garden.css`)** — The sprout effect is a single CSS keyframe (`flower-garden-sprout`) applied to each item's wrapper. The animation transforms `scaleY` from 0→1 with `transform-origin: bottom center`, which is why flowers grow upward from the ground rather than scaling from their centers. The keyframe also preserves `translateX(-50%)` so the horizontal centering survives the animation. Consumers must either import `flower-garden.css` or define an equivalent `.flower-garden-sprout` class — without it, flowers appear instantly with no growth.

### Position modes

`FlowerGarden` supports two layouts via the `position` prop:

- `'relative'` (default): garden is `position: absolute` inside its parent, anchored to the parent's top. Flowers still grow from `bottom: 0` of the garden's 0-height container, so the parent itself needs height to be visible.
- `'fixed-bottom'`: garden is `position: fixed` to the viewport bottom. Used for footer / scroll-triggered placements where flowers should hug the bottom of the screen regardless of scroll position.

### Framer integration

Framer requires single-file Code Components and renders them in a server-side preview pass that crashes on top-level browser API access. The Framer-ready component (see `src/components/FlowerGardenFramer.tsx` if present) consolidates types, SVG renderers, hook logic, and CSS into one file, gates all browser work behind `useEffect`, and imports `addPropertyControls` / `ControlType` from `framer` — which resolves to a local no-op shim (`src/shims/framer.ts`) during Vite dev and to the real package inside Framer.

The example in `examples/framer-example.tsx` predates the consolidated file and still imports from `../src` (won't work pasted into Framer); prefer the single-file component for Framer use.
