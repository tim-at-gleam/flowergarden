/*
 * Flower Garden — Framer-ready single-file component
 *
 * A pixel-art flower garden that plants itself one flower per second
 * once the component scrolls into view. Drop this at the very bottom
 * of your Framer page: when the user reaches it, the garden grows.
 *
 * Copy the contents of this file into a Framer Code File and place
 * the component at the bottom of your vertical stack. Resize the
 * dropped instance to set the garden's height — flowers sprout from
 * its bottom edge.
 *
 * Everything is self-contained (types, SVG renderers, state, CSS,
 * property controls). Browser APIs are gated behind useEffect so
 * Framer's server-side preview pass doesn't crash.
 */

import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

// ============================================================================
// Types
// ============================================================================

type FlowerType = "daisy" | "sunflower" | "rose" | "dandelion"
type StemThickness = "thin" | "normal"

interface LeafData {
  side: "left" | "right"
  position: number
  size: number
}
type LeafConfig = LeafData[]

interface StemCurve {
  curve1: number
  curve2: number
}

interface Flower {
  id: string
  x: number
  color: string
  type: FlowerType
  height: number
  scale: number
  leafConfig: LeafConfig
  rotation: number
  stemThickness: StemThickness
  stemCurve: StemCurve
}

interface TinyFlower {
  id: string
  x: number
  color: string
  height: number
  rotation: number
  stemCurve: StemCurve
}

type GardenItem =
  | { type: "flower"; data: Flower }
  | { type: "tiny-flower"; data: TinyFlower }

// ============================================================================
// Palette constants
// ============================================================================

const STEM_COLOR = "#4A7C59"
const LEAF_COLOR = "#6B8E23"
const CENTER_COLOR = "#FFD93D"

const STEM_WIDTHS: Record<StemThickness, { width: number; x: number }> = {
  thin: { width: 1, x: 7.5 },
  normal: { width: 1.5, x: 7.25 },
}

const DEFAULT_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFE66D",
  "#95E1D3",
  "#F38181",
  "#AA96DA",
  "#FCBAD3",
  "#A8D8EA",
]
const DEFAULT_FLOWER_TYPES: FlowerType[] = [
  "daisy",
  "sunflower",
  "rose",
  "dandelion",
]
const STEM_THICKNESSES: StemThickness[] = ["thin", "normal"]

// ============================================================================
// Flower head SVG primitives
// ============================================================================

function DaisyFlower({ color }: { color: string }) {
  return (
    <>
      <rect x="6" y="4" width="4" height="4" fill={CENTER_COLOR} />
      <rect x="6" y="0" width="4" height="4" fill={color} />
      <rect x="6" y="8" width="4" height="4" fill={color} />
      <rect x="2" y="4" width="4" height="4" fill={color} />
      <rect x="10" y="4" width="4" height="4" fill={color} />
      <rect x="3" y="1" width="3" height="3" fill={color} opacity="0.8" />
      <rect x="10" y="1" width="3" height="3" fill={color} opacity="0.8" />
      <rect x="3" y="8" width="3" height="3" fill={color} opacity="0.8" />
      <rect x="10" y="8" width="3" height="3" fill={color} opacity="0.8" />
    </>
  )
}

function SunflowerFlower({ color }: { color: string }) {
  return (
    <>
      <rect x="5" y="3" width="6" height="6" fill="#8B4513" />
      <rect x="6" y="4" width="4" height="4" fill="#654321" />
      <rect x="6" y="0" width="4" height="3" fill={color} />
      <rect x="6" y="9" width="4" height="3" fill={color} />
      <rect x="2" y="4" width="3" height="4" fill={color} />
      <rect x="11" y="4" width="3" height="4" fill={color} />
      <rect x="3" y="1" width="3" height="2" fill={color} />
      <rect x="10" y="1" width="3" height="2" fill={color} />
      <rect x="3" y="9" width="3" height="2" fill={color} />
      <rect x="10" y="9" width="3" height="2" fill={color} />
    </>
  )
}

