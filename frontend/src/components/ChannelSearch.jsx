import React, { useEffect, useState, useRef } from 'react';
import { Input, Container, Badge, Stack, Card, Tag } from '@chakra-ui/react';

const ChannelSearch = ({ availableChannels, channels, colors, clickFunction }) => {
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(0);


  useEffect(() => {
    setResults(availableChannels);
  }, [availableChannels]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSearching(false);
      }
    };

    if (inputRef.current) {
      const elementHeight = inputRef.current.clientHeight;
      setInputHeight(elementHeight);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchChannel = (query) => {
    console.log("query: ", query);
    let result = availableChannels.filter(ticker =>
      ticker.toLowerCase().includes(query.toLowerCase())
    );
    setResults(result);
  };

  const isSearching = () => {
    setSearching(true);
  };

  return (
    <Container ref={containerRef} centerContent>
      <Input
        ref={inputRef}
        onFocus={isSearching}
        onChange={($event) => searchChannel($event.target.value)}
        placeholder='Search for a ticker'
        size='md'
        width={280}
      />
      {searching && (
        <Card zIndex={9999} position={"absolute"} top={inputHeight * 2.5}  width={280} height={300} alignItems={"center"}>
          <Stack spacing={3} padding={3} overflowY={'auto'}>
            {results.map((result, index) => (
              <Tag
                key={index}
                disabled={channels.includes(result)}
                _disabled={{ opacity: 0.6, cursor: "not-allowed"}}
                sx={{
                //   bg: colors[availableChannels.indexOf(result)],
                  border: '1px solid',
                  borderColor: colors[result],
                }}
                variant={"outline"}
                width={200}
                borderRadius='full'
                cursor='pointer'
                onClick={() => clickFunction(result)}
              >
                {result}
              </Tag>
            ))}
          </Stack>
        </Card>
      )}
    </Container>
  );
};

export default ChannelSearch;
