import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import theme from "../Theme";
import Routes from "./routes";
import { Link, useLocation } from "react-router-dom";

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

const CustomDrawer = () => {
  const location = useLocation();
  const classes = useStyle(theme);

  return (
      <div>
        <List>
          {Routes.map((route) => {
            const isSelected = route.path === location.pathname ? true : false
  
            if (route.sidebarName === "Logout") return null;
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
            component={Link}
            key="Logout"
            to="/"
            className={classes.listItem}
          >
            <ListItemIcon className={classes.listItem}>{Routes[Routes.length-1].icon}</ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
  );
};

export default CustomDrawer;