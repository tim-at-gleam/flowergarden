# Flower Garden

A delightful pixel-art flower garden React component with sprouting animations. Perfect for adding whimsical decorative elements to your website.

![Flower Types](docs/flower-types.png)

## Features

- **4 flower types**: Daisy, Sunflower, Rose, Dandelion (plus tiny flower variant)
- **Procedural generation**: Each flower is randomly generated with unique characteristics
- **Sprouting animation**: Flowers grow from the ground with a satisfying bounce
- **Configurable**: Custom colors, flower types, positioning
- **Lightweight**: Pure SVG, no external dependencies beyond React
- **TypeScript**: Full type definitions included

## Installation

Copy the `src` folder into your project, or install as a local package:

```bash
# If published to npm
npm install flower-garden

# Or copy files directly
cp -r src/ your-project/src/flower-garden/
```

## Quick Start

```tsx
import { FlowerGarden, useFlowerGarden } from './flower-garden'
import './flower-garden/flower-garden.css'

function MyComponent() {
    const { items, addFlower } = useFlowerGarden()

    return (
        <div style={{ position: 'relative', minHeight: '100px' }}>
            <button onClick={addFlower}>Plant a Flower</button>
            <FlowerGarden items={items} />
        </div>
    )
}
```

## API Reference

### `<FlowerGarden />`

The main container component that renders flowers.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `GardenItem[]` | required | Array of flowers to render |
| `className` | `string` | `''` | Additional CSS class |
| `style` | `CSSProperties` | - | Inline styles |
| `position` | `'relative' \| 'fixed-bottom'` | `'relative'` | Positioning mode |
| `zIndex` | `number` | `1000` | Z-index for fixed positioning |

### `useFlowerGarden(config?)`

Hook to manage flower garden state.

**Config options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `colors` | `string[]` | 8 pastel colors | Hex colors for petals |
| `flowerTypes` | `FlowerType[]` | all 4 types | Which flower types to include |
| `tinyFlowerProbability` | `number` | `0.35` | Chance of tiny vs regular flower |
| `minX` | `number` | `3` | Minimum horizontal position (%) |
| `maxX` | `number` | `97` | Maximum horizontal position (%) |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `items` | `GardenItem[]` | Current flowers |
| `addFlower` | `() => void` | Add a random flower |
| `addFlowers` | `(count: number) => void` | Add multiple flowers |
| `clear` | `() => void` | Remove all flowers |
| `removeFlower` | `(id: string) => void` | Remove specific flower |
| `count` | `number` | Total flower count |

## Usage Examples

### Basic: Button Trigger

```tsx
function BasicExample() {
    const { items, addFlower, clear } = useFlowerGarden()

    return (
        <div style={{ position: 'relative', height: '200px' }}>
            <button onClick={addFlower}>Plant</button>
            <button onClick={clear}>Clear</button>
            <FlowerGarden items={items} />
        </div>
    )
}
```

### Footer: Scroll-Triggered

```tsx
function FooterGarden() {
    const { items, addFlowers } = useFlowerGarden({ minX: 2, maxX: 98 })
    const footerRef = useRef(null)
    const [triggered, setTriggered] = useState(false)

    useEffect(() => {
        if (triggered) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setTriggered(true)
                    addFlowers(8)
                }
            },
            { threshold: 0.1 }
        )

        if (footerRef.current) observer.observe(footerRef.current)
        return () => observer.disconnect()
    }, [triggered, addFlowers])

    return (
        <>
            <footer ref={footerRef}>Footer content</footer>
            <FlowerGarden items={items} position="fixed-bottom" />
        </>
    )
}
```

### Custom Colors

```tsx
const { items, addFlower } = useFlowerGarden({
    colors: ['#E8A0BF', '#BA90C6', '#C0DBEA', '#FDF4F5'],
    flowerTypes: ['daisy', 'rose'], // Only daisies and roses
})
```

## Using with Framer

See `examples/framer-example.tsx` for a ready-to-use Framer Code Component.

Key considerations for Framer:
1. CSS must be injected via `<style>` tag (see example)
2. Use `position="fixed-bottom"` for footer placement
3. Configure props through Framer's property controls

## CSS Animation

The sprouting animation is defined in `flower-garden.css`. Include it in your project:

```tsx
import './flower-garden/flower-garden.css'
```

Or add the keyframes manually:

```css
@keyframes flower-garden-sprout {
    0% {
        transform: translateX(-50%) scaleY(0);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: translateX(-50%) scaleY(1);
        opacity: 1;
    }
}

.flower-garden-sprout {
    animation: flower-garden-sprout 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

## Flower Types

| Type | Description |
|------|-------------|
| `daisy` | Classic flower with cross-pattern petals and yellow center |
| `sunflower` | Large brown center with pointed yellow petals |
| `rose` | Layered petals with spiral center hint |
| `dandelion` | Fluffy puffball with wispy edges |
| tiny flower | Smaller, simpler variant (auto-selected) |

## File Structure

```
flower-garden/
├── src/
│   ├── index.ts              # Main exports
│   ├── flower-garden.tsx     # Container component
│   ├── pixel-flower.tsx      # SVG flower components
│   ├── use-flower-garden.ts  # State management hook
│   ├── types.ts              # TypeScript definitions
│   └── flower-garden.css     # Animation styles
├── examples/
│   ├── basic-example.tsx     # Simple button trigger
│   ├── footer-example.tsx    # Scroll-triggered footer
│   └── framer-example.tsx    # Framer Code Component
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
