import React, { useRef, useEffect, createContext, useState } from 'react';
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
import Login from '../Screens/Login';
import UserProfile from '../Screens/UserProfile';
import HomeNavigationStack from './HomeStack';
import RequestForm from '../Screens/RequestForm';
import WorkerProfile from '../Screens/WorkerProfile';
import CalendarView from '../Screens/CalendarView';
import PostRequestForm from '../Screens/PostRequestForm';
import Schedule from '../Screens/Schedule';
import VIewServiceRequest from '../Screens/VIewServiceRequest';
import AddEventCalendar from '../Screens/AddEventCalendar';
import ViewComments from '../Screens/ViewComments';
import PostRequests from '../Screens/PostRequests';
import PostRequestStack from './PostRequestStack';
import BookingInformation from '../Screens/BookingInformation';
import CompletedRequests from '../Screens/CompletedRequests';
import ConversationThread from '../Screens/ConversationThread';

import { IPAddress } from '../global/global';
import Messaging from '../Screens/Messaging';
import Requests from '../Screens/Requests';
import Bookings from '../Screens/Bookings';
import ReportUser from '../Screens/ReportUser';
import SubmitSupport from '../Screens/SubmitSupport';
import Reports from '../Screens/Reports';

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
                <Drawer.Screen name="Home_Drawer" component={TabNavigation} options={{
                    drawerLabel: "Home",
                    drawerIcon: ({color}) => (
                        <Icon name="home" size={25} color={color}  />
                    ),
                    drawerLabelStyle: {
                        fontFamily: "LexendDeca_Medium",
                        fontSize: 15
                    }
                }} />

                <Drawer.Screen name="RequestsDrawer" component={Requests} options={{
                    drawerLabel: "Requests",
                    drawerIcon: ({color}) => (
                        <Icon name="clipboard-text-multiple" size={25} color={color}  />
                    ),
                    drawerLabelStyle: {
                        fontFamily: "LexendDeca_Medium",
                        fontSize: 15
                    }
                }} />

                <Drawer.Screen name="BookingsDrawer" component={Bookings} options={{
                    drawerLabel: "Bookings",
                    drawerIcon: ({color}) => (
                        <Icon name="bookmark-box-multiple" size={25} color={color}  />
                    ),
                    drawerLabelStyle: {
                        fontFamily: "LexendDeca_Medium",
                        fontSize: 15
                    }
                }} />

                <Drawer.Screen name="CompletedBookingsDrawer" component={CompletedRequests} options={{
                    drawerLabel: "Completed Bookings",
                    drawerIcon: ({color}) => (
                        <Icon name="clipboard-check-multiple" size={25} color={color}  />
                    ),
                    drawerLabelStyle: {
                        fontFamily: "LexendDeca_Medium",
                        fontSize: 15
                    }
                }} />
                <Drawer.Screen name="MessagingDrawer" component={Messaging} options={{
                    drawerLabel: "Messaging",
                    drawerIcon: ({color}) => (
                        <Icon name="forum" size={25} color={color}  />
                    ),
                    drawerLabelStyle: {
                        fontFamily: "LexendDeca_Medium",
                        fontSize: 15
                    }
                }} />
                <Drawer.Screen name="ReportsDrawer" component={Reports} options={{
                    drawerLabel: "Reports",
                    drawerIcon: ({color}) => (
                        <Icon name="alert-circle" size={25} color={color}  />
                    ),
                    drawerLabelStyle: {
                        fontFamily: "LexendDeca_Medium",
                        fontSize: 15
                    }
                }} />

                <Drawer.Screen name="SubmitSupportDrawer" component={SubmitSupport} options={{
                    drawerLabel: "Submit Support",
                    drawerIcon: ({color}) => (
                        <Icon name="lifebuoy" size={25} color={color}  />
                    ),
                    drawerLabelStyle: {
                        fontFamily: "LexendDeca_Medium",
                        fontSize: 15
                    }
                }} />

                <Drawer.Screen name="ReportUserDrawer" component={ReportUser} options={{
                    drawerItemStyle: { display: 'none' }
                }} />
                {/* <Drawer.Screen name="RUT2" component={RegisterUserAccountType} options={{
                    drawerIcon: ({color}) => (
                        <Icon name="clipboard-edit" size={25} color={color}  />
                    ),
                    drawerLabelStyle: {
                        fontFamily: "LexendDeca_Medium",
                        fontSize: 15
                    },
                }} /> */}

                <Drawer.Screen name="ConversationThreadDrawer" component={ConversationThread} options={{
                    drawerItemStyle: { display: 'none' }
                }}/>

                <Drawer.Screen name="RequestFormDrawer" component={RequestForm} options={{
                    drawerItemStyle: { display: 'none' }
                }}/>

                <Drawer.Screen name="WorkerProfileDrawer" component={WorkerProfile} options={{
                    drawerItemStyle: { display: 'none' }
                }} />

                <Drawer.Screen name="PostRequestFormDrawer" component={PostRequestForm} options={{
                    drawerItemStyle: { display: 'none' }
                }} />

                <Drawer.Screen name="PostRequestPRRStack" component={PostRequestStack} options={{
                    drawerItemStyle: { display: 'none' }
                }}/>
                <Drawer.Screen name="ScheduleDrawer" component={Schedule} options={{
                    drawerItemStyle: { display: 'none' }
                }}/>
                <Drawer.Screen name="ViewServiceRequestDrawer" component={VIewServiceRequest} options={{
                    drawerItemStyle: { display: 'none' }
                }}/>
                <Drawer.Screen name="ViewCommentsDrawer" component={ViewComments} options={{
                    drawerItemStyle: { display: 'none' }
                }} />

                <Drawer.Screen name="BookingInformationDrawer" component={BookingInformation} 
                    options={{
                    drawerItemStyle: { display: 'none' }
                }} />


            </Drawer.Navigator>
    )
}


const styles = StyleSheet.create({

})