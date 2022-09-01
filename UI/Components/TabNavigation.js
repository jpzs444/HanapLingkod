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



const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
        initialRouteName='HomeTab'
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                alignItems: 'center',
                position: 'absolute',
                borderRadius: 18,
                height: 60,
                padding: 14,
                paddingBottom: 12,
                bottom: 30,
                left: 30, 
                right: 30,
                backgroundColor: ThemeDefaults.themeOrange,
                elevation: 5,
                zIndex: 20,               
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
                )
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
        <Tab.Screen name="Notification" component={Login} 
            options={{
                tabBarBadge: 5,
                tabBarBadgeStyle: {
                    backgroundColor: ThemeDefaults.themeDarkBlue,
                },
                tabBarIcon: ({focused}) => (
                    <Icon name="bell" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                )
            }}
        />
    </Tab.Navigator>
  )
}

export default TabNavigation

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 18,
        padding: 10,
        bottom: 30,
        left: 30, 
        right: 30,
        backgroundColor: ThemeDefaults.themeOrange,
        zIndex: 20,
    }
})
