import type { FlowerType, LeafConfig, StemCurve, StemThickness } from './types'

interface PixelFlowerProps {
    color: string
    type: FlowerType
    height: number
    scale?: number
    leafConfig: LeafConfig
    rotation?: number
    stemThickness?: StemThickness
    stemCurve?: StemCurve
}

// Stem colors for variety
const STEM_COLOR = '#4A7C59'
const LEAF_COLOR = '#6B8E23'
const CENTER_COLOR = '#FFD93D'

// Stem width mapping
const STEM_WIDTHS: Record<StemThickness, { width: number; x: number }> = {
    thin: { width: 1, x: 7.5 },
    normal: { width: 1.5, x: 7.25 },
    thick: { width: 1.5, x: 7.25 },
}

// Daisy - classic flower with rounded petals
function DaisyFlower({ color }: { color: string }) {
    return (
        <>
            {/* Flower center */}
            <rect x="6" y="4" width="4" height="4" fill={CENTER_COLOR} />
            {/* Petals - cross pattern */}
            <rect x="6" y="0" width="4" height="4" fill={color} />
            <rect x="6" y="8" width="4" height="4" fill={color} />
            <rect x="2" y="4" width="4" height="4" fill={color} />
            <rect x="10" y="4" width="4" height="4" fill={color} />
            {/* Corner petals */}
            <rect x="3" y="1" width="3" height="3" fill={color} opacity="0.8" />
            <rect x="10" y="1" width="3" height="3" fill={color} opacity="0.8" />
            <rect x="3" y="8" width="3" height="3" fill={color} opacity="0.8" />
            <rect x="10" y="8" width="3" height="3" fill={color} opacity="0.8" />
        </>
    )
}

// Sunflower - large center with small petals
function SunflowerFlower({ color }: { color: string }) {
    return (
        <>
            {/* Large brown center */}
            <rect x="5" y="3" width="6" height="6" fill="#8B4513" />
            <rect x="6" y="4" width="4" height="4" fill="#654321" />
            {/* Petals around - pointed */}
            <rect x="6" y="0" width="4" height="3" fill={color} />
            <rect x="6" y="9" width="4" height="3" fill={color} />
            <rect x="2" y="4" width="3" height="4" fill={color} />
            <rect x="11" y="4" width="3" height="4" fill={color} />
            {/* Diagonal petals */}
            <rect x="3" y="1" width="3" height="2" fill={color} />
            <rect x="10" y="1" width="3" height="2" fill={color} />
            <rect x="3" y="9" width="3" height="2" fill={color} />
            <rect x="10" y="9" width="3" height="2" fill={color} />
        </>
    )
}

// Rose - layered spiral petals with rounded bottom
function RoseFlower({ color }: { color: string }) {
    return (
        <>
            {/* Outer petals - main body */}
            <rect x="3" y="3" width="10" height="7" fill={color} />
            {/* Bottom curve - narrower to create rounded effect */}
            <rect x="5" y="10" width="6" height="2" fill={color} />
            {/* Inner darker layer */}
            <rect x="5" y="4" width="6" height="5" fill={color} opacity="0.7" />
            {/* Center spiral hint */}
            <rect x="6" y="5" width="4" height="4" fill={color} opacity="0.5" />
            <rect x="7" y="6" width="2" height="2" fill={color} opacity="0.3" />
            {/* Petal edges - sides */}
            <rect x="2" y="5" width="2" height="4" fill={color} opacity="0.9" />
            <rect x="12" y="5" width="2" height="4" fill={color} opacity="0.9" />
            {/* Petal edges - top */}
            <rect x="5" y="2" width="6" height="2" fill={color} opacity="0.9" />
        </>
    )
}

