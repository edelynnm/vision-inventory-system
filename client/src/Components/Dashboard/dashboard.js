import { Fragment, useEffect, useState } from "react";
import { Divider, Typography } from "@material-ui/core";
import PageTemplate from "../Subcomponents/uiTemplates/pageTemplate";
import { useAuth } from "../Subcomponents/auth";
import ajax from "../../Utils/facade";
import { Alert } from "@material-ui/lab";

const Dashboard = () => {
  const auth = useAuth();
  const [restockItems, setRestockItems] = useState([]);

  useEffect(() => {
    getItems();
    const interval = setInterval(() => {
      getItems();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const getItems = () => {
    ajax.GET({
      url: "http://localhost:8000/api/inventory",
      authToken: auth.token,
      callback: getRestockItems,
    });
  };

  const getRestockItems = (items) => {
    const result = items.filter((item) =>
      item.item_qty <= item.reorder_point ? item : ""
    );
    setRestockItems(result);
  };

  const dashboard = (
    <div style={{ marginRight: 50 }}>
      <Typography
        variant="h4"
        align="left"
        color="primary"
        style={{ fontWeight: 700, marginBottom: 20 }}
      >{`Welcome ${auth.user.fname} ${auth.user.lname}!`}</Typography>
      <Divider />
      <Typography
        variant="h5"
        color="secondary"
        align="left"
        style={{ fontWeight: 700, margin: "40px 0 20px 0" }}
      >
        Inventory Notifications
      </Typography>
      <Alert open variant="filled" severity={restockItems.length === 0 ? "success" : "error"}>
        {restockItems.length !== 0 ? (
          <div>
            <Typography style={{ fontWeight: 700 }} gutterBottom>
              RESTOCK:{" "}
            </Typography>
            {restockItems.map((item, index) => (
              <div>
                <Typography>ITEM {index + 1}</Typography>
                <Typography style={{ marginLeft: 40 }}>
                  CODE:<b> {item.item_code}</b>
                </Typography>
                <Typography style={{ marginLeft: 40 }}>
                  DESC: <b>{`${item.item_brand} ${item.item_specs}`}</b>
                </Typography>
                <Typography style={{ marginLeft: 40 }}>
                  QTY LEFT: <b>{item.item_qty}</b>
                </Typography>
                <br />
              </div>
            ))}
          </div>
        ) : (
          <Typography>"Nothing to show."</Typography>
        )}
      </Alert>
    </div>
  );

  return (
    <Fragment>
      <PageTemplate component={dashboard} />
    </Fragment>
  );
};

export default Dashboard;
