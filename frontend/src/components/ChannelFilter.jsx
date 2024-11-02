import React, { useEffect } from 'react';
import { Button, Checkbox, Grid, GridItem, HStack, Box, Tag } from '@chakra-ui/react';
import { MdDelete } from "react-icons/md";

function ChannelFilter({ direction, channels, colors, channelFunction, removeFilter }) {
    

    useEffect(() => {
        console.log('colors: ', colors)
        console.log('channels: ', channels)
    }, [colors])

    return (
        <div style={{ display: 'flex', gap: '24px' }}>
            <br />
            {/* <Grid 
        templateColumns="repeat(3, 1fr)" 
        gap={4} 
        alignItems="center"
      > */}
            {channels.map((channel, index) => (
                <Tag variant={'outline'} padding={'4px 4px'} key={channel} width={'fit-content'}>
                    <HStack direction="row" >
                        <Checkbox
                            size='lg'
                            sx={{
                                ".chakra-checkbox__control": {
                                    _checked: {
                                        bg: colors[channel], // Apply the RGB color as background
                                        borderColor: colors[channel], // Apply the RGB color as border color
                                    },
                                },
                            }}
                            defaultChecked
                            onChange={($event) => channelFunction(channel, $event.target.checked)}
                        >
                            {channel}
                        </Checkbox>
                        <MdDelete
                            size={16}
                            onClick={() => removeFilter(channel)}
                            style={{ cursor: "pointer" }}
                        />
                    </HStack>
                </Tag>
            ))}
            {/* </Grid> */}
        </div>
    );
}

export default ChannelFilter;
