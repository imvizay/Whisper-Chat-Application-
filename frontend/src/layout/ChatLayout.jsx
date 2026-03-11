
// css
import '../assets/css/chat_dashboard/chat-layout.css'

import ChatBar from "../components/chat/ChatBar";
import { Outlet } from "react-router-dom";

function ChatLayout() {
  return (
    <div className="chatLayoutWrapper">

      {/* LEFT SIDE - Chat list */}
      <aside className="chatSidebar">
        <ChatBar />
      </aside>

      {/* RIGHT SIDE - Chat window */}
      <main className="chatContentArea">
        <Outlet />
      </main>

    </div>
  );
}

export default ChatLayout;