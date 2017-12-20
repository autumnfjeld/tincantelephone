
import React from 'react';
import ChatApp from './ChatApp';
import './App.css';
import './Login.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    // TODO OAuth
    this.state = { 
      username: '',
      group: 'Groupless',
      valid: false,
      startChat: false
    };

    // Bind 'this' to event handlers. React ES6 does not do this by default
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.groupChangeHandler = this.groupChangeHandler.bind(this);
    // this.validatePassword = this.validatePassword.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  usernameChangeHandler(event) {
    console.log('usernameChangeHandler() called', event.target.value);
    this.setState({ username: event.target.value }, () => {
      this.setState({ valid: true});
    });
  }

  groupChangeHandler(event) {
    console.log('groupChangeHandler() called', event.target.value);
    if (event.target.value) {
      this.setState({ group: event.target.value  }, () => {
        console.log('finally  done setting this.state.group', this.state.group);
        console.log('check username', this.state.username);
        if (this.state.username) {
          this.setState({ valid: true});
        }      
      });
    } else {
      this.setState({ valid: true});
    }

  }

  // validatePassword(){
  //   if (this.state.password === this.state.group) {
  //     // this.setState({ submitted: true, username: this.state.username });
  //     this.setState({ valid: true});
  //   }
  // }

  submitHandler(event) {
    console.log('submitHandler this.state.password', event, this.state.username);
    event.preventDefault();
    if (this.state.username) {
      this.setState({ startChat: true});
    } 
  }

  render() {
    const valid = this.state.valid;
    const startChat = this.state.startChat;

    if (startChat) {
      // Form was submitted, now show the main App
      return (
        <ChatApp 
          username={this.state.username}
          group={this.state.group} />
      );
    }

    // Initial page load, show a simple login form
    return (
      <form onSubmit={this.submitHandler} className="username-container">
        <h1>TinCanTelephone</h1>
        <div>
          <input
            type="text"
            placeholder="username"
            onChange={this.usernameChangeHandler}
            autoFocus
            required />
        <input
            type="text"
            onChange={this.groupChangeHandler}
            placeholder="group (optional)"
            />
        </div>
        <p> Default group: Groupless </p>
        <input type="submit" value="Submit" 
          disabled={!valid}
          className="btn-submit"
        />
      </form>
    );
  }
}

App.defaultProps = {
};

export default App;
