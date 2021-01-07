import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
} from "@material-ui/core";
import theme from "../Theme/index";
import PageTemplate from "../Utils/uiTemplates/pageTemplate"

const styles = (theme) => ({
  main: {
    backgroundColor: theme.palette.primary.light,
    height: "100vh",
    padding: "50px 0 50px 300px"
  },

});

const useStyle = makeStyles(styles);

const Reports = () => {
  const classes = useStyle(theme);

  const reports = (

      <Typography align="left">Reports!</Typography>
  )

  return (
    <Fragment>
      <PageTemplate component={reports}/>
    </Fragment>
  );
};

export default Reports;
