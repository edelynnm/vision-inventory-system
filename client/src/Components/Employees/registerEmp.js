import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Snackbar,
} from "@material-ui/core";
import {
  Visibility,
  VisibilityOff,
  ChevronLeftRounded,
} from "@material-ui/icons";

import PageTemplate from "../Subcomponents/uiTemplates/pageTemplate";
import ajax from "../../Utils/facade";
import theme from "../../Theme/index";
import { useAuth } from "../Subcomponents/auth";
import { Alert } from "@material-ui/lab";
import { Redirect } from "react-router-dom";

const styles = (theme) => ({
  margin: {
    marginTop: 20,
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
});

const useStyle = makeStyles(styles);

const RegisterEmployees = (props) => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [returnStatus, setReturnStatus] = useState(false);
  const [status, setStatus] = useState({
    success: false,
    message: ""
  });

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [pswdVisibility, setPswdVisibility] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [data, setData] = useState({
    userRoleId: "",
    email: "",
    defaultPassword: "",
    fname: "",
    lname: "",
  });
 
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    ajax.GET({
      url: "http://localhost:8000/api/employees/roles",
      authToken: auth.token,
      callback: setRoles,
    });
  };

  const handleReturn = () => {
    setReturnStatus(true);
  };

  const handleSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  const handleResponse = (body) => {   
    setStatus({success: body.success, message: body.message})
    setData({
      userRoleId: "",
      email: "",
      defaultPassword: "",
      fname: "",
      lname: "",
    })
    setSelectedRole("")
    handleSnackbar();
  }

  const onSubmitForm = (e) => {
    e.preventDefault();
    ajax.POST({
      url: "http://localhost:8000/api/employees/register",
      authToken: auth.token,
      headers: {"Content-Type": "application/json"},
      body: data,
      callback: handleResponse
    })
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value)
    setData({ ...data, userRoleId: e.target.value });

  };

  const handleClickShowPassword = () => {
    setPswdVisibility({
      ...pswdVisibility,
      showPassword: !pswdVisibility.showPassword,
    });
  };


  // SUB-COMPONENTS
  const snackbar = (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbar}
      >
        <Alert
          elevation={0}
          variant="filled"
          onClose={handleSnackbar}
          severity={status.success ? "success" : "error"}
        >
          {status.message}
        </Alert>
      </Snackbar>
    </div>
  );

  const empForm = (
    <div>
      {snackbar}
      <Button onClick={handleReturn} disableRipple className={classes.backButton}>
        <ChevronLeftRounded className={classes.chevron} />
        <Typography variant="subtitle2">BACK</Typography>
      </Button>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          width: 400,
        }}
      >
        <Typography variant="h3" color="primary">
          SIGN UP
        </Typography>
        <Typography variant="subtitle1" color="secondary" gutterBottom>
          for employees
        </Typography>
        <form onSubmit={onSubmitForm}>
          <Box display="flex" flexDirection="column" flexWrap="wrap">
            <TextField
              required
              id="fname"
              label="First Name"
              name="fname"
              value={data.fname}
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
              value={data.lname}
              variant="outlined"
              className={classes.margin}
              onChange={handleChange}
            />
            <TextField
              required
              id="email"
              label="Email Address"
              name="email"
              value={data.email}
              variant="outlined"
              autoComplete="email"
              className={classes.margin}
              onChange={handleChange}
            />
            <TextField
              required
              id="password"
              label="Default Password"
              type={pswdVisibility.showPassword ? "text" : "password"}
              name="defaultPassword"
              value={data.defaultPassword}
              autoComplete="current-password"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {pswdVisibility.showPassword ? (
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
              select
              required
              id="roleID"
              label="Role"
              value={selectedRole}
              variant="outlined"
              className={classes.margin}
              onChange={handleRoleChange}
            >
              {roles.map((role) => (
                <MenuItem key={role.role_title} value={role.role_id}>
                  {role.role_title}
                </MenuItem>
              ))}
            </TextField>
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
    </div>
  );

  return returnStatus ? <Redirect to="/employees" /> : (
    <Fragment>
      <PageTemplate component={empForm} />
    </Fragment>
  );
};

export default RegisterEmployees;
