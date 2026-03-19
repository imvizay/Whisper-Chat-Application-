import React, { useState } from "react";
import "../../assets/css/chat_dashboard/chat-window.css";

import { useLocation } from "react-router-dom";

function ChatWindow() {
  const [message, setMessage] = useState("");

  const location  = useLocation()
  const friend = location?.state

  const isTyping = true; // simulate typing

  
  return (
    <div className="chatWindowContainer">

      {/* Header */}
      <div className="chatHeader">
        <div className="chatUserInfo">
          <div className="avatarWrapper">
            <img
              src="https://i.pravatar.cc/40"
              alt="user"
              className="chatAvatar"
            />
            <span className="onlineDot"></span>
          </div>

          <div>
            <h4>{friend?.username?.toUpperCase() || "User"}</h4>
            <p className="statusText">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chatMessages">

       
        {/* Typing Indicator */}
        {isTyping && (
          <div className="typingIndicator">
            <span></span><span></span><span></span>
          </div>
        )}

      </div>

      {/* Input */}
      <div className="chatInputArea">
        <input
          type="text"
          placeholder="Type a message..."
      
          
        />

        <button>Send</button>
      </div>

    </div>
  );
}

export default ChatWindow;