// Dandelion - fluffy puffball
function DandelionFlower({ color }: { color: string }) {
    return (
        <>
            {/* Fluffy center */}
            <rect x="6" y="4" width="4" height="4" fill={color} />
            {/* Wispy bits all around */}
            <rect x="7" y="0" width="2" height="4" fill={color} opacity="0.7" />
            <rect x="7" y="8" width="2" height="4" fill={color} opacity="0.7" />
            <rect x="2" y="5" width="4" height="2" fill={color} opacity="0.7" />
            <rect x="10" y="5" width="4" height="2" fill={color} opacity="0.7" />
            {/* Diagonal wisps */}
            <rect x="3" y="2" width="3" height="2" fill={color} opacity="0.5" />
            <rect x="10" y="2" width="3" height="2" fill={color} opacity="0.5" />
            <rect x="3" y="8" width="3" height="2" fill={color} opacity="0.5" />
            <rect x="10" y="8" width="3" height="2" fill={color} opacity="0.5" />
            {/* Extra wisps */}
            <rect x="5" y="1" width="2" height="2" fill={color} opacity="0.4" />
            <rect x="9" y="1" width="2" height="2" fill={color} opacity="0.4" />
        </>
    )
}

// Calculate x offset at a given point along the stem based on cubic bezier curve
function getCurveOffset(progress: number, curve1: number, curve2: number): number {
    const t = progress
    const oneMinusT = 1 - t
    const oneMinusT2 = oneMinusT * oneMinusT
    const t2 = t * t

    // B(t) = 3(1-t)²t*P1 + 3(1-t)t²*P2 (simplified since P0 = P3 = 0)
    return 3 * oneMinusT2 * t * curve1 + 3 * oneMinusT * t2 * curve2
}

// Individual leaf component with variable size
function Leaf({ x, y, side, size }: { x: number; y: number; side: 'left' | 'right'; size: number }) {
    const mainWidth = Math.round(3 * size)
    const mainHeight = Math.round(2 * size)
    const stemWidth = Math.round(2 * size)
    const stemHeight = Math.max(1, Math.round(1 * size))

    const adjustedX = side === 'left' ? x - mainWidth + 1 : x

    return (
        <>
            <rect x={adjustedX} y={y} width={mainWidth} height={mainHeight} fill={LEAF_COLOR} />
            <rect
                x={side === 'left' ? adjustedX + Math.max(1, mainWidth - stemWidth) : adjustedX}
                y={y + mainHeight}
                width={stemWidth}
                height={stemHeight}
                fill={LEAF_COLOR}
                opacity="0.8"
            />
        </>
    )
}

// Leaves component
function Leaves({
    config,
    stemHeight,
    stemThickness,
    stemCurve,
}: {
    config: LeafConfig
    stemHeight: number
    stemThickness: StemThickness
    stemCurve: StemCurve
}) {
    const baseY = 12

    if (config.length === 0) return null

    const { x: stemX, width: stemWidth } = STEM_WIDTHS[stemThickness]
    const baseCenterX = stemX + stemWidth / 2

    return (
        <>
            {config.map((leaf, index) => {
                const leafY = baseY + Math.round(stemHeight * leaf.position)
                const curveOffset = getCurveOffset(leaf.position, stemCurve.curve1, stemCurve.curve2)
                const leafX =
                    leaf.side === 'left'
                        ? baseCenterX + curveOffset - stemWidth / 2
                        : baseCenterX + curveOffset + stemWidth / 2

                return <Leaf key={index} x={leafX} y={leafY} side={leaf.side} size={leaf.size} />
            })}
        </>
    )
}

// Tiny flower component
interface TinyFlowerProps {
    color: string
    height: number
    rotation?: number
    stemCurve?: StemCurve
}

