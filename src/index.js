import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import * as firebase from 'firebase'

var config = {
    apiKey: "AIzaSyDA-YZyMA0-TQjZ5h4CO3GQeB1Ugzen-98",
    authDomain: "jschool-1d2db.firebaseapp.com",
    databaseURL: "https://jschool-1d2db.firebaseio.com",
    storageBucket: "jschool-1d2db.appspot.com",
}

firebase.initializeApp(config)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
