import React, { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";

const SentimentContainer = (props) => {
  if (props.consensus == null) return null;
  return (
        <div
                style={{
                width: "300px",
                height: "300px",
                backgroundColor: "rgba(255,255,255,0.5)",
                borderRadius: "10px",
                margin: "0 4px"}}
        >
                  <Text fontSize="2xl" mb={4} mt={4} style={{ width: "100%", textAlign: "center", fontWeight: "bold" }} >{props.name}</Text>  
                  <div style={{display:'flex',flexDirection:'column', width:"100%", justifyContent:'center',alignItems:"center", alignContent:"center"}}>
                    <Text style={{textAlign: "center", fontWeight:"bold"}}>Consensus</Text>
                    <div style={{display: "flex", width: "100px",height: "100px",backgroundColor: props.consensus.color, borderRadius: "50%", justifyContent:'center', alignItems:'center'}}>
                      <Text color={'white'} style={{fontWeight:"bold", fontSize:"14px"}}>{props.consensus.label}</Text>
                    </div>
                  </div>
                <div style={{height:'8px'}}/>
                {
                  props.bullishScore > 0 ? (
                    <div>
                      <Text style={{ textAlign: "center", fontWeight: "bold" }}>Percentage bullish</Text>
                      <Text style={{ fontSize: "30px", fontWeight: "bold", textAlign: "center" }}>
                        {props.bullishScore}
                      </Text>
                    </div>
                  ) : null
                }
      </div>
  );
};

export default SentimentContainer;
