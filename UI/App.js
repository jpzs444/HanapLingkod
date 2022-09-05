import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import 'react-native-gesture-handler';

import deviceExpoPushToken from './global/global'


import LoginNavigationStack from './Components/LoginStack';

import TabNavigation from './Components/TabNavigation';
import DrawerNavigator from './Components/DrawerNavigation';
import { Linking } from "react-native";

const AppStack = createNativeStackNavigator();

export default function App() {
  // const {isLoading, userToken} = useContext(AuthContext);

  // if(isLoading) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator size={"large"} />
  //     </View>
  //   );
  // }

  // get notification access/token
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>{
      setExpoPushToken(token)
      global.deviceExpoPushToken = expoPushToken
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
        Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      });
    
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  // set message here
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "HANAPLINGKOD",
    body: "San ka Punta?",
    data: { someData: "Welcome to HanapLingkod" },
  };

  // send to server
  // await fetch("https://exp.host/--/api/v2/push/send", {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Accept-encoding": "gzip, deflate",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(message),
  // });

}

async function registerForPushNotificationsAsync() {
  let token;
  
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.requestPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("token: ", token);
  }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;

}

  return (
      <NavigationContainer>
        <AppStack.Navigator initialRouteName="LoginNavigationStack" screenOptions={{headerShown: false}} >
          <AppStack.Screen name="LoginNavigationStack" component={LoginNavigationStack} /> 
          <AppStack.Screen name="DrawerNavigation" component={DrawerNavigator} /> 
        </AppStack.Navigator>

        {/* <LoginNavigationStack /> */}
        {/* <DrawerNavigator /> */}

      </NavigationContainer>
  );
}

