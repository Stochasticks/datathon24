const tipranksEnumDictionary = {
  investorSentiment: {
    "Neutral": { label: "Neutral", color: "#FFD700" },
    "Positive": { label: "Bullish", color: "#00FF00" },
    "VeryPositive": { label: "Very Bullish", color: "#008000" },
    "Negative": { label: "Bearish", color: "#FFA500" },
    "VeryNegative": { label: "Very Bearish", color: "#FF0000" },
    "Unknown": { label: "Unknown", color: "rgb(128, 128, 128)" },
  },
  newsSentiment: {
    "VeryBullish": { label: "Very Bullish", color: "#008000" },
    "Bullish": { label: "Bullish", color: "#00FF00" },
    "Neutral": { label: "Neutral", color: "#FFD700" },
    "Bearish": { label: "Bearish", color: "#FFA500" },
    "VeryBearish": { label: "Very Bearish", color: "#FF0000" },
    "Unknown": { label: "Unknown", color: "rgb(128, 128, 128)" },
  },
  hedgeFundTrend: {
    "Increased": { label: "Hedge Fund Holdings Increased", color: "#00FF00" },
    "Decreased": { label: "Hedge Fund Holdings Decreased", color: "#FF0000" },
    "Neutral": { label: "Hedge Fund Holdings Neutral", color: "#FFD700" },
  },
  insiderTrend: {
    "BoughtShares": { label: "Insiders Bought Shares", color: "#00FF00" },
    "SoldShares": { label: "Insiders Sold Shares", color: "#FF0000" },
    "Neutral": { label: "No Significant Insider Activity", color: "#FFD700" },
    "-" :{label: "None", color:"rgb(128, 128, 128)"}
  },

  sma: {
    "Positive": { label: "Price Above Simple Moving Average (SMA)", color: "#00FF00" },
    "Negative": { label: "Price Below Simple Moving Average (SMA)", color: "#FF0000" },
  },

  analystConsensus: {
    "StrongBuy": { label: "Strong Buy", color: "#006400" },
    "ModerateBuy": { label: "Moderate Buy", color: "#00FF00" },
    "Hold": { label: "Hold", color: "#FFD700" },
    "ModerateSell": { label: "Moderate Sell", color: "#FFA500" },
    "Sell": { label: "Sell", color: "#FF0000" },
  },

  bloggerConsensus: {
    "VeryBullish": { label: "Very Bullish", color: "#008000" },
    "Bullish": { label: "Bullish", color: "#00FF00" },
    "Neutral": { label: "Neutral", color: "#FFD700" },
    "Bearish": { label: "Bearish", color: "#FFA500" },
    "VeryBearish": { label: "Very Bearish", color: "#FF0000" },
    "Unknown": { label: "Unknown", color: "rgb(128, 128, 128)" },
  },
};

export default tipranksEnumDictionary;
