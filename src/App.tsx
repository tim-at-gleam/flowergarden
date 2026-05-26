import * as React from "react"
import FlowerGardenFramer from "./components/FlowerGardenFramer"

export function App() {
  return (
    <div className="app">
      <section className="hero" aria-label="Hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Flower Garden</p>
          <h1 className="hero__title">Scroll down. Watch it bloom.</h1>
          <p className="hero__subtitle">
            A pixel-art garden that plants one flower per second once it
            enters the viewport, up to 120 flowers. Drop it at the bottom of
            your Framer page.
          </p>
        </div>
      </section>

      <section className="spacer" aria-hidden="true">
        <p>↓ keep scrolling ↓</p>
      </section>

      <section className="garden-section" aria-label="Garden preview">
        <div className="garden-section__inner">
          <h2>The garden lives here</h2>
          <p>
            The component sits at the very bottom of the page. When it
            scrolls into view, an IntersectionObserver kicks off a 1Hz
            growth loop. Each new flower lands in the largest current gap,
            so the bed stays evenly distributed as it fills in.
          </p>
        </div>
        <div className="garden-mount">
          <FlowerGardenFramer />
        </div>
      </section>
    </div>
  )
}
