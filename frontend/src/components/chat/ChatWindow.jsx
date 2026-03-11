import '../../assets/css/chat_dashboard/chat-window.css'

function ChatWindow() {
  return (
    <div className="chatWindowWrapper">

      {/* Top Bar */}
      <div className="windowTopBar">

        <div className="chatUserInfo">
          <img
            className="chatUserAvatar"
            src="https://i.pravatar.cc/40"
            alt="user"
          />

          <div className="chatUserMeta">
            <h5 className="chatUserName">Anjani Lashkari</h5>
            <span className="chatUserStatus onlineStatus">Online</span>
            {/* change to typingStatus when typing */}
            {/* <span className="chatUserStatus typingStatus">typing...</span> */}
          </div>
        </div>

        <div className="chatTopActions">
          <button className="topActionBtn">📹</button>
          <button className="topActionBtn">📞</button>
          <button className="topActionBtn">⋮</button>
        </div>

      </div>


      {/* Chat Body */}
      <div className="chatBody">

        {/* Date separator */}
        <div className="chatDateSeparator">
          <span>Today</span>
        </div>


        {/* Friend message */}
        <div className="friendMessageWrapper">
          <img
            className="friendAvatar"
            src="https://i.pravatar.cc/32"
            alt="friend"
          />

          <div className="friendMessageBubble">
            <p>Hey! How's the project going?</p>

            <span className="messageTime">
              12:38 PM
            </span>
          </div>
        </div>


        {/* My message */}
        <div className="myMessageWrapper">

          <div className="myMessageBubble">
            <p>
              It's going great! Just finishing the dashboard UI with the
              violet theme.
            </p>

            <div className="messageMeta">
              <span className="messageTime">12:42 PM</span>

              {/* Message status */}
              <span className="messageStatus">
                ✓✓
              </span>

              {/* Examples */}
              {/* ✓ = sent */}
              {/* ✓✓ = delivered */}
              {/* ✓✓ blue = seen */}
            </div>
          </div>

        </div>


        {/* Typing indicator */}
        <div className="typingIndicatorWrapper">

          <img
            className="friendAvatar"
            src="https://i.pravatar.cc/32"
            alt="friend"
          />

          <div className="typingBubble">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>

      </div>


      {/* Message Input */}
      <div className="chatInputMessageModal">

        <button className="inputActionBtn">＋</button>

        <input
          type="text"
          className="chatMessageInput"
          placeholder="Type a message..."
        />

        <button className="sendMessageBtn">
          ➤
        </button>

      </div>

    </div>
  );
}

export default ChatWindow;