import React from 'react';
import * as firebase from 'firebase';
import logo from './animal.png';

const provider = new firebase.auth.GoogleAuthProvider();

async function loginFirebase() {
  return await firebase.auth().signInWithPopup(provider);
}

export class Login extends React.Component {

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  async login() {
    try {
      const result = await loginFirebase();
      this.props.onLoginSuccess(result);
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
    }
  }

  render() {
    return(
      <div>
        <div className="login-header" >
        <h2> WHERE IS MY PET ? </h2>
        </div>
        <div className="login-body">
        <img className = "logo" src={logo} width="256" height="256"/>
        <button type="button" className="btn btn-outline-light" onClick={this.login}>Google Login</button>
        </div>
      </div>
    );
  }
}
