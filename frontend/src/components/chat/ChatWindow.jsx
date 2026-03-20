import { BASEURL_DEV } from "../../services/shared-api/apiSetup"
import { useState, useRef, useEffect } from "react"
import "../../assets/css/chat_dashboard/chat-window.css"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"

function ChatWindow() {
  const location = useLocation()
  const friend = location?.state

  const chatId = friend?.chat_id
  const userId = friend?.current_user_id
  const receiverId = friend?.id

  const [input, setInput] = useState("")
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  const queryClient = useQueryClient()
  const messagesEndRef = useRef(null)

  // Fetch chat history
  const fetchMessages = async () => {
    const res = await fetch(`${BASEURL_DEV}/chat/${chatId}/messages/`)
    return res.json()
  }

  const { data: messages = [] } = useQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: fetchMessages,
    enabled: !!chatId,
  })

  // WebSocket connection
  useEffect(() => {
    if (!chatId) return

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${chatId}/`)

    ws.onopen = () => {
      console.log("Connected to chat")
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.message) {
        queryClient.setQueryData(["chatMessages", chatId], (old = []) => [
          ...old,
          data,
        ])
      }
    }

    ws.onclose = () => {
      console.log("Disconnected")
      setIsConnected(false)
    }

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [chatId, queryClient])

  // send message safely
  const sendMessage = () => {
    if (!input.trim()) return

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("Socket not ready")
      return
    }

    const payload = {
      message: input,
      receiver_id: receiverId,
      sender_id: userId,
    }

    socket.send(JSON.stringify(payload))

    setInput("")
  }

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="chatWindowContainer">

      {/* Header */}
      <div className="chatHeader">
        <div className="chatUserInfo">
          <div className="avatarWrapper">
            <span className="chatAvatar">
              {friend?.username?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <h4>{friend?.username?.toUpperCase() || "User"}</h4>
            <p className="statusText">
              {isConnected ? "Online" : "Connecting..."}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chatMessages">
        {messages.map((msg, index) => {
          const isMe = msg.sender_id === userId
        
          return (
            <div
              key={index}
              className={`messageRow ${isMe ? "myMessage" : "theirMessage"}`}
            >
              <div className="messageBubble">
                {msg.message || msg.content}
              </div>
            </div>
          )
        })}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="chatInputArea">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />

        <button onClick={sendMessage} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatWindow