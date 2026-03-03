// routing tools
import { Route,Routes } from 'react-router-dom'
// components
import BaseLayout from './layout/Base'

import BrandIntro from './components/brand-intro/BrandIntro'
import RegisterAccount from './components/forms/Register'


export default function App() {
  return (
    <>
    <Routes>
      {/* onboarding introduction component */}
      <Route path='/' element={<BaseLayout/>}>
         <Route index element={<BrandIntro/>}/>
         <Route path = "register" element={<RegisterAccount/>}/>
      </Route>
     

    </Routes>
    </>
  )
}
