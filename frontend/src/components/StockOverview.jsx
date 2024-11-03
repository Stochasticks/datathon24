import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Button, ButtonGroup } from "@chakra-ui/react"; // For Chakra UI

import axios from "axios";
import { useDataContext } from "../contexts/DataContext";
import OverviewDetails from "./OverviewDetails";

const StockOverview = ({ symbol, width, height }) => {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState("1month"); // Default timeframe set to 1 month

  useEffect(() => {
    const fetchHistoricalData = async () => {
      console.log("symbol: ", symbol);
      console.log("entered: ", timeframe);
      const outputSizeMap = {
        "1month": 30, // approximately 1 month of trading days
        "3months": 90, // approximately 1 month of trading days
        "6months": 180, // approximately 6 months of trading days
        "1year": 252, // approximately 1 year of trading days
        "5years": 1260, // approximately 5 years of trading days
      };

      try {
        const response = await axios.get(
          `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=${outputSizeMap[timeframe]}&apikey=581a77adc42044f5aad1ce98cde830c0`
        );

        // Format data to include date, open, high, low, and close for the chart
        const formattedData = response.data.values
          .map((entry) => ({
            date: entry.datetime,
            open: parseFloat(entry.open),
            high: parseFloat(entry.high),
            low: parseFloat(entry.low),
            close: parseFloat(entry.close),
          }))
          .reverse(); // Reverse to have chronological order

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    };

    fetchHistoricalData();
  }, [symbol, timeframe]); // Add timeframe as a dependency

  // Custom tooltip to display open, high, low, and close values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { open, high, low, close } = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #cccccc",
            padding: "10px",
          }}
        >
          <p>
            <strong>{new Date(label).toLocaleDateString()}</strong>
          </p>
          <p>Open: {open}</p>
          <p>High: {high}</p>
          <p>Low: {low}</p>
          <p>Close: {close}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{display: 'flex', gap:'20px'}}>
      <div>
        <ButtonGroup spacing="2" mb="4">
          <Button
            colorScheme={timeframe === "1month" ? "blue" : "gray"}
            onClick={() => setTimeframe("1month")}
          >
            1 Month
          </Button>
          <Button
            colorScheme={timeframe === "3months" ? "blue" : "gray"}
            onClick={() => setTimeframe("3months")}
          >
            3 Months
          </Button>
          <Button
            colorScheme={timeframe === "6months" ? "blue" : "gray"}
            onClick={() => setTimeframe("6months")}
          >
            6 Months
          </Button>
          <Button
            colorScheme={timeframe === "1year" ? "blue" : "gray"}
            onClick={() => setTimeframe("1year")}
          >
            1 Year
          </Button>
          <Button
            colorScheme={timeframe === "5years" ? "blue" : "gray"}
            onClick={() => setTimeframe("5years")}
          >
            5 Years
          </Button>
        </ButtonGroup>

        <LineChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#8884d8" />
        </LineChart>
      </div>
      {
        <OverviewDetails />
      }
    </div>
  );
};

export default StockOverview;
