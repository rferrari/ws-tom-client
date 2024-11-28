import React, { Component } from 'react';
import Chat from './Chat';
// import InfoBox from './InfoBox';

// const WS_URL = process.env.REACT_APP_WS_URL; // Reads from .env
// const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; // Reads from .env

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // wsUrl: "",
      isConnected: false,
      isAuthorized: false,
      secretKey: "",
      name: "Visitor",
    };
    // this.nameInputRef = React.createRef(); // Create a ref for the name input
    this.wsUrlInputRef = React.createRef(); // Create a ref for the ws url input
    this.ws = null;
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if (this.ws) this.ws.close();
  }

  addEventListeners() {
    this.ws.onopen = () => {
      console.log('App.js connected');
      this.setState({ isConnected: true });
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
    // try {
      // Try parsing the evt.data as JSON
      const data = JSON.parse(evt.data);
      if (data.auth === true) {
        this.setState({ isAuthorized: true });
      }
    // } catch (e) {
    //   // If parsing fails (invalid JSON), just ignore and do nothing
    //   console.warn("Invalid JSON data, ignoring:", e);
    // }
  };

  render() {
    if (!this.state.isConnected || !this.state.isAuthorized) {
      return (
        <div className="box-auth">
          <input
            type="text"
            placeholder='Connection Url'
            ref={this.wsUrlInputRef}
            className="box-auth-input"
          />
          <button className="boxAuthButton" onClick={() => this.checkSecretKey()}>Connect</button>
        </div>
      );
    }

    return (
      <div className="App">
        <Chat ws={this.ws} name={this.state.name} />
      </div>
    );
  }

  checkSecretKey() {
    if (this.wsUrlInputRef.current.value !== "") {
      this.ws = new WebSocket(this.wsUrlInputRef.current.value);
      this.addEventListeners();
      this.setState({ isAuthorized: true });
      const message = { name: "System-uuid-bot", message: this.state.name, auth: this.state.isAuthorized }
      this.ws.send(JSON.stringify(message))
    }
  }
}

export default App;