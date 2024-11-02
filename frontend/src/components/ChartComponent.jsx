// import { createChart, ColorType, PriceScaleMode } from "lightweight-charts";
// import React, { useContext, useEffect, useRef, useState } from "react";
// import { Stack, Box, Checkbox, VStack, Select } from "@chakra-ui/react";
// import { ChannelsDataContext } from "../contexts/ChannelsContext";

// export const ChartComponent = ({ height, width, events }) => {
//   const { tickers, availableChannels, colors } =
//     useContext(ChannelsDataContext);

//   const data = tickers.map((ticker) => ({
//     ticker,
//     data: events
//       .filter((event) => event.symbol === ticker)
//       .map((event) => ({ time: event.timestamp, value: event.price })),
//     color: colors[ticker],
//     title: ticker,
//   }));

//   const chartContainerRef = useRef();
//   const chartRef = useRef(null);
//   const existingSeriesRef = useRef(new Map());

//   // State to track visibility of each series
//   const [visibleSeries, setVisibleSeries] = useState(
//     tickers.reduce((acc, ticker) => {
//       acc[ticker] = true; // Initially, all series are visible
//       return acc;
//     }, {})
//   );

//   // State for selected tickers for dropdown
//   const [selectedTickers, setSelectedTickers] = useState([]);

//   useEffect(() => {
//     if (!chartRef.current) {
//       chartRef.current = createChart(chartContainerRef.current, {
//         layout: {
//           background: { type: ColorType.Solid, color: "transparent" },
//           textColor: "black",
//         },
//         width,
//         height,
//         timeScale: {
//           tickMarkFormatter: (time) => {
//             const date = new Date(time * 1000);
//             return date.toLocaleString();
//           },
//         },
//       });
//       chartRef.current.timeScale().fitContent();
//     }

//     return () => {
//       if (chartRef.current) {
//         chartRef.current.remove();
//         chartRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (chartRef.current) {
//       chartRef.current.applyOptions({ width, height });
//     }
//   }, [width, height]);

//   useEffect(() => {
//     const chart = chartRef.current;
//     if (!chart) return;

//     // Remove invisible series
//     existingSeriesRef.current.forEach((series, title) => {
//       if (!visibleSeries[title]) {
//         chart.removeSeries(series);
//         existingSeriesRef.current.delete(title);
//       }
//     });

//     data.forEach((serie) => {
//       if (!visibleSeries[serie.title]) return; // Skip if series is not visible

//       let series = existingSeriesRef.current.get(serie.title);

//       if (!series) {
//         series = chart.addLineSeries({
//           color: serie.color,
//           title: serie.title,
//         });
//         series.priceScale().applyOptions({
//           mode: PriceScaleMode.Percentage,
//         });
//         existingSeriesRef.current.set(serie.title, series);
//       }
//       series.setData(serie.data);
//     });
//   }, [events, data, visibleSeries]);

//   // Handler for series visibility changes based on selected tickers
//   const handleVisibilityChange = (ticker) => {
//     setVisibleSeries((prev) => ({
//       ...prev,
//       [ticker]: !prev[ticker],
//     }));
//   };

//   // Handler for dropdown selection change
//   const handleSelectChange = (event) => {
//     const selectedOptions = Array.from(event.target.selectedOptions).map(
//       (option) => option.value
//     );
//     setSelectedTickers(selectedOptions);

//     // Update visibility based on selected tickers
//     const updatedVisibility = tickers.reduce((acc, ticker) => {
//       acc[ticker] = selectedOptions.includes(ticker);
//       return acc;
//     }, {});
//     setVisibleSeries(updatedVisibility);
//   };

//   return (
//     <Stack direction="row">
//       <div
//         style={{ maxHeight: height, maxWidth: width }}
//         ref={chartContainerRef}
//       />
//       <Box
//         width="250px"
//         height={100}
//         padding="10px"
//         borderWidth={1}
//         borderRadius="md"
//         overflow="hidden"
//       >
//         <Select
//           placeholder="Select series..."
//           multiple
//           value={selectedTickers}
//           onChange={handleSelectChange}
//           mb={3}
//         >
//           {tickers.map((ticker) => (
//             <option key={ticker} value={ticker}>
//               {ticker}
//             </option>
//           ))}
//         </Select>
//       </Box>
//     </Stack>
//   );
// };

