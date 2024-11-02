import { Box, Text, Button, useColorModeValue, VStack } from "@chakra-ui/react";
import React from "react";

const DashboardSidebar = ({ setSelectedSection, addNewSection, sections }) => {
  return (
    <Box width="200px" bg={useColorModeValue("gray.200", "gray.900")} p="4">
      <Text fontSize="xl" mb="4" className="logo-text">
        Stochas<span>ticks</span>
      </Text>
      <VStack spacing={4} align="start">
        {sections.map((section) => (
          <Text
            key={section}
            cursor="pointer"
            onClick={() => setSelectedSection(section)}
          >
            {section.split('-')[0].trim()}
          </Text>
        ))}
        <Button size="sm" onClick={addNewSection}>
          + New Company
        </Button>
      </VStack>
    </Box>
  );
};

export default DashboardSidebar;
