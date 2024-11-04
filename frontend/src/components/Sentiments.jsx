import React, { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import SentimentContainer from "./SentimentContainer";
import consensus_dict from '../utils/consensus_dict';

const Sentiments = (props) => {
  const [data, setData] = useState({});
  const ticker = props.symbol;
  console.log(ticker)
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
        .then((output) => {
         const parsedResponse = JSON.parse(output.body);
         console.log(parsedResponse);
         let new_data = parsedResponse.message;
         new_data = new_data
            .replace(/'/g, '"')         
            .replace(/\bNone\b/g, "null")
            .replace(/'\b-'\b/g, "null");
         const finalData = JSON.parse(new_data); 
         console.log(finalData);
        setData(finalData[0]); 
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });            
    }
  }, [ticker]);

  return (
    <div style={{ overflowX: "hidden", overflowY: "scroll", height: "600px" }}>
        <Text style={{ marginLeft: "10px", fontWeight:'bold' }} fontSize="4xl" mb={4}>
          Sentiments
        </Text>
        <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
                <SentimentContainer name="Retail"   consensus={ consensus_dict.bloggerConsensus[data?.bloggerConsensus] } bullishScore={Math.round(data?.bloggerBullishSentiment * 100)}/>
                <SentimentContainer name="Investors"  consensus={ consensus_dict.investorSentiment[data?.investorSentiment] }/>
                <SentimentContainer name="News media" consensus={ consensus_dict.newsSentiment[data?.newsSentiment] } bullishScore={Math.round(data?.newsSentimentsBullishPercent * 100)} />          
        </div>
        <div style={{display:'flex',flexDirection:'column', width: "100%",height: "200px", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "10px", margin: "8px 4px", alignItems:'center'}}>
          <Text fontSize="2xl" mb={4} mt={4} style={{ width: "100%", textAlign: "center", fontWeight: "bold" }} >Smart Score</Text> 
          <div style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
            <div style={{width: '80%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden', marginTop: '10px' }}>
              <div
                style={{
                  width: `${data.smartScore / 10.0 * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, red, orange, gold, green)',
                  borderRadius: '10px 0 0 10px',
                }}
                />
            </div>
            <Text  ml={4} fontSize="3xl" style={{fontWeight:'bold'}}>{data.smartScore}</Text>
          </div> 

        </div>
    </div>
  );
};

export default Sentiments;
