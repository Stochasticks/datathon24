import React, { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import SentimentContainer from "./SentimentContainer";
const mock_response = {
  body: "{\"message\": \"[{\\\"ticker\\\": \\\"AAPL\\\", \\\"hedgeFundTrendValue\\\": -386045483.0, \\\"smartScore\\\": 7, \\\"bloggerSectorAvg\\\": 0.6901, \\\"bloggerBullishSentiment\\\": 0.74, \\\"insidersLast3MonthsSum\\\": -22602362.0, \\\"newsSentimentsBearishPercent\\\": 0.1026, \\\"newsSentimentsBullishPercent\\\": 0.8974, \\\"investorHoldingChangeLast7Days\\\": -0.00108054984247974, \\\"investorHoldingChangeLast30Days\\\": 0.0095256980618674, \\\"priceTarget\\\": 245.84, \\\"convertedPriceTarget\\\": 245.84, \\\"convertedPriceTargetCurrencyId\\\": 1, \\\"fundamentalsReturnOnEquity\\\": 1.574125, \\\"fundamentalsAssetGrowth\\\": 0.03516, \\\"technicalsTwelveMonthsMomentum\\\": 0.2878, \\\"sma\\\": \\\"Positive\\\", \\\"analystConsensus\\\": \\\"ModerateBuy\\\", \\\"hedgeFundTrend\\\": \\\"Decreased\\\", \\\"insiderTrend\\\": \\\"SoldShares\\\", \\\"investorSentiment\\\": \\\"Neutral\\\", \\\"newsSentiment\\\": \\\"VeryBullish\\\", \\\"bloggerConsensus\\\": \\\"Bullish\\\", \\\"marketCountryId\\\": 1, \\\"isomic\\\": \\\"XNAS\\\"}]\"}",
  statusCode: 200
};
const Sentiments = (props) => {
  const [data, setData] = useState({});
  const ticker = props.symbol;

  useEffect(() => {
    if (ticker) {
      const url = `https://u2et6buhf3.execute-api.us-west-2.amazonaws.com/ticker_info/invsentiment?ticker=${ticker}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const parsedResponse = JSON.parse(data.body);   
          setData(parsedResponse.message[0]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
        /*const parsedResponse = JSON.parse(mock_response.body);

        // Step 2: Parse the inner JSON in `message`
        const finalData = JSON.parse(parsedResponse.message);
        console.log(finalData[0]);
        setData(finalData[0]);*/
            
    }
  }, [ticker]);

  return (
    <div style={{ overflowX: "hidden", overflowY: "scroll", height: "600px" }}>
        <Text style={{ marginLeft: "10px" }} fontSize="2xl" mb={4}>
          Sentiments
        </Text>
        <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
                <SentimentContainer name="Retail"   consensus={ data?.bloggerConsensus }/>
                <SentimentContainer name="Investors"  consensus={ data?.investorSentiment }/>
                <SentimentContainer name="News media" consensus={ data?.newsSentiment } />          
        </div>
                 
    </div>
  );
};

export default Sentiments;
