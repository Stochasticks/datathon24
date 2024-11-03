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

const ChatsPage = () => {
  const [files, setFiles] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabs, setTabs] = useState([
    { chatId: "", files: [], messages: [], question: "" },
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [tabs[tabIndex]?.messages]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setTabs((prevTabs) => {
      const newTabs = [...prevTabs];
      newTabs[tabIndex].files = selectedFiles;
      return newTabs;
    });
  };

  const handleFileUpload = async () => {
    const currentTab = tabs[tabIndex];
    if (currentTab.files.length === 0) {
      alert("Please select files to upload.");
      return;
    }
    setUploading(true);
    setUploadMessage("");
    const formData = new FormData();
    for (const file of currentTab.files) {
      formData.append("files", file);
    }

    try {
      const response = await fetch("http://localhost:8501/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setTabs((prevTabs) => {
          const newTabs = [...prevTabs];
          newTabs[tabIndex].chatId = data.chat_id;
          return newTabs;
        });
        setUploadMessage("Files successfully uploaded, how can I help you?");
      } else {
        setUploadMessage(`Upload error: ${data.error}`);
      }
    } catch (error) {
      setUploadMessage(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
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
    const currentTab = tabs[tabIndex];
    if (!currentTab.chatId || !currentTab.question) {
      alert("Please upload files and enter a question.");
      return;
    }

    setChatMessage("");
    try {
      const tempQuestion = currentTab.question;
      setTabs((prevTabs) => {
        const newTabs = [...prevTabs];
        newTabs[tabIndex].question = ""; // Clear the question input
        return newTabs;
      });

      const response = await fetch("http://localhost:8501/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: currentTab.chatId,
          question: tempQuestion,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTabs((prevTabs) => {
          const newTabs = [...prevTabs];
          newTabs[tabIndex] = {
            ...newTabs[tabIndex],
            messages: [
              ...newTabs[tabIndex].messages,
              { question: tempQuestion, response: data.response },
            ],
          };
          return newTabs;
        });
        setChatMessage("Query processed successfully!");
      } else {
        setChatMessage(`Chat error: ${data.error}`);
      }
    } catch (error) {
      setChatMessage(`Chat failed: ${error.message}`);
    }
  };

  const addTab = () => {
    if (tabs.length < 5) {
      setTabs([...tabs, { chatId: "", files: [], messages: [], question: "" }]);
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
            <TabPanel className="panel" key={index}  height={'400px'} overflowY={'scroll'} overflowX={'hidden'}>
              {/* File Upload Section */}
              <Box mb={4}>
                {tab.files.length > 0 ? (
                  <VStack align="stretch" spacing={2}>
                    <Text fontWeight="bold">Uploaded Files:</Text>
                    {tab.files.map((file, i) => (
                      <Box
                        key={i}
                        p={2}
                        bg="gray.100"
                        borderRadius="md"
                        boxShadow="sm"
                      >
                        {file.name}
                      </Box>
                    ))}
                    <Button
                      onClick={handleFileUpload}
                      disabled={uploading}
                      mt={2}
                    >
                      {uploading ? "Uploading..." : "Upload Files"}
                    </Button>
                  </VStack>
                ) : (
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
                      multiple
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
                      <Text mt={2}>Upload a file</Text>
                    </Box>
                  </Box>
                )}
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
                        <Text>{msg.question}</Text>
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
                        <Text>{msg.response || "No response yet"}</Text>
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
          <Input
            value={tabs[tabIndex].question}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value !== "") {
                handleChat();
              }
            }}
            onChange={handleQuestionChange}
            placeholder="Type your question here..."
            borderRadius="md 0 0 md"
            mb={0}
          />
          <Button
            onClick={handleChat}
            borderRadius="0 md md 0"
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
          >
            <Icon as={FiSend} />
          </Button>
        </HStack>
      </Box>
    </Container>
  );
};

export default ChatsPage;
