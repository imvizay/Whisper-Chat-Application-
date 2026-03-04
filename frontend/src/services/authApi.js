
// Api Endpoints releted to authentication services.
import { http } from "./shared-api/httpRequest"
export const authApi = {
    
    sendOtp : (data) => http.post(`/auth/send-otp/`,data),
    verifyOtp : (data) => http.post(`/auth/verify-otp/`,data),

    login : (data) => http.post(`/auth/login/`,data),
    logout : () => http.post(`/auth/logout/`)
}