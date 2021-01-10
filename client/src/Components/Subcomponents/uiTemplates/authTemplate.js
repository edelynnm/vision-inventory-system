import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Hidden, Box } from "@material-ui/core";
import clsx from "clsx";

const styles = {
  root: {
    height: "100vh",
  },
  leftScreen: {
    backgroundColor: "white",
    zIndex: 2,
  },
  leftContainer: {
    margin: "80px",
  },
  rightContainer: {
    height: "100%",
    zIndex: 1,
  },
};

const useStyle = makeStyles(styles);

const AuthTemplate = (props) => {
  const classes = useStyle();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Box
          component={Grid}
          item
          xs
          lg={4}
          className={clsx(props.leftScreenStyle, classes.leftScreen)}
        >
          <Box className={classes.leftContainer}>
            {props.leftScreen}
          </Box>
        </Box>
        <Hidden smDown>
          <Grid item md className={clsx(props.rightScreenStyle)}>
            <Box className={clsx(props.rightContainerStyle, classes.rightContainer)}>
              {props.rightScreen}
            </Box>
          </Grid>
        </Hidden>
      </Grid>
    </Fragment>
  );
};

export default AuthTemplate;