function RoseFlower({ color }: { color: string }) {
  return (
    <>
      <rect x="3" y="3" width="10" height="7" fill={color} />
      <rect x="5" y="10" width="6" height="2" fill={color} />
      <rect x="5" y="4" width="6" height="5" fill={color} opacity="0.7" />
      <rect x="6" y="5" width="4" height="4" fill={color} opacity="0.5" />
      <rect x="7" y="6" width="2" height="2" fill={color} opacity="0.3" />
      <rect x="2" y="5" width="2" height="4" fill={color} opacity="0.9" />
      <rect x="12" y="5" width="2" height="4" fill={color} opacity="0.9" />
      <rect x="5" y="2" width="6" height="2" fill={color} opacity="0.9" />
    </>
  )
}

function DandelionFlower({ color }: { color: string }) {
  return (
    <>
      <rect x="6" y="4" width="4" height="4" fill={color} />
      <rect x="7" y="0" width="2" height="4" fill={color} opacity="0.7" />
      <rect x="7" y="8" width="2" height="4" fill={color} opacity="0.7" />
      <rect x="2" y="5" width="4" height="2" fill={color} opacity="0.7" />
      <rect x="10" y="5" width="4" height="2" fill={color} opacity="0.7" />
      <rect x="3" y="2" width="3" height="2" fill={color} opacity="0.5" />
      <rect x="10" y="2" width="3" height="2" fill={color} opacity="0.5" />
      <rect x="3" y="8" width="3" height="2" fill={color} opacity="0.5" />
      <rect x="10" y="8" width="3" height="2" fill={color} opacity="0.5" />
      <rect x="5" y="1" width="2" height="2" fill={color} opacity="0.4" />
      <rect x="9" y="1" width="2" height="2" fill={color} opacity="0.4" />
    </>
  )
}

// ============================================================================
// Stem + leaves
// ============================================================================

function getCurveOffset(
  progress: number,
  curve1: number,
  curve2: number,
): number {
  const t = progress
  const oneMinusT = 1 - t
  return (
    3 * oneMinusT * oneMinusT * t * curve1 + 3 * oneMinusT * t * t * curve2
  )
}

function Leaf({
  x,
  y,
  side,
  size,
}: {
  x: number
  y: number
  side: "left" | "right"
  size: number
}) {
  const mainWidth = Math.round(3 * size)
  const mainHeight = Math.round(2 * size)
  const stemWidth = Math.round(2 * size)
  const stemHeight = Math.max(1, Math.round(1 * size))
  const adjustedX = side === "left" ? x - mainWidth + 1 : x

  return (
    <>
      <rect
        x={adjustedX}
        y={y}
        width={mainWidth}
        height={mainHeight}
        fill={LEAF_COLOR}
      />
      <rect
        x={
          side === "left"
            ? adjustedX + Math.max(1, mainWidth - stemWidth)
            : adjustedX
        }
        y={y + mainHeight}
        width={stemWidth}
        height={stemHeight}
        fill={LEAF_COLOR}
        opacity="0.8"
      />
    </>
  )
}

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
  if (config.length === 0) return null
  const baseY = 12
  const { x: stemX, width: stemWidth } = STEM_WIDTHS[stemThickness]
  const baseCenterX = stemX + stemWidth / 2

  return (
    <>
      {config.map((leaf, i) => {
        const leafY = baseY + Math.round(stemHeight * leaf.position)
        const curveOffset = getCurveOffset(
          leaf.position,
          stemCurve.curve1,
          stemCurve.curve2,
        )
        const leafX =
          leaf.side === "left"
            ? baseCenterX + curveOffset - stemWidth / 2
            : baseCenterX + curveOffset + stemWidth / 2
        return (
          <Leaf key={i} x={leafX} y={leafY} side={leaf.side} size={leaf.size} />
        )
      })}
    </>
  )
}

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

  return (
    <path
      d={pathD}
      stroke={STEM_COLOR}
      strokeWidth={stemW}
      fill="none"
      strokeLinecap="round"
    />
  )
}

// ============================================================================
// Full flower SVG
// ============================================================================

