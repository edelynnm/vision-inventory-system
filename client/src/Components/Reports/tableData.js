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

const styles = (theme) => ({
  margin: {
    margin: "0 60px 60px 0",
  },
  tableContainer: {
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: "white",
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
  
const TableData = (props) => {
  const classes = useStyle(theme);

  return (
    <div className={classes.margin}>
      <Typography variant={"h6"} color="secondary" style={{ fontWeight: 700 }} gutterBottom>
        {props.date}
      </Typography>
      <TableContainer
        component={Paper}
        elevation={0}
        className={classes.tableContainer}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow key={props.date}>
              <TableHeader width={120}>Item Code</TableHeader>
              <TableHeader width={200}>Description</TableHeader>
              <TableHeader width={80}>Unit</TableHeader>
              <TableHeader width={80}>Unit Price</TableHeader>
              <TableHeader width={80}>Total Sold</TableHeader>
              <TableHeader width={80}>Total Amount</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.value.map((item) => (
              <TableRow hover>
                <StyledTableCell>{item.item_code}</StyledTableCell>
                <StyledTableCell>
                  {`${item.item_brand} ${item.item_specs}`}
                </StyledTableCell>
                <StyledTableCell>{item.item_unit}</StyledTableCell>
                <StyledTableCell>₱ {item.item_unit_price}</StyledTableCell>
                <StyledTableCell>{item.sold}</StyledTableCell>
                <StyledTableCell>
                  ₱ {Number(item.sold) * Number(item.item_unit_price)}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableData;
