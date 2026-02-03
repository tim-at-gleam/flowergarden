/**
 * Footer Example: Full-Width Flower Garden at Bottom of Page
 *
 * This example shows how to create a flower garden that spans the
 * full width of the viewport at the bottom of the page, triggered
 * by scroll position using IntersectionObserver.
 */

import { useEffect, useRef, useState } from 'react'
import { FlowerGarden, useFlowerGarden } from '../src'
import '../src/flower-garden.css'

export function FooterExample() {
    const { items, addFlower, addFlowers } = useFlowerGarden({
        // Wider spread for full-width footer
        minX: 2,
        maxX: 98,
    })

    const [hasTriggered, setHasTriggered] = useState(false)
    const triggerRef = useRef<HTMLDivElement>(null)

    // Use IntersectionObserver to trigger flowers when footer comes into view
    useEffect(() => {
        if (hasTriggered) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasTriggered) {
                        setHasTriggered(true)
                        // Add a burst of flowers when footer becomes visible
                        addFlowers(8)
                    }
                })
            },
            {
                threshold: 0.1, // Trigger when 10% of footer is visible
            }
        )

        if (triggerRef.current) {
            observer.observe(triggerRef.current)
        }

        return () => observer.disconnect()
    }, [hasTriggered, addFlowers])

    return (
        <div>
            {/* Page content */}
            <main style={{ padding: '20px' }}>
                <h1>Scroll Down to See Flowers</h1>
                <div style={{ height: '150vh' }}>
                    {/* Tall content to enable scrolling */}
                    <p>Keep scrolling...</p>
                </div>
            </main>

            {/* Footer with trigger element */}
            <footer
                ref={triggerRef}
                style={{
                    position: 'relative',
                    padding: '60px 20px 20px',
                    background: '#f5f5f5',
                    textAlign: 'center',
                }}
            >
                <p>Footer content here</p>

                {/* Add more flowers on click */}
                <button onClick={addFlower} style={{ marginTop: '10px' }}>
                    Plant Another Flower
                </button>
            </footer>

            {/* Fixed flower garden at bottom of viewport */}
            <FlowerGarden items={items} position="fixed-bottom" zIndex={100} />
        </div>
    )
}