import { createChart, ColorType, PriceScaleMode } from "lightweight-charts";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  VStack,
  Checkbox,
  ModalFooter,
} from "@chakra-ui/react";
import { ChannelsDataContext } from "../contexts/ChannelsContext";

export const ChartComponent = ({ height, width, events }) => {
  const { tickers, colors } = useContext(ChannelsDataContext);
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const existingSeriesRef = useRef(new Map());

  // State to track visibility of each series
  const [visibleSeries, setVisibleSeries] = useState({});

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize selectedTickers to include all tickers by default
  const [selectedTickers, setSelectedTickers] = useState([]);

  useEffect(() => {
    // Log tickers to check if they are populated
    console.log('tickers: ', tickers);
    
    if (tickers.length > 0) {
      const initialVisibleSeries = tickers.reduce((acc, ticker) => {
        acc[ticker] = true; // All series are visible by default
        return acc;
      }, {});
      setVisibleSeries(initialVisibleSeries);
      setSelectedTickers(tickers); // Initialize selectedTickers with all tickers
    }
  }, [tickers]); // Run this effect when tickers changes

  console.log('visible: ', visibleSeries);

  useEffect(() => {
    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "black",
        },
        width,
        height,
        timeScale: {
          tickMarkFormatter: (time) => {
            const date = new Date(time * 1000);
            return date.toLocaleString();
          },
        },
      });
      chartRef.current.timeScale().fitContent();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({ width, height });
    }
  }, [width, height]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // Remove invisible series
    existingSeriesRef.current.forEach((series, title) => {
      if (!visibleSeries[title]) {
        chart.removeSeries(series);
        existingSeriesRef.current.delete(title);
      }
    });

    const data = tickers.map((ticker) => ({
      ticker,
      data: events
        .filter((event) => event.symbol === ticker)
        .map((event) => ({ time: event.timestamp, value: event.price })),
      color: colors[ticker],
      title: ticker,
    }));

    data.forEach((serie) => {
      if (!visibleSeries[serie.title]) return; // Skip if series is not visible

      let series = existingSeriesRef.current.get(serie.title);

      if (!series) {
        series = chart.addLineSeries({
          color: serie.color,
          title: serie.title,
        });
        series.priceScale().applyOptions({
          mode: PriceScaleMode.Percentage,
        });
        existingSeriesRef.current.set(serie.title, series);
      }
      series.setData(serie.data);
    });
  }, [events, tickers, visibleSeries]); // Ensure to listen to tickers

  // Handler to open modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Handler to close modal
  const closeModal = () => {
    setIsOpen(false);
  };

  // Handler for search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handler for checkbox change
  const handleCheckboxChange = (ticker) => {
    setSelectedTickers((prev) => {
      if (prev.includes(ticker)) {
        return prev.filter((t) => t !== ticker);
      } else {
        return [...prev, ticker];
      }
    });
  };

  // Apply visibility changes when modal is closed
  const handleApplyFilter = () => {
    const updatedVisibility = tickers.reduce((acc, ticker) => {
      acc[ticker] = selectedTickers.includes(ticker);
      return acc;
    }, {});
    setVisibleSeries(updatedVisibility);
    closeModal();
  };

  return (
    <Stack direction="row">
      <Button onClick={openModal}>Filter</Button>

      {/* Modal for searching and selecting tickers */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent height={"60vh"}>
          <ModalHeader>Filter Series</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Search tickers..."
              value={searchQuery}
              onChange={handleSearchChange}
              mb={3}
            />
            <VStack
              h={"35vh"}
              align="start"
              spacing={2}
              overflowY={"scroll"}
              overflowX={"hidden"}
            >
              {tickers
                .filter((ticker) =>
                  ticker.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((ticker) => (
                  <Checkbox
                    key={ticker}
                    isChecked={selectedTickers.includes(ticker)}
                    onChange={() => handleCheckboxChange(ticker)}
                  >
                    {ticker}
                  </Checkbox>
                ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleApplyFilter}>
              Apply
            </Button>
            <Button onClick={closeModal} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div
        style={{ maxHeight: height, maxWidth: width }}
        ref={chartContainerRef}
      />
    </Stack>
  );
};
