
import React from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import 'moment-timezone';
// import config from 'config';

import Messages from './Messages';
import ChatInput from './ChatInput';
import './ChatApp.css';

/**
 * Note: 'univeral' usage of moment timestamp can be used if serverside code node.js
 * Unsure of best approach for time.....so will just go with moment.js
 */

class ChatApp extends React.Component {
  socket = {};
  constructor(props) {
    console.log('ChatApp component got props', props);
    super(props);
    this.state = { messages: [] };
    this.sendHandler = this.sendHandler.bind(this);
    
    // Connect to the server
    const api = 'https://tincantelephone-api.herokuapp.com/';
    // For dev. Figure out how to set up dev props in react
    // const api = 'http://localhost:5000';
    this.socket = io(api, { query: `username=${props.username}&group=${props.group}`, }).connect();

    // Listen for messages from the server
    this.socket.on('server:message', message => {
      this.addMessage(message);
    });
  }

  sendHandler(message) {
    const messageObject = {
      username: this.props.username,
      group: this.props.group,
      // unix time UTC
      unixTimeStamp: moment().unix(),
      message
    };

    // Emit the message to the server
    this.socket.emit('client:message', messageObject);

    messageObject.fromMe = true;
    this.addMessage(messageObject);
  }

  addMessage(message) {
    // Append the message to the component state
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  }

  render() {
    const username = this.props.username;
    const group = this.props.group;
    return (
      <div className="container">
        <h1>TinCanTelephone</h1>
        <h5>Who am I? Where am I?    {username} in the {group} group</h5>
        <Messages messages={this.state.messages} />
        <ChatInput onSend={this.sendHandler} />
      </div>
    );
  }

}
ChatApp.defaultProps = {
  username: 'Anonymous'
};

export default ChatApp;
