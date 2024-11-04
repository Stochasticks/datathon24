import React, { useEffect, useState } from "react";
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import { useDataContext } from "../contexts/DataContext";

const SentimentScoreBar = ({ symbol }) => {
  const { state } = useDataContext();

  const bgColor = useColorModeValue("whiteAlpha.800", "gray.700");
  const titleColor = useColorModeValue("gray.700", "gray.200");
  const smartScoreBg = useColorModeValue("#e0e0e0", "gray.600");

  return (
        <Flex width="80%" align="center" justify="center">
          <Box width="80%" height="20px" bg={smartScoreBg} borderRadius="lg" overflow="hidden">
            <Box
              width={`${(state.sentiment?.smartScore / 10) * 100}%`}
              height="100%"
              bg="linear-gradient(90deg, red, orange, gold, green)"
              borderRadius="lg 0 0 lg"
            />
          </Box>
          <Text ml={4} fontSize="3xl" fontWeight="bold" color="teal.500">
            {state.sentiment?.smartScore}
          </Text>
        </Flex>
  );
};

export default SentimentScoreBar;