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
        <Route index element = {<EmptyChatWindow/>}/> {/* at empty chat window search freinds or add new friends */}

        {/* <Route path=":userId" element = {<ChatWindow/>}/> */}
        <Route path='notifications' element={<NotificationPanel/>}/>

      </Route>
     

    </Routes>
    </>
  )
}
