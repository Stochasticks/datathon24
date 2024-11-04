import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ChakraProvider,
  useColorModeValue,
  Input,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import DashboardSidebar from "./DashboardSidebar";
import DashboardSectionHeader from "./DashboardSectionHeader";
import StockSearchBar from "./DashboardStockSearch";
import StockOverview from "./StockOverview";
import { useDataContext } from "../contexts/DataContext";
import Financials from "./Financials";
import Sentiments from "./Sentiments";
import { environment } from "../environments/environment";
import ConfigButton from "./ConfigButton";
import { FaMessage } from "react-icons/fa6";
import ChatsPage from "../ChatsPage";
import { saveAs } from 'file-saver';

// Sample data for the charts
const data = [
  { name: "Page A", uv: 4000, pv: 2400 },
  { name: "Page B", uv: 3000, pv: 1398 },
  { name: "Page C", uv: 2000, pv: 9800 },
];

// Available chart types
const chartTypes = (props) => {
  return {
    Line: (
      <LineChart width={300} height={150} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" />
      </LineChart>
    ),
    Bar: (
      <BarChart width={300} height={150} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
      </BarChart>
    ),
    Overview: <StockOverview symbol={props.symbol} width={300} height={150} />,
    Financials: <Financials />,
    Sentiment: <Sentiments symbol={props.symbol} />,
  };
};

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("Company 1");
  const [sections, setSections] = useState({
    "AAPL - Apple Inc": [
      { name: "Overview", chartType: "Overview", fullSize: true },
      { name: "Financials", chartType: "Financials", fullSize: true },
      { name: "Sentiment Analysis", chartType: "Sentiment", fullSize: true },
    ],
  });
  const [newSectionName, setNewSectionName] = useState("");
  const { state, fetchData } = useDataContext();

  // Fetching all the data needed for a dashboard
  const fetchAllData = (symbol) => {
    if (symbol.startsWith("Company")) return;
    console.log("symbol: ", symbol);
    fetchData(
      "assets",
      `https://u2et6buhf3.execute-api.us-west-2.amazonaws.com/ticker_info/tickerinfo?ticker=${symbol}&metric=Assets`
    );
    fetchData(
      "balanceSheet",
      `${environment.balanceSheetUrl}/balance_sheet?symbol=${symbol}`
    );
    fetchData(
      "incomeStatement",
      `${environment.incomeStatementUrl}/income_statement?symbol=${symbol}`
    );
    fetchData(
      "cashFlowStatement",
      `${environment.cashFlowUrl}/cashflow?symbol=${symbol}`
    );
    fetchData(
      "ratios",
      `${environment.ratiosUrl}/ratios?symbol=${symbol}`
    );
    fetchData(
        "sentiment",
        `${environment.sentimentUrl}/ticker_info/invsentiment?ticker=${symbol}`
    )
  };

  useEffect(() => {
    fetchAllData(selectedSection.split("-")[0].trim());
  }, [selectedSection]);

  // Function to add a new section without an initial name
  const addNewSection = () => {
    const sectionKey = `Company ${Object.keys(sections).length + 1}`;
    setSections((prevSections) => ({
      ...prevSections,
      [sectionKey]: [],
    }));
    setSelectedSection(sectionKey);
    setNewSectionName(""); // Clear the input field
  };

  const setChartType = (section, chartIdx, type) => {
    const updatedSection = [...sections[section]];
    updatedSection[chartIdx].chartType = type;
    setSections((prevSections) => ({
      ...prevSections,
      [section]: updatedSection,
    }));
  };

  const addChart = (section) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: [
        ...prevSections[section],
        { chartType: null, fullSize: false },
      ],
    }));
  };

  const renderChart = (type, fullSize, chartKey) =>
    type ? (
      React.cloneElement(
        chartTypes({ symbol: selectedSection.split("-")[0].trim() })[type],
        {
          key: `${type}-${chartKey}`,
          width: fullSize ? 700 : 300,
          height: fullSize ? 400 : 150,
        }
      )
    ) : (
      <Text>Add a chart</Text>
    );

  // Function to toggle chart size (default or full size)
  const toggleChartSize = (section, chartIdx) => {
    const updatedSection = [...sections[section]];
    updatedSection[chartIdx].fullSize = !updatedSection[chartIdx].fullSize;
    setSections((prevSections) => ({
      ...prevSections,
      [section]: updatedSection,
    }));
  };

  // Function to update section name
  const handleSectionNameSubmit = (value) => {
    console.log("entered");
    console;
    if (value) {
      fetchAllData(value.split("-")[0].trim());
      setSections((prevSections) => {
        const updatedSections = { ...prevSections };
        console.log(
          "updatedSections[selectedSection]",
          updatedSections[selectedSection]
        );

        updatedSections[value] = [
          { name: "Overview", chartType: "Overview", fullSize: true },
          { name: "Financials", chartType: "Financials", fullSize: true },
          {
            name: "Sentiment Analysis",
            chartType: "Sentiment",
            fullSize: true,
          },
        ];
        delete updatedSections[selectedSection];
        return updatedSections;
      });
      setSelectedSection(value);
      setNewSectionName("");
    }
  };

  // Other functions remain the same as before

  useEffect(() => {
    setSelectedSection(Object.keys(sections)[0]);
  }, []);

  const handleDownload = (dataType) => {
    const fileName = `${dataType}_data.json`; // You can change this to the desired format
    const dataToDownload = JSON.stringify(state[dataType]); // Adjust according to how you store your data
    const blob = new Blob([dataToDownload], { type: 'application/json' });
    saveAs(blob, fileName);
  };

  return (
    <ChakraProvider>
      <Flex height="100vh">
        {/* Sidebar */}
        <DashboardSidebar
          setSelectedSection={setSelectedSection}
          addNewSection={addNewSection}
          sections={Object.keys(sections)}
        />
        {/* Chatbot access */}
        <Box position={"absolute"} bottom={8} right={20} zIndex={999}>
          <ConfigButton
            type={"normal"}
            noFooter={true}
            buttonText="OpenTicks"
            buttonIcon={<FaMessage />}
            modalTitle=""
            modalContent={<ChatsPage />}
            width="fit-content"
            height="fit-content"
          />
        </Box>
        {/* Main content area */}
        <Box flex="1" p="4">
          <DashboardSectionHeader title={selectedSection} />

          {/* Render search bar for renaming new sections */}
          {selectedSection.startsWith("Company") && (
            // <Box mb="4">
            //   <Input
            //     placeholder="Enter section name"
            //     value={newSectionName}
            //     onChange={(e) => setNewSectionName(e.target.value)}
            //     onKeyDown={(e) => e.key === "Enter" && handleSectionNameSubmit()}
            //   />
            //   <Button onClick={handleSectionNameSubmit} mt="2">
            //     Start Analysis
            //   </Button>
            // </Box>
            <StockSearchBar handleSectionNameSubmit={handleSectionNameSubmit} />
          )}

          {/* Render the rest of your dashboard content as before */}
          {/* Tabs for each section, add charts, etc. */}
          {!selectedSection.startsWith("Company") &&
            Object.keys(sections).map((sectionKey, sectionIdx) => (
              <Box
                key={sectionKey}
                display={selectedSection === sectionKey ? "block" : "none"}
              >
                {/* <Text fontSize="xl" mb="4">{`Section ${sectionIdx + 1}`}</Text> */}
                <Tabs>
                  <TabList>
                    {sections[sectionKey].map((section, idx) => (
                      <Tab key={`${sectionKey}-${idx}`}>
                        {section?.name || `Chart ${idx + 1}`}
                      </Tab>
                    ))}
                    <Button
                      size="sm"
                      ml="2"
                      onClick={() => addChart(sectionKey)}
                    >
                      + Add Chart
                    </Button>
                  </TabList>

                  <TabPanels>
                    {sections[sectionKey].map(
                      ({ chartType, fullSize }, idx) => (
                        <TabPanel key={`${sectionKey}-${idx}`}>
                          <Flex justify="space-between" mb="4">
                            <Text fontSize="lg"></Text>
                            <HStack spacing="4">
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  size="sm"
                                  rightIcon={<ChevronDownIcon />}
                                >
                                  Download Data
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    onClick={() =>
                                      handleDownload("balanceSheet")
                                    }
                                  >
                                    Download Balance Sheet
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleDownload("incomeStatement")
                                    }
                                  >
                                    Download Income Statement
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleDownload("cashFlowStatement")
                                    }
                                  >
                                    Download Cash Flow Statement
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => handleDownload("ratios")}
                                  >
                                    Download Financial Ratios
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </HStack>
                          </Flex>

                          {/* Render chart */}
                          <Box
                            p="2"
                            bg={useColorModeValue("gray.100", "gray.700")}
                            rounded="md"
                            shadow="md"
                          >
                            {renderChart(chartType, fullSize)}
                          </Box>
                        </TabPanel>
                      )
                    )}
                  </TabPanels>
                </Tabs>
              </Box>
            ))}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Dashboard;
