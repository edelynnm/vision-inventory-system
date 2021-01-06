import { DashboardRounded, LocalMallRounded, SupervisorAccountRounded, TrendingUpRounded, ExitToAppRounded, LocalOfferRounded } from "@material-ui/icons";
import Dashboard from "../Components/dashboard";
import Inventory from "../Components/Inventory/inventory"
import Sales from "../Components/sales";
import Employees from "../Components/employees";
import Reports from "../Components/reports"

const PrivateRoutes = [
  {
    sidebarName: "Dashboard",
    icon: <DashboardRounded />,
    path: "/dashboard",
    component: Dashboard,
  },
  {
    sidebarName: "Inventory",
    icon: <LocalMallRounded />,
    path: "/inventory",
    component: Inventory
  },
  {
    sidebarName: "Sales",
    icon: <LocalOfferRounded />,
    path: "/sales",
    component: Sales
  },
  {
    sidebarName: "Reports",
    icon: <TrendingUpRounded />,
    path: "/reports",
    component: Reports
  },
  {
    sidebarName: "Employees",
    icon: <SupervisorAccountRounded />,
    path: "/employees",
    component: Employees
  },
  {
    sidebarName: "Logout",
    icon: <ExitToAppRounded />,
    path: "/logout",
  },
];

export default PrivateRoutes;
