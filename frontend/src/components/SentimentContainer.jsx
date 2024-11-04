import React from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

const SentimentContainer = ({ name, consensus, bullishScore }) => {
  if (!consensus) return null;

  const bg = useColorModeValue("whiteAlpha.800", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const scoreColor = useColorModeValue("teal.500", "teal.300");

  return (
    <Box
      width="33%"
      height="300px"
      bg={bg}
      borderRadius="lg"
      boxShadow="md"
      mx="4px"
      p="6"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      textAlign="center"
    >
      <Text fontSize="xl" fontWeight="semibold" mb="2" color={textColor}>
        {name}
      </Text>
      <Text fontSize="md" color={textColor} mb="4">
        Consensus
      </Text>
      <Flex
        width="100px"
        height="100px"
        bg={consensus.color}
        borderRadius="full"
        align="center"
        justify="center"
        mb="4"
        boxShadow="base"
      >
        <Text color="white" fontWeight="bold" fontSize="lg">
          {consensus.label}
        </Text>
      </Flex>
      {bullishScore > 0 && (
        <Box>
          <Text fontSize="md" color={textColor} mb="1">Percentage Bullish</Text>
          <Text fontSize="3xl" fontWeight="bold" color={scoreColor}>
            {bullishScore}%
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default SentimentContainer;
