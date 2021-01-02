import React from "react";
import './App.css';
import { ThemeProvider } from "@material-ui/core/styles";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import theme from "./Theme/index";
import Routes from "./Utils/routes"
import Home from "./Components/homepage"
import PageTemplate from "./Utils/pageTemplate"
;
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/test" component={PageTemplate} />

          {Routes.map((route) => (
            <Route exact path={route.path} component={route.component} />
          ))}
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
