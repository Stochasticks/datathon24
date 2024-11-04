import React, { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, useColorModeValue } from "@chakra-ui/react";
import { useDataContext } from "../contexts/DataContext";
import SentimentScoreBar from "./SentimentScoreBar";
import consensus_dict from '../utils/consensus_dict';


const OverviewDetails = () => {
  const [data, setData] = useState({});
  const { state } = useDataContext();
  const bg = useColorModeValue("whiteAlpha.800", "gray.700");

  const formatCurrency = (value) => {
    // Only format numbers, return strings as they are
    if (typeof value === "number") {
      if (Number.isNaN(value)) return "N/A";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }
    return value; // Return the value as is for non-numeric types
  };

  const formatNumber = (number) => {
    if (`${number}`.includes(".")) return number;
    if (number === null || number === undefined) return "-";
    return number.toLocaleString();
  };

  useEffect(() => {
    setData({
      ...data,
      ratios: state.ratios?.ratios,
    });
  }, [state.ratios]);

  useEffect(() => {
    let bs = state.balanceSheet?.replace(/'/g, '"').replace(/nan/g, "null");

    let is = state.incomeStatement?.replace(/'/g, '"').replace(/nan/g, "null");

    if (bs && is) {
      bs = JSON.parse(bs).data;
      is = JSON.parse(is).data;

      setData((prevData) => ({
        ...prevData,
        financials: {
          "Total Revenue": is.find((item) => item.index === "Total Revenue")?.[
            Object.keys(is.find((item) => item.index === "Total Revenue"))[1]
          ] || "N/A",
          "Gross Profit": is.find((item) => item.index === "Gross Profit")?.[
            Object.keys(is.find((item) => item.index === "Gross Profit"))[1]
          ] || "N/A",
          "Total Debt": bs.find((item) => item.index === "Total Debt")?.[
            Object.keys(bs.find((item) => item.index === "Total Debt"))[1]
          ] || "N/A",
          "Total Capitalization": bs.find(
            (item) => item.index === "Total Capitalization"
          )?.[
            Object.keys(bs.find((item) => item.index === "Total Capitalization"))[1]
          ] || "N/A",
          EBITDA: is.find((item) => item.index === "EBITDA")?.[
            Object.keys(is.find((item) => item.index === "EBITDA"))[1]
          ] || "N/A",
        },
      }));
    }
  }, [state.balanceSheet, state.incomeStatement]);

  return (
    <Box display={"flex"} gap={"16px"}>
      <Table size={"sm"} variant="simple" colorScheme="black">
        <Thead>
          <Tr>
            <Th>Ratios</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.ratios &&
            Object.keys(data?.ratios)?.map((key, index) => (
              <Tr key={index}>
                <Td>
                  <b>
                    {key.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()}:{" "}
                  </b>
                </Td>
                <Td>{formatNumber(data.ratios[key])}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
      <Table size={"sm"} variant="simple" colorScheme="black">
        <Thead>
          <Tr>
            <Th>Financials (Last Year)</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.financials &&
            Object.keys(data?.financials)?.map((key, index) => (
              <Tr key={index}>
                <Td>
                  <b>{key}: </b>
                </Td>
                <Td>{formatCurrency(data.financials[key])}</Td>
              </Tr>
            ))}
          <Box
            height={"200px"}
            width={"100%"}
            bg={bg}
            padding={2}
            borderRadius="lg"
            boxShadow="md"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            textAlign="center"
          >
            <Text fontSize={"1xl"} fontWeight={"bold"} mt={3}>Analyst consensus</Text>
            <Text fontSize={"1xl"} mt={1} fontWeight="bold" color="teal.500">{consensus_dict.analystConsensus[state.sentiment?.analystConsensus]}</Text>
            <Text fontSize={"1xl"} fontWeight={"bold"} mt={4}>Sentiment Score </Text>
            <SentimentScoreBar symbol={state.sentiment?.ticker}/>
          </Box>
        </Tbody>
      </Table>
    </Box>
  );
};

export default OverviewDetails;
