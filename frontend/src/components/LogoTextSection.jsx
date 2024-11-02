'use client'

import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'

export default function LogoTextSection(props) {
  const { title, children, color, height, width } = props;
  return (
    <>
      <Container 
        maxW={width} 
        height={height} 
        bg={useColorModeValue(color ?? 'green.50', '#1a202c')} 
        marginLeft={0} 
        marginRight={0}
        shadow={'lg'}
        rounded={'md'}
      >
        <Box 
          textAlign="center" 
          py={4} 
          px={6}
          // boxShadow={'2xl'}
          // rounded={'md'}
        >
          <Heading as="h4" size="sm" mt={6} mb={2}>
            {title}
          </Heading>
          {children}
        </Box>
      </Container>
    </>
  )
}
// <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
