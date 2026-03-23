import "../../assets/css/chat_dashboard/chat-sidebar.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'

// icons
import { Handshake , MessagesSquare, User , Bell, SettingsIcon, Home } from 'lucide-react'

// component
import FriendsPanel from "./FriendsPanel";

const INITIAL_FEATURES = [ 
  {icon:Home,           name:'mobileHomeIndex', path:'', hideOnDesktop:true},
  {icon:MessagesSquare, name:'chats',          path:'chats'},
  {icon:User,           name:'friends',        path:'friends-list'},
  {icon:Bell,           name:'notifications',  path:'notifications', isNotificationIcon:true},
  {icon:SettingsIcon,   name:'settings',       path:'settings', hideOnDesktop:true },
]

function ChatBar() {

  const navigate = useNavigate()
  const location = useLocation()

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Active Feature logic 
  const getActiveFeature = (feature) => {
    const currentPath = location.pathname

    // base route
    if (currentPath === "/chat-dashboard") {
      return isMobile
        ? feature.name === "mobileHomeIndex"
        : feature.name === "chats"
    }

    // exact match
    return currentPath === `/chat-dashboard/${feature.path}`
  }

  // filter based on screen
  const visibleFeatures = INITIAL_FEATURES.filter(feature => {
    if (!isMobile && feature.hideOnDesktop) return false
    return true
  })

  return (
    <aside className="chatBarContainer">

      {/* Branding */}
      <div className="chatBranding">
        <div className="chatLogo"><Handshake/></div>

        <div className="chatBrandText">
          <h3>Whisper</h3>
          <p>Secure Messaging</p>
        </div>
      </div>

      {/* Search */}
      <div className="chatSearchWrapper">
        <input
          type="search"
          placeholder="Search chats..."
          className="chatSearchInput"
        />
      </div>

      {/* Service Icons */}
      <div className="chatServicePanel">

        {visibleFeatures.map((btn) => {
          const isActive = getActiveFeature(btn)

          return (
            <button 
              key={btn.name}
              onClick={() => navigate(`/chat-dashboard/${btn.path}`)}

              className={`serviceIcon 
                ${isActive ? 'activeService' : ''}
                ${btn.isNotificationIcon ? "notificationIcon" : ''}
              `}
            >
              <btn.icon/>
              {btn.isNotificationIcon && <span className="notificationDot"></span>}
            </button>
          )
        })}

      </div>

      {/* Recent Chats */}
      <div className="recentChatsContainer">
        <FriendsPanel/>
      </div>

    </aside>
  );
}

export default ChatBar