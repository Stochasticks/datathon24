import { Flex, Text, Box } from "@chakra-ui/react";

const PromptExamples = ({ handleClick }) => {
  const examples = [
    "Give me a resume of the 2023 annual report for CN.",
    "Resume this balance sheet.",
    "Resume this income statement.",
  ];
  return (
    <Flex
      alignItems="center"
      direction="column"
      p={5}
      bg="gray.50"
      borderRadius="md"
      shadow="sm"
    >
      <Text fontSize="lg" mb={4} color="gray.700" fontWeight="bold">
        Here are a few examples of how OpenTicks can help you:
      </Text>

      {examples.map((example, index) => {
        return (
          <Box
            as="button"
            p={3}
            mb={2}
            width="100%"
            maxW="400px"
            bg="teal.100"
            borderRadius="md"
            fontWeight="medium"
            color="teal.700"
            textAlign="center"
            _hover={{
              bg: "teal.200",
              transform: "scale(1.05)",
              transition: "all 0.2s ease-in-out",
            }}
            onClick={() => handleClick(example)}
          >
            {example}
          </Box>
        );
      })}
    </Flex>
  );
};

export default PromptExamples;
