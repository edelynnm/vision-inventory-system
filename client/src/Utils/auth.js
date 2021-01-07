import ms from "ms";
import { useState, useContext, createContext, useEffect } from "react";
import ajax from "./facade";

const authContext = createContext();

// handle user state
const useProvideAuth = () => {
  const [user, setUser] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const isLoggedIn = () => {
      const expiration = getExpiration();
      return Date.now < expiration ? true : false;
    };

    const fetchUser = () => {
      if (isLoggedIn) {
        const token = localStorage.getItem("token");
        setToken(token)
        getUser(token)
      } else {
        alert("Session expired, please login again.")
        logout();
      }
    };

    const getUser = (token) => {
      ajax.GET({
        url:"http://localhost:8000/api/user",
        authToken: token,
        callback: setUser
      })
    }

    fetchUser() 
    const interval =  setInterval(() => isLoggedIn(), 5000);
    return () => {
      console.log('token expired')
      fetchUser()
      clearInterval(interval)
    }
  }, []);

  const getExpiration = () => JSON.parse(localStorage.getItem("expires_in"));

  const login = (authResult) => {
    const issuedAt = Date.now();
    const expiresIn = issuedAt + ms(authResult.expiresIn);

    localStorage.setItem("token", authResult.token);
    localStorage.setItem("expires_in", expiresIn);
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_in");
    setUser(false);
    window.location.reload();
  };

  return { user, token, login, logout };
};

// Component to provide the value to be inherited
// useAuth() to read the value
const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

// subscribe && rerender everytime there is change to user
const useAuth = () => {
  return useContext(authContext);
};

export { useAuth, AuthProvider };
