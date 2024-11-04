import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";
import Dashboard from "./components/Dashboard";
import { DataProvider } from "./contexts/DataContext";


const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ChakraProvider>
                <DataProvider>
                  <Dashboard />
                </DataProvider>
              </ChakraProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};
const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
