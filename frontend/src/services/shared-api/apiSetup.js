// control room for api
import axios from 'axios'

const BASEURL_DEV = `http://127.0.0.1:8000/api`; // backned url

export const api = axios.create({
    baseURL:BASEURL_DEV
})

api.interceptors.request.use(
    
    (config)=>{

        const stored = localStorage.getItem("authUser")

        // skip login & refresh endpoints
        if(config.url?.includes("/auth/login") || config.url?.includes("/token/refresh")){
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

api.interceptors.response.use(
    (res) => res.data,
    (error)=>{
        if(error.response?.status === 401){
            console.log("token expire")
        }
        return Promise.reject(error)
    }
)