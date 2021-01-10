import { Fragment, useState } from "react";
import {
  Typography,
  Button,
  Divider,
} from "@material-ui/core";
import PageTemplate from "../Subcomponents/uiTemplates/pageTemplate";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const styles = () => ({
  mainButton: {
    padding: 20,
    height: 120,
    width: 230,
    marginRight: 20,
  },
});


const useStyle = makeStyles(styles);

const Employees = () => {
  const classes = useStyle();
  const [openForm, setOpenForm] = useState(false);
  const [openRecords, setOpenRecords] = useState(false);
  
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
          className={classes.mainButton}
          variant="contained"
          color="secondary"
          onClick={()=>setOpenForm(true)}
        >
          <Typography variant="h6" style={{ fontWeight: 700 }}>
            Register Employee
          </Typography>
        </Button>
        <Button
          className={classes.mainButton}
          variant="contained"
          color="secondary"
          onClick={()=>setOpenRecords(true)}
        >
          <Typography variant="h6" style={{ fontWeight: 700 }}>
            Employee Records
          </Typography>
        </Button>
      </div>
      <Divider style={{ width: "95%" }} />
    </Fragment>
  );

  if (openForm) {
    return (<Redirect to="/employees/register" />)
  }
  
  if (openRecords) { 
    return (<Redirect to="/employees/records" />)
  }

  return (
    <Fragment>
      <PageTemplate component={employees} />
    </Fragment>
  );
};

export default Employees;
