import React from 'react'
import '../../assets/css/forms/login.css'
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

// tanstack query mutation function
import { useMutation } from '@tanstack/react-query'

// api 
import { authApi } from '../../services/authApi'

// auth hook
import { useAuth } from '../../contexts/authContext'

function Login() {
  const [loginData,setLoginData] = useState({
    contact:"",
    password:""
  })

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleInput = (e) => {
    let { name,value } = e.target

    setLoginData((p)=>({
      ...p,
      [name]:value
    }))

  }

  const sendLoginCredMutation = useMutation({
    mutationFn:(data)=> authApi.login(data),
    onSuccess:(data)=>{
      login(data)
      navigate('/')
      alert("user logged in.")

    },
    onError:(error)=>{
      alert("login attempt failed.")
      console.log(error)
    }

  })

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    // api
    sendLoginCredMutation.mutate(loginData)
  }


  return (
    <div className="loginContainer">
         <div className="loginCard">
           <h3 className="loginTitle">Welcome Back</h3>
           <p className="loginSubtitle">Login to continue to Whisper</p>

           <form method="POST" onSubmit={handleLoginSubmit} className="loginForm">

             <div className="fieldBlock">
               <label>Contact</label>
               <input type="text" placeholder="Enter mobile number" name="contact" value={loginData.contact} onChange={handleInput}  />
             </div>

             <div className="fieldBlock">
               <label>Password</label>
               <input type="password" placeholder="Enter password" name="password" value={loginData.password} onChange={handleInput}  />
             </div>

             <button type="submit" className="loginButton" disabled={sendLoginCredMutation.isPending }>
              {sendLoginCredMutation.isPending ? "Logging In..." : "Login"}  
             </button>

             <p className="redirectRegister">Don't have an account? <span onClick={()=>navigate("/register")}>Create one</span></p>
           </form>

         </div>
       </div>
     )
}

export default Login;