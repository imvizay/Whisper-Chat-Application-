import React from "react";
import "../../assets/css/chat_dashboard/chat-sidebar.css";

// state
import { useState } from "react";

// navigation 
import { useNavigate } from 'react-router-dom'

// icons lucide-react
import { Handshake , MessagesSquare, User , Bell, SettingsIcon } from 'lucide-react'


const INITIAL_FEATURES = [ 
  {icon:MessagesSquare, name:'chats',         isActive:true  , path:''  },
  {icon:User,           name:'friends',       isActive:false , path:'friends-list'  },
  {icon:Bell,           name:'notifications', isActive:false , isNotificationIcon:true, path:'notifications' },
  {icon:SettingsIcon,   name:'settings',      isActive:false , path: 'settings' },
]

function ChatBar() {

  const [featureIcon,setFeatureIcon] = useState(INITIAL_FEATURES)
  
  const navigate = useNavigate()

  // Handle Active Icon On Ui.
  const handleActiveIcon = (name,path) => {
    setFeatureIcon((prev)=>(
      prev.map(icon=>({
        ...icon,
        isActive:icon.name == name
      }))
    ))

    navigate(`${path}`)

  }


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

        {featureIcon.map((btn)=>(
          <button 
            onClick={ () => handleActiveIcon( btn.name, btn.path )}

            className = {`serviceIcon ${btn.isActive ? 'activeService' : 
                                        btn.isNotificationIcon ? "notificationIcon" : ''}`
                        }
          >
            <btn.icon/>
            {btn.isNotificationIcon && <span className="notificationDot"></span>}
          </button>
        ))}

      </div>

      {/* Recent Chats */}
      <div className="recentChatsContainer">

        <div className="recentChatCard activeChat">

          <img
            src="https://i.pravatar.cc/40?img=5"
            alt="user"
            className="chatAvatar"
          />

          <div className="friendInfo">
            <h5>Alex Rivera</h5>
            <p className="typingStatus">Typing...</p>
          </div>

          <span className="chatTime">12:45 PM</span>

        </div>

        <div className="recentChatCard">

          <img
            src="https://i.pravatar.cc/40?img=10"
            alt="user"
            className="chatAvatar"
          />

          <div className="friendInfo">
            <h5>Sarah Chen</h5>
            <p>The design looks amazing!</p>
          </div>

          <span className="chatTime">Yesterday</span>

          <span className="unreadBadge">2</span>

        </div>

        <div className="recentChatCard">

          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="user"
            className="chatAvatar"
          />

          <div className="friendInfo">
            <h5>Marc Specter</h5>
            <p>Let's catch up later.</p>
          </div>

          <span className="chatTime">Monday</span>

        </div>

      </div>

    </aside>
  );
}

export default ChatBar;