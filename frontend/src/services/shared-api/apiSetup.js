// control room for api
import axios from 'axios'

// export const BASEURL_DEV = `http://127.0.0.1:8000/api`; // backned url

// production
export const BASEURL_DEV = 'https://whisper-7bux.onrender.com/api'



export const api = axios.create({
    baseURL:BASEURL_DEV
})

api.interceptors.request.use(
    
    (config)=>{

        const stored = localStorage.getItem("authUser")

        // skip login & refresh endpoints
        if( config.url?.includes("/auth/login") || 
            config.url?.includes("/token/refresh") || 
            config.url?.includes("/auth/send-otp") || 
            config.url?.includes("/auth/verify-otp") 

        ){
            return config
        }


        if(stored){

            const token = JSON.parse(stored)

            if(token?.access){
                            config.headers = {
                                  ...config.headers,
                                  Authorization:`Bearer ${token.access}`
                            }
            }
            
        }
        return config

    }, 

    (error) => Promise.reject(error)
)


//  retry request by making api call to refresh token in order to generate new access token using refresh token
api.interceptors.response.use(
  (res) => res.data,

  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
        console.log("401 Error Detected")
      originalRequest._retry = true

      try {
        console.log("Running Refresh Token Api")

        const authUser = localStorage.getItem("authUser")
        const parsed = JSON.parse(authUser)

        console.log("Api Call To Refresh Token Endpoint")
        const res = await api.post(`${BASEURL_DEV}/token/refresh/`, {
          refresh: parsed.refresh
        })

        console.log("Before Error Jump Res Data State",res.access)
        const newAccess = res.access
        
        const updatedAuthUser = {
          ...parsed,
          access:newAccess
        }
        console.log("Updating AuthUser on Localstorage")
        localStorage.setItem("authUser", JSON.stringify(updatedAuthUser))

        console.log("Retrying Original Request with new token")

        // update header
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`

        // retry original request
        return api(originalRequest)

      } catch (err) {
        console.log("Refresh failed logout user")
      }
    }

    return Promise.reject(error)
  }
)