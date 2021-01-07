import { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
} from "@material-ui/core";
import theme from "../Theme/index";
import PageTemplate from "../Utils/uiTemplates/pageTemplate"
import { useAuth } from "../Utils/auth";

const styles = (theme) => ({
  main: {
    backgroundColor: theme.palette.primary.light,
    height: "100vh",
    padding: "50px 0 50px 300px"
  },

});

const useStyle = makeStyles(styles);

const Dashboard = () => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const dashboard = (
      <Typography variant="h4" align="left" color="primary" style={{fontWeight: 700}}>Welcome {auth.user.fname}!</Typography>
  )

  return (
    <Fragment>
      <PageTemplate component={dashboard}/>
    </Fragment>
  );
};

export default Dashboard;
