import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@material-ui/core";
import theme from "../../Theme/index";
import ajax from "../../Utils/facade";
import { useAuth } from "../Subcomponents/auth";

const styles = (theme) => ({
  textFieldMargin: {
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

const AddNewItem = (props) => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [newItem, setNewItem] = useState({
    itemCode: "",
    itemBrand: "",
    itemSpecs: "",
    itemQty: "",
    itemUnitPrice: "",
    itemUnit: "",
    reorderPoint: "",
  });

  // save new item
  const saveItem = (e) => {
    e.preventDefault();
    ajax.POST({
      url: "http://localhost:8000/api/inventory/new-item",
      headers: {"Content-Type" : "application/json"},
      authToken: auth.token,
      body: newItem,
      callback: handleResponse,
    });
  };

  const handleResponse = (body) => {
    props.openModal();
    props.openSnackbar(body);
  };
  
  const handleNewItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  // Variables
  const newItemTextFields = [
    {
      name: "itemCode",
      label: "Item Code",
      value: newItem.itemCode,
      autoFocus: true,
    },
    {
      name: "itemBrand",
      label: "Brand",
      value: newItem.itemBrand,
    },
    {
      name: "itemSpecs",
      label: "Specs",
      value: newItem.itemSpecs,
    },
    {
      name: "itemUnit",
      label: "Unit",
      value: newItem.itemUnit,
    },
    {
      name: "itemQty",
      label: "Qty",
      type: "number",
      value: newItem.itemQty,
    },
    {
      name: "itemUnitPrice",
      label: "Unit Price",
      type: "number",
      value: newItem.itemUnitPrice,
      adornment: <InputAdornment>₱&nbsp;</InputAdornment>,
    },
    {
      name: "reorderPoint",
      label: "Reorder Point",
      type: "number",
      value: newItem.reorderPoint,
    },
  ];

  return (
    <div>
      <div>
        <Typography
          variant="h5"
          color="primary"
          style={{ fontWeight: 700, marginBottom: 30 }}
        >
          Add New Item
        </Typography>
        <form onSubmit={saveItem} style={{ marginTop: "15px" }}>
          {newItemTextFields.map((field) => (
            <TextField
              key={field.name}
              required
              variant="outlined"
              size="small"
              autoFocus={field.autoFocus ?? false}
              name={field.name}
              label={field.label}
              value={field.value}
              type={field.type ?? "text"}
              InputProps={{
                startAdornment: field.adornment ?? "",
              }}
              onChange={handleNewItemChange}
              className={classes.textFieldMargin}
            />
          ))}
          <div className={classes.buttons}>
            <Button
              variant="outlined"
              type="submit"
              className={classes.saveBtn}
            >
              Save
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
    </div>
  );
};

export default AddNewItem;
