import { useCallback, useState } from 'react'
import type { Flower, FlowerGardenConfig, GardenItem, LeafConfig, LeafData, StemCurve, TinyFlower } from './types'

const DEFAULT_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA']
const DEFAULT_FLOWER_TYPES: Flower['type'][] = ['daisy', 'sunflower', 'rose', 'dandelion']
const STEM_THICKNESSES: Flower['stemThickness'][] = ['thin', 'normal']

function generateId(): string {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
}

function randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function generateStemCurve(): StemCurve {
    const curve1 = (Math.random() - 0.5) * 4 // -2 to +2
    const sameDirection = Math.random() < 0.5
    const curve2 = sameDirection
        ? (Math.random() - 0.5) * 4
        : -curve1 + (Math.random() - 0.5) * 2
    return { curve1, curve2 }
}

function generateLeafConfig(): LeafConfig {
    const leafCountRoll = Math.random()
    let leafCount: number
    if (leafCountRoll < 0.15) leafCount = 0
    else if (leafCountRoll < 0.45) leafCount = 1
    else if (leafCountRoll < 0.8) leafCount = 2
    else leafCount = 3

    if (leafCount === 0) return []

    const leaves: LeafData[] = []
    const positions = Array.from({ length: leafCount }, () => 0.15 + Math.random() * 0.4).sort((a, b) => a - b)
    const startSide: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right'

    for (let i = 0; i < leafCount; i++) {
        const side: 'left' | 'right' = i % 2 === 0 ? startSide : startSide === 'left' ? 'right' : 'left'
        leaves.push({
            side,
            position: positions[i],
            size: 0.6 + Math.random() * 0.8,
        })
    }

    return leaves
}

function findOptimalX(items: GardenItem[], minX: number, maxX: number): number {
    if (items.length === 0) {
        return (minX + maxX) / 2
    }

    const positions = items.map((item) => item.data.x).sort((a, b) => a - b)

    let largestGap = positions[0] - minX
    let gapStart = minX
    let gapEnd = positions[0]

    for (let i = 0; i < positions.length - 1; i++) {
        const gap = positions[i + 1] - positions[i]
        if (gap > largestGap) {
            largestGap = gap
            gapStart = positions[i]
            gapEnd = positions[i + 1]
        }
    }

    const rightGap = maxX - positions[positions.length - 1]
    if (rightGap > largestGap) {
        largestGap = rightGap
        gapStart = positions[positions.length - 1]
        gapEnd = maxX
    }

    const mid = (gapStart + gapEnd) / 2
    const jitter = (Math.random() - 0.5) * Math.min(10, (gapEnd - gapStart) * 0.3)
    return Math.max(minX, Math.min(maxX, mid + jitter))
}

export interface UseFlowerGardenReturn {
    /** Current array of garden items */
    items: GardenItem[]
    /** Add a random flower to the garden */
    addFlower: () => void
    /** Add multiple flowers at once */
    addFlowers: (count: number) => void
    /** Clear all flowers from the garden */
    clear: () => void
    /** Remove a specific flower by ID */
    removeFlower: (id: string) => void
    /** Total number of flowers */
    count: number
}

/**
 * Hook to manage a flower garden's state.
 * Provides functions to add, remove, and clear flowers.
 */
export function useFlowerGarden(config: FlowerGardenConfig = {}): UseFlowerGardenReturn {
    const {
        colors = DEFAULT_COLORS,
        flowerTypes = DEFAULT_FLOWER_TYPES,
        tinyFlowerProbability = 0.35,
        minX = 3,
        maxX = 97,
    } = config

    const [items, setItems] = useState<GardenItem[]>([])

    const addFlower = useCallback(() => {
        setItems((prev) => {
            const stemCurve = generateStemCurve()
            const optimalX = findOptimalX(prev, minX, maxX)
            const roll = Math.random()

            let newItem: GardenItem

            if (roll >= tinyFlowerProbability) {
                // Regular flower
                const flower: Flower = {
                    id: generateId(),
                    x: optimalX,
                    color: randomChoice(colors),
                    type: randomChoice(flowerTypes),
                    height: 0.7 + Math.random() * 0.6,
                    scale: 0.7 + Math.random() * 0.6,
                    leafConfig: generateLeafConfig(),
                    rotation: (Math.random() - 0.5) * 14,
                    stemThickness: randomChoice(STEM_THICKNESSES),
                    stemCurve,
                }
                newItem = { type: 'flower', data: flower }
            } else {
                // Tiny flower
                const tinyFlower: TinyFlower = {
                    id: generateId(),
                    x: optimalX,
                    color: randomChoice(colors),
                    height: 0.6 + Math.random() * 0.5,
                    rotation: (Math.random() - 0.5) * 20,
                    stemCurve,
                }
                newItem = { type: 'tiny-flower', data: tinyFlower }
            }

            return [...prev, newItem]
        })
    }, [colors, flowerTypes, tinyFlowerProbability, minX, maxX])

    const addFlowers = useCallback(
        (count: number) => {
            for (let i = 0; i < count; i++) {
                // Stagger slightly for visual effect
                setTimeout(() => addFlower(), i * 100)
            }
        },
        [addFlower]
    )

    const clear = useCallback(() => {
        setItems([])
    }, [])

    const removeFlower = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.data.id !== id))
    }, [])

    return {
        items,
        addFlower,
        addFlowers,
        clear,
        removeFlower,
        count: items.length,
    }
}
