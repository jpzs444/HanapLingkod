import { StyleSheet, Text, View, StatusBar, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import { useNavigation } from '@react-navigation/native'
import { IPAddress } from '../global/global'


const ForgotPassword = () => {

    const navigation = useNavigation()
    navigation.addListener("focus", ()=>{setLoading(false)})
    
    const [loading, setLoading] = useState(false)

    const [username, setUsername] = useState("")

    const handleCheckUserExist = async () => {
        setLoading(true)
        try {
            await fetch(`https://hanaplingkod.onrender.com/usernameChecker`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    username: username
                })
            })
            .then(res => res.json())
            .then(data => {
                // console.log("Success(user exist fp): ", data)
                setLoading(false)
                navigation.navigate("OTPVerification", {token: data.token, phoneNum: data.user.phoneNumber, role: data.user.role, forgotPassword: true})
            })
            // navigation.navigate("FP_Reset")
        } catch (error) {
            console.log("Error forgot password(fetch user): ", error)
        }
    }

    return (
        <View style={styles.container}>
            <Appbar onlyBackBtn={true} showLogo={true} />

            <View style={styles.body}>
                <TText style={styles.header}>Forgot Password</TText>

                <TText style={styles.instruction}>Please enter your username and we will send you a one-time passcode to confirmation and reset your password</TText>

                {/* username text input */}
                <View style={styles.inputContainer}>
                    <Icon name='account-circle' size={18} color={'#aaa'} />
                    <TextInput 
                        placeholder='username'
                        autoCapitalize={'none'}
                        onChangeText={val => setUsername(val)}
                        style={styles.textInput}
                    />
                </View>
                
                <TouchableOpacity style={styles.submitBtn}
                    activeOpacity={0.5}
                    onPress={() => {
                        handleCheckUserExist()
                    }}
                >
                    {
                        loading ? 
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" />
                        </View>
                        :
                        <TText style={styles.btnText}>Submit</TText>
                    }
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight
    },
    body: {
        marginHorizontal: 60,
        marginTop: 30,
        alignItems: 'center',
    },
    header: {
        fontFamily: "LexendDeca_Medium",
        fontSize: 20,
    },
    instruction: {
        marginTop: 40,
        marginBottom: 30,
        textAlign: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1.3,
        borderBottomColor: 'black',
        width: '80%',
        marginHorizontal: 30,
        marginVertical: 40,
        paddingHorizontal: 10,
    },
    textInput: {
        width: '90%',
        padding: 8,
        paddingLeft: 12,
        fontFamily: "LexendDeca",
        fontSize: 16,
    },
    submitBtn: {
        marginTop: 50,
        backgroundColor: ThemeDefaults.themeOrange,
        width: '90%',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 15
    },
    btnText: {
        color: ThemeDefaults.themeWhite,
        fontFamily: "LexendDeca_Medium",
        fontSize: 18
    },
    loadingContainer: {
        width: '100%',
        height: 30,
        alignItems: 'center'
    },
})