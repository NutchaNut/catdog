import React from 'react';
import {Login} from './login';
import * as firebase from 'firebase';
import PageHome from './components/PageHome.js'
import './app.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


export class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      isLogin : false,
      existAccount : false,
      userData : null,
      userId : ''
    }
    this.handleOnLoginSucess = this.handleOnLoginSucess.bind(this);
  }

  //let userid;

  async handleOnLoginSucess(userAuth) {
    const userid = userAuth.user.uid;
    console.log('userId', userid);
    this.setState({userId : userAuth.user.uid});
    const ref = firebase.database();
    firebase.database().ref('/users/' + userid)
    .once('value')
    .then(async (snapshot) => {
      const userData = snapshot.val();
      if (!userData) {
        // Set default for new user data
        const initialUserData = {
          username: userAuth.user.email,
        };
        // Add new user to database
        await firebase.database().ref('/users/' + userid).set(initialUserData);
        this.setState({
          isLogin: true,
          userData: initialUserData,
        });
      } else {
        this.setState({
          isLogin: true,
          userData: snapshot.val(),
        });
      }
    })
  }

  render(){
    console.log(this.state.userId);
      if(this.state.isLogin){
        return(
          <MuiThemeProvider>
         <PageHome userData={this.state.userId} />
         </MuiThemeProvider>
       );
     }
     else{
       return <Login onLoginSuccess={this.handleOnLoginSucess} />
       }


  }
}
