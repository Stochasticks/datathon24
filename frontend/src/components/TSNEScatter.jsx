import React from "react";
import { Box, Text } from "@chakra-ui/react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AbstractSocketComponent } from "../utils/AbstractSocketComponent";
import { ChannelsDataContext } from "../contexts/ChannelsContext";

export class TSNEScatter extends AbstractSocketComponent {
  graph = document.querySelector("#line-graph");
  constructor(props) {
    super(props, "tsneSocket");
  }

  onTsneData = (value) => {
    this.setState((previousState) => ({
      events: [...previousState.events, value],
    }));
  };

  onTrailTsne = (value) => {
    console.log("trail tsne");
    this.setState((previousState) => ({
      events: [...previousState.events, value],
    }));
  };

  getHandlers() {
    return {
      tsne: this.onTsneData,
      "trail-tsne": this.onTrailTsne,
    };
  }

  componentDidMount() {
    super.componentDidMount();

    // Ensure the socket is connected before emitting events
    if (this.socket) {
      this.socket.emit("get-trail-tsne");
    }
  }

  render() {
    const { events } = this.state;
    const lastEvent = events[events.length - 1];

    // console.log('lastEvent: ', lastEvent)

    if (!lastEvent) return null;

    const data = Object.entries(lastEvent).map(([label, coord]) => ({
      x: parseFloat(coord[0]).toFixed(3),
      y: parseFloat(coord[1]).toFixed(3),
      label,
    }));

    return (
      <Box
        alignContent={"center"}
        height={this.props.height}
        width={this.props.width}
      >
        <Text>Last updated {new Date().toLocaleTimeString()}</Text>
        <Box display="flex" justifyContent="center">
          <ResponsiveContainer
            width={this.graph?.parentElement.parentElement.clientWidth}
            aspect={2}
          >
            <ScatterChart>
              <ZAxis type="string" dataKey="label" name="ticker" />
              <XAxis type="number" dataKey="x" name="x" unit="" />
              <YAxis type="number" dataKey="y" name="y" unit="" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="T-sne" data={data} fill="#48bb78" />
            </ScatterChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    );
  }
}

TSNEScatter.contextType = ChannelsDataContext;
