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
import {
  Box,
  Button,
  ButtonGroup,
  SimpleGrid,
  Spinner,
  VStack,
  Text,
} from "@chakra-ui/react"; // For Chakra UI

import axios from "axios";
import { useDataContext } from "../contexts/DataContext";
import OverviewDetails from "./OverviewDetails";
import { environment } from "../environments/environment";

const StockOverview = ({ symbol, width, height }) => {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState("1month"); // Default timeframe set to 1 month
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for comparison data
  const { state } = useDataContext();

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

  useEffect(()=>{
    if (state.comparison) {
        setLoading(false);
    }
  }, [state.comparison])

  //   useEffect(() => {
  //     const fetchComparisonData = async () => {
  //       setLoading(true);
  //       try {
  //         const response = await fetch(
  //           `${environment.sectorComparisonUrl}/sector_comparison?symbol=${symbol}`
  //         ); // Replace with your actual endpoint
  //         const data = await response.json();
  //         setComparisonData(data);
  //       } catch (error) {
  //         console.error("Error fetching comparison data:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchComparisonData();
  //   }, []);

  return (
    <div style={{ overflowX: "hidden", overflowY: "scroll", height: "600px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <ButtonGroup spacing="2" mb="4" width="100%">
            <Button
              colorScheme={timeframe === "1month" ? "blue" : "gray"}
              onClick={() => setTimeframe("1month")}
              width="100%"
            >
              1 Month
            </Button>
            <Button
              colorScheme={timeframe === "3months" ? "blue" : "gray"}
              onClick={() => setTimeframe("3months")}
              width="100%"
            >
              3 Months
            </Button>
            <Button
              colorScheme={timeframe === "6months" ? "blue" : "gray"}
              onClick={() => setTimeframe("6months")}
              width="100%"
            >
              6 Months
            </Button>
            <Button
              colorScheme={timeframe === "1year" ? "blue" : "gray"}
              onClick={() => setTimeframe("1year")}
              width="100%"
            >
              1 Year
            </Button>
            <Button
              colorScheme={timeframe === "5years" ? "blue" : "gray"}
              onClick={() => setTimeframe("5years")}
              width="100%"
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

        {/* Overview Details Component */}
        <div style={{ flex: 1 }}>
          <OverviewDetails />
        </div>
      </div>

      <Box>
        {loading ? (
          <Spinner />
        ) : (
          <VStack spacing={4} align="start" mt={6} width={"100%"}>
            <Text fontSize="lg" fontWeight="bold">
              Comparison Data
            </Text>
            <SimpleGrid
              columns={{ base: 2, md: 3 }}
              spacing={10}
              width={"100%"}
            >
              {state.comparison?.map((company) => (
                <Box
                  key={company.symbol}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                >
                  <Text fontSize="md" fontWeight="bold">
                    {company.name} ({company.symbol})
                  </Text>
                  <VStack align="start" spacing={1}>
                    <Text>
                      <b>Current Ratio: </b>
                      {company.ratios.currentRatio}
                    </Text>
                    <Text>
                      <b>Debt to Equity:</b> {company.ratios.debtToEquity}
                    </Text>
                    <Text>
                      <b>Dividend Yield:</b> {company.ratios.dividendYield}
                    </Text>
                    <Text>
                      <b>Gross Margins:</b>{" "}
                      {(company.ratios.grossMargins * 100).toFixed(2)}%
                    </Text>
                    <Text>
                      <b>Market Cap:</b> $
                      {(company.ratios.marketCap / 1e12).toFixed(2)} Trillion
                    </Text>
                    <Text>
                      <b>Operating Margins:</b>{" "}
                      {(company.ratios.operatingMargins * 100).toFixed(2)}%
                    </Text>
                    <Text>
                      <b>Price to Book:</b> {company.ratios.priceToBook}
                    </Text>
                    <Text>
                      <b>Price to Earnings:</b> {company.ratios.priceToEarnings}
                    </Text>
                    <Text>
                      <b>Profit Margins:</b>{" "}
                      {(company.ratios.profitMargins * 100).toFixed(2)}%
                    </Text>
                    <Text>
                      <b>Quick Ratio:</b> {company.ratios.quickRatio}
                    </Text>
                    <Text>
                      <b>Return on Equity:</b>{" "}
                      {(company.ratios.returnOnEquity * 100).toFixed(2)}%
                    </Text>
                    <Text>
                      <b>Volume:</b> {company.ratios.volume.toLocaleString()}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        )}
      </Box>
    </div>
  );
};

export default StockOverview;
