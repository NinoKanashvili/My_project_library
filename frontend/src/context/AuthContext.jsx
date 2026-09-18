import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

export function AuthProvider({children}){
    const [isAuthenticated,setIsAuthenticated] = useState(!!localStorage.getItem('access'))

    function logout() {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsAuthenticated(false);
    }

    return(
        <AuthContext.Provider value={{isAuthenticated,setIsAuthenticated,logout}}>
            {children}
        </AuthContext.Provider>
    )
} 

export function useAuth(){
    return useContext(AuthContext)
}