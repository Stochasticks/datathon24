import React from "react";
import { Box, Tooltip, Text } from "@chakra-ui/react";
import { AbstractSocketComponent } from "../utils/AbstractSocketComponent";
import { environment } from "../environments/environment";
import { ChannelsDataContext } from "../contexts/ChannelsContext";

export class CosineMatrix extends AbstractSocketComponent {
  constructor(props) {
    super(props, "cosineSocket");
    this.state = {
      events: [],
    };
  }

  onCosineMatrix(value) {
    //console.log('Received cosine event: ', value);
    this.setState((previousState) => ({
      events: [...previousState.events, value],
    }));
  }

  onTrailVectors(value) {
    this.setState((previousState) => ({
      events: [...previousState.events, value],
    }));
  }

  getHandlers() {
    return {
      cosine: this.onCosineMatrix,
      "trail-vectors": this.onTrailVectors,
    };
  }

  getColor(value, maxValue, minValue) {
    const projected = 100 + ((value - minValue) / (maxValue - minValue)) * 800;
    return `green.${100 * Math.round(projected / 100)}`; // Use full saturation and lightness
  }

  getTextColor(value, maxValue, minValue) {
    const projected = 100 + ((minValue - value) / (maxValue - minValue)) * 800;
    return `blackAlpha.${100 * Math.round(projected / 100)}`; // Use full saturation and lightness
  }

  componentDidMount() {
    super.componentDidMount();
    this.socket.emit("get-cosine-vectors");
  }

  takeFirstX(matrix, x) {
    // Ensure x is within the bounds of the matrix dimensions
    x = Math.min(x, matrix.length, matrix[0].length);

    // Create a new matrix for the result
    let subMatrix = [];

    for (let i = 0; i < x; i++) {
      let row = [];
      for (let j = 0; j < x; j++) {
        row.push(matrix[i][j]);
      }
      subMatrix.push(row);
    }

    return subMatrix;
  }

  render() {
    const { events } = this.state;
    let lastEvent = events[events.length - 1];
    if (!lastEvent) return null;

    // console.log('last event before: ', lastEvent)

    //lastEvent = {matrix: this.takeFirstX(lastEvent.matrix, 16), symbols: lastEvent.symbols.slice(0, 16)};

    const numElem = lastEvent.matrix.length;
    const cellSize = 100 / (numElem + 1); // Percentage of the parent container

    return (
      <Box
        display="flex"
        flexDirection="column"
        height={this.props.height * 1.2}
        width={this.props.width * 1.2}
        overflowX="scroll"
        overflowY="scroll"
      >
        <Text>Last updated {new Date().toLocaleTimeString()}</Text>
        <br />
        <br />
        <Box
          display="grid"
          gridTemplateColumns={`repeat(${numElem + 1}, 1fr)`}
          gridTemplateRows={`repeat(${numElem + 1}, ${cellSize}%)`}
          width="100%"
          height="100%"
        >
          <Box gridColumn="1" gridRow="1" />
          {lastEvent.symbols.map((symbol, index) => (
            <Box
              key={index}
              gridColumn={index + 2}
              gridRow="1"
              display="flex"
              alignItems="flex-end"
              marginLeft={3}
              marginBottom={2}
              justifyContent="center"
              transform={"rotate(-90deg) translate(10px)"}
              fontSize={"xx-small"}
              textAlign="bottom"
              width={cellSize}
            >
              <b>{symbol}</b>
            </Box>
          ))}
          {lastEvent.symbols.map((symbol, rowIndex) => (
            <Box
              key={rowIndex}
              gridColumn="1"
              gridRow={rowIndex + 2}
              display="flex"
              alignItems="center"
              marginRight={2}
              justifyContent="center"
              fontSize={"xx-small"}
              textAlign="center"
              height={cellSize * 5}
            >
              <b>{symbol}</b>
            </Box>
          ))}
          {(lastEvent.matrix ?? []).map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <Tooltip
                key={colIndex}
                hasArrow
                label={
                  <Text>
                    {lastEvent.symbols[rowIndex]}-{lastEvent.symbols[colIndex]}
                    <br />
                    Cosine similarity {value.toFixed(4)}
                    <br /> <small>10 ticks - returns</small>
                    <br />
                  </Text>
                }
                bg="gray.300"
                color="black"
              >
                <Box
                  gridColumn={colIndex + 2}
                  gridRow={rowIndex + 2}
                  backgroundColor={this.getColor(value.toFixed(2), 1, 0)}
                  color={this.getTextColor(value.toFixed(2), 1, 0)}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  verticalAlign="middle"
                  width="100%"
                  height="100%"
                  sx={{
                    border: "2px solid transparent", // Default border
                    "&:hover": {
                      border: "2px solid black", // Border on hover
                      cursor: "pointer",
                    },
                    transition: "border 0.3s ease", // Smooth transition effect
                  }}
                />
              </Tooltip>
            ))
          )}
        </Box>
      </Box>
    );
  }
}
CosineMatrix.contextType = ChannelsDataContext;
export default CosineMatrix;
