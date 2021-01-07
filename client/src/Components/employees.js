import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Divider,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from "@material-ui/core";
import {
  Visibility,
  VisibilityOff,
  ChevronLeftRounded,
} from "@material-ui/icons";

import PageTemplate from "../Utils/uiTemplates/pageTemplate";
import ajax from "../Utils/facade";
import theme from "../Theme";

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

const Employees = () => {
  const classes = useStyle(theme);
  
  const [openForm, setOpenForm] = useState(false);
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
  
  // useEffect(() => {
  //   fetchRoles();
  // }, []);

  // const fetchRoles = () => {
  //   ajax.GET({
  //     url: "http://localhost:8000/api/employees/roles",
  //     callback: setRoles,
  //   });
  // };

  // const fetchUser = async () => {
  //   ajax.POST({
  //     url: "http://localhost:8000/api/employees/roles",
      
  //   })
  // };
  
  const showForm = () => {
    setOpenForm(!openForm);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    console.log(data)
  };
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    console.log(e.target.value);
    setSelectedRole(e.target.value);
  };

  const handleClickShowPassword = () => {
    setPswdVisibility({
      ...pswdVisibility,
      showPassword: !pswdVisibility.showPassword,
    });
  };

  const empForm = (
    <div>
      <Button onClick={showForm} disableRipple className={classes.backButton}>
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
  const employees = (
    <Fragment>
      <div style={{ paddingBottom: 40 }}>
        <Typography
          align="left"
          variant="h5"
          color="primary"
          style={{ fontWeight: 700, marginBottom: 30 }}
        >
          Manage Employees
        </Typography>
        <Button
          style={{ padding: "30px" }}
          variant="contained"
          color="secondary"
          onClick={showForm}
        >
          <Typography variant="h6" style={{ fontWeight: 700 }}>
            Register Employee
          </Typography>
        </Button>
      </div>
      <Divider style={{ width: "95%" }} />
    </Fragment>
  );

  return (
    <Fragment>
      <PageTemplate component={openForm ? empForm : employees} />
    </Fragment>
  );
};

export default Employees;
