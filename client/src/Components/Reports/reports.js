import { Fragment, useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  TableContainer,
  Typography,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Paper
} from "@material-ui/core";
import theme from "../../Theme/index";
import PageTemplate from "../Subcomponents/uiTemplates/pageTemplate";
import ajax from "../../Utils/facade";
import { useAuth } from "../Subcomponents/auth";


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

const Reports = () => {
  const classes = useStyle(theme);
  const auth = useAuth();
  const [items, setItems ] = useState([]);

  useEffect(() => {
    fetchItems()
  },[])

  const fetchItems = () => {
    ajax.GET({
      url: "http://localhost:8000/api/report",
      authToken: auth.token,
      headers: {"Content-Type": "application/json"},
      callback: setItems
    })
  }
  const displayText =
    items.length === 0 ? (
      <div className={classes.displayText}>
        <Typography align="center">Nothing to display</Typography>
      </div>
    ) : (
      ""
    );


  const main = (
    <Fragment>
      <Typography
        align="left"
        variant="h5"
        color="primary"
        style={{ fontWeight: 700, marginBottom: 30 }}
        >
        Sales Report
      </Typography>
      <div className={classes.margin}>
        <TableContainer
          component={Paper}
          elevation={0}
          className={classes.tableContainer}
        >
          <Table stickyHeader >
            <TableHead>
              <TableRow>
                <TableHeader width={120}>Item Code</TableHeader>
                <TableHeader width={120}>Description</TableHeader>
                <TableHeader width={100}>Unit</TableHeader>
                <TableHeader width={80}>Unit Price</TableHeader>
                <TableHeader width={100}>Total Sold</TableHeader>
                <TableHeader width={80}>Total Amount</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
            {items.map((item, index) => (
              <TableRow key={index} hover>
                <StyledTableCell>{item.item_code}</StyledTableCell>
                <StyledTableCell>
                  {`${item.item_brand} ${item.item_specs}`}
                </StyledTableCell>
                <StyledTableCell>{item.item_unit}</StyledTableCell>
                <StyledTableCell>₱ {item.item_unit_price}</StyledTableCell>
                <StyledTableCell>{item.sold}</StyledTableCell>
                <StyledTableCell>₱ {Number(item.sold) * Number(item.item_unit_price)}</StyledTableCell>

              </TableRow>
            ))}
              </TableBody>

          </Table>
          {displayText}
        </TableContainer>
      </div>
    </Fragment>
  )

  return (
    <Fragment>
      <PageTemplate component={main}/>
    </Fragment>
  );
};

export default Reports;
