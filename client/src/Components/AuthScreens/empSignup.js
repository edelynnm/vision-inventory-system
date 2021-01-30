import { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Paper,
} from "@material-ui/core";
import {
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import theme from "../../Theme/index";
import { Redirect } from "react-router-dom";
import ajax from "../../Utils/facade";

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

const EmpSignup = (props) => {
  const classes = useStyle(theme);
  const [returnStatus, setReturnStatus] = useState(false);
  const [status, setStatus] = useState({ success: false, message: null });
  const [password, setPassword] = useState("");
  const [pswdVisibility, setPswdVisibility] = useState(false);

  const handleClickShowPassword = (e) => {
    setPswdVisibility(!pswdVisibility);
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    ajax.PATCH({
      url: `http://localhost:8000/api/auth/signup/emp${props.location.search}`,
      headers: { "Content-Type": "application/json" },
      body: { password },
      callback: handleResponse,
    });
  };

  const handleResponse = ({ success, message }) => {
    setStatus({ success, message });
  };

  const signupForm = (
    <div>
      <Typography variant="h3" color="primary">
        SETUP ACCOUNT
      </Typography>
      <form onSubmit={onSubmitForm}>
        <Box display="flex" flexDirection="column" flexWrap="wrap">
          <TextField
            required
            id="password"
            label="New Password"
            type={pswdVisibility ? "text" : "password"}
            name="password"
            value={password.password}
            autoComplete="new-password"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {pswdVisibility ? <Visibility /> : <VisibilityOff />}
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
            Register
          </Button>
        </Box>
      </form>
    </div>
  );

  const showMessage = (
    <div>
      <Typography>
        {status.message}
        <br/>
        {status.success ? "Redirecting..." : "" }
      </Typography>
    </div>
  );

  const main = (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={0}
        style={{ padding: 80, width: 400, border: "2px solid #e4e9f4" }}
      >
        {status.message !== null ? showMessage : signupForm}
      </Paper>
    </div>
  );

  if (status.success) {
    setTimeout(() => setReturnStatus(true), 2000)
  };

  return returnStatus ? <Redirect to="/" /> : <Fragment>{main}</Fragment>;
};

export default EmpSignup;
