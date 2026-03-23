// routing tools
import { Route,Routes } from 'react-router-dom'
// components
import BaseLayout from './layout/Base'

import BrandIntro from './components/brand-intro/BrandIntro'
import RegisterAccount from './components/forms/Register'
import Login from './components/forms/Login'

// chat-dashboard components
import ChatLayout from './layout/ChatLayout'
// import ChatWindow from './components/chat/ChatWindow'
import EmptyChatWindow from './components/chat/indexElement/EmptyChatWindow'
import NotificationPanel from './components/chat/NotificationPanel'
import FriendsPanel from './components/chat/FriendsPanel'
import ChatWindow from './components/chat/ChatWindow'
import ChatBar from './components/chat/ChatBar'


export default function App() {
  return (
    <>
    <Routes>
      {/* onboarding introduction component */}
      <Route path='/' element={<BaseLayout/>}>
         <Route index element={<BrandIntro/>}/>
         <Route path = "register" element={<RegisterAccount/>}/>
         <Route path = "login" element={<Login/>}/>
      </Route>

      <Route path='/chat-dashboard' element={<ChatLayout/>}>  

       
        <Route path="chats" element={<EmptyChatWindow />} />
      

        <Route path="chat/:friendId" element = {<ChatWindow/>}/>
        <Route path='notifications' element={<NotificationPanel/>}/>
        <Route path='friends-list' element={<FriendsPanel/>}/>


      </Route>
     

    </Routes>
    </>
  )
}
