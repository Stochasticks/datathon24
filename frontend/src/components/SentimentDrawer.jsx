import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,
    Text,
    Divider
} from '@chakra-ui/react'
import React, { useEffect, useState, useRef } from "react";

const SentimentDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()
  
    return (
      <>
        <Button ref={btnRef} colorScheme='gray' onClick={onOpen}  mt={8}>
          How is this score calculated?
        </Button>
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Calculating sentiment</DrawerHeader>
  
            <DrawerBody>
              <Text fontSize={"1xm"} fontWeight={"bold"} color="teal.500">Contributing factors</Text>
              <Text> Data is scraped from the web to create a sentiment score. For each source of data, we perform sentiment analysis using NLP strategies.</Text>
              <Divider mt={4} mb={4} orientation='horizontal' />
              <Text fontSize={"1xm"} fontWeight={"bold"} color="teal.500">Retail sentiment</Text>
              <Text> We scrape forums and spaces where retail investors discuss, such as <span style={{fontWeight:"bold"}}>Reddit</span> and <span style={{fontWeight:"bold"}}>wallstreetbets</span>.</Text>
              <Divider mt={4} mb={4} orientation='horizontal' />
              <Text fontSize={"1xm"} fontWeight={"bold"} color="teal.500">News sentiment</Text>
              <Text> We look at articles that mention the ticker and scrape the contents of the pages to perform sentiment analysis. News websites like CNBC, Bloomberg and Wall Street Journal. Since many of these websites have paywalls, we use Wayback machine to access their articles.</Text>
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
}


export default SentimentDrawer;