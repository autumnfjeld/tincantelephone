import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

class Message extends React.Component {
  render() {
    // Was the message sent by the current user?
    // console.log('Message got this.props.unixTimeStamp', this.props);
    const name = this.props.fromMe ? 'me' : this.props.username;
    const messageClassName = 'message-box' + (this.props.fromMe ? ' from-me' : '');
    const unixTimeStamp = this.props.unixTimeStamp;
    const message = this.props.message;

    return (
      <div className={messageClassName}>
        <Moment
          unix
          fromNow
          interval={30000}
          className='time-stamp'>
            { unixTimeStamp } 
        </Moment>
        <div className="time-stamp"> unix time: {unixTimeStamp} </div>
        <div className="username"> { name } </div>
        <div className="message-body"> {message} </div>
      </div>
    );
  }
}

Message.defaultProps = {
  message: '',
  username: '',
  unixTimeStamp: '',
  fromMe: false
};

export default Message;
