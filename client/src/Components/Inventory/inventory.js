import { Fragment, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Modal,
  Snackbar,
} from "@material-ui/core";
import { SearchRounded, AddRounded } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import theme from "../../Theme/index";
import PageTemplate from "../Subcomponents/uiTemplates/pageTemplate";
import ajax from "../../Utils/facade";
import AddNewItem from "./addNewItem";
import RestockItem from "./restockItem";
import { useAuth } from "../Subcomponents/auth";
import { Redirect } from "react-router-dom";
import clsx from "clsx";
import currencyFormatter from "../../Utils/currency.js"

const styles = (theme) => ({
  margin: {
    margin: "0 60px 60px 0",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  tableContainer: {
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: "white",
    height: 700,
  },
  head: {
    backgroundColor: theme.palette.primary.light,
  },
  displayText: {
    padding: 200,
    width: "100",
  },
  actionBtn: {
    padding: "15px 15px 15px 10px",
    marginLeft: 20,
  },
  restockBtn: {
    fontWeight: 700,
    backgroundColor: "#fa5d1e",
    color: "white",
    border: "1px solid #e34c10",
    "&:hover": {
      backgroundColor: "#d64a11",
    },
  },
  newBtn: {
    fontWeight: 700,
    border: `1px solid ${theme.palette.primary.dark}`,
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
  hide: {
    display: "hidden",
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

// locally forbid role on restock and add new item function inside this component.
const localForbiddenIDs = [2];

const Inventory = (props) => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [items, setItems] = useState([]);
  const [matchItems, setMatchItems] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [newItemModal, setNewItemModal] = useState(false);
  const [restockModal, setRestockModal] = useState(false);
  const [status, setStatus] = useState({ success: false, message: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openRecords, setOpenRecords] = useState(false);

  useEffect(() => {
    // getItems();
    const interval = setInterval(() => {
      getItems();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    searchItem(items);
  }, [searchWord]);

  const getItems = () => {
    ajax.GET({
      url: "http://localhost:8000/api/inventory",
      authToken: auth.token,
      callback: setItems,
    });
  };

  const searchItem = (items) => {
    const results = items.filter((item) => {
      const itemProp = `${item.code} ${item.brand} ${item.specs}`;
      return itemProp.toUpperCase().includes(searchWord.toUpperCase())
        ? item
        : "";
    });
    setMatchItems(results);
  };

  const openNewItemModal = () => {
    setNewItemModal(!newItemModal);
  };

  const openRestockModal = (selectedItemCode) => {
    setRestockModal(!restockModal);
    setSelectedItemCode(selectedItemCode);
  };

  const handleSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  const showMessage = ({ success, message }) => {
    setStatus({ success, message });
    handleSnackbar();
  };

  const handleChange = (e) => {
    setSearchWord(e.target.value);
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
        autoHideDuration={5000}
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

  const displayText =
    !matchItems && !searchWord ? (
      <div className={classes.displayText}>
        <Typography align="center">No Match Found</Typography>
      </div>
    ) : items.length === 0 ? (
      <div className={classes.displayText}>
        <Typography align="center">No Items</Typography>
      </div>
    ) : (
      ""
    );

  const searchBar = (
    <div>
      <TextField
        style={{ backgroundColor: "white", borderRadius: 8 }}
        variant="outlined"
        placeholder="Search"
        value={searchWord}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );

  const toolbarBtns = (
    <div>
      <Button
        disableElevation
        variant="contained"
        color="primary"
        className={clsx(classes.newBtn, classes.actionBtn)}
        onClick={openNewItemModal}
      >
        <AddRounded style={{ marginRight: 5 }} />
        New Item
      </Button>
        <Button
          disableElevation
          variant="contained"
          color="secondary"
          className={clsx(classes.restockBtn, classes.actionBtn)}
          onClick={() => setOpenRecords(true)}
        >
          Restock Records
        </Button>
    </div>
  );

  const toolbar = (
    <div className={classes.toolbar}>
      {searchBar}
      {localForbiddenIDs.includes(auth.user.roleID) ? "" : toolbarBtns}
    </div>
  );

  const newItemModalContainer = (
    <div style={{ height: "100%" }}>
      <Modal open={newItemModal} className={classes.modal} disableAutoFocus>
        <Paper className={classes.modalContent} style={{ height: 500 }}>
          <AddNewItem openModal={openNewItemModal} openSnackbar={showMessage} />
        </Paper>
      </Modal>
    </div>
  );

  const restockItemModalContainer = (
    <div style={{ height: "100%" }}>
      <Modal open={restockModal} className={classes.modal} disableAutoFocus>
        <Paper className={classes.modalContent} style={{ height: 200 }}>
          <RestockItem
            openModal={openRestockModal}
            itemCode={selectedItemCode}
            openSnackbar={showMessage}
          />
        </Paper>
      </Modal>
    </div>
  );

  const tableData = (items) =>
    items.map((item) => (
      <TableRow key={item.code} hover style={{backgroundColor: `${item.qty <= item.reorder_point ? "#fdecea": ""}`}}>
        <StyledTableCell>{item.code}</StyledTableCell>
        <StyledTableCell>{`${item.brand} ${item.specs}`}</StyledTableCell>
        <StyledTableCell>{item.unit}</StyledTableCell>
        <StyledTableCell>
          {currencyFormatter(item.unit_price)}
        </StyledTableCell>
        <StyledTableCell>{item.qty}</StyledTableCell>
        <StyledTableCell align="center">{item.reorder_point}</StyledTableCell>

        {localForbiddenIDs.includes(auth.user.roleID) ? (
          ""
        ) : (
          <StyledTableCell align="center">
            <Button
              variant="contained"
              disableElevation
              className={classes.restockBtn}
              onClick={() => openRestockModal(item.code)}
            >
              Restock
            </Button>
          </StyledTableCell>
        )}
      </TableRow>
    ));

  // MAIN COMPONENT
  const inventory = (
    <div className={classes.margin}>
      {snackbar}
      {restockItemModalContainer}
      {newItemModalContainer}
      {toolbar}
      <br></br>
      <div>
        <TableContainer
          component={Paper}
          elevation={0}
          className={classes.tableContainer}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableHeader width={120}>Item Code</TableHeader>
                <TableHeader width={450}>Description</TableHeader>
                <TableHeader width={80}>Unit</TableHeader>
                <TableHeader width={100}>Unit Price</TableHeader>
                <TableHeader width={80}>Qty</TableHeader>
                <TableHeader width={90} align="center">
                  Reorder Point
                </TableHeader>
                {localForbiddenIDs.includes(auth.user.roleID) ? (
                  ""
                ) : (
                  <TableHeader width={50} align="center">
                    Actions
                  </TableHeader>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {searchWord !== "" ? tableData(matchItems) : tableData(items)}
            </TableBody>
          </Table>
          {displayText}
        </TableContainer>
      </div>
    </div>
  );

  if (openRecords) {
    return <Redirect to="/inventory/restock-records" />;
  }
  return (
    <Fragment>
      <PageTemplate component={inventory} />
    </Fragment>
  );
};

export default Inventory;
