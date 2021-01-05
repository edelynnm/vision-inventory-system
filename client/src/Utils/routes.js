import { DashboardRounded, LocalMallRounded, SupervisorAccountRounded, TrendingUpRounded, ShoppingCartRounded, ExitToAppRounded, LocalOfferRounded } from "@material-ui/icons";
import Dashboard from "../Components/dashboard";
import Purchase from "../Components/purchase";
import Inventory from "../Components/inventory"
import Sales from "../Components/sales";
import Employees from "../Components/employees";
import Reports from "../Components/reports"

const MainRoutes = [
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

export default MainRoutes;
