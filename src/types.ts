export type FlowerType = 'daisy' | 'sunflower' | 'rose' | 'dandelion'
export type StemThickness = 'thin' | 'normal' | 'thick'
export type GardenItemType = 'flower' | 'tiny-flower'

/** Individual leaf configuration */
export interface LeafData {
    /** Which side of the stem */
    side: 'left' | 'right'
    /** Position along the stem (0 = top, 1 = bottom) */
    position: number
    /** Scale factor (0.6 - 1.4) */
    size: number
}

/** Leaf configuration for a flower - array of 0-3 leaves */
export type LeafConfig = LeafData[]

/**
 * Stem curve configuration using cubic bezier control points
 * - curve1: horizontal displacement at upper third of stem
 * - curve2: horizontal displacement at lower third of stem
 * - Same sign = gentle arc, opposite signs = S-curve
 * - Suggested range: -2 to +2 pixels
 */
export interface StemCurve {
    curve1: number
    curve2: number
}

export interface Flower {
    id: string
    /** Horizontal position as percentage (0-100) */
    x: number
    /** Hex color for petals */
    color: string
    /** Flower head style */
    type: FlowerType
    /** Scale factor for stem height (0.7 - 1.3) */
    height: number
    /** Scale factor for flower head (0.7 - 1.3) */
    scale: number
    /** Leaf placement configuration */
    leafConfig: LeafConfig
    /** Rotation angle in degrees (-15 to 15) */
    rotation: number
    /** Stem width variant */
    stemThickness: StemThickness
    /** Stem curve configuration */
    stemCurve: StemCurve
}

export interface TinyFlower {
    id: string
    /** Horizontal position as percentage (0-100) */
    x: number
    /** Hex color */
    color: string
    /** Scale factor for height (0.6 - 1.1) */
    height: number
    /** Rotation angle in degrees */
    rotation: number
    /** Stem curve configuration */
    stemCurve: StemCurve
}

export type GardenItem =
    | { type: 'flower'; data: Flower }
    | { type: 'tiny-flower'; data: TinyFlower }

export interface FlowerGardenConfig {
    /** Flower petal colors to choose from */
    colors?: string[]
    /** Which flower types to include */
    flowerTypes?: FlowerType[]
    /** Probability of tiny flower vs regular (0-1, default 0.35) */
    tinyFlowerProbability?: number
    /** Min horizontal position % (default 3) */
    minX?: number
    /** Max horizontal position % (default 97) */
    maxX?: number
}
