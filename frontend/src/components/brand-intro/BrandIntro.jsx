// css
import '../../assets/css/brand-intro.css'

// hooks
import { useState } from 'react';

// navigation links
import { NavLink } from 'react-router-dom';


const BrandIntro = () => {

    const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="brandIntroWrapper">

      {/* ── Ambient Background Blobs ── */}
      <div className="ambientBlob ambientBlobTopLeft" />
      <div className="ambientBlob ambientBlobCenter" />
      <div className="ambientBlob ambientBlobBottomRight" />

      {/* ── Navbar ── */}
      <nav className="navbar">
        <a className="navLogo" href="#">
          <span className="navLogoIcon">∞</span>
          <span className="navLogoText">Whisper</span>
        </a>

        {/* Desktop Links */}
        <div className="navLinks">
          <button className="navLinkItem">Help</button>
          <NavLink className={'navLinkHelp'} to='/authentication' >Register</NavLink>
        </div>

        {/* Hamburger */}
        <div className="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </div>
      </nav>

       {/* Mobile Panel */}
       <div className={`mobileNavPanel ${menuOpen ? 'active' : ''}`}>
        <button onClick={() => setMenuOpen(false)}>Help</button>
        <button onClick={() => setMenuOpen(false)}>Register</button>
       </div>
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

      {/* ── Footer Strip ── */}
      <footer className="footerStrip">
        <span className="footerLabel">End-to-End Encrypted</span>
        <span className='buisnessInfo'>For Buisness Contact:7987725298</span>
      </footer>

    </div>
  );
};

export default BrandIntro;