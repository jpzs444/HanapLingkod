import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import RegisterUserAccountType from './Screens/RegisterUserAccountType';
import RecruiterRegistration from './Screens/RecruiterRegistration';

const Stack = createNativeStackNavigator();
export default function App() {


  return (
    <NavigationContainer>
      {/* <Login /> */}
      {/* <RegisterUserAccountType /> */}
      <RecruiterRegistration />
    </NavigationContainer>
  );
}7

