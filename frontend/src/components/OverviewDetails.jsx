import React, { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useDataContext } from "../contexts/DataContext";

const OverviewDetails = () => {
  const [data, setData] = useState({});
  const { state } = useDataContext();

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
    // if (typeof state.ratios != "undefined" ) {
    //   console.log("state.ratios: ", JSON.parse(state.ratios));
    setData({
      ...data,
      ratios: state.ratios?.ratios,
    });
    // }
    // console.log("state.ratios?.ratios: ", state.ratios?.ratios);
    // console.log(
    //   "Object.keys(data.ratios): ",
    //   Object.keys(state.ratios?.ratios || [])
    // );
  }, [state.ratios]);

  useEffect(() => {
    let bs = state.balanceSheet?.replace(/'/g, '"').replace(/nan/g, "null");

    let is = state.incomeStatement?.replace(/'/g, '"').replace(/nan/g, "null");

    if (bs && is) {
      bs = JSON.parse(bs).data;
      is = JSON.parse(is).data;

      setData({
        ...data,
        financials: {
          "Total Revenue": is.find((item) => item.index == "Total Revenue")[
            Object.keys(is.find((item) => item.index == "Total Revenue"))[1]
          ],
          "Gross Profit": is.find((item) => item.index == "Gross Profit")[
            Object.keys(is.find((item) => item.index == "Gross Profit"))[1]
          ],
          "Total Debt": bs.find((item) => item.index == "Total Debt")[
            Object.keys(bs.find((item) => item.index == "Total Debt"))[1]
          ],
          "Total Capitalization": bs.find(
            (item) => item.index == "Total Capitalization"
          )[
            Object.keys(
              bs.find((item) => item.index == "Total Capitalization")
            )[1]
          ],
          //   EBIT: is.find((item) => item.index == "EBIT")[
          //     Object.keys(is.find((item) => item.index == "EBIT"))[1]
          //   ],
          EBITDA: is.find((item) => item.index == "EBITDA")[
            Object.keys(is.find((item) => item.index == "EBITDA"))[1]
          ],
        },
      });
    //   console.log("state.balanceSheet: ", bs);
    //   console.log("Object.keys(state.balanceSheet): ", Object.keys(bs || []));
    //   console.log("state.incomeStatement: ", is);
    //   console.log("Object.keys(state.incomeStatement): ", {
    //     EBITDA: is.find((item) => item.index == "EBITDA")[
    //       Object.keys(is.find((item) => item.index == "EBITDA"))[1]
    //     ],
    //   });
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
          {/* {data.section1?.rows?.map((row, index) => (
                        <Tr key={index}>
                            <Td>{row.key1}</Td>
                            <Td>{row.key2}</Td>
                        </Tr>
                    ))} */}
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
            backgroundColor={"teal"}
            padding={8}
            margin={8}
          >
            Insert Sentiment Insights
          </Box>
        </Tbody>
      </Table>
    </Box>
  );
};

export default OverviewDetails;
