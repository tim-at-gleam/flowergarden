import { PixelFlower, PixelTinyFlower } from './pixel-flower'
import type { GardenItem } from './types'

export interface FlowerGardenProps {
    /** Array of garden items (flowers) to render */
    items: GardenItem[]
    /** Optional className for the container */
    className?: string
    /** Optional inline styles for the container */
    style?: React.CSSProperties
    /**
     * Position mode:
     * - 'relative': Garden is positioned relative to parent (default)
     * - 'fixed-bottom': Garden is fixed to bottom of viewport (for footer use)
     */
    position?: 'relative' | 'fixed-bottom'
    /** Z-index for fixed positioning (default: 1000) */
    zIndex?: number
}

/**
 * FlowerGarden renders a collection of pixel-art flowers.
 * Flowers grow upward from the bottom edge with a sprout animation.
 *
 * For the animation to work, include the CSS from 'flower-garden/flower-garden.css'
 * or define your own .flower-garden-sprout animation.
 */
export function FlowerGarden({
    items,
    className = '',
    style,
    position = 'relative',
    zIndex = 1000,
}: FlowerGardenProps) {
    if (items.length === 0) {
        return null
    }

    const isFixed = position === 'fixed-bottom'

    const containerStyle: React.CSSProperties = {
        position: isFixed ? 'fixed' : 'absolute',
        left: 0,
        right: 0,
        bottom: isFixed ? 0 : undefined,
        top: isFixed ? undefined : 0,
        height: 0,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: isFixed ? zIndex : undefined,
        ...style,
    }

    return (
        <div className={className} style={containerStyle}>
            {items.map((item) => {
                const x = item.data.x

                return (
                    <div
                        key={item.data.id}
                        className="flower-garden-sprout"
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: `${x}%`,
                            transform: 'translateX(-50%)',
                            transformOrigin: 'bottom center',
                        }}
                    >
                        {item.type === 'flower' && (
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
                        {item.type === 'tiny-flower' && (
                            <PixelTinyFlower
                                color={item.data.color}
                                height={item.data.height}
                                rotation={item.data.rotation}
                                stemCurve={item.data.stemCurve}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
