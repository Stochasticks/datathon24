import {
  Button,
  Container,
  Heading,
  Input,
  Box,
  Text,
  Icon,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  CloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiSend } from "react-icons/fi";
import { environment } from "./environments/environment";
import LoadingSpinner from "./components/LoadingSpinner";

const ChatsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [tabs, setTabs] = useState([
    { chatId: "", messages: [], question: "", file: null },
  ]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [tabs[tabIndex]?.messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Only one file for simplicity
    if (file) {
      setSelectedFile(file);
      setTabs((prevTabs) => {
        const newTabs = [...prevTabs];
        newTabs[tabIndex].file = file; // Store the file in the current tab
        return newTabs;
      });
    }
  };

  const handleQuestionChange = (e) => {
    const newQuestion = e.target.value;
    setTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      newTabs[tabIndex].question = newQuestion;
      return newTabs;
    });
  };

  const handleChat = async () => {
    console.log("entered ");
    setLoading(true);
    const currentTab = tabs[tabIndex];

    // Check for necessary inputs
    // if (!currentTab.chatId || !currentTab.question) {
    //     alert("Please upload a file and enter a question.");
    //     return;
    // }

    // Prepare the request payload
    const requestPayload = {
      chat_id: currentTab.chatId,
      question: currentTab.question,
      file_name: currentTab?.file?.name,
      files: null, // Placeholder for file data
    };

    // Read the file as an ArrayBuffer if it exists
    if (currentTab.file) {
      const fileArrayBuffer = await currentTab.file.arrayBuffer();
      requestPayload.files = Array.from(new Uint8Array(fileArrayBuffer)); // Convert to array for JSON serialization
    }

    try {
      const response = await fetch(environment.chatURL + "/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the appropriate content type
        },
        body: JSON.stringify(requestPayload), // Send the JSON payload
      });

      const data = await response.json();

      if (response.ok) {
        // Extracting the assistant's response
        const assistantMessage = data.response.output.message.content[0].text;
        console.log("Assistant message: ", assistantMessage);

        setTabs((prevTabs) => {
          const newTabs = [...prevTabs];

          if (currentTab.question.trim() === "") {
            console.log("Empty question; not adding message.");
            return newTabs; // No updates, just return the current state
          }

          // Check for duplicate messages
          const messageExists = newTabs[tabIndex].messages.some(
            (msg) =>
              msg.question === currentTab.question &&
              msg.response === assistantMessage
          );

          if (!messageExists) {
            newTabs[tabIndex].messages.push({
              question: currentTab.question,
              response: assistantMessage,
            });
            console.log("new input: ", {
              question: currentTab.question,
              response: assistantMessage,
            });
          } else {
            console.log("Duplicate message not added.");
          }

          // Clear question input and file
          newTabs[tabIndex].question = ""; // Clear the question input
          newTabs[tabIndex].file = null; // Clear the uploaded file after sending
          setSelectedFile(null); // Clear the selected file in state
          setLoading(false);
          return newTabs;
        });

        setChatMessage("Query processed successfully!");
      } else {
        setChatMessage(`Chat error: ${data.error}`);
      }
    } catch (error) {
      setChatMessage(`Chat failed: ${error.message}`);
    }
    setLoading(false);
  };

  const addTab = () => {
    if (tabs.length < 5) {
      setTabs([
        ...tabs,
        { chatId: "", messages: [], question: "", file: null },
      ]);
      setTabIndex(tabs.length);
    }
  };

  const removeTab = (index) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter((_, i) => i !== index);
      setTabs(newTabs);
      setTabIndex(index === 0 ? 0 : index - 1);
    }
  };

  useEffect(() => {
    console.log("messages: ", tabs[tabIndex].messages);
  }, [tabs[tabIndex].messages.length]);

  return (
    <Container
      display="flex"
      flexDirection="column"
      height="70vh"
      width={"80vw"}
      maxW="container.lg"
      backgroundColor={useColorModeValue("white", "gray.800")}
    >
      <Heading as="h1" textAlign="center" mb={4}>
        How can I help you?
      </Heading>

      <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" isFitted>
        <TabList>
          {tabs.map((tab, index) => (
            <HStack key={index} spacing={1}>
              <Tab>Chat # {index + 1}</Tab>
              {tabs.length > 1 && (
                <CloseButton onClick={() => removeTab(index)} />
              )}
            </HStack>
          ))}
          {tabs.length < 5 && (
            <Button onClick={addTab} ml={2}>
              + New Chat
            </Button>
          )}
        </TabList>

        <TabPanels flex="1" overflowY="auto" mb={4}>
          {tabs.map((tab, index) => (
            <TabPanel
              className="panel"
              key={index}
              height={"400px"}
              overflowY={"scroll"}
              overflowX={"hidden"}
            >
              {/* File Upload Section */}
              <Box mb={4}>
                <Box
                  border="2px dashed gray"
                  height="150px"
                  width="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  borderRadius="md"
                  cursor="pointer"
                >
                  <Input
                    type="file"
                    accept="*/*" // Allow all file types
                    height="100%"
                    width="100%"
                    position="absolute"
                    top="0"
                    left="0"
                    opacity="0"
                    cursor="pointer"
                    onChange={handleFileChange}
                  />
                  <Box textAlign="center">
                    <Icon as={FiUpload} boxSize={8} />
                    <Text mt={2}>
                      {selectedFile ? selectedFile.name : "Upload a file"}
                    </Text>
                  </Box>
                </Box>
                {uploadMessage && <Text mt={2}>{uploadMessage}</Text>}
              </Box>

              {/* Chat Messages Section */}
              <Box flex="1" overflowY="auto" mb={4}>
                <VStack align="stretch" spacing={3}>
                  {tab.messages.map((msg, i) => (
                    <Box key={i}>
                      <Box
                        alignSelf="flex-end"
                        bg="blue.100"
                        p={3}
                        borderRadius="md"
                        maxW="70%"
                        ml="auto"
                      >
                        <Text fontWeight="bold">You:</Text>
                        <Text>{msg.question}</Text>{" "}
                        {/* This should correctly display the question */}
                      </Box>
                      <Box
                        alignSelf="left"
                        p={3}
                        borderRadius="md"
                        maxW="70%"
                        textAlign="left"
                        mt={2}
                      >
                        <Text fontWeight="bold">Response:</Text>
                        <Text whiteSpace={'pre-line'}>{msg.response || "No response yet"}</Text>{" "}
                        {/* Ensure response shows correctly */}
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </VStack>
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {chatMessage && <Text mt={2}>{chatMessage}</Text>}

      {/* Input Area */}
      <Box as="footer" mt="auto" p={3} borderTop="1px solid gray">
        <HStack spacing={0}>
        {loading ? <LoadingSpinner /> : null}
          <Input
            // value={tabs[tabIndex].question}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value !== "" && !loading) {
                handleChat();
                e.target.value = ""
              }
            }}
            onChange={handleQuestionChange}
            placeholder="Type your question here..."
            borderRadius="md 0 0 md"
            mb={0}
          />
          <Button
            colorScheme="blue"
            onClick={handleChat}
            borderRadius="0 md md 0"
            disabled={loading}
          >
            <Icon as={FiSend} />
          </Button>
        </HStack>
      </Box>
    </Container>
  );
};

export default ChatsPage;
