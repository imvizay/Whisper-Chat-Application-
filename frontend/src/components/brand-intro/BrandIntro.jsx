import React from 'react'
import '../../assets/css/brand-intro.css'
function BrandIntro() {
  return (
    <>
     {/* ── Hero Section ── */}
      <section className="heroSection">

        {/* Orbital Ring Visual */}
        <div className="orbitalContainer">
          <div className="orbitalGlow" />
          <div className="orbitalRingOuter" />
          <div className="orbitalRingInner" />
          <div className="orbitalRingCore" />
          <span className="orbitDot orbitDotLeft" />
          <span className="orbitDot orbitDotRight" />
        </div>

        {/* Headline */}
        <h1 className="heroHeadline">
          Just You.{' '}
          <span className="heroHeadlineAccent">Just Them.</span>
        </h1>

        {/* Tagline */}
        <p className="heroTagline">
          Pure Conversation. No noise, no distractions,
          <br />just connection.
        </p>

        {/* CTA Buttons */}
        <div className="ctaGroup">
          <button className="btnPrimary">
            Get Started
            <span className="btnArrow">→</span>
          </button>
          <button className="btnSecondary">Sign In</button>
        </div>

      </section>
    </>
  )
}

export default BrandIntro