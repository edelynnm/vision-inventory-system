import { Fragment, useState, useEffect } from "react";
import { makeStyles, withStyles} from "@material-ui/core/styles";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  IconButton
} from "@material-ui/core";
import theme from "../../Theme/index";
import ajax from "../../Utils/facade";
import { useAuth } from "../Subcomponents/auth";
import getTotal from "../../Utils/getTotal";
import { CloseRounded } from "@material-ui/icons";

const styles = (theme) => ({
  tableContainer: {
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: "white",
    maxHeight: 600
  },
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

const ItemTransactions = (props) => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems()
  }, [])

  const getItems = () => {
    ajax.GET({
      url: `http://localhost:8000/api/sales/new-transaction/${props.transactionID}/items`,
      authToken: auth.token,
      callback: setItems,
    });
  };

  return (
    <Fragment>
      <div>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
          <IconButton onClick={()=>props.openModal()}>
            <CloseRounded />
          </IconButton>
        </div>
        
        <Typography
          variant="h5"
          color="secondary"
          style={{ fontWeight: 700, marginBottom: 30 }}
        >
          <Typography 
          color="primary"
          >
        Transaction ID
        </Typography>
        {props.transactionID}
        </Typography>
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
            {items.map((item,index) => (
              <TableRow key={index}>
                <StyledTableCell>{item.code}</StyledTableCell>
                <StyledTableCell>{`${item.brand} ${item.specs}`}</StyledTableCell>
                <StyledTableCell>{item.unit}</StyledTableCell>
                <StyledTableCell>{item.qty}</StyledTableCell>
                <StyledTableCell>₱ {item.unit_price}</StyledTableCell>
                <StyledTableCell>₱ {item.total_price}</StyledTableCell>
              </TableRow>
            ))}
            <TableRow>
              <StyledTableCell align="right" colSpan={5}>
                Total
              </StyledTableCell>
              <StyledTableCell colSpan={5}>₱ {getTotal(items)}</StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
        </div>
      </div>
    </Fragment>
  );
};

export default ItemTransactions;
