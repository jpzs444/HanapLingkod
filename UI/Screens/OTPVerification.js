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

import { useNavigation } from '@react-navigation/native';
import { IPAddress } from '../global/global';

import RnOtpTimer from 'react-native-otp-timer';

export default function OTPVerification({route}, props) {
    const navigation = useNavigation();
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

    const [isotpMatch, setotpMatch] = useState(0)

    const [otpNum, setotpNum] = useState({
        n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",
    })


    const num1 = useRef();
    const num2 = useRef();
    const num3 = useRef();
    const num4 = useRef();
    const num5 = useRef();
    const num6 = useRef();

    // Send Verification with given number on the registration
    useEffect(() => {
        sendVerification();
    },[])

    // update resend otp code countdown timer
    useEffect(() => {
        const timerId = setInterval(() => {
            if (timerRef.current !== 0 && timerPressed) {
                timerRef.current -= 1;
                setTimerCountdown(timerRef.current);
            //   sendVerification();
            } else {
                clearInterval(timerId);
                setTimerCountdown(60)
            }
        }, 1000);
    }, [timerPressed]);
  
    // is invalid otp
    useEffect(() => {
        setshowInvalidMsg(!isInvalidOTP)
    }, [isInvalidOTP]);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => handleSystemBackButton())

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", () => handleSystemBackButton())
        }
    }, [])

    const handleSystemBackButton = () => {
        navigation.navigate("Login")
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
            .then(setVerificationId);
    }

    const confirmCode = () => {
        setCode(`${otpNum.n1}${otpNum.n2}${otpNum.n3}${otpNum.n4}${otpNum.n5}${otpNum.n6}`)
        setIsLoading(true)
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        console.log(`otp code is: ${code}`)
        console.log(typeof code)
        firebase.auth().signInWithCredential(credential)
        .then(() => {
            // reset state of inputs
            setCode('');
            setotpNum({n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",})
            setInvalidOTP(false)

            // if authenticated, create the account/login
            console.log('auth successful..');

            forgotPassword && navigation.navigate("FP_Reset", {token: token})

            global.isPhoneNumVerified = true
            fromEditUserInfo ? updateUserInformation() : null

            // if authentication is successful, continue to the welcome screen
            isLogin ? console.log(" going to home screen") : null
            
            console.log("confirm code | account type: ", role)
            role === 'recruiter' ? createRecruiterAccount() : null
            role === 'worker' ? createWorkerAccount() : null
            
            setIsLoading(false)
            isLogin && navigation.replace("HomeStack");
            isLogin && fromWelcome && navigation.replace("HomeStack");
        })
        .catch((error) => {
            setCode("")
            setotpNum({n1: "", n2: "", n3: "", n4: "", n5: "", n6: "",})
            setIsLoading(false)
            setInvalidOTP(true)

            // alert(error);
            console.log("error: ", error.message)
        })
    }



    // CREATE ACCOUNT


    // CREATE RECRUITER ACCOUNT

    const createRecruiterAccount = () => {
        console.log("userType: recruiter | creater user")
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
        // formData.append("emailAddress", user.email);
        formData.append("GovId", filename);
  
        fetch("http://"+ IPAddress +":3000/signup/recruiter?username=" + user.username, {
          method: "POST",
          body: formData,
          headers: {
            "content-type": "multipart/form-data",
          },
        }).then(() => {
            console.log("Account created | recruiter");
            navigation.navigate("WelcomePage", {role: "recruiter", user: user})
        }).catch((er) => {console.log("error: ", er)})
      }



      // CREATE WORKER ACCOUNT

    const createWorkerAccount = () => {
        console.log("userType: worker | creater user")

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
        formData.append("workDescription", user.workDescription);
        // formData.append("emailAddress", user.email);
        formData.append("GovId", filename);
        // formData.append("Category", work.Category === "unlisted" ? work.Category : "");
        // formData.append("ServiceSubCategory", work[0].service);
        // formData.append("minPrice", work[0].lowestPrice);
        // formData.append("maxPrice", work[0].highestPrice);

          console.log("work length: ", work.length)
        // append work information listed by the worker from the registration
        for (let i = 0; i < work.length; i++){
            formData.append("Category", work[i].Category === "unlisted" ? work[i].Category : "");
            formData.append("ServiceSubCategory", work[i].service);
            formData.append("minPrice", work[i].lowestPrice);
            formData.append("maxPrice", work[i].highestPrice);

            console.log("work service: ", work[i].service)
        }

  
        fetch("http://"+ IPAddress +":3000/signup/worker?username=" + user.username, {
          method: "POST",
          body: formData,
          headers: {
            "content-type": "multipart/form-data",
          },
        }).then(() => {
            console.log("Account created | worker");
            //props.navigation.navigate("OTPVerification", {role: user.role});
            navigation.navigate("WelcomePage", {role: 'worker', user: user})
        }).catch((er) => {console.log("error: ", er.message)})
      }

    const updateUserInformation = () => {

        // DELETE  Update/Upload Works/Services offered by the Worker
        for(let i = 0; i < workList.length; i++){
            fetch("http://" + IPAddress + ":3000/Work/" + workList[i].ServiceSubId.ServiceSubCategory + "/" + workList[i]._id, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                },
            }).then((res) => console.log("old work set deleted successfully   ", res.message))
            .catch((error) => console.log(error.message))
        }

        // upload pasworks images upload by the worker
        fetch("http://" + IPAddress + ":3000/prevWorks/" + global.userData._id, {
            method: "PUT",
            headers: {
                "content-type": "multipart/form-data",
            },
            body: formDataPastWorks
        }).then((res) => console.log("successfully uploaded past work images"))
        .catch((error) => console.log(error.message))

        // upload new and updated set of works
        fetch("http://" + IPAddress + ":3000/Work", {
            method: "PUT",
            headers: {
                "content-type": "multipart/form-data",
            },
            body: formDataSetOfWorks
        }).then((res) => console.log("successfully uploaded and updated works"))
        .catch((error) => console.log(error.message))

        // update recruiter and worker profile picture and basic information
        fetch("http://" + IPAddress + ":3000/" + global.userData.role === 'recruiter' ? "Recruiter/" : "Worker/" + global.userData._id, {
            method: "PUT",
            headers: {
                "content-type": "multipart/form-data",
            },
            body: formDataUserInfo,
        }).then((response) => console.log("successfully updated user basic information"))
        .catch((error) => console.log(error.message))

        navigation.navigate("UserProfileScreen")
    }


  return (
    <SafeAreaView style={styles.container}>        
        
        <FirebaseRecaptchaVerifierModal 
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
        />

        <Appbar backBtn={true} hasPicture={false} otpverificationpage={true} />

        {/* header */}
        <View style={styles.body}>
            <TText style={styles.headerTitle}>Phone Number</TText>
            <TText style={styles.headerTitle}>Verification</TText>
            {/* header description */}
            <View style={styles.headerDesc}>
                <TText style={{textAlign: 'center', fontSize: 18, lineHeight: 26}}>Please enter the 6-digit OTP that we have sent to your registered phone number +63{phoneNum}.</TText>
            </View>
        </View>

        {/* body | input  */}
         <View style={styles.inputContainer}>
            <View style={styles.inputBox}>
                <TextInput 
                    style={styles.input}
                    keyboardType={'numeric'}
                    returnKeyType={"next"}
                    textContentType={'number'}
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

        {/* If OTP is incorrect */}
        {
            !showInvalidMsg ? 
            <View style={{marginBottom: 30}}>
                <TText style={{
                    color: ThemeDefaults.appIcon,
                    fontFamily: 'LexendDeca_Medium',
                    fontSize: 18
                }}>
                    Login failed, please re-enter the OTP
                </TText>
            </View> 
        : null
        }

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
            <Pressable style={styles.resendCode} onPress={()=> {
                setTimerCountdown(60);
                setTimerPressed(true);
                sendVerification();
            }}>
                {timerCountdown === 60 ? 
                    <TText style={[styles.resendCodeText, {color: ThemeDefaults.appIcon, fontSize: 18}]}>Resend OTP</TText> 
                    : <TText style={styles.resendCodeText}>{timerCountdown < 60 && timerCountdown > 9 ? `Resend OTP in 0:${timerCountdown}` : `Resend OTP in 0:0${timerCountdown}`}</TText>}
            </Pressable>
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