import { Fragment, useEffect, useState } from "react";
import { Typography} from "@material-ui/core";
import PageTemplate from "../Subcomponents/uiTemplates/pageTemplate";
import ajax from "../../Utils/facade";
import { useAuth } from "../Subcomponents/auth";
import groupByDate from "../../Utils/groupBy";
import TableData from "./tableData.";


const Reports = () => {
  const auth = useAuth();
  const [items, setItems] = useState({});

  useEffect(() => { 
    fetchItems()
  }, []);


  const handleChange = (body) => { 
    setItems(groupByDate(body));
  };

  const fetchItems = () => {
    ajax.GET({
      url: "http://localhost:8000/api/report",
      authToken: auth.token,
      headers: { "Content-Type": "application/json" },
      callback: handleChange,
    });
  };
  
  const getTable = (items) => {
    let data = []
    for (const [key, value] of Object.entries(items)) {
      data.push(<TableData date={key} value={value} />)
    }
    return data;
  }
  
  const displayText =
    Object.entries(items).length === 0 ? (
    <div styles={{padding: 200, width: "100",}}>
      <Typography align="center">Nothing to display</Typography>
    </div>
  ) : (
    ""
  );

  const main = (
    <Fragment>
      <div>
        <Typography
          align="left"
          variant="h5"
          color="primary"
          style={{ fontWeight: 700, marginBottom: 20 }}
        >
          Sales Report
        </Typography>
      </div>
      {displayText}
      {getTable(items)}
    </Fragment>
  );

  return (
    <Fragment>
      <PageTemplate component={main} />
    </Fragment>
  );
};

export default Reports;
