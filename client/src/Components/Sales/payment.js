import { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@material-ui/core";
import theme from "../../Theme/index";
import ajax from "../../Utils/facade";
import { useAuth } from "../Subcomponents/auth";
import { Redirect } from "react-router-dom";

const styles = (theme) => ({
  textField: {
    marginBottom: 20,
  },
  buttons: {
    marginTop: 8,
    display: "flex",
    justifyContent: "flex-end",
  },
  saveBtn: {
    marginRight: 10,
    backgroundColor: theme.palette.success.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
  cancelBtn: {
    backgroundColor: theme.palette.error.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: "40px 50px 50px 50px",
  },
});

const useStyle = makeStyles(styles);

const Payment = (props) => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [payment, setPayment] = useState("");
  // const [total, setTotal] = useState();

  const [change, setChange] = useState();
  const [newTransaction, setNewTransaction] = useState(true);

  // useEffect(() => {
  //   ajax.GET({
  //     url: `http://localhost:8000/api/sales/get-total/${props.transactionID}`,
  //     authToken: auth.token,
  //     callback: setTotal
  //   })
  // }, [])

  // useEffect(() => {
  //   return () => {
  //     if (!newTransaction) {
  //       props.total = 0;
  //     }
  //   };
  // }, [newTransaction]);

  // save additional item qty
  const sendPayment = (e) => {
    e.preventDefault();
    ajax.POST({
      url: `http://localhost:8000/api/sales/save-transaction/${props.transactionID}`,
      headers: { "Content-Type": "application/json" },
      authToken: auth.token,
      body: { payment, total : props.total },
      callback: handleResponse,
    });
  };

  const handleChange = (e) => {
    setPayment(e.target.value);
  };

  const handleResponse = (body) => {
    if (body.success) {
      setChange(body.change);
      alert(`Your change: ${body.change}`);
      props.openModal();
      props.status();
    }

    // props.openSnackbar(body);
  };


  return (
  //   <Redirect to="/sales" />
  // ) : (
    <Fragment>
      <div>
        <Typography
          variant="h5"
          color="primary"
          style={{ fontWeight: 700, marginBottom: 30 }}
        >
          Payment
        </Typography>
        <form onSubmit={sendPayment} style={{ marginTop: "15px" }}>
          <TextField
            disabled
            key="total"
            variant="outlined"
            size="small"
            name="total"
            label="Total"
            value={props.total}
            type="number"
            className={classes.textField}
            InputProps={{
              readOnly: true,
              startAdornment: <InputAdornment>₱&nbsp;</InputAdornment>,
            }}
          />
          <TextField
            key="payment"
            required
            variant="outlined"
            size="small"
            autoFocus
            name="payment"
            label="Amount"
            value={payment}
            type="number"
            onChange={handleChange}
            className={classes.textField}
            InputProps={{
              startAdornment: <InputAdornment>₱&nbsp;</InputAdornment>,
            }}
          />

          <div className={classes.buttons}>
            <Button
              variant="outlined"
              type="submit"
              className={classes.saveBtn}
            >
              Pay
            </Button>
            <Button
              variant="outlined"
              onClick={props.openModal}
              className={classes.cancelBtn}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;
