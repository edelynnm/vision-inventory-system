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
  IconButton,
} from "@material-ui/core";
import { SearchRounded, AddRounded, CloseRounded } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import theme from "../../Theme/index";
import PageTemplate from "../../Utils/uiTemplates/pageTemplate";
import ajax from "../../Utils/facade";
import AddNewItem from "./addNewItem";
import RestockItem from "./restockItem";

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
    padding: "15px 15px 15px 10px",
    fontWeight: 700,
    marginLeft: 20,
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

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

const Inventory = () => {
  const classes = useStyle(theme);
  const [items, setItems] = useState([]);
  const [matchItems, setMatchItems] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [newItemModal, setNewItemModal] = useState(false);
  const [restockModal, setRestockModal] = useState(false);
  const [status, setStatus] = useState({ success: false, message: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    getItems();
  }, [items]);

  useEffect(() => {
    searchItem(items);
  }, [searchWord]); 

  const searchItem = (items) => {
    const results = items.filter((item) =>
      item.item_desc.toUpperCase().includes(searchWord.toUpperCase())
        ? item
        : ""
    );
    setMatchItems(results)
  };
  
  const getItems = () => {
    ajax.GET({
      url: "http://localhost:8000/api/inventory",
      callback: setItems,
    });
  };

  const handleChange = (e) => {
    setSearchWord(e.target.value);
  };

  const openNewItemModal = () => {
    setNewItemModal(!newItemModal);
  };

  const openRestockModal = (selectedItemCode) => {
    setRestockModal(!restockModal);
    setSelectedItemCode(selectedItemCode);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(!openSnackbar);
  };

  const handleSnackbar = ({ success, message }) => {
    setStatus({ success, message });
    handleCloseSnackbar();
  };

  // Components
  const snackbar = (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <div style={{ marginBottom: 40 }}>
          <Alert
            elevation={0}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity={status.success ? "success" : "error"}
          >
            {status.message}
          </Alert>
        </div>
      </Snackbar>
    </div>
  );
  // SUB-COMPONENTS
  const displayText =
    searchWord !== "" && matchItems.length === 0 ? (
      <div className={classes.displayText}>
        <Typography align="center">No match found</Typography>
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

  const newItemBtn = (
    <Button
      disableElevation
      variant="contained"
      color="primary"
      className={classes.newBtn}
      onClick={openNewItemModal}
    >
      <AddRounded style={{ marginRight: 5 }} />
      New Item
    </Button>
  );

  const toolbar = (
    <div className={classes.toolbar}>
      {searchBar}
      {newItemBtn}
    </div>
  );

  const newItemModalContainer = (
    <div style={{ height: "100%" }}>
      <Modal open={newItemModal} className={classes.modal} disableAutoFocus>
        <Paper className={classes.modalContent} style={{ height: 500 }}>
          <AddNewItem
            openModal={openNewItemModal}
            openSnackbar={handleSnackbar}
          />
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
            openSnackbar={handleSnackbar}
          />
        </Paper>
      </Modal>
    </div>
  );

  const tableData = (items) => (
    items.map((item) => (
      <TableRow key={item.item_code} hover>
        <StyledTableCell>{item.item_code}</StyledTableCell>
        <StyledTableCell>{item.item_desc}</StyledTableCell>
        <StyledTableCell>{item.item_unit}</StyledTableCell>
        <StyledTableCell>{item.item_qty}</StyledTableCell>
        <StyledTableCell>
          {currencyFormatter.format(Number(item.item_unit_price))}
        </StyledTableCell>
        <StyledTableCell align="center">
          {item.reorder_point}
        </StyledTableCell>
        <StyledTableCell align="center">
          <Button
            variant="contained"
            disableElevation
            className={classes.restockBtn}
            onClick={() => openRestockModal(item.item_code)}
          >
            Restock
          </Button>
        </StyledTableCell>
      </TableRow>
    ))
  )
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
                <TableHeader width={80}>Qty</TableHeader>
                <TableHeader width={100}>Unit Price</TableHeader>
                <TableHeader width={90} align="center">
                  Reorder Point
                </TableHeader>
                <TableHeader width={50} align="center">
                  Actions
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchWord !== "" ? tableData(matchItems): tableData(items)}
            </TableBody>
          </Table>
          {displayText}
        </TableContainer>
      </div>
    </div>
  );

  return (
    <Fragment>
      <PageTemplate component={inventory} />
    </Fragment>
  );
};

export default Inventory;