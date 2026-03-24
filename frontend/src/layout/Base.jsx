// css
import '../assets/css/brand-intro.css'



// navigation links
import { Outlet } from 'react-router-dom'


const BaseLayout = () => {


  return (
    <div className="brandIntroWrapper">

      <div className="ambientBlob ambientBlobTopLeft" />
      <div className="ambientBlob ambientBlobCenter" />
      <div className="ambientBlob ambientBlobBottomRight" />

      <nav className="navbar">
        <a className="navLogo" href="#">
          <span className="navLogoIcon">∞</span>
          <span className="navLogoText">Whisper</span>
        </a>
      </nav>

       
      <main style={{minHeight:"100vh"}}>
        <Outlet/>
      </main>

      {/* ── Footer Strip ── */}
      <footer className="footerStrip">
        <span className="footerLabel">End-to-End Encrypted</span>
        <span className='buisnessInfo'>For Buisness Contact:7987725298</span>
      </footer>

    </div>
  )
}

export default BaseLayout