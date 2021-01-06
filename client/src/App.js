import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import theme from "./Theme/index";
import ProtectedRoutes from "./Utils/routes";
import Login from "./Components/AuthScreen/login";
import Signup from "./Components/AuthScreen/signup";
import VerifyEmail from "./Components/AuthScreen/verifyEmail";
import { AuthProvider } from "./Utils/auth";
import PrivateRoute from "./Components/Auth/privateRoute";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route key="Login" exact path="/" component={Login} />
            <Route key="Signup" exact path="/auth/signup" component={Signup} />
            <Route
              key="VerifyEmail"
              exact
              path="/auth/signup/verify-email"
              component={VerifyEmail}
            />
            {ProtectedRoutes.map((route) => (
              <PrivateRoute
                key={route.sidebarName}
                exact
                path={route.path}
                component={route.component}
              />
            ))}
          </Switch>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
