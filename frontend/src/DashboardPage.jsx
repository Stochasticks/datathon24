import React, { useEffect, useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react';
import GlobalMarkets from './GlobalMarkets';
import './Dashboard.css'
import { theme } from './theme/ThemeUtils';

import SimpleSidebar from './components/Sidebar';

// import ChatsOpenTicks from 'openticks/ChatsOpenTicks';
import WithSubnavigation from './components/Navbar';

const DashboardPage = () => {
  const [pageContent, setPageContent] = useState(<div><h1>Test</h1></div>);

  const updateContentBasedOnHash = () => {
    const hash = window.location.hash;

    // if (hash.includes('global-markets') || hash == '') {
    //   setPageContent(<GlobalMarkets />);
    // } else {
    //   setPageContent(<div>
    //     <h1>Under Construction</h1>
    //   </div>); 
    // }
    let gMContainer = document.getElementById('global-market-container');
    // let openTicksContainer = document.getElementById('openticks-container');
    let oContainer = document.getElementById('other-container');
    if (hash.includes('global-markets') || hash == '') {
      gMContainer.style.display = 'initial';
      // openTicksContainer.style.display = 'none'
      oContainer.style.display = 'none';
    } else if (hash.includes('openticks')) {
      gMContainer.style.display = 'none';
      // openTicksContainer.style.display = 'initial'
      oContainer.style.display = 'none';
    } else {
      gMContainer.style.display = 'none';
      // openTicksContainer.style.display = 'none'
      oContainer.style.display = 'initial';
    }
  };

  useEffect(() => {
    updateContentBasedOnHash();

    window.addEventListener('hashchange', updateContentBasedOnHash);

    return () => {
      window.removeEventListener('hashchange', updateContentBasedOnHash);
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
        <div className='App Dashboard'>
          <WithSubnavigation />
          <SimpleSidebar content={
            <div>
              <div id='global-market-container'>
                <GlobalMarkets />
              </div>
              {/* <div id='openticks-container'> 
                <ChatsOpenTicks />
              </div> */}
              <div id='other-container'> 
                <h1>Under Construction</h1>
              </div>
            </div>
          } />
        </div>
    </ChakraProvider>
  )
}

export default DashboardPage