// css
import '../../assets/css/forms/create-account.css'

// hooks
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
// components
import OtpVerification from './Verification'

// utilis
import { validateAccountForm } from '../../utilis/account-validation-form'
import { authApi } from '../../services/authApi'

export default function RegisterAccount() {

  // registeration form default open 
  const [isRegFormOpen,setIsRegForm] = useState(true)
  const [isOtpBoxOpen,setIsOtpBox] = useState(false) 
  const [regError,setRegError] = useState({})

  const [userData,setUserData] = useState({
    username:'',
    contact:'',
    password:'',
    confirm_password:''
  })

  const [userDataError,setUserDataError] = useState({
    usernameError:"",
    contactError:"",
    passwordError:"",
    confirm_passwordError:"",
  })


  const handleInputField = (e) => {
    let { name , value } = e.target

    setUserData(prev=>({
      ...prev,
      [name]:value
    }))    
  }


  // send otp tanstack query
  const sendOtpMutation = useMutation({

    mutationFn : (data) => authApi.sendOtp(data),

    onSuccess : () => {
      setIsRegForm(false)
      setIsOtpBox(true)
    },
    
    onError : (error) => {
      alert("Failed to send Otp. Retry.")
      console.log(error)
    }
  })

  const handleSubmission = (e) => {
    e.preventDefault()

    console.log('user data :',userData)

    const result = validateAccountForm(userData)
    // failed
    if(!result.isValid){
      console.log("registration errors",result.errors)
      setRegError(result.errors)
      return alert("register account validation check failed")
    }
    // passed 
    console.log("Form validation.Proceed")

    sendOtpMutation.mutate(userData)

  } 


  // OtpBox Component Fn.

  const onVerify = () => {
    
  }

  return (
    <section className='registerSection'>
     
     {isRegFormOpen && (
      <>
          <h3>Join Whisper</h3>
          <form onSubmit={handleSubmission} method='POST'>
            {/* username field */}
            <div className='fieldBlock'>
              <label htmlFor="">Username:</label>
              <input type="text" placeholder='username' 
                     name = "username" value={userData.username} onChange={handleInputField}
              />
              <small className='fieldInfo'>Note : username must be unique and can only include ( _ ) as special character and none other</small>
            </div>

            {/* contact field */}
            <div className='fieldBlock'>
              <label htmlFor="">Mobile No.</label>
              <input type = "text" placeholder = 'mobile number'
                     name = "contact" value = {userData.contact} onChange = {handleInputField}
              />
              {/* <small className='fieldInfo'> Note : 10 digits mobile number </small> */}
            </div>

            {/* password field */}
            <div className='fieldBlock'>
              <label htmlFor="">Password</label>
              <input type="text" placeholder='password'
                     name = "password" value={userData.password} onChange={handleInputField} 
              />
              {/* <small className='fieldInfo'>incorrect password</small> */}
            </div>

            {/* confirm password field */}
             <div className='fieldBlock'>
              <label htmlFor=""> Confirm Password </label>
              <input type = "text" placeholder = 'confirm password' 
                     name = "confirm_password" value = { userData.confirm_password } onChange = { handleInputField }
              />
            </div>

            <button type='submit' disabled={sendOtpMutation.isPending}>
              {sendOtpMutation.isPending ? "Sending..." : "Continue"}
            </button>
          </form>
      </>
     )}

     {isOtpBoxOpen && ( 
      <OtpVerification 
                setIsRegForm={setIsRegForm}
                setIsOtpBox={setIsOtpBox}
                onVerify={onVerify}
      /> )}

    </section>
  )
}
