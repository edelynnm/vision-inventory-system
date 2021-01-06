import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import theme from "./Theme/index";
import PrivateRoutes from "./Utils/routes"
import Login from "./Components/Auth/login"
import Signup from "./Components/Auth/signup";
import VerifyEmail from "./Components/Auth/verifyEmail";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route key="Login" exact path="/" component={Login} />
          <Route key="Signup" exact path="/auth/signup" component={Signup} />
          <Route key="VerifyEmail" exact path="/auth/signup/verify-email" component={VerifyEmail} />
          
          {PrivateRoutes.map((route) => (
            <Route key={route.sidebarName} exact path={route.path} component={route.component} />
          ))}
          
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
