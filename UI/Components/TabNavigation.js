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
import WorkerProfile from '../Screens/WorkerProfile';

import { devicePushToken, IPAddress } from '../global/global';
// import HomeNavigationStack from './HomeStack';
import UserProfile from '../Screens/UserProfile';
import RequestForm from '../Screens/RequestForm';
import ListSpecificWorkers from '../Screens/ListSpecificWorkers';
import SubCategory from '../Screens/SubCategory';
import HomeNavigationStack from './HomeStack';
import ViewComments from '../Screens/ViewComments';
import Maps from '../Screens/Maps';
import PostRequestStack from './PostRequestStack';
import ReportUser from '../Screens/ReportUser';

const hiddenTabNavBtn = () => ({
    tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
  });


const Tab = createBottomTabNavigator();

const TabNavigation = () => {

    let nc = global.notificationCount
    // useEffect(() => {
    //     setNotificationCount(global.notificationCount)
    // }, [notificationCount])

  const [notificationCount, setNotificationCount] = useState(0)
  useEffect(() => {
    fetch("https://hanaplingkod.onrender.com/notification/:" + global.userData._id, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": global.accessToken
      },
    }).then((res) => res.json())
    .then((res) => {
    //   setNotificationCount(res.length)
      console.log('notif length: ', res.length)
      let notifCount = 0
        for(read of res){
        if(!read.read){
            notifCount = notifCount + 1
        }
        }
        global.notificationCount = notifCount
        setNotificationCount(notifCount)
        console.log('notif c: ', notifCount)
    }).catch((err) => {
      console.log("error tab nav: ", err.message)
    })
    handleGetNotifCount()
  }, [])


  const handleGetNotifCount = async () => {
    try {
        await fetch(`"https://hanaplingkod.onrender.com/notification/${global.userData._id}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.accessToken
            }
        }).then(res => res.json())
        .then(data => {
            let notifCount = 0
            for(read of data){
                if(!read.read){
                    notifCount = notifCount + 1
                }
            }
            setNotificationCount(notifCount)
            // return notifCount
        })
    } catch (error) {
        console.log("error fetch notif count(tab nav): ", error)
    }
  }
  

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
                ),
                tabBarHideOnKeyboard: true,
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
        <Tab.Screen name="PostRequestPRRStack" component={PostRequests} 
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
                // tabBarBadge: notificationCount,
                tabBarBadgeStyle: {
                    backgroundColor: '#BB1E00',
                },
                tabBarIcon: ({focused}) => (
                    <Icon name="bell" size={28} color={focused ? ThemeDefaults.themeWhite : ThemeDefaults.themefadedWhite} />
                ),
            }}
        />

        {/* List of Specific Workers Tab */}
        <Tab.Screen name="ListOfSpecificWorkersTab" component={ListSpecificWorkers} 
            options={{
                tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
            }}
        />

        {/* List of Specific Workers Tab */}
        <Tab.Screen name="SubCategoryTab" component={SubCategory} 
            options={{
                tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
                
            }}
        />

        <Tab.Screen name="MapsTab" component={Maps} 
            options={{
                tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
                
            }}
        />

        <Tab.Screen name="ViewCommentsTab" component={ViewComments} 
            options={{
                tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
                
            }}
        />

        <Tab.Screen name="ReportUserTab" component={ReportUser} 
            options={{
                tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
                
            }}
        />

        {/* <Tab.Screen name="ViewCommentsTab" component={ViewComments} 
            options={{
                tabBarButton: () => <View style={{ width: 0, height: 0 }}></View>,
                
            }}
        /> */}


        {/* <Tab.Screen name="UserProfileScreen" component={UserProfile} 
            options={hiddenTabNavBtn}
        /> */}
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
