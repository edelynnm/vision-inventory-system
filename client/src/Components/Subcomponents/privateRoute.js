import { useAuth } from "./auth";
import { Redirect, Route, useLocation } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  let auth = useAuth();
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={(props) => {
        return(auth.user ? <Component {...props} /> : <Redirect to={{pathname: "/", state: {from: location.pathname}}} />)}}
    />
  );
};

export default PrivateRoute;
