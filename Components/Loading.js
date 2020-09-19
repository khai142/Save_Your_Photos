import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import firebase from './FirebaseConfig';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.props.navigation.replace(user ? "Home" : "Login");
    });
  }
  render(){
    return (
      <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    );
  }
}
