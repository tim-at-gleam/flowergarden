/**
 * Framer Example: Code Component for Framer
 *
 * This example shows how to create a Framer Code Component
 * that can be used in Framer websites.
 *
 * To use in Framer:
 * 1. Create a new Code Component in Framer
 * 2. Copy the FlowerGarden component files into your Framer project
 * 3. Adapt this example for your use case
 *
 * Note: You may need to adjust based on Framer's specific requirements.
 * Check with your team about Framer's Code Component API.
 */

import { useEffect, useState } from 'react'
import { FlowerGarden, useFlowerGarden } from '../src'

// Inline the CSS as a style tag for Framer (since CSS imports may not work)
const FLOWER_GARDEN_STYLES = `
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
`

interface FramerFlowerGardenProps {
    /** Number of flowers to show initially */
    initialFlowers?: number
    /** Whether to add flowers when component mounts */
    autoGrow?: boolean
    /** Delay between each flower when auto-growing (ms) */
    growDelay?: number
    /** Custom colors (comma-separated hex values) */
    colors?: string
    /** Z-index for the garden */
    zIndex?: number
}

/**
 * Framer Code Component: Flower Garden
 *
 * A decorative pixel-art flower garden that can be placed at the
 * bottom of a section or page.
 */
export function FramerFlowerGarden({
    initialFlowers = 5,
    autoGrow = true,
    growDelay = 150,
    colors = '#FF6B6B,#4ECDC4,#FFE66D,#95E1D3,#F38181',
    zIndex = 100,
}: FramerFlowerGardenProps) {
    const [styleInjected, setStyleInjected] = useState(false)

    // Parse colors from comma-separated string
    const colorArray = colors.split(',').map((c) => c.trim())

    const { items, addFlower } = useFlowerGarden({
        colors: colorArray,
        minX: 2,
        maxX: 98,
    })

    // Inject styles on mount
    useEffect(() => {
        if (styleInjected) return

        const styleId = 'flower-garden-styles'
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style')
            style.id = styleId
            style.textContent = FLOWER_GARDEN_STYLES
            document.head.appendChild(style)
        }
        setStyleInjected(true)
    }, [styleInjected])

    // Auto-grow flowers on mount
    useEffect(() => {
        if (!autoGrow || !styleInjected) return

        for (let i = 0; i < initialFlowers; i++) {
            setTimeout(() => addFlower(), i * growDelay)
        }
    }, [autoGrow, initialFlowers, growDelay, addFlower, styleInjected])

    if (!styleInjected) return null

    return <FlowerGarden items={items} position="fixed-bottom" zIndex={zIndex} />
}

// Default export for Framer
export default FramerFlowerGarden
