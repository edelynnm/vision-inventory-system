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
  Divider
} from "@material-ui/core";
import { ChevronLeftRounded} from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ajax from "../Utils/facade";
import PageTemplate from "../Utils/uiTemplates/pageTemplate";
import theme from "../Theme/index";
import { useAuth } from "../Utils/auth";

const styles = (theme) => ({
  textFieldMargin: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  tableContainer: {
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: "white",
    height: 700,
    width: 1180
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
});

const headerStyle = (theme) => ({
  head: {
    backgroundColor: theme.palette.primary.light,
    borderRight: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
});

const cellStyle = (theme) => ({
  head: {
    borderRight: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
});

const TableHeader = withStyles(headerStyle)(TableCell);
const StyledTableCell = withStyles(cellStyle)(TableCell);

const useStyle = makeStyles(styles);

const Sales = () => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [inputItem, setInputItem] = useState({
    code: "",
    qty: "",
  });
  const [matchItem, setMatchItem] = useState({
    itemCode: "",
    itemBrand: "",
    itemSpecs: "",
    itemQty: "",
    itemUnitPrice: "",
    itemUnit: "",
  });
  const [openTransaction, setOpenTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState("");

  const [openRecords, setOpenRecords] = useState(false);

  // useEffect(() => {
  //   fetchItem()
  // }, [inputItem.code])

  const handleOnBlur = (e) => {
    setInputItem({...inputItem, [e.target.name]: e.target.value})
  };

  const receiveItem = (body) => {
    console.log(body)
    if (!body.success) {
      console.log(body.message)
    } else { 
      setMatchItem(body.item)
      console.log(matchItem)
    }
  }

  const fetchItem = (e) => {
    handleOnBlur(e)
    ajax.POST({
      url: "http://localhost:8000/api/sales/new-transaction/get-item",
      header: {"Content-Type" : "application/json"},
      authToken: auth.token,
      body: inputItem.code,
      callback: receiveItem
    })
  }

  const createTransaction = () => {
    // ajax.POST({
    //   url: "http://localhost:8000/api/sales/new-transaction",
    //   authToken: auth.token,
    //   callback: setNewTransaction
    // })

    setOpenTransaction(!openTransaction);
  }

  const viewRecords = () => {
    setOpenRecords(!openRecords);
  }

  const disabledTextFields = [
    {
      name: "itemBrand",
      label: "Brand",
      value: matchItem.itemBrand,
    },
    {
      name: "itemSpecs",
      label: "Specs",
      value: matchItem.itemSpecs,
    },
    {
      name: "itemUnit",
      label: "Unit",
      value: matchItem.itemUnit,
    },
    {
      name: "itemUnitPrice",
      label: "Unit Price",
      type: "number",
      value: matchItem.itemUnitPrice,
      adornment: <InputAdornment>₱&nbsp;</InputAdornment>,
    },
    {
      name: "remaining",
      label: "Remaining Qty",
      type: "number",
      value: matchItem.itemQty,
    },
  ];

  const salesForm = (
    <div style={{ width: 250 }}>
      <Box display="flex" flexDirection="column" flexwrap="wrap">
        
          <TextField
              key="inputItemCode"
              required
              variant="outlined"
              size="small"
              name="code"
              autoFocus
              label="Item Code"
              onBlur={fetchItem}
              className={classes.textFieldMargin}
            >
          </TextField>
        <form>
            
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
                startAdornment: field.adornment ?? "",
              }}
              className={classes.textFieldMargin}
            />
          ))}
          <TextField
            key="inputItemQty"
            required
            variant="outlined"
            size="small"
            name="qty"
            label="Qty"
            className={classes.textFieldMargin}
          >
          </TextField>
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

  const receipt = (
    <TableContainer
      component={Paper}
      elevation={0}
      className={classes.tableContainer}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow key={newTransaction.id}>
            <TableHeader>Transaction ID</TableHeader>
            <StyledTableCell colSpan={5}>
              <Typography>
              {newTransaction.id}
              </Typography>
            </StyledTableCell>
          </TableRow>
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
          {/* {items.map((item) => (
              <TableRow key={item.item_code} hover>
                <StyledTableCell>{item.item_code}</StyledTableCell>
              </TableRow>
            ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const sales = (
    <Fragment>
      <Button
        onClick={createTransaction}
        disableRipple
        className={classes.backButton}
      >
        <ChevronLeftRounded className={classes.chevron} />
        <Typography variant="subtitle2">
          BACK
        </Typography>
      </Button>
      
      <div>
        <Box display="flex" flexDirection="row" flexWrap="noWrap">
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
          <div>
            <div style={{marginLeft: "65px"}}>
              {receipt}
            </div>
          </div>
        </Box>
      </div>
    </Fragment>
  );

  const salesHome = (
    <Fragment>
    <div style={{paddingBottom: 40 }}> 
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
      onClick={createTransaction}
    >
      <Typography variant="h6" style={{ fontWeight: 700 }}>
        New Transaction
      </Typography>
    </Button>
    <Button
      className={classes.mainButton}
      variant="contained"
      color="secondary"
      onClick={viewRecords}
    >
      <Typography variant="h6" style={{ fontWeight: 700 }}>
        View Transaction <br/>Records
      </Typography>
    </Button>
    </div>
    <Divider style={{width: "95%"}} />
    </Fragment>
  )

  return (
    <Fragment>
      <PageTemplate component={openTransaction ? sales : salesHome} />
    </Fragment>
  );
};

export default Sales;
