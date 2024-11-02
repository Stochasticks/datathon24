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
import { LineGraph } from "./LineGraph";
import CosineMatrix from "./CosineMatrix";
import { TSNEScatter } from "./TSNEScatter";
import StockSearchBar from "./DashboardStockSearch";
import StockOverview from "./StockOverview";

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
    Quotes: <LineGraph width={300} height={150} />,
    Cosine: <CosineMatrix width={300} height={150} />,
    "t-SNE": <TSNEScatter width={300} height={150} />,
    Overview: <StockOverview symbol={props.symbol} width={300} height={150}/>,
  };
};

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("Company 1");
  const [sections, setSections] = useState({
    "AAPL - Apple Inc": [
      { name: "Overview", chartType: "Overview", fullSize: true },
      { name: "Fundamentals", chartType: "Quotes", fullSize: true },
    ],
    "Company 1": [
      { chartType: "Quotes", fullSize: true },
      { chartType: "Quotes", fullSize: true },
    ],
    // "Test 1": [{ chartType: "Quotes", fullSize: true }],
    // "Test 2": [{ chartType: "Cosine", fullSize: true }],
    // "Test 3": [{ chartType: "t-SNE", fullSize: true }],
  });
  const [newSectionName, setNewSectionName] = useState("");

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
      React.cloneElement(chartTypes({symbol: selectedSection.split('-')[0].trim()})[type], {
        key: `${type}-${chartKey}`,
        width: fullSize ? 700 : 300,
        height: fullSize ? 400 : 150,
      })
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
      setSections((prevSections) => {
        const updatedSections = { ...prevSections };
        updatedSections[value] = updatedSections[selectedSection];
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

  return (
    <ChakraProvider>
      <Flex height="100vh">
        {/* Sidebar */}
        <DashboardSidebar
          setSelectedSection={setSelectedSection}
          addNewSection={addNewSection}
          sections={Object.keys(sections)}
        />

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
                            <Text fontSize="lg">Chart {idx + 1}</Text>
                            <HStack spacing="4">
                              {/* Toggle chart size button */}
                              <Button
                                size="sm"
                                onClick={() => toggleChartSize(sectionKey, idx)}
                              >
                                {fullSize ? "Default Size" : "Full Size"}
                              </Button>

                              {/* Chart type selector */}
                              <Menu>
                                <MenuButton
                                  as={Button}
                                  size="sm"
                                  rightIcon={<ChevronDownIcon />}
                                >
                                  {chartType
                                    ? `${chartType} Chart`
                                    : "Select Chart"}
                                </MenuButton>
                                <MenuList>
                                  {Object.keys(chartTypes({})).map((type) => (
                                    <MenuItem
                                      key={type}
                                      onClick={() =>
                                        setChartType(sectionKey, idx, type)
                                      }
                                    >
                                      {type} Chart
                                    </MenuItem>
                                  ))}
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
                            {/* {renderChart(chartType, fullSize, `${chartType}-${fullSize}`)} */}
                            {renderChart(chartType, fullSize)}
                            <Text>Test Chart sub-section</Text>
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
