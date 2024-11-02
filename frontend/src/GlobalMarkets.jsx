import React, { useContext, useEffect } from "react";
import {
  Box,
  VStack,
  Stack,
  HStack,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Wrap,
  border,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { CosineMatrix } from "./components/CosineMatrix";
import { LineGraph } from "./components/LineGraph";
import { TSNEScatter } from "./components/TSNEScatter";
import CurrentChannelsMenu from "./components/CurrentChannelsMenu";
import ConfigButton from "./components/ConfigButton";
import { FaCog, FaDownload, FaPlus } from "react-icons/fa"; // Import any icon from react-icons
import { ChannelsDataContext } from "./contexts/ChannelsContext";
import ChannelFilter from "./components/ChannelFilter";
import LogoTextSection from "./components/LogoTextSection";

const GlobalMarkets = () => {
  const {
    availableChannels,
    selectedChannels,
    setSelectedChannels,
    colors,
    unSubcribeFromChannel,
  } = useContext(ChannelsDataContext);

  const [value, setValue] = React.useState("1");

  const removeFilter = (channel) => {
    //console.log("removing: ", channel)
    let channels = selectedChannels.filter((c) => c !== channel);
    setSelectedChannels(channels);
    unSubcribeFromChannel(channel, false);
  };

  useEffect(() => {
    console.log("value: ", value);
  }, [value]);

  const configsContent = (
    <div style={{ width: "inherit" }}>
      <Accordion defaultIndex={[0]} allowMultiple allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Dashboard Layout
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <RadioGroup onChange={setValue} value={value}>
              <Stack direction="row">
                <Radio value="1">Default Layout</Radio>
                <Radio value="2">Vertical Layout</Radio>
              </Stack>
            </RadioGroup>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Section 2 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );

  const globalMarketsDownloadModal = <div style={{ width: "inherit" }}></div>;

  return (
    <VStack alignItems={"start"} padding={"0% 4%"} width={"85vw"}>
      <HStack alignItems={"flex-start"} width={"inherit"}>
        <HStack justifyContent={"flex-start"} width={"60%"}>
          <Popover>
            <PopoverTrigger>
              <Button>
                <FaPlus /> &nbsp; Add Tickers
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Look for available tickers here</PopoverHeader>
              <PopoverBody>
                <VStack
                  height={"400px"}
                  display={"flex"}
                  alignItems={"flex-start"}
                >
                  <CurrentChannelsMenu />
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Box
            boxShadow="inset 0 4px 8px rgba(0, 0, 0, 0.2)"
            borderRadius="md"
            padding="2% 2%"
            maxWidth={"60%"}
          >
            <Wrap minWidth={"100px"} overflowX={"auto"} pb="16px">
              <ChannelFilter
                direction={["row, row"]}
                channels={selectedChannels}
                channelFunction={unSubcribeFromChannel}
                removeFilter={removeFilter}
                colors={colors}
              />
            </Wrap>
          </Box>
        </HStack>
        <HStack justifyContent={"flex-end"} gap={"40px"} width={"25%"}>
          <ConfigButton
            type={"normal"}
            buttonText="Download Data"
            buttonIcon={<FaDownload />}
            modalTitle="Download Market Vectors"
            modalContent={globalMarketsDownloadModal}
            width="600px"
            height="400px"
          />
          <ConfigButton
            type={"icon-button"}
            buttonText="Open Config"
            buttonIcon={<FaCog />}
            modalTitle="Configuration Settings"
            modalContent={configsContent}
            width="600px"
            height="400px"
          />
        </HStack>
      </HStack>
      <Divider />
      <div className={value === "1" ? "def-grid" : "vert-grid"}>
        {/* <VStack
          width={"50%"}
          height={"84vh"}
          display={"flex"}
          alignItems={"flex-start"}
        >
          
        </VStack> */}

        <div className={value === "1" ? "box, fe" : "box-vert"}>
          <LogoTextSection
            height={value === "1" ? "100%" : "inherit"}
            width={value === "1" ? "50vw" : 'inherit'}
            title="Live cosine similarities"
          >
            <CosineMatrix />
          </LogoTextSection>
        </div>

        <div className={value === "1" ? "box" : "box-vert"}>
          <LogoTextSection height={value === "1" ? "100%" : "inherit"} width={value === "1" ? undefined : 'inherit'} title="Live t-SNE">
            <TSNEScatter></TSNEScatter>
          </LogoTextSection>
        </div>

        <div className={value === "1" ? "box" : "box-vert"}>
          <LogoTextSection height={value === "1" ? "100%" : "inherit"} width={value === "1" ? undefined : 'inherit'} title="Returns">
            <LineGraph></LineGraph>
          </LogoTextSection>
        </div>
    </div>
    </VStack>
  );
};

export default GlobalMarkets;
