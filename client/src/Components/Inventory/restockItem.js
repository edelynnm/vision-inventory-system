import { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  InputAdornment,
  Button,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import { CloseRounded } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import theme from "../../Theme/index";
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
  //openModal, itemCode
  const classes = useStyle(theme);
  const [itemQty, setItemQty] = useState("");

  // save additional item qty
  const saveItem = (e) => {
    e.preventDefault();
    const body = { itemCode: props.itemCode, itemQty };
    console.log(body);
    handleResponse({ success: false, message: "Quantity not valid" });
    //   ajax.POST({
    //     url: "http://localhost:8000/api/inventory/new-item",
    //     httpHeader: { header: "Content-Type", type: "application/json" },
    //     body: itemQty,
    //     callback: handleResponse
    //   });
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
