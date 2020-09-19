import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import firebase from './FirebaseConfig';
import { showMessage, hideMessage } from "react-native-flash-message";

export default class SignUp extends React.Component{
  constructor(props) {
    super(props);
    this.state = { 
      email: '',
      pas: ""
    };
  }

  SignUp = () =>{
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pas)
    .then(()=>{
      showMessage({
        message: "Đăng ký thành công!",
        type: "info",
      });
    })
    .then(()=>{
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pas);
      this.props.navigation.replace("Home");
    })
    .catch(function(error) {
      console.log(error);
      if (error.code === "auth/invalid-email"){
        alert("Địa chỉ email không hợp lệ")
      }
      if (error.code === "auth/weak-password"){
        alert("Mật khẩu cần có ít nhất 6 ký tự")
      }
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={{width: "70%"}}>
          <Text>E-mail:</Text>
          <TextInput
            autoCompleteType ={'email'}
            style={{padding: 5, height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5}}
            onChangeText={(text) => this.setState({email: text})}
            value={this.state.email}
          />
          <Text>Password:</Text>
          <TextInput
            secureTextEntry={true}
            style={{padding: 5, height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5}}
            onChangeText={(text) => this.setState({pas: text})}
            value={this.state.pas}
          />
          <TouchableOpacity style={{margin: 20, padding: 10, alignItems: "center", backgroundColor: "gray", borderRadius: 100}} onPress={()=>{this.SignUp()}}>
            <Text style={{fontSize: 18, fontWeight: "bold", textTransform: "uppercase", color: "white"}}>
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
