import { Fragment, useState } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Snackbar,
  Typography,
  Box,
  Link,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import ajax from "../../Utils/facade";
import AuthTemplate from "../Subcomponents/uiTemplates/authTemplate";
import logo from "../../Assets/icons/vision-logo@2x.png";
import welcomeImg from "../../Assets/images/welcome-img.jpg";
import { useAuth } from "../Subcomponents/auth";
import { useLocation } from "react-router-dom";

const styles = {
  root: {
    height: "100vh",
  },
  authScreen: {
    boxShadow: "10px 10px 40px rgba(0,0,0, 0.4)",
  },
  welcomeOverlay: {
    backgroundColor: "rgba(2, 15, 72, 0.3)",
  },
  welcomeImg: {
    backgroundImage: `url(${welcomeImg})`,
    backgroundSize: "cover",
    zIndex: 0,
  },
  logo: {
    width: "65px",
    height: "auto",
    margin: "0 0 30px 0",
  },
  margin: {
    marginTop: "20px",
  },
  subText: {
    marginTop: "20px",
    fontSize: "11pt",
  },
};

const useStyle = makeStyles(styles);

const Login = () => {
  const classes = useStyle();
  const auth = useAuth();
  const { state } = useLocation();
  const { from } = state || { from: "/" } // important to redirect to prev page when refreshing
  const [redirect, setRedirect ] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [errMessage, setErrMessage] = useState("");
  
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    ajax.POST({
      url: "http://localhost:8000/api/auth/login",
      headers: { "Content-Type": "application/json" },
      body: values,
      callback: handleHTTPResponse,
    });
    
  };
  
  const handleHTTPResponse = (body) => {
    if (!body.success) {
      showErrMessage(body.message);
    } else {
      auth.login(body);
      setRedirect(true)
      window.location.reload();
    }
  };

  const showErrMessage = (message) => {
    setErrMessage(message);
    handleCloseSnackbar();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  // Components
  const snackbar = ( // for ERROR ONLY
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <div>
          <Alert
            variant="filled"
            onClose={handleCloseSnackbar}
            severity="error"
          >
            {errMessage}
          </Alert>
        </div>
      </Snackbar>
    </div>
  );

  const leftScreen = (
    <div>
      {snackbar}
      <img className={classes.logo} src={logo} alt="vision-logo"></img>
      <Typography variant="h3" color="primary" gutterBottom>
        Welcome to Vision
      </Typography>
      <Typography
        style={{ width: "80%" }}
        variant="h4"
        color="secondary"
        gutterBottom
      >
        The inventory solution for your business.
      </Typography>
      <form onSubmit={onSubmitForm}>
        <Box display="flex" flexDirection="column" flexWrap="wrap">
          <TextField
            required
            id="outlined-required"
            label="Email Address"
            name="email"
            variant="outlined"
            autoComplete="email"
            value={values.email}
            autoFocus
            className={classes.margin}
            onChange={handleChange}
          />
          <TextField
            required
            id="outlined-password-input"
            label="Password"
            type={values.showPassword ? "text" : "password"}
            name="password"
            value={values.password}
            autoComplete="current-password"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className={classes.margin}
            onChange={handleChange}
          />
          <Button
            style={{ padding: "10px 50px" }}
            type="submit"
            variant="contained"
            color="primary"
            className={classes.margin}
          >
            Login
          </Button>
        </Box>
      </form>
      <Box display="flex" justifyContent="space-between">
        <Link href="/forgot-password" color="secondary">
          <Typography
            color="secondary"
            style={{ textAlign: "left" }}
            className={classes.subText}
          >
            Forgot Password?
          </Typography>
        </Link>
        <Typography
          color="primary"
          style={{ textAlign: "right" }}
          className={classes.subText}
        >
          Don't have an account yet?&nbsp;
          <Link href="/auth/signup" color="secondary">
            <Typography
              component="span"
              color="secondary"
              className={classes.subText}
            >
              Sign Up.
            </Typography>
          </Link>
        </Typography>
      </Box>
    </div>
  );

  if (redirect) {
   return <Redirect to="/dashboard" />
  }

  return auth.user ? <Redirect to={from} /> : (
    <Fragment>
      <AuthTemplate
        leftScreenStyle={classes.authScreen}
        leftScreen={leftScreen}
        rightScreenStyle={classes.welcomeImg}
        rightContainerStyle={classes.welcomeOverlay}
      />
    </Fragment>
  );
};

export default Login;
