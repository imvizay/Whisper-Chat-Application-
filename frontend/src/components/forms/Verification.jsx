import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/forms/otp-verification.css";

import { authApi } from "../../services/authApi";
import { useMutation } from "@tanstack/react-query";

function OtpVerification({ userData,setIsRegForm,  setIsOtpBox ,onVerify }) {
  const [otp, setOtp] = useState(new Array(6).fill(""))
  const [timer, setTimer] = useState(60)
  const inputsRef = useRef([])

  // Close Otp Dialog Box
  const closeOtpWindow = () => {
    setIsOtpBox(false)
    setIsRegForm(true)
  }

  
  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return

    const newOtp = [...otp]
    newOtp[index] = element.value.slice(-1)
    setOtp(newOtp)

    // Move focus forward
    if (element.value && index < 5) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pasteData)) return

    const newOtp = pasteData.split("")
    setOtp(newOtp)

    newOtp.forEach((digit, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = digit
      }
    })
  }

  const sendVerificationMutatiom = useMutation({
    mutationFn : (otp) => authApi.verifyOtp(otp),
    onSuccess : () => {
      setIsOtpBox(false)
      setIsRegForm(false)
      alert("account created successfully on whisper.")
    },
    onError: (error)=>{
      
      console.log("otp verification failed",error)
      alert("failed otp verification")
    }
  })


  const handleSubmit = (e) => {

    e.preventDefault()
    const finalOtp = otp.join("")

    if (finalOtp.length === 6) {
      const data = {
        contact:userData?.contact,
        otp:finalOtp
      }

      sendVerificationMutatiom.mutate(data)
    }
    else{
      console.log("invalid otp")
    }
  }

  const handleResend = () => {
    setTimer(30)
    setOtp(new Array(6).fill(""))
    inputsRef.current[0].focus()
  }

  return (
    <div className="otpContainer">
      <span className="closeVerification" onClick={closeOtpWindow}>X</span>
      <h3 className="otpTitle">Verify OTP</h3>
      <p className="otpSubtitle">Enter the 6-digit code sent to your mobile 
        <br /> 
        <br /> 
        <small>7987725298</small> 
      </p>
      

      <form onSubmit={handleSubmit} className="otpForm">
        <div className="otpInputWrapper" onPaste={handlePaste}>
          {otp.map((data, index) => (
            <input key={index} type="text" maxLength="1" className="otpInput"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
            />
          ))}
        </div>

        <button type="submit" className="verifyButton">
          Verify
        </button>
      </form>

      <div className="resendSection">
        {timer > 0 ? (
          <span className="resendTimer">
            Resend OTP in {timer}s
          </span>
        ) : (
          <button onClick={handleResend} className="resendButton">
            Resend OTP
          </button>
        )}
      </div>
    </div>
  )
}

export default OtpVerification