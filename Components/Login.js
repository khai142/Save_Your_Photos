import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import firebase from './FirebaseConfig';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      email: '',
      pas: ""
    };
  }

  SignIn = () =>{
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pas)
    .then(()=>{
      this.props.navigation.replace("Home")
    })
    .catch(function(error) {
      console.log(error);
      // alert("Đăng ký thất bại!");
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
            autoCompleteType={"password"}
            secureTextEntry={true}
            style={{padding: 5, height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5}}
            onChangeText={(text) => this.setState({pas: text})}
            value={this.state.pas}
          />
          <TouchableOpacity style={{margin: 20, padding: 10, alignItems: "center", backgroundColor: "#2196f3", borderRadius: 100}} onPress={()=>{this.SignIn()}}>
            <Text style={{fontSize: 18, fontWeight: "bold", textTransform: "uppercase", color: "white"}}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems: "center"}} onPress={()=>this.props.navigation.navigate("SignUp")}>
            <Text style={{color: "green", fontSize: 15, textDecorationLine: 'underline'}}>
              Chưa có tài khoản? Đăng ký ngay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{margin: 20, padding: 10, alignItems: "center", backgroundColor: "#edc12f", borderRadius: 100}} onPress={()=>{this.SignInWithGoogle()}}>
            <Text style={{fontSize: 14, fontWeight: "bold", color: "white"}}>
              Đăng nhập bằng tài khoản Google(not yet)
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
