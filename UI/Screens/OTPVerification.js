import React, {useState, useRef, useEffect} from 'react';
import {
    SafeAreaView, View, TouchableOpacity, TextInput, StatusBar, StyleSheet, Alert
} from 'react-native'

import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../config';
import firebase from 'firebase/compat/app';

import Appbar from '../Components/Appbar';
import ThemeDefaults from '../Components/ThemeDefaults';
import TText from '../Components/TText';

import { useNavigation } from '@react-navigation/native';

export default function OTPVerification({route}) {
    const navigation = useNavigation();
    const {phoneNum, role, user} = route.params;

    // Firebase OTP Verification Code
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const recaptchaVerifier = useRef(null);

    const [isInvalidOTP, setInvalidOTP] = useState('false')

    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(phoneNum, recaptchaVerifier.current)
            .then(setVerificationId);
            // setPhoneNumber('');
    }

    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        console.log(`otp code is ${code}`)
        console.log(typeof code)
        firebase.auth().signInWithCredential(credential)
        .then(() => {
            Alert.alert(
                'Login Successful. Welcome to HanapLingkod',
            );
            console.log('auth successful.. going to home screen');
            navigation.navigate("WelcomeScreen", {role: role});
            setCode('');
        })
        .catch((error) => {
            alert(error);
            setInvalidOTP(true)
        })
    }

    // Send Verification with given number on the registration
    useEffect(() => {
        sendVerification();
    },[])


    // const [otp, setOTP] = useState(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)
    const [otpNum, setotpNum] = useState({
        n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",
    })

    //  isotpMatch == 0 default hidden
    //       "     == 1 not matching
    //       "     == 2 otp matched
    const [isotpMatch, setotpMatch] = useState(0)

    const num1 = useRef();
    const num2 = useRef();
    const num3 = useRef();
    const num4 = useRef();
    const num5 = useRef();
    const num6 = useRef();

  return (
    <SafeAreaView style={styles.container}>
        {/* Appbar */}
        
        <FirebaseRecaptchaVerifierModal 
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
        />

        <Appbar backBtn={true} hasPicture={false} />

        {/* header */}
        <View style={styles.body}>
            <TText style={styles.headerTitle}>Phone Number</TText>
            <TText style={styles.headerTitle}>Verification</TText>
            {/* header description */}
            <View style={styles.headerDesc}>
                <TText style={{textAlign: 'center', fontSize: 18, lineHeight: 26}}>Please enter the 6-digit OTP that we have sent to your registered phone number.</TText>
            </View>
        </View>

        {/* body | input */}
        <View style={styles.inputContainer}>
            <View style={styles.inputBox}>
                <TextInput 
                    style={styles.input}
                    keyboardType={'numeric'}
                    returnKeyType={"next"}
                    textContentType={'number'}
                    maxLength={1}
                    onChangeText={(val) => {
                        // setotpNum((prev) => ({...prev, n1: val}))
                        setCode((prev) => prev + val)
                    }}
                    onKeyPress={({nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n1: ""}))
                        } else {
                            num2.current.focus()
                        }
                    }}
                    ref={num1}
                />
            </View>
            <View style={styles.inputBox}>
                <TextInput 
                    style={styles.input}
                    keyboardType={'numeric'}
                    returnKeyType={"next"}
                    textContentType={'number'}
                    maxLength={1}
                    onChangeText={(val) => {
                        // setotpNum((prev) => ({...prev, n2: val}))
                        setCode((prev) => prev + val)
                    }}
                    onKeyPress={( {nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n2: ""}))
                            num1.current.focus()
                        } else {
                            num3.current.focus()
                        }
                    }}
                    ref={num2}
                />
            </View>
            <View style={styles.inputBox}>
                <TextInput 
                    style={styles.input}
                    keyboardType={'numeric'}
                    returnKeyType={"next"}
                    textContentType={'number'}
                    maxLength={1}
                    onChangeText={(val) => {
                        // setotpNum((prev) => ({...prev, n3: val}))
                        setCode((prev) => prev + val)
                    }}
                    onKeyPress={( {nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n3: ""}))
                            num2.current.focus()
                        } else {
                            num4.current.focus()
                        }
                    }}
                    ref={num3}
                />
            </View>
            <View style={styles.inputBox}>
                <TextInput 
                    style={styles.input}
                    keyboardType={'numeric'}
                    returnKeyType={"next"}
                    textContentType={'number'}
                    maxLength={1}
                    onChangeText={(val) => {
                        // setotpNum((prev) => ({...prev, n4: val}))
                        setCode((prev) => prev + val)
                    }}
                    onKeyPress={( {nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n4: ""}))
                            num3.current.focus()
                        } else {
                            num5.current.focus()
                        }
                    }}
                    ref={num4}
                />
            </View>
            <View style={styles.inputBox}>
                <TextInput 
                    style={styles.input}
                    keyboardType={'numeric'}
                    returnKeyType={"next"}
                    textContentType={'number'}
                    maxLength={1}
                    onChangeText={(val) => {
                        // setotpNum((prev) => ({...prev, n5: val}))
                        setCode((prev) => prev + val)
                    }}
                    onKeyPress={({nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n5: ""}))
                            num4.current.focus()
                        } else {
                            num6.current.focus()
                        }
                    }}
                    ref={num5}
                />
            </View>
            <View style={styles.inputBox}>
                <TextInput 
                    style={styles.input}
                    keyboardType={'numeric'}
                    returnKeyType={"next"}
                    textContentType={'number'}
                    maxLength={1}
                    onChangeText={(val) => {
                        // setotpNum((prev) => ({...prev, n6: val}))
                        setCode((prev) => prev + val)
                    }}
                    onKeyPress={({nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n6: ""}))
                            num5.current.focus()
                        } else {
                            console.log("end of line")
                        }
                    }}
                    ref={num6}
                />
            </View>
        </View>

        {/* If OTP is incorrect */}
        {
            isInvalidOTP ? 
            <View style={{marginBottom: 30}}>
                { isotpMatch == 0 ? null : 
                    <TText style={{
                        color: ThemeDefaults.appIcon,
                        fontFamily: 'LexendDeca_Medium',
                        fontSize: 18
                    }}>
                        Login failed. Please re-enter the OTP
                    </TText>
                }
            </View> 
        : null
        }

        {/* button | countdown/resend */}
        <View style={styles.submitContainer}>
            <TouchableOpacity 
                onPress={()=> {
                    console.log(num1.value)
                    // navigation.navigate("WelcomeScreen")
                    // setCode((prev) => `${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)
                    confirmCode()
                }}
                style={styles.submitBtn}
            >
                <TText style={styles.submitText}>Submit</TText>
            </TouchableOpacity>
            <View style={styles.resendCode}>
                <TText style={styles.resendCodeText}>Resend OTP in 1:00</TText>
            </View>
        </View>

        <View>
            <TText>{otpNum.n1} {otpNum.n2} {otpNum.n3} {otpNum.n4} {otpNum.n5} {otpNum.n6}</TText>
        </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,
        alignItems: 'center'
    },
    body: {
        alignItems: 'center',
        paddingHorizontal: '15%',
        marginTop: 60
    },
    headerTitle: {
        fontFamily: 'LexendDeca_SemiBold', 
        fontSize: 26
    },
    headerDesc: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 60
    },
    inputContainer: {
        width: '60%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 80
    },  
    inputBox: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        padding: 8
    },
    input: {
        fontSize: 30
    },
    submitContainer: {
        width: '100%',
        alignItems: 'center',
    },
    submitBtn: {
        width: '65%',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        backgroundColor: ThemeDefaults.themeOrange,
        elevation: 5
    },
    submitText: {
        fontFamily: 'LexendDeca_SemiBold',
        fontSize: 20,
        color: ThemeDefaults.themeWhite
    },
    resendCode: {
        marginTop: 20
    },
    resendCodeText: {
        color: '#a1a1a1'
    }
})