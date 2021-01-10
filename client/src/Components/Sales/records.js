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
  Button
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { ChevronLeftRounded } from "@material-ui/icons";
import { Redirect } from "react-router-dom";
import { useAuth } from "../Subcomponents/auth";
import PageTemplate from "../Subcomponents/uiTemplates/pageTemplate";
import ajax from "../../Utils/facade";
import theme from "../../Theme";

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

  //SUBCOMPONENT
  const displayText =
    transactions.length === 0 ? (
      <div className={classes.displayText}>
        <Typography align="center">Nothing to display</Typography>
      </div>
    ) : (
      ""
    );

  const convertToDate = (dateTime) => {
    return new Date(dateTime).toDateString()
  }
  
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
        <TableContainer
          component={Paper}
          elevation={0}
          className={classes.tableContainer}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableHeader width={80}>Transaction ID</TableHeader>
                <TableHeader width={50}>Date</TableHeader>
                <TableHeader width={80}>Total</TableHeader>
                <TableHeader width={100}>Incharge</TableHeader>
              </TableRow>
            </TableHead>
             <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index} hover>
                <StyledTableCell>{transaction.transaction_id}</StyledTableCell>
                <StyledTableCell>
                  {convertToDate(transaction.transaction_date_time)}
                </StyledTableCell>
                <StyledTableCell>₱ {transaction.total}</StyledTableCell>
                <StyledTableCell>{`${transaction.fname} ${transaction.lname}`}</StyledTableCell>
              </TableRow>
            ))}
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
