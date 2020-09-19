import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import SignUp from "./SignUp";
import Login from "./Login";
import Loading from "./Loading";

const Stack = createStackNavigator();

class AppNavigator extends React.Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Loading" component={Loading}/>
          <Stack.Screen name="Login" component={Login} options={{title: "Đăng nhập"}}/>
          <Stack.Screen name="SignUp" component={SignUp} options={{title: "Đăng ký"}}/>
          <Stack.Screen name="Home" component={HomeScreen} options={{title: "Save your photos"}}/>
       </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default AppNavigator;
