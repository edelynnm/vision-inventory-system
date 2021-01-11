import { Fragment, useState, useEffect } from "react";
import { Typography, Button } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { ChevronLeftRounded } from "@material-ui/icons";
import ajax from "../../Utils/facade";
import AuthTemplate from "../Subcomponents/uiTemplates/authTemplate";
import { makeStyles } from "@material-ui/core/styles";
import theme from "../../Theme/index";
import parseQs from "../../Utils/parseQS";

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

const VerifyEmail = (props) => {
  const classes = useStyle(theme);
  const [verificationMsg, setVerificationMsg] = useState("");
  const [type, setType] = useState(null)
  const [isVerified, setIsVerified] = useState(false)
  const queryString = props.location.search;
  const url = window.location.href

  useEffect(() => { // verify email on load
    verifyEmail();
    getType()
  }, []);
  
  const handleResponse = (body) => {
    if (body.success) {
      setIsVerified(true)
      setType(body.type)
    }

    return setVerificationMsg(body.message);
  };

  const verifyEmail = () => {
    ajax.PATCH({
      url: `http://localhost:8000/api/auth/verify-email${queryString}`,
      headers: { "Content-Type":"application/json" },
      callback: handleResponse,
    });
  };

  const getType = () => {
    const type = parseQs(url, "type")
    setType(type)
  }

  const leftScreen = (
    <div>
      <Button
        component={Link}
        disableRipple
        className={classes.backButton}
        to={"/"}
      >
        <ChevronLeftRounded className={classes.chevron} />
        <Typography variant="subtitle2">
          LOGIN
        </Typography>
      </Button>
      <div>
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

  if(type === "emp" && isVerified) {
    return (
      <Redirect to={`/auth/signup/emp/${props.location.search}`} />
    )
  }

  return (
    <Fragment>
      {showMessage}
    </Fragment>
  );
};

export default VerifyEmail;
