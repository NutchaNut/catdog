import React from 'react';
import ReactDOM from 'react-dom';
  import * as firebase from 'firebase';
import {App} from './app'

const config = {
  apiKey: "AIzaSyD6x6jGqMjv-zqQ1OyHYAWqAia6w4Na8y0",
  authDomain: "catdog-190309.firebaseapp.com",
  databaseURL: "https://catdog-190309.firebaseio.com",
  storageBucket: "gs://catdog-190309.appspot.com/",
};

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
