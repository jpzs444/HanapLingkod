import React from 'react'
import { View, Image, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import TText from '../Components/TText';
import { useNavigation } from '@react-navigation/native';
import ThemeDefaults from '../Components/ThemeDefaults';

export default function Welcome() {

    const navigation = useNavigation();

  return (
    <View style={styles.container}>
        <TText style={styles.headerTitle}>Welcome to HanapLingkod</TText>
        <TText style={styles.headersubtitle}>You have successfully registered an account!</TText>
        <TText style={styles.message}>HanapLingkod is on the process of verifying your account and personal information. It usually takes 1-3 business days</TText>
        <TText style={styles.message}>For the mean time, you may explore the application and set up your profile</TText>

        <Image style={styles.image} source={require('../assets/images/bg-welcome.png')} />

        <View style={styles.btnContainer}>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate("Home")}
            >
                <TText style={styles.btnText}>Go to Homepage</TText>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: 'LexendDeca_Bold',
        fontSize: 30,
        marginBottom: 30
    },
    headersubtitle: {
        fontFamily: 'LexendDeca_SemiBold',
        fontSize: 18,
        marginBottom: 15,
        color: ThemeDefaults.appIcon
    },
    message: {
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 60,
        marginBottom: 20
    },
    image: {
        width: 350,
        height: 350,
        marginVertical: 20
    },
    btnContainer: {
        marginTop: 90,
        marginBottom: 20,
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