import React, { useMemo, useState } from "react";
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

// Sample data for the charts
const data = [
  { name: "Page A", uv: 4000, pv: 2400 },
  { name: "Page B", uv: 3000, pv: 1398 },
  { name: "Page C", uv: 2000, pv: 9800 },
];

// Available chart types
const chartTypes = {
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
  Quotes: (
    <LineGraph width={300} height={150} />
  ),
  Cosine: (
    <CosineMatrix width={300} height={150} />
  ),
  "t-SNE": (
    <TSNEScatter width={300} height={150} />
  ),
};

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState("Charts");
  const [sections, setSections] = useState({
    Charts: [{ chartType: 'Quotes', fullSize: true }],
    "Section 2": [{ chartType: 'Cosine', fullSize: true }],
    "Section 3": [{ chartType: 't-SNE', fullSize: true }],
  });

  // Function to handle adding a new chart to a section
  const addChart = (section) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: [
        ...prevSections[section],
        { chartType: null, fullSize: false },
      ],
    }));
  };

  // Function to toggle chart size (default or full size)
  const toggleChartSize = (section, chartIdx) => {
    const updatedSection = [...sections[section]];
    updatedSection[chartIdx].fullSize = !updatedSection[chartIdx].fullSize;
    setSections((prevSections) => ({
      ...prevSections,
      [section]: updatedSection,
    }));
  };

  // Function to set chart type for a specific chart slot
  const setChartType = (section, chartIdx, type) => {
    const updatedSection = [...sections[section]];
    updatedSection[chartIdx].chartType = type;
    setSections((prevSections) => ({
      ...prevSections,
      [section]: updatedSection,
    }));
  };

  // Render the selected chart based on type
  const renderChart = (type, fullSize, chartKey) =>
    type ? (
      React.cloneElement(chartTypes[type], {
        key: `${type}-${chartKey}`,
        width: fullSize ? 700 : 300,
        height: fullSize ? 400 : 150,
      })
    ) : (
      <Text>Add a chart</Text>
    );

  // const renderChart = (type, fullSize) => {
  //   const chartComponent = useMemo(() => {
  //     return type ? chartTypes[type] : null;
  //   }, [type]);
  
  //   return chartComponent ? (
  //     React.cloneElement(chartComponent, {
  //       width: fullSize ? 700 : 300,
  //       height: fullSize ? 400 : 150,
  //     })
  //   ) : (
  //     <Text>Add a chart</Text>
  //   );
  // };

  return (
    <ChakraProvider>
      <Flex height="100vh">
        {/* Sidebar */}
        <DashboardSidebar setSelectedSection={setSelectedSection} />

        {/* Main content area */}
        <Box flex="1" p="4">
          <DashboardSectionHeader title={selectedSection} />

          {/* Render tabs for the selected section */}
          {Object.keys(sections).map((sectionKey, sectionIdx) => (
            <Box
              key={sectionKey}
              display={selectedSection === sectionKey ? "block" : "none"}
            >
              {/* <Text fontSize="xl" mb="4">{`Section ${sectionIdx + 1}`}</Text> */}
              <Tabs>
                <TabList>
                  {sections[sectionKey].map((_, idx) => (
                    <Tab key={`${sectionKey}-${idx}`}>{`Chart ${idx + 1}`}</Tab>
                  ))}
                  <Button size="sm" ml="2" onClick={() => addChart(sectionKey)}>
                    + Add Chart
                  </Button>
                </TabList>

                <TabPanels>
                  {sections[sectionKey].map(({ chartType, fullSize }, idx) => (
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
                              {Object.keys(chartTypes).map((type) => (
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
                  ))}
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
