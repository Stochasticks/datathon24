import React, { useState, createContext, useEffect } from "react";
import { Manager } from 'socket.io-client';
import { environment } from "../environments/environment";
import axios from "axios";

export const ChannelsDataContext = createContext();

export function UseChannelsDataContext({ children }) {

  const [selectedChannels, setSelectedChannels] = useState([]);
  const [availableChannels, setAvailableChannels] = useState([]);
  const [colors, setColors] = useState([]);
  const [tickers, setTickers] = useState([]);

  const [socketDictionary, setSocketDictionary] = useState({
    'lineSocket': new Manager(environment.lineSocketUrl).socket("/", {
      transports: ["websocket"],
      secure: true
    }),
    'cosineSocket': new Manager(environment.cosineSocketUrl).socket("/", {
      transports: ["websocket"],
      secure: true
    }),
    'tsneSocket': new Manager(environment.tsneSocketUrl).socket("/", {
      transports: ["websocket"],
      secure: true
    }),
  });
  
  function getColor(index, total) {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
  }

  const calculateColors = (tickers) => {
    const total = tickers.length;
    const colorsDict = tickers.reduce((acc, tick, index) => {
      acc[tick] = getColor(index, total);
      return acc;
    }, {});
    return colorsDict;
  }

  const unSubcribeFromChannel = (ticker, subscribe) => {
    if (subscribe) {
      socketDictionary.lineSocket.emit('subscribe', { symbol: ticker });
      setTickers([...tickers, ticker]);
    } else {
      socketDictionary.lineSocket.emit('unsubscribe', { symbol: ticker });
      setTickers(tickers.filter(t => t !== ticker));
    }
  }

  const fetchAvailableTickers = async () => {
    try {
      const response = await axios.get(`http://${environment.lineSocketUrl}/api/available-tickers/`);
      setAvailableChannels(response.data);
      setSelectedChannels(response.data);
      setTickers(response.data);
      setColors(calculateColors(response.data));

      response.data.forEach(ticker => {
        socketDictionary.lineSocket.emit('subscribe', { symbol: ticker });
      });

      socketDictionary.lineSocket.emit('get-trail-data');
    } catch (error) {
      console.error("There was an error fetching the tickers:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchAvailableTickers();
  }, []);

  console.log('Tickers', tickers)

  return (
    <ChannelsDataContext.Provider value={{ socketDictionary, availableChannels, selectedChannels, colors, tickers, unSubcribeFromChannel, setSelectedChannels }}>
      {children}
    </ChannelsDataContext.Provider>
  );
}
