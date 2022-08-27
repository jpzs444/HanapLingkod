import React, { useState, useContext } from 'react';
import {View, ActivityIndicator} from 'react-native';
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

import { AuthContext, AuthProvider } from './context/AuthContext';


const Stack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const LoginNavigationStack = () => {
  return(
    <LoginStack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}} >
        <LoginStack.Screen name="Login" component={Login} />
        <LoginStack.Screen name="AccountTypeSelect" component={RegisterUserAccountType} />
        <LoginStack.Screen name="Register" component={Registration} />
        <LoginStack.Screen name="OTPVerification" component={OTPVerification} />
        <LoginStack.Screen name="WelcomeScreen" component={Welcome} />
        <LoginStack.Screen name="HomeStack" component={HomeNavigationStack} />
    </LoginStack.Navigator>
  )
}

const HomeNavigationStack = () => {
  return(
    <HomeStack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}} >
        <HomeStack.Screen name="Home" component={Home} />
    </HomeStack.Navigator>
  )
}

export default function App() {
  // const {isLoading, userToken} = useContext(AuthContext);

  // if(isLoading) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator size={"large"} />
  //     </View>
  //   );
  // }

  return (
      <NavigationContainer>

        <LoginNavigationStack />

      </NavigationContainer>
  );
}

