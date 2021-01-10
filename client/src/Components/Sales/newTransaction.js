import { Fragment, useState, useEffect } from "react";
import {
  Grid,
  Table,
  TextField,
  Button,
  InputAdornment,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  Box,
  Modal,
  Snackbar,
} from "@material-ui/core";
import { ChevronLeftRounded } from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Payment from "./payment";
import theme from "../../Theme/index";
import { useAuth } from "../Subcomponents/auth";
import ajax from "../../Utils/facade";
import clsx from "clsx";
import { Redirect } from "react-router-dom";
import { Alert } from "@material-ui/lab";

const styles = (theme) => ({
  textFieldMargin: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  table: {
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: "white",
  },
  header: {
    marginBottom: 15,
  },
  tableContainer: {
    height: 700,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  saveBtn: {
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
  backButton: {
    color: "#7b8ba6",
    margin: "0px 0 30px -20px",
    "&:hover": {
      backgroundColor: "transparent",
      color: theme.palette.primary.main,
      transition: "0.3s",
    },
  },
  mainButton: {
    padding: 20,
    height: 120,
    marginRight: 15,
  },
  margin: {
    marginTop: "20px",
  },
  chevron: {
    fontSize: "30pt",
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

const headerStyle = (theme) => ({
  head: {
    backgroundColor: theme.palette.primary.light,
    borderRight: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
});

const cellStyle = (theme) => ({
  body: {
    borderRight: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
});

const TableHeader = withStyles(headerStyle)(TableCell);
const StyledTableCell = withStyles(cellStyle)(TableCell);

const useStyle = makeStyles(styles);

const NewTransaction = (props) => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [newTransactionID, setNewTransactionID] = useState("");
  const [inputItem, setInputItem] = useState({
    code: "",
    qty: "",
  });
  const [matchItem, setMatchItem] = useState({
    itemCode: " ",
    itemBrand: " ",
    itemSpecs: " ",
    itemQty: "0",
    itemUnitPrice: "0",
    itemUnit: " ",
  });
  const [addedItem, setAddedItem] = useState();
  const [items, setItems] = useState([]);
  const [itemsBought, setItemsBought] = useState([]);
  const [paymentModal, setPaymentModal] = useState(false);
  const [returnStatus, setReturnStatus] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const [status, setStatus] = useState({
    success: false,
    message: ""
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchItem();
    generateID();
  }, []);

  useEffect(() => {
    fetchItemsBought();
  }, [addedItem]);

  useEffect(() => {
    if(successStatus) {
      setTimeout(promptAlert, 500)
      setSuccessStatus(false)
    }
  }, [successStatus]);

  const generateID = () => {
    const transactionID = Date.now().toString();
    setNewTransactionID(transactionID);
  };

  // get all items in inventory and use to search matching products
  const fetchItem = () => {
    ajax.GET({
      url: "http://localhost:8000/api/inventory",
      authToken: auth.token,
      callback: setItems,
    });
  };

  // get items added under the same transactionID
  const fetchItemsBought = () => {
    if (newTransactionID) {
      ajax.GET({
        url: `http://localhost:8000/api/sales/new-transaction/${newTransactionID}/items`,
        authToken: auth.token,
        callback: setItemsBought,
      });
    }
  };

  // add item under transactionID
  const onSubmitForm = (e) => {
    e.preventDefault();
    ajax.POST({
      url: `http://localhost:8000/api/sales/new-transaction/${newTransactionID}/add`,
      headers: { "Content-Type": "application/json" },
      authToken: auth.token,
      body: inputItem,
      callback: setAddedItem,
    });
    setMatchItem({
      itemCode: " ",
      itemBrand: " ",
      itemSpecs: " ",
      itemQty: "0",
      itemUnitPrice: "0",
      itemUnit: " ",
    })
    setInputItem({
      code: "",
      qty: "",
    })
  };

  const cancelReq = () => {
    ajax.DELETE({
      url: `http://localhost:8000/api/sales/new-transaction/${newTransactionID }`,
      authToken: auth.token,
    })
  }

  const cancelTransaction = () => {
    const cancel = window.confirm("Cancel transaction?");

    if (!cancel) {
      return setReturnStatus(false)
    }

    if (cancel && itemsBought.length !== 0) {
      cancelReq()
    } 
    setReturnStatus(true)
  };

  const promptAlert = () => {
    const newTransaction = window.confirm("Start a new transaction?");
    if (newTransaction) {
      setReturnStatus(false)
      window.location.reload();
    } else {
      setReturnStatus(true)
    }
  };

  const findItem = (e) => {
    const matchItem = items.find((item) => item.item_code === e.target.value);
    if (!matchItem) {
      console.log("no item found"); //snackbox
    } else {
      setMatchItem(matchItem);
    }
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    if (itemsBought.length !== 0) {
      const prices = itemsBought.map((item) => Number(item.total_price) * Number(item.qty));
      totalPrice = prices.reduce((acc, val) => acc + val);
    }
    return totalPrice.toFixed(2);
  };

  const handleChange = (e) => {
    setInputItem({ ...inputItem, [e.target.name]: e.target.value });
  };

  const openPaymentModal = () => {
    setPaymentModal(!paymentModal);
  };

  const checkStatus = () => {
    setSuccessStatus(!successStatus)
  }
  const handleSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

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

  const disabledTextFields = [
    {
      name: "itemBrand",
      label: "Brand",
      value: matchItem.item_brand,
    },
    {
      name: "itemSpecs",
      label: "Specs",
      value: matchItem.item_specs,
    },
    {
      name: "itemUnit",
      label: "Unit",
      value: matchItem.item_unit,
    },
    {
      name: "itemUnitPrice",
      label: "Unit Price",
      type: "number",
      value: matchItem.item_unit_price,
      adornment: <InputAdornment>₱&nbsp;</InputAdornment>,
    },
    {
      name: "remaining",
      label: "Remaining Qty",
      type: "number",
      value: matchItem.item_qty,
    },
  ];
  const paymentModalContainer = (
    <div>
      <Modal open={paymentModal} className={classes.modal} disableAutoFocus>
        <Paper className={classes.modalContent} style={{ height: 200 }}>
          <Payment
            transactionID={newTransactionID}
            total={getTotalPrice()}
            openModal={openPaymentModal}
            status={checkStatus}
            // openSnackbar={showMessage}
          />
        </Paper>
      </Modal>
    </div>
  );

  const salesForm = (
    <div style={{ width: 250 }}>
      <Box display="flex" flexDirection="column" flexwrap="wrap">
        <form onSubmit={onSubmitForm}>
          <TextField
            key="inputItemCode"
            required
            variant="outlined"
            size="small"
            name="code"
            value={inputItem.code}
            autoFocus
            label="Item Code"
            onBlur={findItem}
            onChange={handleChange}
            className={classes.textFieldMargin}
          />
          {disabledTextFields.map((field) => (
            <TextField
              disabled
              key={field.name}
              variant="outlined"
              size="small"
              name={field.name}
              label={field.label}
              type={field.type ?? "text"}
              InputProps={{
                readOnly: true,
                startAdornment: field.adornment ?? "",
              }}
              value={field.value || ""}
              className={classes.textFieldMargin}
            />
          ))}
          <TextField
            key="inputItemQty"
            required
            variant="outlined"
            size="small"
            name="qty"
            value={inputItem.qty}
            label="Qty"
            className={classes.textFieldMargin}
            onChange={handleChange}
          ></TextField>
          <div className={classes.buttonContainer}>
            <Button
              variant="outlined"
              type="submit"
              className={classes.saveBtn}
            >
              Add
            </Button>
          </div>
        </form>
      </Box>
    </div>
  );

  const transactionTable = (
    <Fragment>
      <TableContainer
        component={Paper}
        elevation={0}
        className={clsx(classes.header, classes.table)}
      >
        <Table>
          <TableHead>
            <TableRow key={props.transactionID}>
              <TableHeader width={135}>Transaction ID</TableHeader>
              <TableCell>
                <Typography>{newTransactionID}</Typography>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={()=>setPaymentModal(true)}
                >
                  Payment
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      <TableContainer
        component={Paper}
        elevation={0}
        className={clsx(classes.tableContainer, classes.table)}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableHeader width={120}>Item Code</TableHeader>
              <TableHeader width={400}>Description</TableHeader>
              <TableHeader width={80}>Unit</TableHeader>
              <TableHeader width={80}>Qty</TableHeader>
              <TableHeader width={100}>Unit Price</TableHeader>
              <TableHeader width={90} align="center">
                Total Price
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemsBought.map((item,index) => (
              <TableRow key={index}>
                <StyledTableCell>{item.item_code}</StyledTableCell>
                <StyledTableCell>{`${item.item_brand} ${item.item_specs}`}</StyledTableCell>
                <StyledTableCell>{item.item_unit}</StyledTableCell>
                <StyledTableCell>{item.qty}</StyledTableCell>
                <StyledTableCell>₱ {item.item_unit_price}</StyledTableCell>
                <StyledTableCell>₱ {item.total_price}</StyledTableCell>
              </TableRow>
            ))}
            <TableRow>
              <StyledTableCell align="right" colSpan={5}>
                Total
              </StyledTableCell>
              <StyledTableCell colSpan={5}>₱ {getTotalPrice()}</StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );

  const main = (
    <Fragment>
      <div>
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="noWrap"
          style={{ width: "100%" }}
        >
          <div>
            <Button
              onClick={cancelTransaction}
              disableRipple
              className={classes.backButton}
            >
              <ChevronLeftRounded className={classes.chevron} />
              <Typography variant="subtitle2">BACK</Typography>
            </Button>
            <div>
              <Typography
                variant="h5"
                color="primary"
                style={{ fontWeight: 700, marginBottom: 30 }}
              >
                Add Item
              </Typography>
              {salesForm}
            </div>
          </div>
          <div>
            <div style={{ marginLeft: "65px" }}>{transactionTable}</div>
          </div>
        </Box>
      </div>
    </Fragment>
  )

  return returnStatus ? (
    <Redirect to="/sales" />
  ) : (
    <Fragment>
      {paymentModalContainer}
      <div style={{padding: 100}}>
        {main}
      </div>
    </Fragment>
  );
};

export default NewTransaction;
