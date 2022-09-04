import React from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import TText from './TText';
import 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import RegisterUserAccountType from '../Screens/RegisterUserAccountType';
import TabNavigation from './TabNavigation';
import ThemeDefaults from './ThemeDefaults';
import CustomDrawer from './CustomDrawer';
import Welcome from '../Screens/Welcome';


const Drawer = createDrawerNavigator();


export default function DrawerNavigation(){
    return(
        <Drawer.Navigator 
            drawerContent={props => <CustomDrawer {...props} /> }
            screenOptions={{ 
                headerShown: false, 
                drawerActiveBackgroundColor: ThemeDefaults.themeOrange,
                drawerActiveTintColor: '#fff',
                drawerLabelStyle: {marginLeft: -15, fontSize: 16},
                drawerContentContainerStyle: {flex: 1, height: '100%', }
            }}
        >
            <Drawer.Screen name="Home" component={TabNavigation} options={{
                drawerIcon: ({color}) => (
                    <Icon name="home" size={25} color={color}  />
                )
            }} />

            <Drawer.Screen name="RUT" component={RegisterUserAccountType} options={{
                drawerIcon: ({color}) => (
                    <Icon name="clipboard-edit" size={25} color={color}  />
                )
            }} />
            <Drawer.Screen name="Home2" component={TabNavigation} options={{
                drawerIcon: ({color}) => (
                    <Icon name="home" size={25} color={color}  />
                )
            }} />

            <Drawer.Screen name="RUT2" component={RegisterUserAccountType} options={{
                drawerIcon: ({color}) => (
                    <Icon name="clipboard-edit" size={25} color={color}  />
                )
            }} />

        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({

})