function PixelFlower({
  color,
  type,
  height,
  scale = 1,
  leafConfig,
  rotation = 0,
  stemThickness = "normal",
  stemCurve = { curve1: 0, curve2: 0 },
}: {
  color: string
  type: FlowerType
  height: number
  scale?: number
  leafConfig: LeafConfig
  rotation?: number
  stemThickness?: StemThickness
  stemCurve?: StemCurve
}) {
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

  const finalCenterX = width / 2
  const finalBottomY = scaledFlowerHeadHeight
  const flowerHeadTransform = `translate(${finalCenterX}, ${finalBottomY}) scale(${scale}) translate(-8, -12)`

  return (
    <svg
      width={width}
      height={totalHeight}
      viewBox={`0 0 ${width} ${totalHeight}`}
      style={{
        display: "block",
        imageRendering: "pixelated",
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "bottom center",
      }}
    >
      <CurvedStem
        stemHeight={stemHeight}
        stemThickness={stemThickness}
        curve1={stemCurve.curve1}
        curve2={stemCurve.curve2}
        flowerHeadHeight={Math.ceil(scaledFlowerHeadHeight)}
      />
      <Leaves
        config={leafConfig}
        stemHeight={stemHeight}
        stemThickness={stemThickness}
        stemCurve={stemCurve}
      />
      <g transform={flowerHeadTransform}>
        <FlowerHead color={color} />
      </g>
    </svg>
  )
}

function PixelTinyFlower({
  color,
  height,
  rotation = 0,
  stemCurve = { curve1: 0, curve2: 0 },
}: {
  color: string
  height: number
  rotation?: number
  stemCurve?: StemCurve
}) {
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
  const leafCurveOffset = getCurveOffset(0.5, scaledCurve1, scaledCurve2)
  const leafX = centerX + leafCurveOffset + 0.5
  const leafY = 4 + Math.round(stemHeight * 0.5)

  return (
    <svg
      width={width}
      height={totalHeight}
      viewBox={`0 0 ${width} ${totalHeight}`}
      style={{
        display: "block",
        imageRendering: "pixelated",
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "bottom center",
      }}
    >
      <path
        d={pathD}
        stroke={STEM_COLOR}
        strokeWidth={1}
        fill="none"
        strokeLinecap="round"
      />
      <rect x={leafX} y={leafY} width="2" height="1" fill={LEAF_COLOR} />
      <rect x="1" y="0" width="4" height="4" fill={color} />
      <rect x="2" y="1" width="2" height="2" fill={CENTER_COLOR} />
    </svg>
  )
}

// ============================================================================
// Procedural generation
// ============================================================================

function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
  )
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateStemCurve(): StemCurve {
  const curve1 = (Math.random() - 0.5) * 4
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
  const positions = Array.from(
    { length: leafCount },
    () => 0.15 + Math.random() * 0.4,
  ).sort((a, b) => a - b)
  const startSide: "left" | "right" = Math.random() < 0.5 ? "left" : "right"
  for (let i = 0; i < leafCount; i++) {
    const side: "left" | "right" =
      i % 2 === 0 ? startSide : startSide === "left" ? "right" : "left"
    leaves.push({
      side,
      position: positions[i],
      size: 0.6 + Math.random() * 0.8,
    })
  }
  return leaves
}

