import React from 'react';
import AppNavigator from './Components/AppNavigator';
import FlashMessage from "react-native-flash-message";
import { View } from 'react-native';

export default function App() {
  return (
    <View style={{flex:1}}>
      <AppNavigator/>
      <FlashMessage position="top" />
    </View>
  );
}
