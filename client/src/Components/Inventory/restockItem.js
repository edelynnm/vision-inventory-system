import { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  Button
} from "@material-ui/core";
import theme from "../../Theme/index";
import ajax from "../../Utils/facade";
import { useAuth } from "../Subcomponents/auth";
// import ajax from "../../Utils/facade";

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
});

const useStyle = makeStyles(styles);

const RestockItem = (props) => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [itemQty, setItemQty] = useState("");

  // save additional item qty
  const saveItem = (e) => {
    e.preventDefault();
    const body = { itemCode: props.itemCode, itemQty };

    ajax.POST({
      url: "http://localhost:8000/api/inventory/restock",
      headers: { "Content-Type": "application/json" },
      authToken: auth.token,
      body: body,
      callback: handleResponse
    });
  };

  const handleChange = (e) => {
    setItemQty(e.target.value);
  };

  const handleResponse = (body) => {
    props.openModal();
    props.openSnackbar(body);
  };

  return (
    <Fragment>
      <div>
        <Typography
          variant="h5"
          color="secondary"
          style={{ fontWeight: 700, marginBottom: 30 }}
        >
          Restock Item
        </Typography>
        <form onSubmit={saveItem} style={{ marginTop: "15px" }}>
          <TextField
            key="qty"
            required
            variant="outlined"
            size="small"
            autoFocus
            name="itemQty"
            label="Qty"
            value={itemQty.itemQty}
            type="number"
            onChange={handleChange}
            className={classes.textField}
          />

          <div className={classes.buttons}>
            <Button
              variant="outlined"
              type="submit"
              className={classes.saveBtn}
            >
              Add
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

export default RestockItem;
