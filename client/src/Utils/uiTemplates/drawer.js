import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import theme from "../../Theme";
import Routes from "../routes";
import { Link, withRouter} from "react-router-dom";
import { useAuth } from "../auth";
import { ExitToAppRounded } from "@material-ui/icons";

const styles = (theme) => ({
  listItem: {
    color: "#7b8ba6",
    "&:hover": {
      backgroundColor: theme.palette.primary.light
    },
  },
  selected: {
    color: theme.palette.primary.dark,
    "&.Mui-selected:hover":{
      backgroundColor: "#d9dee9"
    },
    "&.Mui-selected":{
      color: theme.palette.primary.dark,
      backgroundColor: "#e5ebf4"
    }
  }
});

const useStyle = makeStyles(styles);

const CustomDrawer = (props) => {
  const classes = useStyle(theme);
  const auth = useAuth();

  const logoutUser = () => {
    auth.logout();
  }

  return (
      <Fragment>
        <div>
        <List>
          {Routes.map((route) => {
            const isSelected = props.location.pathname.includes(route.path) ? true : false
            if (route.forbiddenRoleIDs.includes(auth.user.roleID)) return null;
            return (
            <ListItem
              button
              component={Link}
              key={route.sidebarName}
              to={route.path}
              selected={isSelected}
              className={isSelected ? classes.selected : classes.listItem}
            >
              <ListItemIcon className={isSelected ? classes.selected : classes.listItem}>{route.icon}</ListItemIcon>
              <ListItemText primary={route.sidebarName} />
            </ListItem>);
          })}
        </List>
        <Divider />
        <List>
          <ListItem
            button
            key="Logout"
            onClick={logoutUser}
            className={classes.listItem}
          >
            <ListItemIcon className={classes.listItem}><ExitToAppRounded /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
        </div>
      </Fragment>
  );
};

export default withRouter(CustomDrawer);