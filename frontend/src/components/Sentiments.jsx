import React, { useEffect, useState } from "react";
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import SentimentContainer from "./SentimentContainer";
import consensus_dict from '../utils/consensus_dict';
import { useDataContext } from "../contexts/DataContext";
import SentimentScoreBar from "./SentimentScoreBar";
import SentimentDrawer from "./SentimentDrawer";
const Sentiments = ({ symbol }) => {
  const { state } = useDataContext();

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
          consensus={consensus_dict.bloggerConsensus[state.sentiment?.bloggerConsensus]}
          bullishScore={Math.round(state.sentiment?.bloggerBullishSentiment * 100)}
        />
        <SentimentContainer
          name="Investors"
          consensus={consensus_dict.investorSentiment[state.sentiment?.investorSentiment]}
        />
        <SentimentContainer
          name="News media"
          consensus={consensus_dict.newsSentiment[state.sentiment?.newsSentiment]}
          bullishScore={Math.round(state.sentiment?.newsSentimentsBullishPercent * 100)}
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
          Sentiment Score
        </Text>
        <SentimentScoreBar symbol={symbol}  />
        <SentimentDrawer/>
      </Flex>
    </Box>
  );
};

export default Sentiments;
