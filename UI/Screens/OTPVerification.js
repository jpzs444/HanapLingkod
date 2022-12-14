import React, {useState, useRef, useEffect} from 'react';
import {
    SafeAreaView, View, TouchableOpacity, TextInput, StatusBar, StyleSheet, ActivityIndicator, Pressable, BackHandler
} from 'react-native'

import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../config';
import firebase from 'firebase/compat/app';

import Appbar from '../Components/Appbar';
import ThemeDefaults from '../Components/ThemeDefaults';
import TText from '../Components/TText';

import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { IPAddress } from '../global/global';

import RnOtpTimer from 'react-native-otp-timer';
import DialogueModal from '../Components/DialogueModal';

export default function OTPVerification(props) {
    const navigation = useNavigation();
    const isFocused = useIsFocused()
    
    const route = useRoute()

    const {phoneNum, role, user, singleImage, image, token,
        isLogin, work, imagelicense, fromWelcome, forgotPassword,
        fromEditUserInfo, formDataUserInfo, formDataPastWorks, formDataSetOfWorks, workList
    } = route.params;

    // Firebase OTP Verification Code
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const recaptchaVerifier = useRef(null);

    const [isInvalidOTP, setInvalidOTP] = useState(false)
    const [showInvalidMsg, setshowInvalidMsg] = useState(false)

    const [timerCountdown, setTimerCountdown] = useState(60);
    const [timerPressed, setTimerPressed] = useState(false);
    const timerRef = useRef(timerCountdown)

    const [isLoading, setIsLoading] = useState(false);

    const [loadingLogin, setLoadingLogin] = useState(false)

    const [isotpMatch, setotpMatch] = useState(0)

    const [otpNum, setotpNum] = useState({
        n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",
    })

    const [tooManyOTPRequests, setTooManyOTPRequests] = useState(false)
    const [startTimer, setStartTimer] = useState(true)


    const num1 = useRef();
    const num2 = useRef();
    const num3 = useRef();
    const num4 = useRef();
    const num5 = useRef();
    const num6 = useRef();

    // Send Verification with given number on the registration
    useEffect(() => {
        setotpNum({n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",})
        setStartTimer(true)
        sendVerification();
    },[isFocused])

    // update resend otp code countdown timer
    useEffect(() => {
        // const timerId = setInterval(() => {
        //     if (timerRef.current !== 0 && timerPressed) {
        //         timerRef.current -= 1;
        //         setTimerCountdown(timerRef.current);
        //     //   sendVerification();
        //     } else {
        //         clearInterval(timerId);
        //         setTimerCountdown(60)
        //     }
        // }, 1000);

        const tim = setInterval(() => setTimerCountdown(prev => prev - 1), 1000)

        if(Number(timerCountdown) === 0){
            setStartTimer(false)
            setTimerCountdown(60)
        }

        return () => {
            clearInterval(tim)
        }
    }, [timerPressed, isFocused, timerCountdown]);
  
    // is invalid otp
    useEffect(() => {
        setshowInvalidMsg(!isInvalidOTP)
    }, [isInvalidOTP]);


    // system back button handler
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => handleSystemBackButton())

        // return () => {
        //     BackHandler.removeEventListener("hardwareBackPress", () => handleSystemBackButton())
        // }
    }, [])

    const handleSystemBackButton = () => {
        navigation.navigate("Login")
        return true
    }


    if(isLoading){
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }


    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(isLogin ? `+63${global.userData.phoneNumber}` : `+63${phoneNum}` , recaptchaVerifier.current)
            .then(setVerificationId)
            .catch((error) => {
                console.log("error confirm code", error.message)
                // setTooManyOTPRequests(true)
                // navigation.goBack()
            })
    }

    const confirmCode = () => {
        setCode(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        
        setStartTimer(true)

        console.log(`otp code is: ${code}`)
        console.log(typeof code)

        firebase.auth().signInWithCredential(credential)
            .then(() => {
                // reset state of inputs
                setCode('');
                setotpNum({n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",})
                setInvalidOTP(false)

                forgotPassword ? navigation.navigate("ResetPassword_LS", {token: token})
                :
                // go to create accout screen
                navigation.navigate("CreateAccountLoading", {
                    phoneNum: phoneNum, 
                    role: role, 
                    user: user, 
                    singleImage: singleImage, 
                    image: image, 
                    token: token,
                    isLogin: isLogin, 
                    work: work, 
                    imagelicense: imagelicense, 
                    fromWelcome: fromWelcome, 
                    forgotPassword: forgotPassword,
                    fromEditUserInfo: fromEditUserInfo, 
                    formDataUserInfo: formDataUserInfo, 
                    formDataPastWorks: formDataPastWorks, 
                    formDataSetOfWorks: formDataSetOfWorks, 
                    workList: workList
                })
                
            })
        .catch((error) => {
            setCode("")
            setotpNum({n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",})
            setInvalidOTP(true)

            // alert(error);
            console.log("error otp verification: ", error.message)
        })
    }

    const handleTooManyRequestsModal = () => {
        setTooManyOTPRequests(false)
        handleNavGoBack()
    }

    const handleNavGoBack = () => {
        navigation.goBack()
    }



    return (
        <SafeAreaView style={styles.container}>        
            
            <FirebaseRecaptchaVerifierModal 
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
                title="Prove you are human"
            />

            <DialogueModal 
                firstMessage={"Invalid OTP!"}
                secondMessage={"Please enter the OTP we sent you"}
                warning
                numBtn={1}
                visible={isInvalidOTP}
                onDecline={setInvalidOTP}
            />

            <DialogueModal 
                firstMessage={"Too many OTP requests. Please try again later"}
                secondMessage={""}
                visible={tooManyOTPRequests}
                numBtn={1}
                onDecline={handleTooManyRequestsModal}
            />

            <Appbar onlyBackBtn={true} otpverificationpage={!isLogin} fromLogin={isLogin} />

            {/* header */}
            <View style={styles.body}>
                <TText style={styles.headerTitle}>Phone Number</TText>
                <TText style={styles.headerTitle}>Verification</TText>
                {/* header description */}
                <View style={styles.headerDesc}>
                    <TText style={{textAlign: 'center', fontSize: 18, lineHeight: 26}}>Please enter the 6-digit OTP that we have sent to your registered phone number +63{phoneNum}</TText>
                </View>
            </View>

            {
                loadingLogin &&
                <View style={{position: 'absolute', top: 0, right: 0, flexGrow: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: "center", backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 5}}>
                    <ActivityIndicator size={'large'} />
                </View>
            }

            {/* body | input  */}
            <View style={styles.inputContainer}>
                <View style={styles.inputBox}>
                    <TextInput 
                        style={styles.input}
                        keyboardType={'numeric'}
                        returnKeyType={"next"}
                        textContentType={'number'}
                        val={otpNum.n1 ? otpNum.n1 : ""}
                        maxLength={1}
                        onChangeText={(val) => {
                            setotpNum({...otpNum, n1: val})
                            val ? num2.current.focus() : null

                            // setCode((prev) => `${prev}${val}`)
                            setCode(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)

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
                        val={otpNum.n2 ? otpNum.n2 : ""}
                        maxLength={1}
                        onChangeText={(val) => {
                            setotpNum({...otpNum, n2: val})
                            val ? num3.current.focus() : num1.current.focus()

                            // setCode((prev) => `${prev}${val}`)
                            setCode((prev) => `${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)

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
                        val={otpNum.n3 ? otpNum.n3 : ""}
                        maxLength={1}
                        onChangeText={(val) => {
                            setotpNum({...otpNum, n3: val})
                            val ? num4.current.focus() : num2.current.focus()
                            // setCode((prev) => `${prev}${val}`)
                            setCode(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)


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
                        val={otpNum.n4 ? otpNum.n4 : ""}
                        maxLength={1}
                        onChangeText={(val) => {
                            setotpNum({...otpNum, n4: val})
                            val ? num5.current.focus() : num3.current.focus()
                            // setCode((prev) => `${prev}${val}`)
                            setCode(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)

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
                        val={otpNum.n5 ? otpNum.n5 : ""}
                        maxLength={1}
                        onChangeText={(val) => {
                            setotpNum({...otpNum, n5: val})
                            val ? num6.current.focus() : num4.current.focus()
                            // setCode((prev) => `${prev}${val}`)
                            setCode(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)

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
                        val={otpNum.n6 ? otpNum.n6 : ""}
                        maxLength={1}
                        onChangeText={(val) => {
                            setotpNum({...otpNum, n6: val})
                            !val && num5.current.focus()
                            console.log(otpNum.n6)
                            console.log(val)
                            // setCode((prev) => `${prev}${val}`)
                            setCode(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${val}`)

                        }}
                        ref={num6}
                    />
                </View>
            </View>


            {/* button | countdown/resend */}
            <View style={styles.submitContainer}>
                <TouchableOpacity 
                    onPress={()=> {
                        
                        // transform number inputs into a string for phone verification
                        setCode("")
                        setCode(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)
                        console.log("input otp: ", code)
                        confirmCode()
                        // navigation.navigate("HomeStack")
                    }}
                    style={styles.submitBtn}
                >
                    <TText style={styles.submitText}>Verify</TText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resendCode} 
                    disabled={startTimer}
                    onPress={()=> {
                        setStartTimer(true)
                        setTimerCountdown(60);
                        setTimerPressed(true);
                        if(!startTimer){
                            sendVerification();
                        }
                    }}
                >
                    {!startTimer ? 
                        <TText style={[styles.resendCodeText, {color: ThemeDefaults.appIcon, fontSize: 18}]}>Resend OTP</TText> 
                        : <TText style={styles.resendCodeText}>{timerCountdown < 60 && timerCountdown > 9 ? `Resend OTP in 0:${timerCountdown}` : `Resend OTP in 0:0${timerCountdown}`}</TText>}
                </TouchableOpacity>
            </View>

            <View>
                {/* <TText>{code}</TText> */}
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
        marginTop: 28,
        flexDirection: 'row'
    },
    resendCodeText: {
        color: '#a1a1a1'
    }
})