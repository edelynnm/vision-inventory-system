import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import theme from "./Theme/index";
import { AuthProvider } from "./Components/Subcomponents/auth";
import PrivateRoute from "./Components/Subcomponents/privateRoute";
import Login from "./Components/AuthScreens/login";
import Signup from "./Components/AuthScreens/signup";
import VerifyEmail from "./Components/AuthScreens/verifyEmail";
import EmpSignup from "./Components/AuthScreens/empSignup";
import NewTransaction from "./Components/Sales/newTransaction";
import Dashboard from "./Components/Dashboard/dashboard";
import Inventory from "./Components/Inventory/inventory";
import Sales from "./Components/Sales/sales";
import TransactionRecords from "./Components/Sales/records";
import Reports from "./Components/Reports/reports";
import Employees from "./Components/Employees/employees";
import RegisterEmployees from "./Components/Employees/registerEmp";
import EmployeeRecords from "./Components/Employees/employeeRecords";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/auth/signup" component={Signup} />
            <Route exact path="/auth/verify-email" component={VerifyEmail} />
            <Route exact path="/auth/signup/emp" component={EmpSignup} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/inventory" component={Inventory} />
            <PrivateRoute exact path="/sales" component={Sales} />
            <PrivateRoute exact path="/reports" component={Reports} />
            <PrivateRoute exact path="/employees" component={Employees} />
            <PrivateRoute exact path="/employees/records" component={EmployeeRecords} />
            <PrivateRoute exact path="/employees/register" component={RegisterEmployees} />
            <PrivateRoute exact path="/sales/new-transaction"component={NewTransaction} />
            <PrivateRoute exact path="/sales/transaction-records" component={TransactionRecords} />
          </Switch>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
