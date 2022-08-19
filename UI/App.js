import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import RegisterUserAccountType from './Screens/RegisterUserAccountType';
import RecruiterRegistration from './Screens/RecruiterRegistration';

import Home from './Screens/Home';
import Welcome from './Screens/Welcome';
import OTPVerification from './Screens/OTPVerification';


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      {/* <Login /> */}
      {/* <RegisterUserAccountType /> */}
      {/* <RecruiterRegistration /> */}
      {/* <OTPVerification /> */}

      <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="AccountTypeSelect" component={RegisterUserAccountType} />
        <Stack.Screen name="RegisterRecruiter" component={RecruiterRegistration} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="WelcomeScreen" component={Welcome} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}7

