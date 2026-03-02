// routing tools
import { Route,Routes } from 'react-router-dom'
// components
import BrandIntro from './components/brand-intro/BrandIntro'

import Authentication from './components/forms/Authentication' // authentication form


export default function App() {
  return (
    <>
    <Routes>
      {/* onboarding introduction component */}
      <Route path='/' element={<BrandIntro/>}/>
         

    </Routes>
    </>
  )
}
