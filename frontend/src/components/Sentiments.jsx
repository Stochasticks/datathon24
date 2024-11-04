import React, { useEffect, useState } from "react";
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import SentimentContainer from "./SentimentContainer";
import consensus_dict from '../utils/consensus_dict';

const Sentiments = ({ symbol }) => {
  const [data, setData] = useState({});
  
  useEffect(() => {
    if (symbol) {
      const url = `https://u2et6buhf3.execute-api.us-west-2.amazonaws.com/ticker_info/invsentiment?ticker=${symbol}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((output) => {
          const parsedResponse = JSON.parse(output.body);
          let new_data = parsedResponse.message
            .replace(/'/g, '"')
            .replace(/\bNone\b/g, "null")
            .replace(/'\b-'\b/g, "null");
          const finalData = JSON.parse(new_data);
          setData(finalData[0]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [symbol]);

  const bgColor = useColorModeValue("whiteAlpha.800", "gray.700");
  const titleColor = useColorModeValue("gray.700", "gray.200");
  const smartScoreBg = useColorModeValue("#e0e0e0", "gray.600");

  return (
    <Box bg={useColorModeValue("gray.100", "gray.800")}  overflowX="hidden" overflowY="scroll" height="600px" p={4}>
      <Text ml={2} fontWeight="bold" fontSize="4xl" mb={4} color={titleColor}>
        Sentiments
      </Text>
      <Flex direction="row" width="100%" justify="space-between">
        <SentimentContainer
          name="Retail"
          consensus={consensus_dict.bloggerConsensus[data?.bloggerConsensus]}
          bullishScore={Math.round(data?.bloggerBullishSentiment * 100)}
        />
        <SentimentContainer
          name="Investors"
          consensus={consensus_dict.investorSentiment[data?.investorSentiment]}
        />
        <SentimentContainer
          name="News media"
          consensus={consensus_dict.newsSentiment[data?.newsSentiment]}
          bullishScore={Math.round(data?.newsSentimentsBullishPercent * 100)}
        />
      </Flex>
      <Flex
        direction="column"
        align="center"
        bg={bgColor}
        borderRadius="lg"
        boxShadow="md"
        mt={8}
        p={6}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
          Smart Score
        </Text>
        <Flex width="80%" align="center" justify="center">
          <Box width="80%" height="20px" bg={smartScoreBg} borderRadius="lg" overflow="hidden">
            <Box
              width={`${(data.smartScore / 10) * 100}%`}
              height="100%"
              bg="linear-gradient(90deg, red, orange, gold, green)"
              borderRadius="lg 0 0 lg"
            />
          </Box>
          <Text ml={4} fontSize="3xl" fontWeight="bold" color="teal.500">
            {data.smartScore}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Sentiments;
