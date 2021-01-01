import React from "react";
import './App.css';
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./Utils/theme";
import Home from "./Components/homepage";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
