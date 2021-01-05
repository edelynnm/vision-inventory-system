import './App.css';
import { ThemeProvider } from "@material-ui/core/styles";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import theme from "./Theme/index";
import MainRoutes from "./Utils/routes"
import Login from "./Components/Auth/login"
import Signup from "./Components/Auth/signup";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route key="Login" exact path="/" component={Login} />
          {MainRoutes.map((route) => (
            <Route key={route.sidebarName} exact path={route.path} component={route.component} />
          ))}
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
