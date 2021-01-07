import { DashboardRounded, LocalMallRounded, SupervisorAccountRounded, TrendingUpRounded, ExitToAppRounded, LocalOfferRounded } from "@material-ui/icons";
import Dashboard from "../Components/dashboard";
import Inventory from "../Components/Inventory/inventory"
import Sales from "../Components/sales";
import Employees from "../Components/employees";
import Reports from "../Components/reports"

const ProtectedRoutes = [
  {
    sidebarName: "Dashboard",
    icon: <DashboardRounded />,
    path: "/dashboard",
    component: Dashboard,
    forbiddenRoleIDs: []
  },
  {
    sidebarName: "Inventory",
    icon: <LocalMallRounded />,
    path: "/inventory",
    component: Inventory,
    forbiddenRoleIDs: [] // provide local forbidden roles for new item & restock feat
  },
  {
    sidebarName: "Sales",
    icon: <LocalOfferRounded />,
    path: "/sales",
    component: Sales,
    forbiddenRoleIDs: [3]
  },
  {
    sidebarName: "Reports",
    icon: <TrendingUpRounded />,
    path: "/reports",
    component: Reports,
    forbiddenRoleIDs: [2,3]
  },
  {
    sidebarName: "Employees",
    icon: <SupervisorAccountRounded />,
    path: "/employees",
    component: Employees,
    forbiddenRoleIDs: [2,3]
  }
];

export default ProtectedRoutes;
