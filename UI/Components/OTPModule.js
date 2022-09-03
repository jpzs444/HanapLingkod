import React, {useRef, useState, useEffect} from 'react'
import {SafeAreaView, View, TouchableOpacity, TextInput, StyleSheet, Alert, StatusBar, BackHandler} from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { firebaseConfig } from '../config';
import firebase from 'firebase/compat/app';
import TText from './TText';

import { useNavigation } from '@react-navigation/native';

function OTPModule({route}) {

    const navigation = useNavigation();
    const {phoneNum} = route.params
  
    const [phoneNumber, setPhoneNumber] = useState(phoneNum);
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const recaptchaVerifier = useRef(null);

    useEffect(() => {
        sendVerification(phoneNum)
    }, [])


    const sendVerification = (phoneNum) => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(phoneNum, recaptchaVerifier.current)
            .then(setVerificationId);
            setPhoneNumber('');
    }

    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebase.auth().signInWithCredential(credential)
        .then(() => {
            setCode('');
        })
        .catch((error) => {
            alert(error);
        })
        Alert.alert(
            'Login Successful. Welcome',
        );
    }

    return (
        <SafeAreaView>
            <FirebaseRecaptchaVerifierModal 
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
            />
            <TText>
                Login using OTP
            </TText>
            <TextInput 
                placeholder='Phone Number with Country code'
                onChangeText={setPhoneNumber}
                keyboardType='phone-pad'
                autoCompleteType='tel'
            />
            <TouchableOpacity onPress={sendVerification}>
                <TText>
                    Send Verification
                </TText>
            </TouchableOpacity>

            <TextInput 
                style={{marginTop: 100}}
                placeholder='Confirm Code'
                onChangeText={setCode}
                keyboardType='number-pad'
            />
            <TouchableOpacity onPress={confirmCode}>
                <TText>
                    Confirm Verification
                </TText>
            </TouchableOpacity>
        </SafeAreaView>


    )

}

// const styles = StyleSheet.create({
//     container: {
//         marginTop: StatusBar.currentHeight,
//         flex: 1,
//         alignItems: 'center'
//     },
//     body: {
//         alignItems: 'center',
//         paddingHorizontal: '15%',
//         marginTop: 60
//     },
//     headerTitle: {
//         fontFamily: 'LexendDeca_SemiBold', 
//         fontSize: 26
//     },
//     headerDesc: {
//         alignItems: 'center',
//         marginTop: 40,
//         marginBottom: 60
//     },
//     inputContainer: {
//         width: '60%',
//         alignItems: 'center',
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         marginBottom: 80
//     },  
//     inputBox: {
//         borderBottomWidth: 2,
//         borderBottomColor: '#000',
//         padding: 8
//     },
//     input: {
//         fontSize: 30
//     },
//     submitContainer: {
//         width: '100%',
//         alignItems: 'center',
//     },
//     submitBtn: {
//         width: '65%',
//         alignItems: 'center',
//         padding: 15,
//         borderRadius: 15,
//         backgroundColor: ThemeDefaults.themeOrange,
//         elevation: 5
//     },
//     submitText: {
//         fontFamily: 'LexendDeca_SemiBold',
//         fontSize: 20,
//         color: ThemeDefaults.themeWhite
//     },
//     resendCode: {
//         marginTop: 20
//     },
//     resendCodeText: {
//         color: '#a1a1a1'
//     }
// })

export default OTPModule