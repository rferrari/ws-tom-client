import React, { Component } from 'react';
import Chat from './Chat';
// import InfoBox from './InfoBox';

const WS_URL = 'ws://localhost:3040';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
    };
    this.ws = null;
  }

  componentDidMount() {
    this.ws = new WebSocket(WS_URL);
    this.addEventListeners();
  }

  componentWillUnmount() {
    if (this.ws) this.ws.close();
  }

  addEventListeners() {
    this.ws.onopen = () => {
      console.log('connected');
      this.setState({ isConnected: true });
      const message = { name: "System", message: this.state.name }
      this.ws.send(JSON.stringify(message))
    };

    this.ws.onmessage = this.handleMessage;

    this.ws.onclose = () => {
      console.log('disconnected');
      this.setState({ isConnected: false });
      setTimeout(() => this.reconnect(), 1000);
    };
    
    this.ws.onerror = (e) => {
      console.log('Error occurred: ', e);
    };
  }

  reconnect() {
    this.ws = new WebSocket(WS_URL);
    this.addEventListeners();
  }

  handleMessage = (evt) => {
    // const data = JSON.parse(evt.data);
    // console.log('Received message: ', data);
  };

  render() {
    return this.state.isConnected ? (
      <div className="App">
        <Chat ws={this.ws} />
      </div>
    ) : (
      <div>Connecting...</div>
    );
  }
}

export default App;