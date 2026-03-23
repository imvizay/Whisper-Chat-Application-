// control room for api
import axios from 'axios'

export const BASEURL_DEV = `http://127.0.0.1:8000/api`; // backned url

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
        const raw = localStorage.getItem("authUser")
        const refToken = JSON.parse(raw)

        const res = await axios.post(`${BASEURL_DEV}/api/token/refresh/`, {
          refresh: refToken
        })

        const newAccess = res.data.access
        localStorage.setItem("access", newAccess)

        console.log("Retrying Original Request with new token")

        // update header
        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`

        // retry original request
        return axios(originalRequest)

      } catch (err) {
        console.log("Refresh failed logout user")
      }
    }

    return Promise.reject(error)
  }
)