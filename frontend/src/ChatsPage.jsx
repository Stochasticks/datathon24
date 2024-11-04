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
import { useDataContext } from "./contexts/DataContext";

const ChatsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [tabs, setTabs] = useState(() => {
    // Load tabs from local storage if available
    const savedTabs = localStorage.getItem("tabs");
    return savedTabs
      ? JSON.parse(savedTabs)
      : [
          {
            chatId: crypto.randomUUID().replace(/-/g, ""),
            messages: [],
            question: "",
            file: null,
          },
        ];
  });
  const [uploadMessage, setUploadMessage] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sentContext, setSentContext] = useState(false);

  const { state } = useDataContext();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [tabs[tabIndex]?.messages]);

  // Save tabs to local storage when they change
  useEffect(() => {
    localStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs]);

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

  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const handleChat = async () => {
    setLoading(true);
    const currentTab = tabs[tabIndex];

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
      requestPayload.files = arrayBufferToBase64(fileArrayBuffer); // Convert to array for JSON serialization
    } else if (!sentContext) {
      const contextInfo = `
        my question is this: ${requestPayload.question},
        use this data as context if needed:
        balance sheet: ${state.balanceSheet} 
        income statement: ${state.incomeStatement}
        cash flow: ${state.cashFlowStatement}
        ratios: ${state.ratios}
      `;
      requestPayload.question = contextInfo;
    }

    try {
      const response = await fetch(environment.chatURL + "/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload), // Send the JSON payload
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage = data.response.output_text;

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
          } else {
            console.log("Duplicate message not added.");
          }

          // Clear question input and file
          newTabs[tabIndex].question = ""; // Clear the question input
          newTabs[tabIndex].file = null; // Clear the uploaded file after sending
          setSelectedFile(null); // Clear the selected file in state
          setLoading(false);
          if (
            !sentContext &&
            requestPayload.question.includes("balance sheet:")
          ) {
            setSentContext(true);
          }
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

  const handleTabFile = () => {
    const el = document.querySelector("#file-upload-button");
    if (el && el.type === "file") {
      el.value = ""; // Clear the file input
    } else {
      console.error("Element not found or not a file input");
    }
    setSelectedFile(null);
  };

  const addTab = () => {
    if (tabs.length < 5) {
      const sessionId = crypto.randomUUID().replace(/-/g, "");
      setTabs([
        ...tabs,
        { chatId: sessionId, messages: [], question: "", file: null },
      ]);
      setTabIndex(tabs.length);
      handleTabFile();
    }
  };

  const removeTab = (index) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter((_, i) => i !== index);
      setTabs(newTabs);
      setTabIndex(index === 0 ? 0 : index - 1);
      handleTabFile();
    }
  };

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
                        <Text whiteSpace={"pre-line"}>
                          {msg.response || "No response yet"}
                        </Text>{" "}
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
      {/* File name display area */}
      {selectedFile && (
        <Box
          bg="gray.100"
          borderRadius="md"
          p={2}
          mb={3}
          textAlign="center"
          border="1px solid gray"
        >
          {selectedFile.name}
        </Box>
      )}
      {/* Input Area */}
      <Box as="footer" mt="auto" p={3} borderTop="1px solid gray">
        <HStack spacing={3}>
          {loading ? <LoadingSpinner /> : null}

          {/* File Upload Area */}
          <Button colorScheme="blue" variant={"outline"}>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.json,.csv, xlsx" // Allow all file types
              position="absolute"
              id="file-upload-button"
              top="0"
              left="0"
              opacity="0"
              cursor="pointer"
              onChange={handleFileChange}
            />
            <Box textAlign="center">
              <Icon as={FiUpload} boxSize={8} />
            </Box>
          </Button>
          <Input
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value !== "" && !loading) {
                handleChat();
                e.target.value = "";
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
        {uploadMessage && <Text mt={2}>{uploadMessage}</Text>}
      </Box>
    </Container>
  );
};

export default ChatsPage;
