import React, { Component } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import InfoBox from './InfoBox';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name || 'Visitor', // Use props.name or default to an empty string
      messages: [],
      lastEventId: '',
    };

    this.addMessage = this.addMessage.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  componentDidMount() {
    this.props.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === 'LOG') {
        console.log(data.message);
      } else if (data.type === 'LAST_EVENT_ID') {
        this.setState({ lastEventId: data.message });
      } else {
        this.addMessage(data);
      }
    };

    this.props.ws.onopen = () => {
      this.setState({ connected: true });
      console.log('connected chat.js');
      const message = { name: 'System-uuid-bot', message: this.state.name };
      this.props.ws.send(JSON.stringify(message));
    };

    this.props.ws.onerror = (e) => {
      console.log('Error occurred: ', e);
      this.setState({ connected: false });
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.name !== this.props.name) {
      this.setState({ name: this.props.name });
    }
  }

  componentWillUnmount() {
    this.props.ws.onmessage = null;
    this.props.ws.onopen = null;
    this.props.ws.onerror = null;
  }

  addMessage(message) {
    const MAX_MESSAGE_COUNT = 100;
    this.setState((state) => ({
      messages: [message, ...state.messages.slice(0, MAX_MESSAGE_COUNT - 1)],
    }));
  }

  submitMessage(messageString) {
    const message = { name: this.state.name, message: messageString };
    if (this.props.ws.readyState === 1) {
      this.props.ws.send(JSON.stringify(message));
    }
    this.addMessage(message);
  }

  render() {
    return (
      <div>
        <InfoBox lastEventId={this.state.lastEventId} />
        <div className="fixed-chat">
          <div className="panel-chat">
            <div className="header-chat">
              <label htmlFor="name">
                Name:&nbsp;
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name..."
                  value={this.state.name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                />
              </label>
            </div>
            <div className="body-chat">
              {this.state.messages.map((message, index) =>
                <ChatMessage
                  key={index}
                  message={message.message}
                  name={message.name}
                />,
              )}
            </div>
            <div className="message-chat">
              <ChatInput
                onSubmitMessage={(messageString) => this.submitMessage(messageString)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;