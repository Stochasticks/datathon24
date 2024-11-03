import React, { useEffect, useState } from "react";
import DataTable from "./Datatable";
import { Text } from "@chakra-ui/react";
import { useDataContext } from "../contexts/DataContext";

const Sentiments = (props) => {
  const { state } = useDataContext();
  const [data, setData] = useState([]);
  const ticker = props.symbol;

  useEffect(() => {
    if (ticker) {
      const url = `https://u2et6buhf3.execute-api.us-west-2.amazonaws.com/ticker_info/invsentiment?ticker=${ticker}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [ticker]);

  return (
    <div style={{ overflowX: "hidden", overflowY: "scroll", height: "600px" }}>
      <div
        style={{
          width: "50%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: "10px",
        }}
      >
        <Text style={{ marginLeft: "10px" }} fontSize="2xl" mb={4}>
          Investor Sentiment
        </Text>
      </div>
    </div>
  );
};

export default Sentiments;