export function PixelTinyFlower({
    color,
    height,
    rotation = 0,
    stemCurve = { curve1: 0, curve2: 0 },
}: TinyFlowerProps) {
    const baseHeight = 16
    const totalHeight = Math.round(baseHeight * height)
    const stemHeight = totalHeight - 4
    const width = 6
    const centerX = 3

    const startY = 4
    const endY = 4 + stemHeight
    const control1Y = 4 + stemHeight / 3
    const control2Y = 4 + (stemHeight * 2) / 3
    const scaledCurve1 = stemCurve.curve1 * 0.5
    const scaledCurve2 = stemCurve.curve2 * 0.5
    const control1X = centerX + scaledCurve1
    const control2X = centerX + scaledCurve2

    const pathD = `M ${centerX} ${startY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${centerX} ${endY}`

    const leafProgress = 0.5
    const leafCurveOffset = getCurveOffset(leafProgress, scaledCurve1, scaledCurve2)
    const leafX = centerX + leafCurveOffset + 0.5
    const leafY = 4 + Math.round(stemHeight * 0.5)

    return (
        <svg
            width={width}
            height={totalHeight}
            viewBox={`0 0 ${width} ${totalHeight}`}
            style={{
                display: 'block',
                imageRendering: 'pixelated',
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'bottom center',
            }}
        >
            <path d={pathD} stroke={STEM_COLOR} strokeWidth={1} fill="none" strokeLinecap="round" />
            <rect x={leafX} y={leafY} width="2" height="1" fill={LEAF_COLOR} />
            <rect x="1" y="0" width="4" height="4" fill={color} />
            <rect x="2" y="1" width="2" height="2" fill={CENTER_COLOR} />
        </svg>
    )
}

// Curved stem component
function CurvedStem({
    stemHeight,
    stemThickness,
    curve1,
    curve2,
    flowerHeadHeight,
}: {
    stemHeight: number
    stemThickness: StemThickness
    curve1: number
    curve2: number
    flowerHeadHeight: number
}) {
    const { width: stemW, x: stemX } = STEM_WIDTHS[stemThickness]
    const centerX = stemX + stemW / 2

    const startY = flowerHeadHeight
    const endY = flowerHeadHeight + stemHeight
    const control1Y = flowerHeadHeight + stemHeight / 3
    const control2Y = flowerHeadHeight + (stemHeight * 2) / 3
    const control1X = centerX + curve1
    const control2X = centerX + curve2

    const pathD = `M ${centerX} ${startY} C ${control1X} ${control1Y} ${control2X} ${control2Y} ${centerX} ${endY}`

    return <path d={pathD} stroke={STEM_COLOR} strokeWidth={stemW} fill="none" strokeLinecap="round" />
}

export function PixelFlower({
    color,
    type,
    height,
    scale = 1,
    leafConfig,
    rotation = 0,
    stemThickness = 'normal',
    stemCurve = { curve1: 0, curve2: 0 },
}: PixelFlowerProps) {
    const baseFlowerHeadHeight = 12
    const baseFlowerHeadWidth = 16

    const scaledFlowerHeadHeight = baseFlowerHeadHeight * scale
    const scaledFlowerHeadWidth = baseFlowerHeadWidth * scale

    const baseStemHeight = 20
    const stemHeight = Math.round(baseStemHeight * height)

    const totalHeight = Math.ceil(scaledFlowerHeadHeight) + stemHeight
    const width = Math.max(Math.ceil(scaledFlowerHeadWidth), 16)

    const FlowerHead = {
        daisy: DaisyFlower,
        sunflower: SunflowerFlower,
        rose: RoseFlower,
        dandelion: DandelionFlower,
    }[type]

    const originX = 8
    const originY = 12
    const finalCenterX = width / 2
    const finalBottomY = scaledFlowerHeadHeight

    const flowerHeadTransform = `translate(${finalCenterX}, ${finalBottomY}) scale(${scale}) translate(${-originX}, ${-originY})`

    return (
        <svg
            width={width}
            height={totalHeight}
            viewBox={`0 0 ${width} ${totalHeight}`}
            style={{
                display: 'block',
                imageRendering: 'pixelated',
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'bottom center',
            }}
        >
            <CurvedStem
                stemHeight={stemHeight}
                stemThickness={stemThickness}
                curve1={stemCurve.curve1}
                curve2={stemCurve.curve2}
                flowerHeadHeight={Math.ceil(scaledFlowerHeadHeight)}
            />
            <Leaves config={leafConfig} stemHeight={stemHeight} stemThickness={stemThickness} stemCurve={stemCurve} />
            <g transform={flowerHeadTransform}>
                <FlowerHead color={color} />
            </g>
        </svg>
    )
}
