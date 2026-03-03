// css
import '../assets/css/brand-intro.css'

// hooks
import { useState } from 'react';

// navigation links
import { NavLink,Outlet } from 'react-router-dom';


const BaseLayout = () => {

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
          <NavLink className={'navLinkHelp'} to='register' >Register</NavLink>
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
       
      <main style={{minHeight:"100vh"}}>
        <Outlet/>
      </main>

      {/* ── Footer Strip ── */}
      <footer className="footerStrip">
        <span className="footerLabel">End-to-End Encrypted</span>
        <span className='buisnessInfo'>For Buisness Contact:7987725298</span>
      </footer>

    </div>
  );
};

export default BaseLayout;