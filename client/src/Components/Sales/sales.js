import { Fragment, useState } from "react";
import { Button, Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PageTemplate from "../Subcomponents/uiTemplates/pageTemplate";
import { Redirect } from "react-router-dom";

const styles = () => ({
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  mainButton: {
    padding: 20,
    height: 120,
    width: 230,
    marginRight: 20,
  },
  margin: {
    marginTop: "20px",
  },
  chevron: {
    fontSize: "30pt",
  },
});

const useStyle = makeStyles(styles);

const Sales = () => {
  const classes = useStyle();
  const [openTransaction, setOpenTransaction] = useState(false);
  const [openRecords, setOpenRecords] = useState(false);

  const salesHome = (
    <Fragment>
      <div style={{ paddingBottom: 40 }}>
        <Typography
          align="left"
          variant="h5"
          color="primary"
          style={{ fontWeight: 700, marginBottom: 30 }}
        >
          Transaction
        </Typography>
        <Button
          className={classes.mainButton}
          variant="contained"
          color="secondary"
          onClick={() => setOpenTransaction(true)}
        >
          <Typography variant="h6" style={{ fontWeight: 700 }}>
            New Transaction
          </Typography>
        </Button>
        <Button
          className={classes.mainButton}
          variant="contained"
          color="secondary"
          onClick={() => setOpenRecords(true)}
        >
          <Typography variant="h6" style={{ fontWeight: 700 }}>
            Transaction Records
          </Typography>
        </Button>
      </div>
      <Divider style={{ width: "95%" }} />
    </Fragment>
  );

  if (openRecords) {
    return <Redirect to="/sales/transaction-records" />;
  }
  return openTransaction ? (
    <Redirect to="/sales/new-transaction" />
  ) : (
    <Fragment>
      <PageTemplate component={salesHome} />
    </Fragment>
  );
};

export default Sales;
