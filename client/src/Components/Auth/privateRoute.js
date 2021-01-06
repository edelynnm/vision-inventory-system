import { useAuth } from "../../Utils/auth";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.user ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default PrivateRoute;
