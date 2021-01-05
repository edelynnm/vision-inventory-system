import { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Grid,
  Hidden,
  Typography,
  Box,
  Link,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import logo from "../../Assets/icons/vision-logo@2x.png";
import welcomeImg from "../../Assets/images/welcome-img.jpg";

const styles = ({
  root: {
    height: "100vh",
  },
  authScreen: {
    backgroundColor: "white",
    zIndex: 2,
  },
  authBox: {
    margin: "80px",
  },
  welcomeOverlay: {
    backgroundColor: "rgba(2, 15, 72, 0.3)",
    height: "100%",
    zIndex: 1,
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
});

const useStyle = makeStyles(styles);

const Login = () => {
  const classes = useStyle();
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false
  });

  const handleClickShowPassword = () => {
    setValues({...values, showPassword: !values.showPassword })
  }
  
  const handleChange = (e) => {
    setValues( {...values, [e.target.name]: e.target.value})
  }

  const onSubmitForm = (e) => {
    e.preventDefault();
    const body = { values }
    console.log(JSON.stringify(body))
  }

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Box
          component={Grid}
          item
          xs
          lg={4}
          className={classes.authScreen}
          boxShadow={20}
        >
          <Box className={classes.authBox}>
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
                    endAdornment: 
                    <InputAdornment position="end">
                      <IconButton 
                      onClick={handleClickShowPassword}>
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>,
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
                <Link href="/signup" color="secondary">
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
          </Box>
        </Box>
        <Hidden smDown>
          <Grid item md className={classes.welcomeImg}>
            <Box className={classes.welcomeOverlay}></Box>
          </Grid>
        </Hidden>
      </Grid>
    </Fragment>
  );
};

export default Login;
