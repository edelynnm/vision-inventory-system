import ms from "ms";
import { useState, useContext, createContext, useEffect } from "react";
import ajax from "../../Utils/facade";

const authContext = createContext();

// handle user state
const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const isLoggedIn = () => {
      const expiration = getExpiration();
      if (expiration !== null && Date.now() >= expiration) {
        alert("Session expired, please login again.");
        logout();
      }
    };

    const fetchUser = () => {
      const token = localStorage.getItem("token");
      setToken(token);

      if (token) {
        getUser(token);
      }
    };

    fetchUser();

    const interval = setInterval(() => isLoggedIn(), 1000);
    return () => {
      fetchUser();
      clearInterval(interval);
    };
  }, []);

  const getExpiration = () => JSON.parse(localStorage.getItem("expires_in"));

  const getUser = (token) => {
    ajax.GET({
      url: "http://localhost:8000/api/user",
      authToken: token,
      callback: setUser,
    });
  };

  const login = (authResult) => {
    const issuedAt = Date.now();
    const expiresIn = issuedAt + ms(authResult.expiresIn);

    localStorage.setItem("token", authResult.token);
    localStorage.setItem("expires_in", expiresIn);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_in");
    setUser(false);
  };

  return { user, login, logout, token };
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
