import React, { useEffect } from 'react'
import { SafeAreaView, View, Image, StatusBar, ScrollView, StyleSheet } from 'react-native';
import TText from '../Components/TText'
import { useNavigation } from '@react-navigation/native';
import Appbar from '../Components/Appbar';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { role, userID } from '../global/global';

import {IPAddress} from '../global/global'

export default function Home({route}) {


  const navigation = useNavigation();
  // const {user, role} = route.params;

  
  useEffect(() => {
    // send pushtoken to backend
    const formData = new FormData();
    formData.append("pushtoken", global.deviceExpoPushToken)

    // console.log("userData: ", global.userData._id)
    // console.log("pushToken: ", global.deviceExpoPushToken)

    fetch("http://" + IPAddress + ":3000/setToken/" + global.userData._id, {
      method: 'PUT',
      body: JSON.stringify({
        pushtoken: global.deviceExpoPushToken,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).then((req) => console.log('success'))
    .catch((err) => console.log("err : ", err.message))
  }, [])


  useEffect(() => {
    try {
      fetch("http://" + IPAddress + ":3000/notification/" + global.deviceExpoPushToken, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        }).then((res) => res.json())
        .then((data) => {
          global.notificationCount = data.length
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
    } catch {
      console.log(error)
    }
  }, [])

  

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: StatusBar.currentHeight, backgroundColor: '#fff'}}>
        <ScrollView style={{flex: 1, width: '100%',}}>
            <Appbar hasPicture={true} menuBtn={true} />
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TText>Welcome to the Home Screen of HanapLingkod</TText>
              <TText>{global.userData.firstname} {global.userData.lastname}</TText>
              <TText>{global.userData.role}</TText>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}
