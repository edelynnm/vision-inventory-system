import { useAuth } from "./auth";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ children, ...rest }) => {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={() => (auth.user ? children : <Redirect to="/" />)}
    />
  );
};

export default PrivateRoute;