function findOptimalX(
  items: GardenItem[],
  minX: number,
  maxX: number,
): number {
  if (items.length === 0) return (minX + maxX) / 2
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

function makeFlower(
  items: GardenItem[],
  colors: string[],
  flowerTypes: FlowerType[],
  tinyFlowerProbability: number,
  minX: number,
  maxX: number,
): GardenItem {
  const stemCurve = generateStemCurve()
  const optimalX = findOptimalX(items, minX, maxX)
  const roll = Math.random()

  if (roll >= tinyFlowerProbability) {
    return {
      type: "flower",
      data: {
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
      },
    }
  }
  return {
    type: "tiny-flower",
    data: {
      id: generateId(),
      x: optimalX,
      color: randomChoice(colors),
      height: 0.6 + Math.random() * 0.5,
      rotation: (Math.random() - 0.5) * 20,
      stemCurve,
    },
  }
}

// ============================================================================
// Framer component
// ============================================================================

interface FlowerGardenFramerProps {
  maxFlowers: number
  growIntervalMs: number
  colors: string
  tinyFlowerProbability: number
  zIndex: number
  triggerThreshold: number
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function FlowerGardenFramer({
  maxFlowers = 120,
  growIntervalMs = 1000,
  colors = "#FF6B6B,#4ECDC4,#FFE66D,#95E1D3,#F38181,#AA96DA,#FCBAD3,#A8D8EA",
  tinyFlowerProbability = 0.35,
  zIndex = 100,
  triggerThreshold = 0.1,
}: Partial<FlowerGardenFramerProps>) {
  const rawId = React.useId()
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "_")

  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [items, setItems] = React.useState<GardenItem[]>([])
  const [triggered, setTriggered] = React.useState(false)

  const colorArray = React.useMemo(
    () =>
      colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    [colors],
  )
  const palette = colorArray.length > 0 ? colorArray : DEFAULT_COLORS

  // IntersectionObserver: start growing once the component scrolls into view.
  React.useEffect(() => {
    if (triggered) return
    const node = containerRef.current
    if (!node) return

    if (typeof IntersectionObserver === "undefined") {
      setTriggered(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTriggered(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: Math.max(0, Math.min(1, triggerThreshold)) },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [triggered, triggerThreshold])

  // Growth loop: one flower per `growIntervalMs`, until `maxFlowers`.
  React.useEffect(() => {
    if (!triggered) return
    if (items.length >= maxFlowers) return

    const interval = window.setInterval(() => {
      setItems((prev) => {
        if (prev.length >= maxFlowers) return prev
        return [
          ...prev,
          makeFlower(
            prev,
            palette,
            DEFAULT_FLOWER_TYPES,
            tinyFlowerProbability,
            3,
            97,
          ),
        ]
      })
    }, Math.max(50, growIntervalMs))

    return () => window.clearInterval(interval)
  }, [triggered, items.length, maxFlowers, growIntervalMs, palette, tinyFlowerProbability])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        minHeight: 1,
        boxSizing: "border-box",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes fg-sprout-${id} {
          0%   { transform: translateX(-50%) scaleY(0); opacity: 0; }
          50%  { opacity: 1; }
          100% { transform: translateX(-50%) scaleY(1); opacity: 1; }
        }
        .fg-sprout-${id} {
          animation: fg-sprout-${id} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .fg-sprout-${id} {
            animation: none;
            opacity: 1;
            transform: translateX(-50%) scaleY(1);
          }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 0,
          pointerEvents: "none",
          overflow: "visible",
          zIndex,
        }}
      >
        {/* Grass line — the ground from which flowers sprout. Layered above
            the flowers so the base ~4px of each stem is hidden behind it,
            making stems appear to emerge organically from the grass. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 4,
            background: "#2EB873",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        {items.map((item) => (
          <div
            key={item.data.id}
            className={`fg-sprout-${id}`}
            style={{
              position: "absolute",
              bottom: 0,
              left: `${item.data.x}%`,
              transform: "translateX(-50%)",
              transformOrigin: "bottom center",
            }}
          >
            {item.type === "flower" && (
              <PixelFlower
                color={item.data.color}
                type={item.data.type}
                height={item.data.height}
                scale={item.data.scale}
                leafConfig={item.data.leafConfig}
                rotation={item.data.rotation}
                stemThickness={item.data.stemThickness}
                stemCurve={item.data.stemCurve}
              />
            )}
            {item.type === "tiny-flower" && (
              <PixelTinyFlower
                color={item.data.color}
                height={item.data.height}
                rotation={item.data.rotation}
                stemCurve={item.data.stemCurve}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { FlowerGardenFramer }

addPropertyControls(FlowerGardenFramer, {
  maxFlowers: {
    type: ControlType.Number,
    title: "Max Flowers",
    min: 1,
    max: 500,
    step: 1,
    defaultValue: 120,
    displayStepper: true,
  },
  growIntervalMs: {
    type: ControlType.Number,
    title: "Grow Interval (ms)",
    min: 100,
    max: 5000,
    step: 50,
    defaultValue: 1000,
    displayStepper: false,
  },
  colors: {
    type: ControlType.String,
    title: "Colors",
    defaultValue:
      "#FF6B6B,#4ECDC4,#FFE66D,#95E1D3,#F38181,#AA96DA,#FCBAD3,#A8D8EA",
    placeholder: "Comma-separated hex colors",
  },
  tinyFlowerProbability: {
    type: ControlType.Number,
    title: "Tiny Flower Chance",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.35,
    displayStepper: false,
  },
  zIndex: {
    type: ControlType.Number,
    title: "Z-Index",
    min: 0,
    max: 9999,
    step: 1,
    defaultValue: 100,
    displayStepper: false,
  },
  triggerThreshold: {
    type: ControlType.Number,
    title: "Trigger Threshold",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.1,
    displayStepper: false,
  },
})
