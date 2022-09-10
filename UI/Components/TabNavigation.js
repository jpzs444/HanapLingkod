// Bottom Tab Navigation

import React, {useEffect, useState} from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeDefaults from './ThemeDefaults';

// import Home from '../Screens/Home';

import Home from '../Screens/Home';
import Workers from '../Screens/Workers';
import PostRequests from '../Screens/PostRequests';
import Messaging from '../Screens/Messaging';
import Notifications from '../Screens/Notifications';

import { devicePushToken, IPAddress } from '../global/global';


const Tab = createBottomTabNavigator();

const TabNavigation = () => {

  const [notificationCount, setNotificationCount] = useState(0)
  useEffect(() => {
    fetch("http://" + IPAddress + ":300/notification/:" + devicePushToken, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json())
    .then((res) => {
      setNotificationCount(res.length)
      console.log('notif length: ', res.length)
      let notifCount = 0
        for(read of data){
        if(!read.read){
            notifCount = notifCount + 1
        }
        }
        global.notificationCount = notifCount
    }).catch((err) => {
      console.log("error: ", err.message)
    })
  }, [global.notificationCount])

  return (
    <Tab.Navigator
        initialRouteName='Home_Tab'
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                ...styles.container               
            }
        }}
    >
        {/* Home Screen Tab */}
        <Tab.Screen name="Home_Tab" component={Home} 
            options={{
                tabBarIcon: ({focused}) => (
                    <Icon name="home" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                )
            }}
        />

        {/* Worker List Tab */}
        <Tab.Screen name="WorkerTab" component={Workers} 
            options={{
                tabBarIcon: ({focused}) => (
                    <Icon name="account-hard-hat" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                )
            }}
        />

        {/* Tasks Tab */}
        <Tab.Screen name="PostRequestsTab" component={PostRequests} 
            options={{
                tabBarIcon: ({focused}) => (
                    <Icon name="clipboard-text-multiple" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                ),
            }}
            
        />

        {/* Messages Tab */}
        <Tab.Screen name="MessagingTab" component={Messaging} 
            options={{
                tabBarIcon: ({focused}) => (
                    <Icon name="forum" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                )
            }}
        />

        {/* Notification Tab */}
        <Tab.Screen name="NotificationsTab" component={Notifications} 
            options={{
                tabBarBadge: global.notificationCount,
                tabBarBadgeStyle: {
                    backgroundColor: '#BB1E00',
                },
                tabBarIcon: ({focused}) => (
                    <Icon name="bell" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                ),
            }}
        />
    </Tab.Navigator>
  )
}

export default TabNavigation

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        position: 'absolute',
        borderRadius: 18,
        height: 60,
        padding: 14,
        paddingBottom: 12,
        bottom: 30,
        left: 30, 
        right: 30,
        backgroundColor: "#FF803C",
        elevation: 5,
        zIndex: 20,   
    }
})
