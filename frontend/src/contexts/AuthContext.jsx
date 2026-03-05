
// state and effect hooks
import { useState,useEffect } from "react";

// context hooks
import { createContext,useContext } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState({
        contact:"",
        username:"",
        status:""
    })

    // set user on page refresh
    useEffect(()=>{
        const authObject = JSON.parse(localStorage.getItem("authUser"))
        
        if (authObject?.access && authObject?.user) {
            setUser(authObject?.user)
        }
    },[])

    // set user info in local storage after login success.(always exclude password)
    const login = (data) => {
        localStorage.setItem("authUser",JSON.stringify(data))
        setUser(data.user)
    }

    // remove user from localstorage 
    const logout = () => {
        localStorage.clear()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}