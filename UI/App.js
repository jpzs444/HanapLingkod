import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import RegisterUserAccountType from './Screens/RegisterUserAccountType';
import Registration from './Screens/Registration';

import Home from './Screens/Home';
import Welcome from './Screens/Welcome';
import OTPVerification from './Screens/OTPVerification';

import OTPModule from './Components/OTPModule';
import ImagesPicker from './Components/ImagesPicker';


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      {/* <Login /> */}
      {/* <RegisterUserAccountType /> */}
      {/* <Registration /> */}
      {/* <OTPVerification /> */}
      {/* <OTPModule /> */}

      <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="AccountTypeSelect" component={RegisterUserAccountType} />
        <Stack.Screen name="Register" component={Registration} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="OTP" component={OTPModule} />
        <Stack.Screen name="WelcomeScreen" component={Welcome} />
        <Stack.Screen name="ImagesPicker" component={ImagesPicker} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}7

