import React from 'react';
import { Spinner, Flex } from '@chakra-ui/react';

const LoadingSpinner = () => {
    return (
        <Flex 
            justify="center" 
            align="center" 
            height="20px" 
        >
            <Spinner 
                size="lg"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
            />
        </Flex>
    );
};

export default LoadingSpinner;
