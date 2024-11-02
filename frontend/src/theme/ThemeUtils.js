import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    styles: {
        global: (props) => ({
            "::-webkit-scrollbar": {
                width: "8px",
                height: "8px"
            },
            "::-webkit-scrollbar-track": {
                background: props.colorMode === "dark" ? "gray.800" : "gray.200",
            },
            "::-webkit-scrollbar-thumb": {
                background: props.colorMode === "dark" ? "gray.600" : "gray.400",
                borderRadius: "10px",
            },
            "::-webkit-scrollbar-thumb:hover": {
                background: props.colorMode === "dark" ? "gray.600" : "gray.500",
            },
        }),
    },
});