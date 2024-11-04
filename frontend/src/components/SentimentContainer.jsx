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
                  <Text fontSize="1.5xl" mb={4} mt={4} style={{ width: "100%", textAlign: "center", fontWeight: "500" }} >{props.name}</Text>   
                  <Text style={{ width: "100%", textAlign: "center" }}><span style={{fontWeight:"bold"}}>Consensus :</span> <span style={{fontWeight:"500",color:props.consensus.color}}>{props.consensus.label}</span></Text>
                <div>
                        
                </div>            
      </div>
  );
};

export default SentimentContainer;
