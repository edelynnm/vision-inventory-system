import { Fragment, useState, useEffect } from "react";
import { Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { HomeRounded } from "@material-ui/icons";
import ajax from "../../Utils/facade";
import AuthTemplate from "../../Utils/uiTemplates/authTemplate";
import { makeStyles } from "@material-ui/core/styles";
import theme from "../../Theme/index";

const styles = (theme) => ({
  rightScreenStyle: {
    backgroundColor: theme.palette.primary.main,
    zIndex: 0,
  },
  backButton: {
    color: "#7b8ba6",
    margin: "0px 0 30px -20px",
    "&:hover": {
      backgroundColor: "transparent",
      color: theme.palette.primary.main,
      transition: "0.3s",
    },
  },
  margin: {
    marginTop: "20px",
  },
  homeBtn: {
    fontSize: "30pt",
  },
});

const useStyle = makeStyles(styles);

const VerifyEmail = ({ location }) => {
  const classes = useStyle(theme);
  const [verificationMsg, setVerificationMsg] = useState("");

  useEffect(() => { // verify email on load
    verifyEmail();
  }, []);

  const handleResponse = ({ message }) => {
    return setVerificationMsg(message);
  };

  const verifyEmail = () => {
    const queryString = location.search;
    ajax.PATCH({
      url: `http://localhost:8000/api/auth/signup/verify-email${queryString}`,
      httpHeader: { header: "Content-Type", type: "appliation/json" },
      callback: handleResponse,
    });
  };

  const leftScreen = (
    <div>
      <Button
        component={Link}
        disableRipple
        className={classes.backButton}
        to={"/"}
      >
        <HomeRounded className={classes.homeBtn} />
      </Button>
      <div
        style={{
          marginTop: 80,
        }}
      >
        <Typography variant="h5">{verificationMsg}</Typography>
      </div>
    </div>
  );
  const showMessage = (
    <Fragment>
      <AuthTemplate
        leftScreen={leftScreen}
        rightScreenStyle={classes.rightScreenStyle}
      />
    </Fragment>
  );

  return (
    <Fragment>
      {showMessage}
    </Fragment>
  );
};

export default VerifyEmail;
