/**
 * Basic Example: Flower Garden with Button Trigger
 *
 * This example shows a simple implementation where clicking a button
 * adds a new flower to the garden.
 */

import { FlowerGarden, useFlowerGarden } from '../src'
import '../src/flower-garden.css'

export function BasicExample() {
    const { items, addFlower, clear, count } = useFlowerGarden({
        // Optional: customize colors
        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'],
    })

    return (
        <div style={{ position: 'relative', minHeight: '200px', border: '1px solid #ccc' }}>
            {/* Control buttons */}
            <div style={{ padding: '16px' }}>
                <button onClick={addFlower} style={{ marginRight: '8px' }}>
                    Plant a Flower
                </button>
                <button onClick={clear} disabled={count === 0}>
                    Clear Garden ({count})
                </button>
            </div>

            {/* The garden grows from the top edge of this container */}
            <FlowerGarden items={items} />
        </div>
    )
}
