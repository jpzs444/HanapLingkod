// Bottom Tab Navigation

import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeDefaults from './ThemeDefaults';

// import Home from '../Screens/Home';

import LoginNavigationStack from './LoginStack';
import HomeNavigationStack from './HomeStack';

import Login from '../Screens/Login';
import Home from '../Screens/Home';
import RegisterUserAccountType from '../Screens/RegisterUserAccountType';
import Welcome from '../Screens/Welcome';
import Notifications from '../Screens/Notifications';



const Tab = createBottomTabNavigator();

const TabNavigation = () => {
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
        <Tab.Screen name="Home_Tab" component={HomeNavigationStack} 
            options={{
                tabBarIcon: ({focused}) => (
                    <Icon name="home" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                )
            }}
        />

        {/* Worker List Tab */}
        <Tab.Screen name="WorkerTab" component={RegisterUserAccountType} 
            options={{
                tabBarIcon: ({focused}) => (
                    <Icon name="account-hard-hat" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                )
            }}
        />

        {/* Tasks Tab */}
        <Tab.Screen name="LoginStackGrp" component={Home} 
            options={{
                tabBarIcon: ({focused}) => (
                    <Icon name="clipboard-text-multiple" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                ),
            }}
            
        />

        {/* Messages Tab */}
        <Tab.Screen name="Messages" component={Home} 
            options={{
                tabBarIcon: ({focused}) => (
                    <Icon name="forum" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                )
            }}
        />

        {/* Notification Tab */}
        <Tab.Screen name="Notification" component={Notifications} 
            options={{
                tabBarBadge: 5,
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
