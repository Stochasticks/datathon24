import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  List,
  ListItem,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { stockData } from "../../assets/NASDAQ";

const StockSearchBar = ({ handleSectionNameSubmit }) => {
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState(stockData.data); //useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  // Fetch stocks data from the API on component mount
//   useEffect(() => {
//     const fetchStocks = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(
//           "https://api.twelvedata.com/stocks?exchange=NASDAQ"
//         );
//         setStocks(response.data.data || []); // Store all stocks in state
//       } catch (error) {
//         console.error("Failed to fetch stocks:", error);
//       }
//       setIsLoading(false);
//     };

//     fetchStocks();
//   }, []);

  // Filter stocks based on query input
  useEffect(() => {
    if (query.length > 0) {
      setFilteredStocks(
        stocks.filter(
          (stock) =>
            stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
            stock.name.toLowerCase().includes(query.toLowerCase())
        ).splice(0, 20)
      );
    } else {
      setFilteredStocks([]);
    }
  }, [query, stocks]);

  // Handle stock selection
  const handleStockSelection = (stock) => {
    console.log(`Selected stock: ${stock.symbol} - ${stock.name}`);
    setNewSectionName(stock.name);
    setQuery(stock.name);
    setFilteredStocks([]);
    handleSectionNameSubmit(`${stock.symbol} - ${stock.name}`)
  };

  return (
    <Box mb="4">
      <Input
        placeholder="Search for a stock"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isLoading && <Spinner mt="2" />}
      
      {/* Render stock suggestions */}
      <List mt="2" maxH="200px" overflowY="auto" border="1px solid #ccc" borderRadius="md">
        {filteredStocks.map((stock) => (
          <ListItem
            key={stock.symbol}
            p="2"
            _hover={{ bg: "gray.100", cursor: "pointer" }}
            onClick={() => handleStockSelection(stock)}
          >
            <Text fontWeight="bold">{stock.symbol}</Text>
            <Text fontSize="sm">{stock.name}</Text>
          </ListItem>
        ))}
      </List>

      {/* Start Analysis button */}
      {/* <Button onClick={handleSectionNameSubmit} mt="2">
        Start Analysis
      </Button> */}
    </Box>
  );
};

export default StockSearchBar;
