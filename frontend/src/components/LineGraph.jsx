// import React, { useContext } from 'react';
// import { AbstractSocketComponent } from '../utils/AbstractSocketComponent';
// import { ChartComponent } from './ChartComponent';
// import { ChannelsDataContext } from '../contexts/ChannelsContext';

// export class LineGraph extends AbstractSocketComponent {
//   constructor(props) {
//     super(props, 'lineSocket');
//     this.state = {
//       events: [],
//       tickers: [],
//       availableChannels: [],
//       colors: []
//     };
//   }

//   onQuoteData = (value) => {
//     console.log("event: ", value)
//     this.setState(previousState => ({
//       events: [...previousState.events, value]
//     }));
//   }

//   onTrailData = (value) => {
//     console.log('trail: ', value)
//     this.setState({
//       events: value
//     });
//   }

//   getHandlers() {
//     return {
//       'quote': this.onQuoteData,
//       'trail-data': this.onTrailData
//     };
//   }

//   componentDidMount() {
//     super.componentDidMount();
//     this.socket.emit('get-trail-data');
//   }

//   render() {
//     const { events } = this.state;
//     return (
//       <div id='line-graph' style={{ height: this.props.height, width: this.props.width }}>
//         <ChartComponent
//           height={this.props.height}
//           width={this.props.width}
//           events={events}
//         />
//       </div>
//     );
//   }
// }

// LineGraph.contextType = ChannelsDataContext;

import React from "react";
import { AbstractSocketComponent } from "../utils/AbstractSocketComponent";
import { ChartComponent } from "./ChartComponent";
import { ChannelsDataContext } from "../contexts/ChannelsContext";

export class LineGraph extends AbstractSocketComponent {
  constructor(props) {
    super(props, "lineSocket");
    this.state = {
      events: [],
    };
  }

  onQuoteData = (value) => {
    console.log('value quote: ', value)
    this.setState((previousState) => ({
      events: [...previousState.events, value],
    }));
  };

  onTrailData = (value) => {
    console.log("trail: ", value);
    this.setState({
      events: value,
    });
  };

  getHandlers() {
    return {
      quote: this.onQuoteData,
      "trail-data": this.onTrailData,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    console.log("mount: ", this.socket.connected);
    console.log("Handlers registered:", Object.keys(this.getHandlers())); // Check registered handlers
    console.log("Socket instance:", this.socket); // Check socket instance
    setTimeout(() => {
      if (this.socket.connected) {
        this.socket.emit("get-trail-data");
      } else {
        console.error("Socket not connected after delay");
      }
    }, 1000);
  }

  render() {
    const { events } = this.state;
    return (
      <div
        id="line-graph"
        // style={{ height: this.props.height, width: this.props.width }}
      >
        <ChartComponent
          height={this.props.height}
          width={this.props.width}
          events={events}
        />
      </div>
    );
  }
}

LineGraph.contextType = ChannelsDataContext;
