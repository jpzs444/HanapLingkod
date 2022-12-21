import { StyleSheet, Text, View, StatusBar, BackHandler } from 'react-native'
import React, {useEffect} from 'react'
import LottieView from "lottie-react-native";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import TText from '../Components/TText';

const CreateAccountLoading = ({route}) => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const {
        phoneNum, role, user, singleImage, image, token,
        isLogin, work, imagelicense, fromWelcome, forgotPassword,
        fromEditUserInfo, formDataUserInfo, formDataPastWorks, formDataSetOfWorks, 
        workList, video
    } = route.params;


    // disable system/hardware back button
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => {return true})

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", () => {return true})
        }
    }, []);


    // componentdidload
    useEffect(() => {
        // if authenticated, create the account/login
        console.log('auth successful..');

        forgotPassword && navigation.navigate("ResetPassword_LS", {token: token})

        global.isPhoneNumVerified = true
        fromEditUserInfo ? updateUserInformation() : null

        // if authentication is successful, continue to the welcome screen
        isLogin ? console.log(" going to home screen") : null
        
        console.log("confirm code | account type: ", role)
        role === 'recruiter' ? createRecruiterAccount() : null
        role === 'worker' ? createWorkerAccount() : null
        
        // setIsLoading(false)
        isLogin && navigation.navigate("HomeStack");
        isLogin && fromWelcome && navigation.navigate("HomeStack");

    }, []);


    // functions


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

        localUri = video
        filename = localUri.split("/").pop()
        match = /\.(\w+)$/.exec(filename);
        type = match ? `video/${match[1]}` : `video`;

        formData.append("Liveness", {
            uri: localUri,
            name: filename,
            type
        })
  
        formData.append("username", user.username);
        formData.append("password", user.password);
        formData.append("firstname", user.firstname);
        formData.append("lastname", user.lastname);
        formData.append("middlename", user.middlename ? user.middlename : "");
        formData.append("emailAddress", user.email);
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
  
        fetch("https://hanaplingkod.onrender.com/signup/recruiter?username=" + user.username, {
          method: "POST",
          body: formData,
        }).then(() => {
            // console.log("Account created | recruiter");
            // setLoadingLogin(false)
            navigation.navigate("WelcomePage", {role: "recruiter", user: user})
        }).catch((er) => {console.log("error: account creation - recruiter:  ", er)})
      }



      // CREATE WORKER ACCOUNT

    const createWorkerAccount = () => {
        console.log("userType: worker | creater user")

        // Govt ID
        let localUri = singleImage;
        let filename = localUri.split("/").pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        
        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();
        
        // ID
        // Assume "photo" is the name of the form field the server expects
        if(singleImage) {
            formData.append("govId", {
                uri: localUri,
                name: filename,
                type,
            });
        }
        
        // License Pic
        if(imagelicense !== ""){
            let uriLicense = imagelicense;
            let licensefilename = uriLicense.split("/").pop();
    
            match = /\.(\w+)$/.exec(licensefilename);
            type = match ? `image/${match[1]}` : `image`;
    
            // license/certificate
            // pass certificate images
            formData.append("certificate", {
                uri: uriLicense,
                name: licensefilename,
                type,
            });
        }

        localUri = video
        filename = localUri.split("/").pop()
        match = /\.(\w+)$/.exec(filename);
        type = match ? `video/${match[1]}` : `video`;

        formData.append("Liveness", {
            uri: localUri,
            name: filename,
            type
        })
  
        formData.append("username", user.username);
        formData.append("password", user.password);
        formData.append("firstname", user.firstname);
        formData.append("lastname", user.lastname);
        formData.append("middlename", user.middlename ? user.middlename : "");
        formData.append("emailAddress", user.email);
        formData.append("birthday", user.birthday);
        formData.append("age", user.age);
        formData.append("sex", user.gender);
        formData.append("street", user.street);
        formData.append("purok", user.purok);
        formData.append("barangay", user.barangay);
        formData.append("city", user.city);
        formData.append("province", user.province);
        formData.append("phoneNumber", user.phonenumber);
        formData.append("workDescription", user.workDescription ? user.workDescription : "");
        // formData.append("GovId", filename);

        //   console.log("work length: ", work.length)
        // append work information listed by the worker from the registration
        for (let i = 0; i < work.length; i++){
            formData.append("Category", work[i].category == "unlisted" ? "unlisted" : "");
            formData.append("ServiceSubCategory", work[i].service);
            formData.append("minPrice", work[i].lowestPrice);
            formData.append("maxPrice", work[i].highestPrice);

            // console.log("work service: ", work[i].service)
        }

        // setLoadingLogin(false)
  
        fetch("https://hanaplingkod.onrender.com/signup/worker?username=" + user.username, {
          method: "POST",
          body: formData,
        }).then(() => {
            console.log("Account created | worker");
            //props.navigation.navigate("OTPVerification", {role: user.role});
            navigation.navigate("WelcomePage", {role: 'worker', user: user})
        }).catch((er) => {console.log("error: sign up worker: ", er.message)})
      }

    const updateUserInformation = () => {

        // DELETE  Update/Upload Works/Services offered by the Worker
        for(let i = 0; i < workList.length; i++){
            fetch("https://hanaplingkod.onrender.com/Work/" + workList[i].ServiceSubId.ServiceSubCategory + "/" + workList[i]._id, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    "Authorization": global.accessToken
                },
            }).then((res) => {
                // setLoadingLogin(false)
                // console.log("old work set deleted successfully   ")
            })
            .catch((error) => console.log("error upldate services: ", error.message))
        }

        // upload pasworks images upload by the worker
        fetch("https://hanaplingkod.onrender.com/prevWorks/" + global.userData._id, {
            method: "PUT",
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": global.accessToken
            },
            body: formDataPastWorks
        }).then((res) => {
            // setLoadingLogin(false)
            // console.log("successfully uploaded past work images")
        })
        .catch((error) => console.log("error prevworks: ", error.message))

        // upload new and updated set of works
        fetch("https://hanaplingkod.onrender.com/Work", {
            method: "PUT",
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": global.accessToken
            },
            body: formDataSetOfWorks
        }).then((res) => {
            // setLoadingLogin(false)
            console.log("successfully uploaded and updated works")
        })
        .catch((error) => console.log("error upload new works: ", error.message))

        // update recruiter and worker profile picture and basic information
        fetch("https://hanaplingkod.onrender.com/" + global.userData.role === 'recruiter' ? "Recruiter/" : "Worker/" + global.userData._id, {
            method: "PUT",
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": global.accessToken
            },
            body: formDataUserInfo,
        }).then((response) => {
            // setLoadingLogin(false)
            console.log("successfully updated user basic information")
        })
        .catch((error) => console.log("error update picture: ", error.message))

        navigation.navigate("UserProfileScreen")
    }

    return (
        <View style={styles.container}>
        {
            isLogin ? 
            <>
                <LottieView
                    source={require("../assets/loader/time-loading.json")}
                    style={styles.animation}
                    autoPlay
                />
                <TText style={{textAlign: 'center', marginTop: 40, fontFamily: "LexendDeca_Medium"}}>Loging you in</TText>
            </>
            :
            <LottieView
                source={require("../assets/loader/create.json")}
                style={styles.animation}
                autoPlay
            />
        }
        </View>
    )
}

export default CreateAccountLoading

const styles = StyleSheet.create({
    animation: {
        width: 300,
        height: 300,
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fff"
    }
})