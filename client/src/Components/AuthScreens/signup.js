import { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Snackbar,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import {
  Visibility,
  VisibilityOff,
  ChevronLeftRounded,
} from "@material-ui/icons";
import theme from "../../Theme/index";
import ajax from "../../Utils/facade";
import AuthTemplate from "../Subcomponents/uiTemplates/authTemplate";

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
  chevron: {
    fontSize: "30pt",
  },
});

const useStyle = makeStyles(styles);

const Signup = () => {
  const classes = useStyle(theme);
  const [values, setValues] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    businessName: "",
  });
  const [formStatus, setFormStatus] = useState({ status: false, message: "" });

  const [pswdVisibility, setPswdVisibility] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  const handleClickShowPassword = () => {
    setPswdVisibility(!pswdVisibility);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleResponse = ({ success, message }) => {
    if (success) return setFormStatus({ status: true, message });

    return showErrMsg(message);
  };

  const showErrMsg = (message) => {
    setFormStatus({ ...formStatus, message });
    handleCloseSnackbar();
  }

  const onSubmitForm = (e) => {
    e.preventDefault();
    ajax.POST({
      url: "http://localhost:8000/api/auth/signup",
      headers: { "Content-Type": "application/json" },
      body: values,
      callback: handleResponse,
    });
  };

  const snackbar = (
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
          <Alert variant="filled" onClose={handleCloseSnackbar} severity="error">
            {formStatus.message}
          </Alert>
        </div>
      </Snackbar>
    </div>
  );

  const signupForm = (
    <div>
      <Typography variant="h3" color="primary">
        SIGN UP
      </Typography>
      <Typography variant="subtitle1" color="secondary" gutterBottom>
        for business owners
      </Typography>
      <form onSubmit={onSubmitForm}>
        <Box display="flex" flexDirection="column" flexWrap="wrap">
          <TextField
            required
            id="fname"
            label="First Name"
            name="fname"
            value={values.fname}
            variant="outlined"
            autoFocus
            className={classes.margin}
            onChange={handleChange}
          />
          <TextField
            required
            id="lname"
            label="Last Name"
            name="lname"
            value={values.lname}
            variant="outlined"
            className={classes.margin}
            onChange={handleChange}
          />
          <TextField
            required
            id="email"
            label="Email Address"
            name="email"
            value={values.email}
            variant="outlined"
            autoComplete="email"
            className={classes.margin}
            onChange={handleChange}
          />
          <TextField
            required
            id="password"
            label="Password"
            type={pswdVisibility ? "text" : "password"}
            name="password"
            value={values.password}
            autoComplete="new-password"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {pswdVisibility ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className={classes.margin}
            onChange={handleChange}
          />
          <TextField
            required
            id="businessName"
            label="Business Name"
            name="businessName"
            value={values.businessName}
            variant="outlined"
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
            Get Started
          </Button>
        </Box>
      </form>
    </div>
  );

  const verifyMsg = (
    <div>
      <Typography variant="h5">{formStatus.message}</Typography>
    </div>
  );

  const leftScreen = (
    <Fragment>
      {snackbar}
      <Button
        component={Link}
        disableRipple
        className={classes.backButton}
        to={"/"}
      >
        <ChevronLeftRounded className={classes.chevron} />
        <Typography variant="subtitle2">
          {formStatus.status ? "LOGIN" : "BACK"}
        </Typography>
      </Button>
      <Box className={classes.signupBox}>
        {formStatus.status ? verifyMsg : signupForm}
      </Box>
    </Fragment>
  );
  return (
    <Fragment>
      <AuthTemplate
        leftScreen={leftScreen}
        rightScreenStyle={classes.rightScreenStyle}
      />
    </Fragment>
  );
};

export default Signup;
