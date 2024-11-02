import {
  Button,
  HStack,
  MoonIcon,
  SunIcon,
  Text,
  useColorMode,
} from "@chakra-ui/icons";
import React from "react";

const DashboardSectionHeader = ({title}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack width={"100%"} justifyContent={"space-between"}>
      <Text fontSize="2xl" mb="4">
        {title}
      </Text>
      <div style={{ display: "flex", gap: "24px" }}>
        <Button onClick={toggleColorMode} alignSelf={"center"}>
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Button
          as={"a"}
          fontSize={"sm"}
          fontWeight={400}
          variant={"link"}
          href={"#"}
        >
          Sign Out
        </Button>
      </div>
    </HStack>
  );
};

export default DashboardSectionHeader;
