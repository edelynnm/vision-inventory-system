import { useState, useContext, createContext, useEffect } from "react";

const authContext = createContext();

// handle user state
const useProvideAuth = () => { 
  const [user, setUser] = useState(false)

  useEffect(() => {
    fetchToken()
  },[user])
  
  const fetchToken = () => {
    const token = localStorage.getItem("token");
    setUser(token);
  }

  const login = (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    setUser(token)
  }

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null)
  }

  return {user, login, logout}
}

// Component to provide the value to be inherited
// useAuth() to read the value
const AuthProvider = ({ children }) => {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// subscribe && rerender everytime there is change to user
const useAuth = () => {
  return useContext(authContext)
}

export {useAuth, AuthProvider};