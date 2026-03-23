import '../assets/css/chat_dashboard/chat-layout.css'
import { Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import ChatBar from "../components/chat/ChatBar"
import { useNavigate } from 'react-router-dom'

function ChatLayout() {
  const location = useLocation()

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isChatScreen = location.pathname.includes("/chat-dashboard/chat/")

  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === "/chat-dashboard") {

      if (isMobile) {
        navigate("/chat-dashboard/friends-list")
      } else {
        navigate("/chat-dashboard/chats")
      }

    }
  }, [location.pathname, isMobile])

 
  return (
    <div className="chatLayoutWrapper">

      {isMobile ? (
        isChatScreen ? (
          <Outlet />  
        ) : (
          <div className="mobileContainer">
            <ChatBar />
            <Outlet />
          </div>
        )
      ) : (
        <>
          <aside className="chatSidebar">
            <ChatBar />
          </aside>

          <main className="chatContentArea">
            <Outlet />
          </main>
        </>
      )}

    </div>
  )
}

export default ChatLayout