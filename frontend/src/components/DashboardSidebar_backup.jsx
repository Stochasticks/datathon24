import { Box, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import React from "react";

const DashboardSidebar = ({setSelectedSection}) => {
  return (
    <Box width="200px" bg={useColorModeValue("gray.200", "gray.900")} p="4">
      <Text fontSize="xl" mb="4" className='logo-text'>
        Stochas<span>ticks</span>
      </Text>
      <VStack spacing={4} align="start">
        <Text cursor="pointer" onClick={() => setSelectedSection("Charts")}>
          Charts
        </Text>
        <Text cursor="pointer" onClick={() => setSelectedSection("Section 2")}>
          Section 2
        </Text>
        <Text cursor="pointer" onClick={() => setSelectedSection("Section 3")}>
          Section 3
        </Text>
      </VStack>
    </Box>
  );
};

export default DashboardSidebar;
