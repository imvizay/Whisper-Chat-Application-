import { BASEURL_DEV } from "../../services/shared-api/apiSetup"
import { useState, useRef, useEffect } from "react"
import "../../assets/css/chat_dashboard/chat-window.css"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { useLocation,useNavigate } from "react-router-dom"

// websocket url
import { getWebSocketUrl } from "../../services/chatsApi"
// icons 
import { Check, CheckCheck, Eye, MoveLeft, StepBack } from "lucide-react"

function ChatWindow() {
  const [input, setInput] = useState("")
  const [userStatus, setUserStatus] = useState({
    isOnline:false,
    lastSeen:null
  })

  const [isTyping,setIsTyping] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const friend = location?.state

  const chatId = friend?.chat_id
  const userId = friend?.current_user_id
  const [isUserTyping, setIsUserTyping] = useState(false)

 

  const queryClient = useQueryClient()

  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Fetch chat history
  const fetchMessages = async () => {
    const res = await fetch(`${BASEURL_DEV}/chat/${chatId}/messages/`)
    return res.json()
  }

  // Chat History Record
  const { data: messages = [] } = useQuery({
    queryKey: ["chatMessages", chatId],
    queryFn: fetchMessages,
    enabled: !!chatId,
    staleTime:Infinity,
  })

  useEffect(() => {
      if (!socketRef.current) return

      messages.forEach(msg => {
        if (
          msg.sender_id !== userId &&
          msg.status !== "seen"
        ) {
          socketRef.current.send(
            JSON.stringify({
              type: "seen",
              message_id: msg.id
            })
          )
        }
      })
    }, [messages])

  // WebSocket connection
  useEffect(() => {
    if (!chatId) return
    const ws = new WebSocket(getWebSocketUrl(chatId))

    // when connection open.
    ws.onopen = () => {
      console.log("connected to websocket")
    }

    // when event fire up or message comes from backend
    ws.onmessage = (event) => {

      const data = JSON.parse(event.data)
      console.log('recieved data:',data)

      if (data.type === "typing" && data.user_id !== userId) {
        setIsTyping(true)
        return
      }

      if (data.type === "stop_typing" && data.user_id !== userId) {
        setIsTyping(false)
        return
      }

      if (data.type === "message_seen") {
         queryClient.setQueryData(
           ["chatMessages", chatId],
           (old = []) =>
             old.map(msg =>
               msg.id === data.message_id
                 ? { ...msg, status: "seen" }
                 : msg
             )
         )
         return
      }

      if(data.type === "user_status"){

        console.log("user status data:",data)
        setUserStatus({
          isOnline:data?.is_online,
          lastSeen:data?.last_seen || null
        })
        return
      }

      if(data.type === "chat_message"){
         queryClient.setQueryData(
         ["chatMessages",chatId],
         ( oldData = []) => {
           return [...oldData,data]
         } )
      }

    }



    // web socket disconnected
    ws.onclose = () => {
  
      // setIsConnected(false)
      console.log("websocket disconnected")
      setUserStatus({
        isOnline:false,
        lastSeen:null
      })
    }

    // log error when websocket failed
    ws.onerror = (error) =>{
      console.error("websocket error",error)
    }
    
    socketRef.current = ws

    // cleanup when component unmount remove connection.
    return ()=> {
      ws.close()
    }

   }, [chatId, queryClient])

 
  const sendMessage = () => {

    if(!input.trim()) return 

    if(!socketRef || socketRef.current.readyState !== WebSocket.OPEN){
      return console.log("error sending message to backend")
    }

    const payload = {
      type:"message",
      sender:userId,
      receiver:friend?.id,
      content:input,
      status:"sent",
    }

    const tempData = {
       id: Date.now(), // temp id
       content: input,
       sender_id: userId,
       status: "sending",
       timestamp: new Date().toISOString()
    }

    // send message to backend
    socketRef.current.send(JSON.stringify(payload))

    setInput("")
   
  }

  console.log(messages)


  const handleTyping = (value) => {
      setInput(value)

      if (!socketRef.current) return

      if (!isUserTyping) {
        socketRef.current.send(JSON.stringify({ type: "typing" }))
        setIsUserTyping(true)
      }
    
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.send(JSON.stringify({ type: "stop_typing" }))
        setIsUserTyping(false)
      }, 1000)
  }

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="chatWindowContainer">

      {/* Header */}
      <div className="chatHeader">
        <button className="backBtn" onClick={() => navigate("/chat-dashboard")}>
          <MoveLeft size={18}/>
        </button>
        <div className="chatUserInfo">
          <div className="avatarWrapper">
            <span className="chatAvatar">
              {friend?.username?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <h4>{friend?.username?.toUpperCase() || "User"}</h4>
            <p className="statusText">
                {isTyping
                  ? "Typing..."
                  : userStatus.isOnline
                  ? "Online"
                  : userStatus.lastSeen
                  ? `last seen at ${new Date(userStatus.lastSeen).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chatMessages">
        {messages.map((msg) => {
          const isMe = msg.sender_id === userId
        
          return (
            <div
              key={msg.id}
              className={`messageRow ${isMe ? "myMessage" : "theirMessage"}`}
            >
              <div className="messageBubble">
                {msg.message || msg.content}

                <div className="meta">
                  <span className="time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                  
                 {msg.sender_id === userId && (
                    <span className="status">
                      {msg.status === "sent" && <Check/>}
                      {msg.status === "delivered" && <CheckCheck/>}
                      {msg.status === "seen" && <CheckCheck color="blue" size={12}/>}

                      {msg.status === "watching" && <Eye/>}
                    </span>
                  )}
                </div>
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
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />

        <button onClick={sendMessage} disabled={!userStatus.isOnline}>
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatWindow