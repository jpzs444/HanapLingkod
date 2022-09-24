import React from 'react'
import { View, Image, TouchableOpacity, StatusBar, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import TText from '../Components/TText';
import { useNavigation } from '@react-navigation/native';
import ThemeDefaults from '../Components/ThemeDefaults';
import { IPAddress } from '../global/global';

export default function Welcome({route}) {

    const {role, user} = route.params;

    const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1, height: '100%'}}>
        <ScrollView style={{flex: 1, height: '100%'}}>
            <View style={styles.container}>
                <TText style={styles.headerTitle}>Welcome to HanapLingkod</TText>
                <TText style={styles.headersubtitle}>You have successfully registered an account!</TText>
                <TText style={styles.message}>HanapLingkod is on the process of verifying your account and personal information. It usually takes 1-3 business days</TText>
                <TText style={styles.message}>For the mean time, you may explore the application and set up your profile</TText>

                <Image style={styles.image} source={role === 'recruiter' ? require('../assets/images/bg-welcome.png'): require('../assets/images/bg-welcome-worker.png')} />

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={styles.btn}
                        // onPress={() => navigation.navigate("Login", {userD:user, role: role, username: user.username, pw: user.password, islogin: true})}
                        onPress={() => {
                            fetch("http://" + IPAddress + ":3000/login?username="+ user.username, {
                                method: "POST",
                                body: JSON.stringify({
                                username: user.username,
                                password: user.password,
                                }),
                                headers: {
                                "content-type": "application/json",
                                },
                            })
                                .then((response) => response.json())
                                .then((user) => {
                                    console.log("data: ", user);
                                    console.log("login from welcome screen")

                                    if(user._id){                                        
                                        global.userData = user;
                                        
                                        navigation.replace("HomeStack");
                                        // navigation.navigate("OTPVerification", {isLogin: true, phoneNum: user.phoneNumber, fromWelcome: true})
                                    } 

                                })
                                .catch((error) => {
                                    console.log("error: ", error.message)
                                })

                        }}
                    >
                        <TText style={styles.btnText}>Go to Homepage</TText>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: '20%'
    },
    headerTitle: {
        fontFamily: 'LexendDeca_Bold',
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 30
    },
    headersubtitle: {
        fontFamily: 'LexendDeca_SemiBold',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15,
        color: ThemeDefaults.appIcon
    },
    message: {
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 15,
        marginBottom: 20
    },
    image: {
        width: 350,
        height: 350,
        // marginVertical: 20
    },
    btnContainer: {
        marginTop: '10%',
        marginBottom: 100,
        width: '100%',
        alignItems: 'center'
    },
    btn: {
        width: '65%',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: ThemeDefaults.themeOrange,
        borderRadius: 15,
        elevation: 4,
    },
    btnText: {
        fontFamily: 'LexendDeca_SemiBold',
        fontSize: 18,
        color: ThemeDefaults.themeWhite
    },
})