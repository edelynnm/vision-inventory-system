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
  Button
} from "@material-ui/core";
import theme from "../../Theme/index";
import ajax from "../../Utils/facade";
import { useAuth } from "../Subcomponents/auth";
import { ChevronLeftRounded } from "@material-ui/icons";
import PageTemplate from "../Subcomponents/uiTemplates/pageTemplate";
import { Redirect } from "react-router-dom";

const styles = (theme) => ({
  tableContainer: {
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: "white",
    maxHeight: 600
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
  displayText: {
    padding: 200,
    width: "100",
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


const RestockRecords = () => {
    const classes = useStyle(theme);
    const auth = useAuth();
    const [back, setBack] = useState(false);
    const [records, setRecords] = useState([]);
  
    useEffect(() => {
      getRecords()
    }, [])
  
    const getRecords = () => {
      ajax.GET({
        url: `http://localhost:8000/api/inventory/restock-records`,
        authToken: auth.token,
        callback: setRecords,
      });
    };
  
    const displayText = 
    records.length === 0 ? (
      <div className={classes.displayText}>
        <Typography align="center">Nothing to display</Typography>
      </div>
    ) : "";

    const main = (
      <Fragment>
        <Button
        onClick={() => setBack(true)}
        disableRipple
        className={classes.backButton}
       >
        <ChevronLeftRounded className={classes.chevron} />
        <Typography variant="subtitle2">BACK</Typography>
      </Button>
        <div className={classes.margin}>
        <Typography align="left"
          variant="h5"
          color="primary" style={{ fontWeight: 700 }} gutterBottom>
          Restock Records
        </Typography>
        <TableContainer
          component={Paper}
          elevation={0}
          className={classes.tableContainer}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableHeader width={50}>Date</TableHeader>
                <TableHeader width={100}>Item Code</TableHeader>
                <TableHeader width={200}>Description</TableHeader>
                <TableHeader width={80}>Additional Qty</TableHeader>
                <TableHeader width={50}>Unit</TableHeader>
                <TableHeader width={80}>Incharge</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => {
                const date = new Date(record.restock_date_time).toLocaleDateString();

                return(
                <TableRow key={index} hover>
                  <StyledTableCell>{date}</StyledTableCell>
                  <StyledTableCell>{record.item_code}</StyledTableCell>
                  <StyledTableCell>
                    {`${record.item_brand} ${record.item_specs}`}
                  </StyledTableCell>
                  <StyledTableCell>{record.additional_qty}</StyledTableCell>
                  <StyledTableCell>{record.item_unit}</StyledTableCell>
                  <StyledTableCell>
                    {`${record.fname} ${record.lname}`}
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

  if(back) {
    return (
      <Redirect to="/inventory" />
    )
  }
  return (
    <Fragment>
      <PageTemplate component={main} />
    </Fragment>
  )
};  

export default RestockRecords;