import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import theme from "../Theme";
import Routes from "./routes";

const styles = (theme) => ({
  toolbar: theme.mixins.toolbar,
  active: {
    color: "#0b2696",
  },
});

const useStyle = makeStyles(styles);


const CustomDrawer = () => {
  const classes = useStyle(theme);
  const [selectedIndex, setSelectedIndex] = useState();

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
      <div>
        <List>
          {Routes.map((route, index) => {
            if (route.sidebarName === "Logout") return null;
            return (
            <ListItem
              button
              component="a"
              key={route.sidebarName}
              href={route.path}
              selected={index === selectedIndex}
              onClick={(event) => handleListItemClick(event, index)}
            >
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.sidebarName} />
            </ListItem>);
          })}
        </List>
        <Divider />
        <List>
          <ListItem
            button
            component="a"
            key="Logout"
            href="/"
          >
            <ListItemIcon>{Routes[Routes.length-1].icon}</ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
  );
};

export default CustomDrawer;
