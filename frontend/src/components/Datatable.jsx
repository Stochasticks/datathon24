import React, { useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
} from '@chakra-ui/react';

// Sample data based on the provided JSON format
// const tableData = {
//   columns: ['index', '2023-09-30 00:00:00', '2022-09-30 00:00:00', '2021-09-30 00:00:00', '2020-09-30 00:00:00'],
//   data: [
//     { index: 'Treasury Shares Number', '2023-09-30 00:00:00': 0.0, '2022-09-30 00:00:00': NaN, '2021-09-30 00:00:00': NaN, '2020-09-30 00:00:00': NaN },
//     { index: 'Ordinary Shares Number', '2023-09-30 00:00:00': 15550061000.0, '2022-09-30 00:00:00': 15943425000.0, '2021-09-30 00:00:00': 16426786000.0, '2020-09-30 00:00:00': 16976763000.0 },
//     // ... other data entries
//   ]
// };

const DataTable = ({tableData, statementType}) => {
  // Currency formatter function
  const formatCurrency = (value) => {
    // Only format numbers, return strings as they are
    if (typeof value === 'number') {
      if (Number.isNaN(value)) return 'N/A';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }
    return value; // Return the value as is for non-numeric types
  };

  const getTitle = () => {
    if (statementType === 'balanceSheet') {
        return 'Balance Sheet';
    } else if (statementType === 'incomeStatement') {
        return 'Income Statement';
    } else if (statementType === 'cashFlowStatement') {
        return 'Cash Flow Statement';
    } else {
        return 'Balance Sheet';
    }
  }

  useEffect(() => {
    // console.log('table data is: ', tableData)
  }, [tableData])

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>{getTitle(statementType)} - USD</Text>
      <Table variant="simple" colorScheme="black">
        <Thead>
          <Tr>
            {tableData?.columns?.map((col, index) => (
              <Th key={index}>{col}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableData?.data?.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {tableData?.columns.map((col, colIndex) => (
                <Td key={colIndex}>
                  {formatCurrency(row[col])} {/* Format as currency */}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DataTable;
