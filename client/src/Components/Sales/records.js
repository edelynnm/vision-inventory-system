import { Fragment, useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Typography,
  Button,
  Modal
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { ChevronLeftRounded } from "@material-ui/icons";
import { Redirect } from "react-router-dom";
import { useAuth } from "../Subcomponents/auth";
import PageTemplate from "../Subcomponents/uiTemplates/pageTemplate";
import ajax from "../../Utils/facade";
import theme from "../../Theme";
import ItemTransactions from "./viewItems";
import currencyFormatter from "../../Utils/currency.js"

const styles = (theme) => ({
  margin: {
    margin: "0 60px 60px 0",
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
  chevron: {
    fontSize: "30pt",
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
  actionBtn: {
    fontWeight: 700,
    backgroundColor: "#fa5d1e",
    color: "white",
    border: "1px solid #e34c10",
    "&:hover": {
      backgroundColor: "#d64a11",
    },
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
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

const TransactionRecords = () => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [returnStatus , setReturnStatus ] = useState(false);
  const [selectedTransID , setSelectedTransID ] = useState("");
  const [itemsModal , setItemsModal ] = useState(false);


  useEffect(() => {
    fetchTransaction();
  }, [])

  const fetchTransaction = () => {
    ajax.GET({
      url: "http://localhost:8000/api/sales/transaction-records",
      authToken: auth.token,
      callback: setTransactions
    })
  }

  const handleClick = () => {
    setReturnStatus(true)
  }

  const openViewItems = (selectedTransID) => {
    setItemsModal(!itemsModal);
    setSelectedTransID(selectedTransID);
  };


  // SUB-COMPONENTS
  const displayText =
    transactions.length === 0 ? (
      <div className={classes.displayText}>
        <Typography align="center">Nothing to display</Typography>
      </div>
    ) : (
      ""
    );

    const itemsModalContainer = (
      <div style={{ height: "100%"}}>
        <Modal open={itemsModal} className={classes.modal} >
          <Paper className={classes.modalContent}>
            <ItemTransactions
              openModal={openViewItems}
              transactionID={selectedTransID}
            />
          </Paper>
        </Modal>
      </div>
    );

    const convertToDate = (timestamp) => {
      const convertedTS = new Date(timestamp)
      const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: "short", timeStyle: "short" }).format(convertedTS);
      const [date, time] = dateTime.split(", ");
      return {
        date,
        time,
      };
    };

  const main = (
    <Fragment>
      <Button
        onClick={handleClick}
        disableRipple
        className={classes.backButton}
       >
        <ChevronLeftRounded className={classes.chevron} />
        <Typography variant="subtitle2">BACK</Typography>
      </Button>
      <div className={classes.margin}>
      {itemsModalContainer}
        <TableContainer
          component={Paper}
          elevation={0}
          className={classes.tableContainer}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableHeader width={50}>Transaction ID</TableHeader>
                <TableHeader width={50}>Date</TableHeader>
                <TableHeader width={50}>Time</TableHeader>
                <TableHeader width={80}>Total</TableHeader>
                <TableHeader width={100}>Incharge</TableHeader>
                <TableHeader width={50}> </TableHeader>

              </TableRow>
            </TableHead>
             <TableBody>
            {transactions.map((transaction, index) => {
              const dateTime = convertToDate(transaction.date)
              const date = dateTime.date;
              const time = dateTime.time;

             return (
              <TableRow key={index} hover>
                <StyledTableCell>{transaction.id}</StyledTableCell>
                <StyledTableCell>{date}</StyledTableCell>
                <StyledTableCell>{time}</StyledTableCell>
                <StyledTableCell>{currencyFormatter(transaction.total)}</StyledTableCell>
                <StyledTableCell>{`${transaction.fname} ${transaction.lname}`}</StyledTableCell>
                <StyledTableCell align="center">
                <Button
                  variant="contained"
                  disableElevation
                  className={classes.actionBtn}
                  onClick={() => openViewItems(transaction.id)}
                >
                  View Items
                </Button>
          </StyledTableCell>
              </TableRow>
            )})}
            </TableBody>
          </Table>
          {displayText}
        </TableContainer>
      </div>
    </Fragment>
  );

  return returnStatus ? <Redirect to="/sales" />:(
    <Fragment>
      <PageTemplate component={main}></PageTemplate>
    </Fragment>
  );
};

export default TransactionRecords;
