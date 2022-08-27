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
import { IPAddress } from '../global/global';

export default function OTPVerification({route}, props) {
    const navigation = useNavigation();
    const {phoneNum, role, user, singleImage, image, isLogin, work, imagelicense} = route.params;

    // Firebase OTP Verification Code
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const recaptchaVerifier = useRef(null);

    const [isInvalidOTP, setInvalidOTP] = useState('false')

    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(isLogin ? `+63${global.userData.phoneNumber}` : `+63${phoneNum}` , recaptchaVerifier.current)
            .then(setVerificationId);
    }

    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        console.log(`otp code is: ${code}`)
        console.log(typeof code)
        firebase.auth().signInWithCredential(credential)
        .then(() => {
            // if authenticated, create the account/login
            console.log('auth successful..');

            // if authentication is successful, continue to the welcome screen
            isLogin ? console.log(" going to home screen") : null
            
            role === 'recruiter' && createRecruiterAccount()
            role === 'worker' && createWorkerAccount()
            
            // reset state of inputs
            setCode('');
            setotpNum({n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",})
            
            isLogin ? navigation.replace("HomeStack") : navigation.replace("WelcomeScreen", {role: role});
        })
        .catch((error) => {
            alert(error);
            console.log("error: ", error)
            setInvalidOTP(true)
            setCode("")
            setotpNum({n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",})
        })
    }

    // Send Verification with given number on the registration
    useEffect(() => {
        sendVerification();

        // navigation.replace("HomeStack")
        // createWorkerAccount()
    },[])


    // const [otp, setOTP] = useState(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)
    const [otpNum, setotpNum] = useState({
        n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",
    })



    // CREATE ACCOUNT


    // CREATE RECRUITER ACCOUNT

    const createRecruiterAccount = () => {
        let localUri = singleImage;
        let filename = localUri.split("/").pop();
  
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
  
        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
  
        // Assume "photo" is the name of the form field the server expects
        formData.append("govId", {
          uri: localUri,
          name: filename,
          type,
        });
  
        formData.append("username", user.username);
        formData.append("password", user.password);
        formData.append("firstname", user.firstname);
        formData.append("lastname", user.lastname);
        formData.append("middlename", user.middlename);
        formData.append("birthday", user.birthday);
        formData.append("age", user.age);
        formData.append("sex", user.gender);
        formData.append("street", user.street);
        formData.append("purok", user.purok);
        formData.append("barangay", user.barangay);
        formData.append("city", user.city);
        formData.append("province", user.province);
        formData.append("phoneNumber", user.phonenumber);
        formData.append("emailAddress", user.email);
        formData.append("GovId", filename);
  
        fetch("http://"+ IPAddress +":3000/signup/recruiter?username=" + user.username, {
          method: "POST",
          body: formData,
          headers: {
            "content-type": "multipart/form-data",
          },
        }).then(() => {
          alert("Account created");
        //   props.navigation.navigate("OTPVerification", {role: user.role});
            navigation.replace("WelcomeScreen", {role: role, user: user})
        }).catch((er) => {console.log("error: ", er)})
      }



      // CREATE WORKER ACCOUNT

    const createWorkerAccount = () => {
        // Govt ID
        let localUri = singleImage;
        let filename = localUri.split("/").pop();

        // License Pic
        let uriLicense = imagelicense;
        let licensefilename = uriLicense.split("/").pop();
  
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
  
        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
  
        // Assume "photo" is the name of the form field the server expects
        formData.append("govId", {
          uri: localUri,
          name: filename,
          type,
        });

        match = /\.(\w+)$/.exec(licensefilename);
        type = match ? `image/${match[1]}` : `image`;

        // pass certificate images
        formData.append("certificate", {
            uri: uriLicense,
            name: licensefilename,
            type,
          });
  
        formData.append("username", user.username);
        formData.append("password", user.password);
        formData.append("firstname", user.firstname);
        formData.append("lastname", user.lastname);
        formData.append("middlename", user.middlename);
        formData.append("birthday", user.birthday);
        formData.append("age", user.age);
        formData.append("sex", user.gender);
        formData.append("street", user.street);
        formData.append("purok", user.purok);
        formData.append("barangay", user.barangay);
        formData.append("city", user.city);
        formData.append("province", user.province);
        formData.append("phoneNumber", user.phonenumber);
        formData.append("emailAddress", user.email);
        formData.append("GovId", filename);
        formData.append("Category", work.Category === "unlisted" ? work.Category : null);
        formData.append("ServiceSubCategory", work[0].service);
        formData.append("minPrice", work[0].lowestPrice);
        formData.append("maxPrice", work[0].highestPrice);
  
        fetch("http://"+ IPAddress +":3000/signup/worker?username=" + user.username, {
          method: "POST",
          body: formData,
          headers: {
            "content-type": "multipart/form-data",
          },
        }).then(() => {
          alert("Account created | worker");
        //   props.navigation.navigate("OTPVerification", {role: user.role});
            navigation.replace("WelcomeScreen", {role: role,})
        }).catch((er) => {console.log("error: ", er)})
      }
  






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
                        setotpNum((prev) => ({...prev, n1: val}))
                        setCode((prev) => `${prev}${val}`)
                    }}
                    onKeyPress={({nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n1: ""}))
                            code.slice(1)
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
                        setotpNum((prev) => ({...prev, n2: val}))
                        setCode((prev) => `${prev}${val}`)

                    }}
                    onKeyPress={( {nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n2: ""}))
                            code.slice(2)
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
                        setotpNum((prev) => ({...prev, n3: val}))
                        setCode((prev) => `${prev}${val}`)
                    }}
                    onKeyPress={( {nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n3: ""}))
                            code.slice(3)
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
                        setCode((prev) => `${prev}${val}`)

                    }}
                    onKeyPress={( {nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            // setotpNum((prev) => ({...prev, n4: ""}))
                            code.slice(4)
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
                        setotpNum((prev) => ({...prev, n5: val}))
                        setCode((prev) => `${prev}${val}`)

                    }}
                    onKeyPress={({nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n5: ""}))
                            code.slice(5)
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
                        setotpNum((prev) => ({...prev, n6: val}))
                        setCode((prev) => `${prev}${val}`)
                    }}
                    onKeyPress={({nativeEvent: {key: keyValue}}) => {
                        if(keyValue === 'Backspace'){
                            setotpNum((prev) => ({...prev, n6: ""}))
                            code.slice(6)
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
                    // navigation.navigate("WelcomeScreen")
                    setCode(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)
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

        <View style={{marginBottom: 100}}>
            <TText>{code}</TText>
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