import React, {useEffect, useState} from 'react'
import { SafeAreaView, View, Image, Text, StatusBar, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import TText from '../Components/TText'
import { useNavigation } from '@react-navigation/native';
import Appbar from '../Components/Appbar';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { IPAddress, role, userID } from '../global/global';

export default function Notifications({route}) {


  const navigation = useNavigation();
  // const {user, role} = route.params;
  const [notifications, setNotifications] = useState({})

  // use useEffect for componentDidMount or for when the page loads
  useEffect(() => {
    // loads all of the notifications sent to the user 
    
  }, [])

  useEffect(() => {
    fetch("http://" + IPAddress + ":300/notification/:" + global.devicePushToken, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => {
      setNotifications({...res})
    }).catch((err) => {
      console.log("error: ", err.message)
    })
  }, [])


  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1, width: '100%'}}>
            <Appbar hasPicture={true} menuBtn={true} />
            <View style={styles.header}>
              <TText style={styles.headerTitle}>Notifications</TText>
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btnUnread}>
                    <View style={styles.btnContent}>
                        <Image style={styles.btnImage} source={require('../assets/images/bg-welcome-worker.png')}/>
                        <View style={styles.btnTexts}>
                          <Text numberOfLines={3} style={styles.btnDesc}>
                            <Text style={styles.btnDescTitle}>Welcome to HanapLingkod! </Text> 
                            You have successfully registered an account! HanapLingkod is on the process of verifying your account and personal information. It usually takes 1-3 business days.
                          </Text>
                          <Text style={styles.btnTime}>5s</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnRead}>
                    <View style={styles.btnContent}>
                        <Image style={styles.btnImage} source={require('../assets/images/bg-welcome-worker.png')}/>
                        <View style={styles.btnTexts}>
                          <Text numberOfLines={3} style={styles.btnDesc}>
                            <Text style={styles.btnDescTitle}>Welcome to HanapLingkod! </Text> 
                            You have successfully registered an account! HanapLingkod is on the process of verifying your account and personal information. It usually takes 1-3 business days.
                          </Text>
                          <Text style={styles.btnTime}>5s</Text>
                        </View>
                    </View>
                </TouchableOpacity>
              </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center', 
      marginTop: StatusBar.currentHeight, 
      backgroundColor: '#fff',
    },
    header: {
      alignItems: 'center', 
      justifyContent: 'center', 
      marginTop: '3%', 
      paddingBottom: 15,
    },
    headerTitle: {
      fontFamily: 'LexendDeca_SemiBold',
    },
    btnContainer: {
      width: "85%",
      marginTop: 40,
    },
    btnContent: {
      flexDirection: 'row', padding: "5%",
    },
    btnUnread: {
      elevation: 4, 
      backgroundColor: '#fff', 
      width: "100%", 
      height: 120, 
      borderWidth: 1, 
      borderColor: 'rgba(217, 103, 43, 0.85)', 
      marginTop: '-3%', 
      borderRadius: 15, 
      marginBottom: '7.5%',
    },
    btnRead: {
      elevation: 4, 
      backgroundColor: '#fff', 
      width: "100%", 
      height: 120, 
      borderWidth: 1, 
      borderColor: 'rgba(0,0, 0, 0.05)', 
      marginTop: '-3%', 
      borderRadius: 15,
    },
    btnImage: {
      width: 80, 
      height: 80, 
      borderRadius: 50, 
      borderWidth: 1, 
      borderColor: 'rgba(0, 0, 0, 0.3)',
    },
    btnTexts: {
      flex: 1, 
      paddingLeft: "4.5%", 
      justifyContent: "space-around",
    },
    btnDesc: {
      fontSize: 14,
    },
    btnDescTitle: {
      fontFamily: 'LexendDeca_SemiBold',
    },
    btnTime: {
      fontSize: 12, 
      color: "rgba(27, 35, 58, 0.75)",
    }
  })
