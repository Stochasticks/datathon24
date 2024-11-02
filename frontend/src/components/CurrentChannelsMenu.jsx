import { Container } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import ChannelSearch from './ChannelSearch';
import { ChannelsDataContext } from '../contexts/ChannelsContext';

const CurrentChannelsMenu = ({ }) => {
  //const [selectedChannels, setSelectedChannels] = useState([]);

  const {availableChannels, selectedChannels, setSelectedChannels, colors, unSubcribeFromChannel} = useContext(ChannelsDataContext);

  const addChannel = (channel) => {
    let channels = [...selectedChannels];
    if (channels.includes(channel)) return
    channels.push(channel);
    setSelectedChannels(channels);
    //console.log("selectedChannels: ", channels); // Log the updated channels list
    unSubcribeFromChannel(channel, true);
  };

  const removeFilter = (channel) => {
    //console.log("removing: ", channel)
    let channels = selectedChannels.filter(c => c !== channel);
    setSelectedChannels(channels);
    unSubcribeFromChannel(channel, false);
  }

  useEffect(() => {
    //setSelectedChannels(availableChannels)
  }, [])

  return (
    <Container>
      <ChannelSearch availableChannels={availableChannels} channels={selectedChannels} colors={colors} clickFunction={addChannel} />
      {/* <ChannelFilter direction={['column, row']} channels={selectedChannels} channelFunction={unSubcribeFromChannel} removeFilter={removeFilter} colors={colors}/> */}
    </Container>
  );
};

export default CurrentChannelsMenu;
