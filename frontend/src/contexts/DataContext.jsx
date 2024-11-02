// DataContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

// Create the context
const DataContext = createContext();

// Reducer to manage state updates
const dataReducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, [action.key]: action.data };
    default:
      return state;
  }
};

// Provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, {});

  // Function to fetch and store data
  const fetchData = async (key, url) => {
    console.log('url: ', url);
    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            console.log('resp: ', response)
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Log the raw response to debug
        const contentType = response.headers.get("content-type");
        console.log("Response Content-Type:", contentType);

        // Check if the response is JSON, otherwise fall back to text
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
            if (data.body) {
                data = JSON.parse(data.body)
            }
        } else {
            data = await response.text(); // For debugging non-JSON responses
        }

        console.log('response data:', data);
        dispatch({ type: "SET_DATA", key, data });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};


  return (
    <DataContext.Provider value={{ state, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for using data context
export const useDataContext = () => {
  return useContext(DataContext);
};
