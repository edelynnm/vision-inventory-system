import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Hidden,
  Drawer,
  Divider,
  AppBar,
  IconButton,
  Toolbar,
  Box,
  Typography
} from "@material-ui/core";
import { MenuRounded } from "@material-ui/icons"
import theme from "../../../Theme/index";
import CustomDrawer from "./drawer";
import { useAuth } from "../auth";

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
});

const useStyle = makeStyles(styles);

const PageTemplate = (props) => {
  const classes = useStyle(theme);
  const [mobileOpen, setMobileOpen] = useState(false);
  const auth = useAuth();
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Fragment>
      <AppBar position="fixed" elevation={0} color="primary" className={classes.appBar}>
        <Toolbar>
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
