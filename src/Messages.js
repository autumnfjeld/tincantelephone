import React from 'react';

import Message from './Message';

class Messages extends React.Component {
  componentDidUpdate() {
    // There is a new message in the state, scroll to bottom of list
    const objDiv = document.getElementById('messageList');
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  render() {
    const currentUser = this.props.currentUser;
    // Loop through all the messages in the state and create a Message component
    const messages = this.props.messages.map((message, i) => {
      const fromMe = currentUser === message.username ? true : false;
        return (
          <Message
            key={i}
            username={message.username}
            unixTimeStamp={message.unixTimeStamp}
            message={message.message}
            fromMe={fromMe} />
        );
      });

    return (
      <div className='messages' id='messageList'>
        { messages }
      </div>
    );
  }
}

Messages.defaultProps = {
  messages: []
};

export default Messages;
