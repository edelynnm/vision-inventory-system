import { DashboardRounded, LocalMallRounded, SupervisorAccountRounded, TrendingUpRounded, LocalOfferRounded } from "@material-ui/icons";

const ProtectedRoutes = [
  {
    sidebarName: "Dashboard",
    icon: <DashboardRounded />,
    path: "/dashboard",
    forbiddenRoleIDs: []
  },
  {
    sidebarName: "Inventory",
    icon: <LocalMallRounded />,
    path: "/inventory",
    forbiddenRoleIDs: [] // provide local forbidden roles for new item & restock feat
  },
  {
    sidebarName: "Sales",
    icon: <LocalOfferRounded />,
    path: "/sales",
    forbiddenRoleIDs: [3]
  },
  {
    sidebarName: "Reports",
    icon: <TrendingUpRounded />,
    path: "/reports",
    forbiddenRoleIDs: [2,3]
  },
  {
    sidebarName: "Employees",
    icon: <SupervisorAccountRounded />,
    path: "/employees",
    forbiddenRoleIDs: [2,3]
  }
];

export default ProtectedRoutes;
