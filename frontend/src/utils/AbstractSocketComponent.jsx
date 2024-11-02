import React, { Component } from "react";
import { ChannelsDataContext } from "../contexts/ChannelsContext";

export class AbstractSocketComponent extends Component {
  static contextType = ChannelsDataContext;

  constructor(props, type) {
    super(props);
    this.socket = null;
    this.type = type;
    this.state = {
      events: [],
      isConnected: false,
      handlers: {},
    };

    if (!(typeof this.getHandlers === "function")) {
      throw new Error("getHandlers must be implemented in the subclass");
    }
  }

  componentDidMount() {
    const { socketDictionary } = this.context;
    const handlers = this.getHandlers();
    this.socket = socketDictionary[this.type];

    if (!this.socket) {
      console.error(`Socket for type ${this.type} is not available.`);
      return;
    }

    this.socket.connect();

    this.socket.on("connect", this.handleConnect);
    this.socket.on("disconnect", this.handleDisconnect);

    Object.entries(handlers).forEach(([flag, handler]) => {
      console.log("flag: ", flag);
      this.socket.on(flag, handler.bind(this));
    });

    this.setState({ handlers });
  }

  handleConnect = () => {
    console.log("abs: ", this.socket);
    console.log("this.type: ", this.type);
    this.setState({
      isConnected: true
    });
    // this.setState({ isConnected: true }, () => {
    //   this.socket.emit("get-trail-data"); // Emit after connection is established
    // });
  };

  handleDisconnect = () => {
    console.error("Socket disconnected");
    this.setState({
      isConnected: false,
    });
  };

  componentWillUnmount() {
    if (!this.socket) return;

    this.socket.off("connect", this.handleConnect);
    this.socket.off("disconnect", this.handleDisconnect);

    Object.keys(this.getHandlers()).forEach((flag) => {
      this.socket.off(flag);
    });
  }

  render() {
    return <div>{/* Your component's render logic */}</div>;
  }
}
