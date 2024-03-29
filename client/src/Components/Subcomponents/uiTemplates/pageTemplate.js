import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Hidden,
  Drawer,
  Divider,
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Typography,
  Avatar,
  Badge
} from "@material-ui/core";
import { MenuRounded, NotificationsRounded } from "@material-ui/icons"
import theme from "../../../Theme/index";
import CustomDrawer from "./drawer";
import { useAuth } from "../auth";
import ajax from "../../../Utils/facade";

const styles = (theme) => ({
  main: {
    backgroundColor: theme.palette.primary.light,
    height: "100vh",
    [theme.breakpoints.up("sm")]: {
      padding: "100px 0 50px 300px"
    },
    padding: "100px 50px"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  }
});

const useStyle = makeStyles(styles);

const PageTemplate = (props) => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [restockItems, setRestockItems] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getItems();
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [])

  // const getItems = () => {
  //   ajax.GET({
  //     url: "http://localhost:8000/api/inventory",
  //     authToken: auth.token,
  //     callback: getRestockItems,
  //   });
  // };

  // const getRestockItems = (items) => {
  //   const result = items.filter((item) =>
  //     item.qty <= item.reorder_point ? item : ""
  //   );
  //   setRestockItems(result);
  // };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const initials = `${auth.user.fname[0]}${auth.user.lname[0]}`
  return (
    <Fragment>
      <AppBar position="fixed" elevation={0} color="primary" className={classes.appBar}>
        <Toolbar style={{"display": "flex", "justifyContent": "space-between"}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuRounded />
          </IconButton>
          <Typography variant="h6" noWrap>
            {auth.user.businessName}
          </Typography>
          <div style={{"display": "flex", "flexDirection":"row"}}>
          <Avatar className={classes.avatar}>{initials}</Avatar>
          {/* <Badge
            overlap="circle"
            color="error"
            badgeContent={restockItems.length}>
            <Avatar style={{"background": "#e5ebf4", "color":"#041d8a", "marginLeft": 8}}>
           <NotificationsRounded></NotificationsRounded>
          </Avatar>
          </Badge> */}
          </div>
        </Toolbar>
      </AppBar>
      <Hidden xsDown>
        <Drawer
          variant="permanent"
          anchor="left"
          >
            <Toolbar />
              <CustomDrawer />
        </Drawer>
      </Hidden>
      <Hidden smUp>
        <Drawer 
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          >
            <Toolbar />
            <Divider />
            <CustomDrawer />
        </Drawer>
      </Hidden>
      <Box className={classes.main}>
        {props.component}
      </Box>
    </Fragment>
  );
};

export default PageTemplate;
