import React, { useEffect, useState } from "react";
import DataTable from "./Datatable";
import { useDataContext } from "../contexts/DataContext";
import { Select } from "@chakra-ui/react"; // Import the Select component

const Financials = () => {
  const { state } = useDataContext();
  const [data, setData] = useState([]);
  const [statementType, setStatementType] = useState("balanceSheet"); // Default to balance sheet

  useEffect(() => {
    console.log(typeof state[statementType]);
    if (state[statementType] && typeof state[statementType] === "string") {
      const formated = state[statementType]
        ?.replace(/'/g, '"')
        .replace(/nan/g, "null");
      console.log("in financials: ", formated);

      setData(JSON.parse(formated));
    } else {
      setData([]);
    }
  }, [state, statementType]);

  const handleChangeStatement = (event) => {
    setStatementType(event.target.value);
  };

  return (
    <div style={{ overflowX: "hidden", overflowY: "scroll", height: "600px" }}>
      <Select
        onChange={handleChangeStatement}
        value={statementType}
        variant={"filled"}
        color={"black"}
        _hover={{
          cursor: "pointer",
        }}
        backgroundColor={"#3182ce"}
        width={"400px"}
        // colorScheme="blue" // Set the color scheme to blue
      >
        <option value="balanceSheet">Balance Sheet</option>
        <option value="incomeStatement">Income Statement</option>
        <option value="cashFlowStatement">Cash Flow Statement</option>
      </Select>
      <DataTable tableData={data} statementType={statementType} />
    </div>
  );
};

export default Financials;
