
import React from 'react';
import io from 'socket.io-client';
import moment from 'moment';
import Moment from 'react-moment';
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
    this.state = { 
      messages: [],
      lastActivityUnixTimeStamp: moment().unix(),
      screenSaver: false,
      awakeCode: '',
      timeOut: 40000
    };
    this.sendHandler = this.sendHandler.bind(this);
    this.tick = this.tick.bind(this);
    this.keydownListener = this.keydownListener.bind(this);

    // Connect to the server
    const api = 'https://tincantelephone-api.herokuapp.com/';
    // For dev. Figure out how to set up dev props in react
    // const api = 'http://localhost:5000';
    const query = `username=${props.username}&group=${props.group}`;
    this.socket = io(api, { query: query, }).connect();

    // Listen for messages from the server
    this.socket.on('server:message', message => {
      this.addMessage(message);
    });

   // Listen for past messages from the server.  Happens only on initial connection.
    this.socket.on('server:pastMessages', messages => {
      console.log('Got past messages', messages);
      for (let msg of messages) {
        this.addMessage(msg);
      }
      // TODO can kill this listener ?  or ?
    });    
  }

    // Listen for keybaord input to unblock screenSaver
  keydownListener(event){
    // console.log('keydownListener', event.key);
    console.log('this.state.screenSaver', this.state.screenSaver)
    // If screenSaver is active check for awakeCode
    if (this.state.screenSaver) {
      this.setState({awakeCode: this.state.awakeCode + event.key}, () => {
        // console.log('this.state.awakeCode', this.state.awakeCode);
        if (this.state.awakeCode.includes('themagicword')) {
          this.setState({
            screenSaver: false, 
            awakeCode: '',
            lastActivityUnixTimeStamp: moment().unix()
          });
          document.removeEventListener('keypress', this.keydownListener, false);
        }
      })
    }
  }

  // Set up activity timer.  Display screenSaver after XX minutes
   tick() {
    console.log('tick this.state.lastActivityUnixTimeStamp', this.state.lastActivityUnixTimeStamp);
    const start = moment(this.state.lastActivityUnixTimeStamp);
    const now = moment();
    console.log('ticking', start.format());
    if (start.add(this.state.timeOut, 'seconds').isBefore(now)) {

    // if (start.add(3, 'minutes').isBefore(now)) {
      this.setState({screenSaver: true});
      // Add listener for awakeCode
      document.addEventListener('keydown', this.keydownListener, false);
    }
  }

  componentDidMount() {
    // Set up timer for inactivity check
    this.interval = setInterval(this.tick, this.state.timeOut, this);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    document.removeEventListener('keypress', this.keydownListener, false);
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

    // Update last activity timestamp
    // console.log('Updating lastActivityUnixTimeStamp');
    this.setState({lastActivityUnixTimeStamp: moment().unix()});
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

    const screenSaver = this.state.screenSaver ? 'screen-saver' : '';

    return (
      <div className={`container chat-app ${screenSaver}`}>
        <h1>TinCanTelephone</h1>
        <h5>Who am I? {username}</h5>
        <h5>Where am I? {group} group</h5>
        <p> {screenSaver}</p>
        <Moment unix> {this.state.lastActivityUnixTimeStamp} </Moment>
        <Messages currentUser={username} messages={this.state.messages} />
        <ChatInput onSend={this.sendHandler} />
      </div>
    );
  }

}
ChatApp.defaultProps = {
  username: 'Anonymous'
};

export default ChatApp;
