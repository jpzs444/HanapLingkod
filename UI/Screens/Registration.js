import React, {useRef, useState, useEffect, useFocusEffect} from 'react';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, 
  Image, Button, StyleSheet, StatusBar, ScrollView, Modal, 
  Platform, Dimensions, BackHandler, InteractionManager } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ModalPicker } from '../Components/ModalPicker';

import * as ImagePicker from 'expo-image-picker';
import { AssetsSelector } from 'expo-images-picker';
// import ImagePicker from 'react-native-image-crop-picker';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import dayjs from 'dayjs';
import Appbar from '../Components/Appbar';
import TText from '../Components/TText';
import ConfirmDialog from '../Components/ConfirmDialog';

import ThemeDefaults from '../Components/ThemeDefaults';
import ModalDialog from '../Components/ModalDialog';
// import ImagesPicker from '../Components/ImagesPicker';
import { IPAddress } from '../global/global';
import OTPVerification from './OTPVerification';
import DialogueModal from '../Components/DialogueModal';

import { Camera, CameraType } from 'expo-camera'
import { Video } from 'expo-av'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

export default function Registration({route}) {

    const {userType} = route.params;

    const navigation = useNavigation();
    const isFocused = useIsFocused()
    
    const [placeholderPhoneNum, setPlaceholderPhoneNum] = useState("Phone Number")
    const [user, setUser] = useState({
      username: "", password: "", firstname: "", email: "",
      lastname: "", age: "", gender: "", street: "",
      purok: "", barangay: "", city: "Daet", province: "Camarines Norte", phonenumber: "",
      role: userType,
    })

    const [confirmPW, setConfirmPW] = useState("")
    const [pwMatch, setPWMatch] = useState(true);

    
    const [next, setNext] = useState(1)
    const [nextNum, setNextNum] = useState(1)

    const [isConfirm, setisConfirm] = useState(false)
    const [chooseData, setchooseData] = useState("")
    const [chooseBarangay, setchooseBarangay] = useState("")
    const [services, setServices] = useState([
      {
        service:"",
      },
    ])
    
    const [isModalVisible, setModalVisible] = useState(false)
    
    const [hidePW, sethidePW] = useState(true)
    
    const [isSexModalVisible, setSexModalVisible] = useState(false)
    const [isBarangayModalVisible, setBarangayModalVisible] = useState(false)
    const [isSubCatModalVisible, setSubCatModalVisible] = useState(false)
    
    const [viewSubmitModal, setViewSubmitModal] = useState(false)
    
    const [isUnlistedModalVisible, setUnlistedModalVisible] = useState(false)
    const [showAddUnlistedServiceModal, setshowAddUnlistedServiceModal] = useState(true)
    const [hasBlanks, sethasBlanks] = useState(false)
    
    const [showDialog, setShowDialog] = useState(false)
    const [isConfirmed, setisConfirmed] = useState(false)
    
    const [formatedDate, setFormatedDate] = useState(new Date())
    const [displayDate, setDisplayDate] = useState(new Date())
    const [dateSelected, setSelected] = useState(false)
    
    const [datePickerVisible, setDatePickerVisibility] = useState(false);
    
    const [isUsernameAvailable, setUsernameAvailable] = useState(false)
    const [isUsernameUnique, setIsUsernameUnique] = useState(true)
    
    const [gobtnNext, setgobtnNext] = useState(true)
    
    const [isPriceValid, setIsPriceValid] = useState(true)
    
    const [didClickCreatAccountButton, setDidClickCreateAccountButton] = useState(false)
    
    
    // video
    const [isRecording, setIsRecording] = useState(false)
    const [video, setVideo] = useState()
    const [cameraPersmission, setCameraPermission] = useState()
    const [microphonePersmission, setMicrophonePermission] = useState()
    const [medialibraryPersmission, setMedialibraryPermission] = useState()
    const [videoCountdown, setVideoCountdown] = useState(10)

    const [showRecordVideo, setShowRecordVideo] = useState(false)
    const [showRecordVideoModal, setShowRecordVideoModal] = useState(false)

    const cameraRef = useRef()

    useEffect(() => {
      (async () => {
        const cameraPersmission = await Camera.requestCameraPermissionsAsync()
        const mircrophonePermission = await Camera.requestMicrophonePermissionsAsync()

        setCameraPermission(cameraPersmission.status === 'granted')
        setMicrophonePermission(mircrophonePermission.status === 'granted')
      })()
    }, []);


    useEffect(() => {
      setisConfirmed(false)
      setShowRecordVideo(false)
      setVideoCountdown(10)

    }, [isFocused]);


    useEffect(() => {
      user.password === confirmPW ? setPWMatch(true) : setPWMatch(false)
    }, [confirmPW, user.password])

    useEffect(() => {
      setgobtnNext(isUsernameUnique && pwMatch)
    }, [isUsernameUnique, pwMatch])

    useEffect(() => {
      // console.log(user.username)
      fetch('https://hanaplingkod.onrender.com/isUsernameUnique', {
        method: "POST",
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          "username": user.username,
        }),
      }).then((response) => response.json())
      .then((isUnique) => {
        setIsUsernameUnique(isUnique)
        // console.log(isUnique)
      }).catch((error) => console.log(error.message))
    }, [user.username])

    // componentdidmount
    // use effect is for back button found on the phone
    useEffect(() => {
      // console.log("backbtn pressed");
      BackHandler.addEventListener("hardwareBackPress", ()=>handleSystemBackButton())
      
      // componentwillunmount
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", ()=>handleSystemBackButton())
        setShowDialog(false)
      }
    }, [next]);


    const startRecording = () => {
      setIsRecording(true)
      console.log("recording...")
      let options = {
        quality: "480p",
        maxDuration: 10,
        mute: true,
      }

      
      const tim = setInterval(() => setVideoCountdown(prev => prev - 1), 1000)
      
      if(Number(videoCountdown) === 0){
          clearInterval(tim)
          setIsRecording(false)
          setShowRecordVideo(false)
          setVideoCountdown(10)
          cameraRef.current.stopRecording()
      }

      cameraRef.current.recordAsync(options)
        .then((recordedVideo) => {
          console.log("recorded video")
          clearInterval(tim)
          setVideo(recordedVideo)
          setIsRecording(false)
          setShowRecordVideo(false)
          setVideoCountdown(10)
        })
      
    }

    const stopRecording = () => {
      setIsRecording(false)
      cameraRef.current.stopRecording()
    }

    
    const ageChecker = () => {
      const yearNow = new Date().getFullYear()
      let userAge = new Date(user.birthday).getFullYear()


      let age = yearNow - userAge

      let today = new Date()
      let bday = new Date(user.birthday)
      if(today.getMonth() < bday.getMonth() || (today.getMonth() === bday.getMonth() && today.getDate() < bday.getDate())){
        age = age - 1
      }
      // console.log("age: ", age)
      // handleSetAge(age)

      // console.log("age > 18: ", (yearNow - userAge) > 18)
      // setUser((prev) => ({...prev, age: age}))

      return age > 17
    }


    const handleSystemBackButton =()=> {
      if(next === 1) {
        navigation.goBack()
        return true
      } else {
        setNext((prev)=> prev-1)
        return true;
      }
    }

    const handleServiceAdd = () => {
      setServices([...services, {service: "", lowestPrice: "", highestPrice: ""}])
      haveBlanks()
    }

    const handleServiceSelect = (val, index) => {
      // const {value} = val.value;
      const list = [...services];
      // console.log("val handle service: ", val)

      if(val.sub_category == "unlisted" || val == "unlisted"){
        list[index]['category'] = 'unlisted'
        // console.log("val --- unlisted")
      } else {
        // console.log("val: ", val.Category)
  
        list[index]['service'] = val.ServiceSubCategory;
        list[index]['category'] = "";
        setServices(list)
      }
      haveBlanks()

      // console.log(services)
    }

    const handleServiceChange = (val, index) => {
      // const {value} = val.value;
      const list = [...services];
      if (val.sub_category === "Unlisted (Add new subcategory)"){
        list[index]['status'] = "unlisted";
        list[index]['service'] = "";
        list[index]['category'] = "";
        setUnlistedModalVisible(true)
      } else {
        if (list[index]['status'] === "unlisted"){
          list[index]['service'] = val.sub_category;
          list[index]['status'] = "";
          list[index]['category'] = "";
        }
        list[index]['service'] = val.sub_category;
        list[index]['category'] = val.category;
      }
      setServices(list)
      haveBlanks()

      // console.log(services)
    }

    const handleServiceLowPrice = (val, index) => {
      // const {value} = val.value;
      const list = [...services];
      list[index]['lowestPrice'] = val;
      setServices(list)
      // console.log("lowPrice: ", services)
      if(Number(list[index]['lowestPrice']) < Number(list[index]['highestPrice'])){
        setIsPriceValid(true)
      } else {
        setIsPriceValid(false)
      }
      haveBlanks()
    }

    const handleServiceHighPrice = (val, index) => {
      // const {value} = val.value;
      const list = [...services];
      list[index]['highestPrice'] = val;
      setServices(list)
      // console.log("highPrice: ", services)
      if(Number(list[index]['lowestPrice']) < Number(list[index]['highestPrice'])){
        setIsPriceValid(true)
      } else {
        setIsPriceValid(false)
      }
      haveBlanks()
    }

    const handleServiceUnlisted = (val, index) => {
      const list = [...services];
      list[index]['service'] = val
      setServices(list)
      // console.log("unlisted: ", services)
      haveBlanks()
    }

    const handleServiceRemove = (index) => {
      const list = [...services];
      // console.log(list)
      list.splice(index, 1);
      setServices(list)
      // console.log(list)

      haveBlanks()
    }

    const handleRemoveImage = (index) => {
      const list = [...image]

      list.splice(index, 1)
      // console.log(list)
      
      setImage(list)
    }

    const haveBlanks = () => {
      let arr = Object.values(services)      
      let arrUser = Object.values(user)
      let arrUser2 = Object.values(arrUser)
      let userJ = 1, job;

      // console.log("arr services: ", arr)
      // console.log("arrUser: ", Object.values(arrUser2))

      for(let el of arrUser){
        job = Object.values(el).includes("") ? 0 : 1
      }

      for(let el of arrUser2){
        // console.log("el of arrUser2: ", el)
        // userJ = el.includes("") ? 0 : 1
        if(el.length === 0){
          userJ = 0
        } 
      }

      if(user.role == "recruiter"){
        if(userJ === 1) {
          sethasBlanks(false)
          // setShowDialog(true)
        } else {
          sethasBlanks(true)
          // show modal/error message to not leave any form "unasnswered"
          // setShowDialog(false)
        }

        // console.log("userJ: ", r)
      } else (job+userJ) === 2 ? sethasBlanks(true) : sethasBlanks(false)
      // console.log(job + " " + userJ)
    }

    const setData = (option) => {
      setchooseData(option)
      setUser((prev) => ({...prev, gender: option}))
      haveBlanks()
    }

    const setBarangay = (option) => {
      setchooseBarangay(option)
      setUser((prev) => ({...prev, barangay: option}))
      haveBlanks()
    }

    const setServiceOffered = (option) => {
      setServices(option)
    }

    const didConfirm = (isConfirmed) => {
      setShowDialog(false)
      setisConfirmed(true)
      // console.log("didConfirm")
    }
   
    const changeModalVisibility = (bool) => {
      setModalVisible(bool)
    }

    const changeSubCategoryModalVisibility = (bool) => {
      setSubCatModalVisible(bool)
    }

    const changeBarangayModalVisibility = (bool) => {
      setBarangayModalVisible(bool)
    }

    const changeSexModalVisibility = (bool) => {
      setSexModalVisible(bool)
    }

    const changeModalDialogVisibility = (bool) => {
      setShowDialog(bool)
      // setUnlistedModalVisible(bool)
    }

    // const changeModalServiceVisibility = (bool) => {
    //   setModalServiceVisible(bool)
    // }

    const handleConfirm = (date) => {
      let dateString = dayjs(date).format("YYYY-MM-DD").toString()
      setFormatedDate(...dateString);
      setDisplayDate(dayjs(date).format("MMM D, YYYY"));
      setDatePickerVisibility(false);
      setSelected(true)
      setUser((prev) => ({...prev, birthday: dateString}))

      const yearNow = new Date().getFullYear()
      let userAge = new Date(date).getFullYear()

      let age = yearNow - userAge

      let today = new Date()
      let bday = new Date(date)
      if(today.getMonth() < bday.getMonth() || (today.getMonth() === bday.getMonth() && today.getDate() < bday.getDate())){
        age = age - 1
      }
      console.log("age: ", age)
      setUser((prev) => ({...prev, age: age}))

      ageChecker()

      haveBlanks()
      // console.log(dateString)
    };

    // OPEN IMAGE PICKER
    // multi ID images
    const [image, setImage] = useState([]);
    //single ID image
    const [singleImage, setSingleImage] = useState('');

    // multi license images
    const [imagelicense, setLicenseImage] = useState([]);
    //single license image
    const [imageSingleLicense, setSingleLicenseImage] = useState('');

    const [statusImagePickerUseLibraryPermission, setImagePickerUserPermission] = ImagePicker.useMediaLibraryPermissions();


    const [isPriceGreater, setIsPriceGreater] = useState(true)
    useEffect(() => {
      // console.log("hp", services[0].highestPrice)
      if(services[0].highestPrice > services[0].lowestPrice){
        setIsPriceGreater(true)
      } else {
        setIsPriceGreater(false)
      }
    }, [services[0].lowestPrice, services[0].highestPrice])

    useEffect(() => {
      const requesPermission = async () => {
        if (Platform.OS !== "web") {
          const { status } =
            // await ImagePicker.useMediaLibraryPermissions();
            await ImagePicker.requestCameraPermissionsAsync();
            // setImagePickerUserPermission(ImagePicker.useMediaLibraryPermissions())
          if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
          }
        }
      }
      // (async () => {
      //   if (Platform.OS !== "web") {
      //     const { status } =
      //       // await ImagePicker.useMediaLibraryPermissions();
      //       await ImagePicker.requestCameraPermissionsAsync();
      //       // setImagePickerUserPermission(ImagePicker.useMediaLibraryPermissions())
      //     if (status !== "granted") {
      //       alert("Sorry, we need camera roll permissions to make this work!");
      //     }
      //   }
      // })();
      requesPermission()

    }, []);

    const pickImage = async () => {

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.5,
      });

      // console.log("selected", result.selected);

      if (!result.cancelled) {
        if(!result.selected && next !== 3) {
          setSingleImage(result.uri)
          setImage([])
        }
        else if(next === 3) {
          if(!result.selected) {
            setSingleLicenseImage(result.uri)
            setLicenseImage([])
          }
          else {
            setLicenseImage([...result.selected])
            setSingleLicenseImage("")
          }
        }
        else {
          setImage([...result.selected])
          setSingleImage("")
        }
      }
      // console.log("Image state: ", image)
    };

    // references for textinput onSubmit
    const ref_email = useRef();
    const ref_pw = useRef();
    const ref_cpw = useRef();
    const ref_fn = useRef();
    const ref_mn = useRef();
    const ref_ln = useRef();
    const ref_age = useRef();

    const [loaded] = useFonts({
        LexendDeca: require('../assets/fonts/LexendDeca-Regular.ttf'),
        LexendDeca_Medium: require('../assets/fonts/LexendDeca-Medium.ttf'),
        LexendDeca_SemiBold: require('../assets/fonts/LexendDeca-SemiBold.ttf'),
        LexendDeca_Bold: require('../assets/fonts/LexendDeca-Bold.ttf'),
        LexendDecaVar: require('../assets/fonts/LexendDeca-VariableFont_wght.ttf'),
      });
    
    if (!loaded) {
      return null;
    }


    const handleUsernameAvailable = (val) => {
      fetch(`https://hanaplingkod.onrender.com/isUsernameUnique`, {
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          username: val,
        }),
      }).then((response) => response.json())
      .then((isUnique) => {
        // console.log("username taken: ", isUnique)
        setIsUsernameUnique(isUnique)
      })
      .catch((error) => console.log(error.message))
    }

    const handleVerifyEmail = (val) => {
      if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)){
          // return true
          setInvalidEmail(true)
      }
      return false
  }
  
      
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView scrollEnabled={isUnlistedModalVisible ? false:true} style={{ width: '100%', minHeight: HEIGHT, }}>

          <Appbar 
            stateChangerNext={setNext} 
            hasPicture={false} 
            registration={true} 
            currentRegistrationScreen={nextNum} 
            userType={userType} 
            screenView={next}
            showLogo={true}
            registrationFormPage={true}
          />

          {/* Page Header */}
          <View style={styles.header}>
              <TText style={styles.headerTitle}>{userType === "recruiter" ? 'Recruiter' : 'Worker'} Information</TText>
              {
                next == 4 ? 
                <TText style={styles.headerDesc}>Please fill in the form carefully. The details will be needed for verification.</TText>
                : <TText style={styles.headerDesc}>Please fill in your personal information carefully. The details will be needed for verification.</TText>
              }
          </View>

          <DialogueModal 
            firstMessage={"Record Liveness Video"}
            secondMessage={"This video will help administrators to verify that you are a physically present human"}
            visible={showRecordVideoModal}
            numBtn={1}
            onDecline={setShowRecordVideoModal}
            showVideoTutorial
          />

          {/* Modal to confirm the creation of account */}
          {isConfirm ?
              <View style={styles.confirmModal}>
                <View style={styles.confirmBox}>
                  <TText style={styles.confirmModalText}>By clicking confirm, your account will be registered and no further changes can be made upon registration.</TText>
                  <View style={styles.confirmModalBtnContainer}>
                    <TouchableOpacity 
                      style={[styles.confirmModalBtn, styles.confirmModalCancel]}
                      onPress={()=> setisConfirm(false)}
                    >
                      <TText style={styles.confirmModalBtnText}>Cancel</TText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.confirmModalBtn, styles.confirmModalConfirm]}
                      onPress={()=> setisConfirm(false)}
                    >
                      <TText style={[styles.confirmModalBtnText, {color: ThemeDefaults.themeOrange}]}>Confirm</TText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              : null
          }

          {/* modal is shown when user has chosen unlisted category */}
          {
            isUnlistedModalVisible ? 
            <View style={[styles.confirmModal]}>
                <View style={styles.confirmBox}>
                <View style={{padding: 20}}>
                  <TText style={styles.confirmModalText}>By clicking confirm, your account will be registered and no further changes can be made upon registration.</TText>
                  <TText style={[styles.confirmModalText]}>Once approved, your specified service in Custom Service Offered, as well as its price range, will be automatically posted in the application.</TText>
                </View>
                  <View style={styles.confirmModalBtnContainer}>
                    <TouchableOpacity 
                      style={[styles.confirmModalBtn, styles.confirmModalConfirm]}
                      onPress={()=> setUnlistedModalVisible(false)}
                    >
                      <TText style={[styles.confirmModalBtnText, {color: ThemeDefaults.themeOrange}]}>Confirm</TText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              : null
          }

          {
            next == 4 ?
              <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', }}>
                {
                  !isPriceValid &&
                  <View style={{marginHorizontal: 35, marginBottom: 40, backgroundColor: ThemeDefaults.themeRed, padding: 15}}>
                    <TText style={{color: ThemeDefaults.themeWhite, textAlign: 'center'}}>Invalid Price inputs. Please provide a price from the minimum to the maximum</TText>
                  </View>
                }
                {
                  services.map((serviceOffered, index) => (
                    <View key={index} style={{width: '100%', alignItems: 'center', marginBottom: 30,}}>
                      {
                        services.length > 1 ?
                          <View style={{width: '80%', alignItems: 'flex-end', marginBottom: 5}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: ThemeDefaults.appIcon, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3}}
                              onPress={() => handleServiceRemove(index)}
                            >
                              <TText style={{color: '#a1a1a1'}}>Remove Service</TText>
                              <Icon name="close-circle" size={18} color={'#a1a1a1'} style={{marginLeft: 10}} />
                            </TouchableOpacity>
                          </View> 
                        : null
                      }
                      <View style={[styles.inputContainer, {width: '80%', justifyContent: 'space-evenly', paddingHorizontal: 15}]}>
                        <Icon name='briefcase' size={23} color={"#D0CCCB"} />
                        <TouchableOpacity 
                          onPress={() => changeSubCategoryModalVisibility(true)}
                          style={{
                            width: '100%', 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            paddingTop: 8,
                            paddingBottom: 5,
                          }}>
                          <TouchableOpacity 
                            styles={styles.dropdownBtn}
                          >
                          {
                            serviceOffered.service || serviceOffered.status || serviceOffered.category ?
                              <TText style={[styles.ddText, {color:"#000"}]}>{serviceOffered.category ? "Unlisted" : serviceOffered.service}</TText>
                              : <TText style={[styles.ddText, {color:"#A1A1A1"}]}>Specific Service Offered</TText>
                          }
                          </TouchableOpacity>
                            <Modal
                              transparent={true}
                              animationType='fade'
                              visible={isSubCatModalVisible}
                              onRequestClose={() => changeSubCategoryModalVisibility(false)}
                            >
                              <ModalPicker 
                                changeModalVisibility={changeSubCategoryModalVisibility}
                                setData={(val) => handleServiceSelect(val, index)}
                                services={true}
                              />
                            </Modal>
                            <Icon name="arrow-down-drop-circle" size={20} color={"#D0CCCB"} />
                          </TouchableOpacity>
                      </View>
                          
                      {
                        serviceOffered.category === "unlisted" && 
                          <View style={[styles.inputContainer, {width: '80%'}]}>
                              {/* {setUnlistedModalVisible(true)} */}
                              <Icon name='briefcase-outline' size={20} color={"#D0CCCB"} />
                              <TextInput style={styles.input} 
                                placeholder={"Custom Service Offered"}
                                placeholderTextColor={"#A1A1A1"}
                                keyboardType={'default'}
                                returnKeyType={"next"}
                                textContentType={'purok'}
                                onChangeText={ (val) => {handleServiceUnlisted(val, index)
                                  haveBlanks()
                                } }
                                onSubmitEditing={ () => ref_cpw.current.focus() }
                                ref={ref_pw} />
                            </View> 
                      }
                      <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={[styles.inputContainer, {width: '48%'}]}>
                            <Icon name='currency-php' size={20} color={"#D0CCCB"} />
                            <TextInput style={[styles.input, {color: isPriceValid ? 'black' : ThemeDefaults.appIcon}]} 
                              placeholder={"Lowest Price"}
                              placeholderTextColor={"#A1A1A1"}
                              value={serviceOffered.lowestPrice ? serviceOffered.lowestPrice : ""}
                              keyboardType={'numeric'}
                              returnKeyType={"next"}
                              textContentType={'price'}
                              onChangeText={ (val) => {
                                handleServiceLowPrice(val, index)
                                haveBlanks()
                              }}
                              ref={ref_pw} />
                        </View>

                        <View style={[styles.inputContainer, {width: '48%'}]}>
                          <Icon name='currency-php' size={20} color={"#D0CCCB"} />
                          <TextInput style={[styles.input, {color: isPriceValid ? 'black' : ThemeDefaults.appIcon}]} 
                            placeholder={"Highest Price"}
                            placeholderTextColor={"#A1A1A1"}
                            value={serviceOffered.highestPrice ? serviceOffered.highestPrice : ""}
                            keyboardType={'numeric'}
                            returnKeyType={"next"}
                            textContentType={'price'}
                            onChangeText={ (val) => {
                              handleServiceHighPrice(val, index);
                              haveBlanks()
                            } }
                            ref={ref_cpw} />
                        </View>

                      </View>
                      

                  
                      {
                        services.length - 1 === index &&
                          <View style={{alignItems: 'center', marginTop: 50}}>
                          <TouchableOpacity style={{width: 60, height: 60, borderRadius: 30, backgroundColor: '#595959', alignItems: 'center', justifyContent: 'center' ,marginBottom: 15}}
                            onPress={() => {
                              handleServiceAdd()
                              haveBlanks()
                            }}
                          >
                            <Icon name='plus' size={30} color={'white'} />
                          </TouchableOpacity>
                          <TText style={{width: 130, textAlign: 'center'}}>Add another service offered</TText>
                        </View>
                      }
                    </View>
                  ))
                }
                
                {/* {
                  !hasBlanks ? 
                  <View style={{marginTop: 20, alignItems: 'center'}}>
                    {
                      !hasBlanks ?
                        <TText style={{fontSize: 18, color: ThemeDefaults.appIcon}}>* Please fill in the required fields</TText> : null
                    }
                    {
                      !pwMatch || !user.password ?
                        <TText style={{fontSize: 18, color: ThemeDefaults.appIcon}}>* Passwords does not match</TText> : null

                    }
                    <TText style={{fontSize: 18, color: ThemeDefaults.appIcon}}>{ !pwMatch ? "* Passwords does not match" : null}</TText>
                  </View> : null
                } */}

                <View style={[styles.confirm, {width: '90%'}]}>
                  {/* Create Account Button */}
                    <TouchableOpacity style={[styles.confirmBtn, {backgroundColor: (!services[0].service || !services[0].lowestPrice || !services[0].highestPrice || !isPriceValid) ? '#ccc' : ThemeDefaults.themeOrange , elevation: (!services[0].service || !services[0].lowestPrice || !services[0].highestPrice || isPriceValid) ? 3 : 0}]} 
                      disabled={
                        (!services[0].service || !services[0].lowestPrice || !services[0].highestPrice || !isPriceValid)
                      }
                      onPress={() => {
                        setDidClickCreateAccountButton(true)
                        setShowDialog(true)
                        // console.log("confirm from worker information work description")
                      }}
                    >
                      <TText style={{fontFamily: 'LexendDeca_SemiBold', fontSize: 18, color: ThemeDefaults.themeWhite}}>
                        Create Account
                      </TText>
                    </TouchableOpacity>
                  </View>
                
                  <DialogueModal 
                    firstMessage={"All the details you have provided to HanapLingkod will be treated with utmost confidentiality with regards to the Data Privacy Act of 2012."}
                    secondMessage={"By clicking confirm, you hereby acknowledge and agree that HanapLingkod will collect and store your data. Your account will then be registered, and no further changes can be made upon registration."}
                    visible={showDialog}
                    warning
                    numBtn={2}
                    declineButtonText={"Cancel"}
                    confirmButtonText={"Confirm"}
                    onAccept={didConfirm}
                    onDecline={setShowDialog}
                  />

                {/* { showDialog ?
                  <Modal
                    transparent={true}
                    animationType='fade'
                    visible={showDialog}
                    onRequestClose={() => changeModalDialogVisibility(false)}
                  >
                    <ModalDialog
                      changeModalVisibility={changeModalDialogVisibility}
                      setData={didConfirm}
                      numBtn={2}
                      confirmText={'Confirm'}
                      cancelText={'Cancel'}
                      message={"By clicking confirm, your account will be registered and no further changes can be made upon registration."}
                    />
                  </Modal> : null
                } */}

                {
                  isConfirmed ? navigation.navigate("OTPVerification", {phoneNum: user.phonenumber, role: user.role, user: user, work: services, singleImage: singleImage, imagelicense: imageSingleLicense, video: video.uri}) : null
                }

              </View>
              : null
          }

          {
            next == 3 ? 
              <View style={styles.workDescriptionContainer}>
                <View style={styles.workDescriptionBox}>
                  <TText style={{marginBottom: 15, fontFamily: 'LexendDeca_Medium', fontSize: 18}}>Work Description (Optional):</TText>
                  <View style={{
                      // minHeight: 150, 
                      backgroundColor: '#fff',
                      paddingVertical: 7,
                      paddingHorizontal: 12,
                      alignItems: 'flex-start',
                      borderRadius: 15,
                      elevation: 3,
                  }}>
                  <TextInput multiline 
                    placeholder='Describe what you do..'
                    placeholderStyle={{}}
                    style={[styles.inputMultiLine, {
                      fontSize: 18,
                      width: '100%',
                      height: 100,
                      maxHeight: 150,
                      padding: 10,
                      textAlignVertical: 'top',
                    }]}
                    defaultValue={user.workDescription}
                    onChangeText={ (val) => {
                      setUser((prev) => ({...prev, workDescription: val}))
                      haveBlanks()
                    } }
                  />
                  </View>
                </View>

                <View style={{width: '100%', alignItems: 'center', marginBottom: 20}}>
                <View style={{width: '80%', marginTop: 40,}}>
                  <TText style={{fontSize: 18}}>Licenses/Certificates (Optional):</TText>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity 
                      onPress={pickImage}
                      style={{alignItems: 'center', marginTop: 20, backgroundColor: '#Fafafa', paddingVertical: 30, borderRadius: 15, elevation: 2, width: '90%'}}
                      >
                      <Icon name="camera-plus" size={40} color={"#E7745D"} style={{marginBottom: 10}} />
                      <TText>Attach photo(s) here</TText>
                    </TouchableOpacity>
                  </View>
                </View>
                </View>

                <View style={{width: '100%', alignItems: 'center', pading: 15, marginTop: 30,}}>
                <TText style={{alignSelf: 'flex-start', marginLeft: '12%'}}>Uploaded License Images:</TText>
                  {
                    imageSingleLicense && !didClickCreatAccountButton ? 
                      <Image source={{uri: imageSingleLicense}} style={{width: 500, height: 400, marginVertical: 20}} />
                    :
                    imagelicense.map(function(item, index) {
                        {/* console.log("item: ", item) */}
                        {/* console.log("image length: ", item.length) */}
                        {/* console.log("index: ", index) */}
                        {/* console.log("image uri: ", item.uri) */}
                        return (
                          <View key={index} style={{padding: 3, marginTop: 15,}}>
                              <TouchableOpacity 
                                onPress={()=> handleRemoveImage(index)}
                                style={{justifyContent: 'flex-end', position: 'absolute', top: 10, right: 10, zIndex: 5, borderWidth: 2, borderColor: ThemeDefaults.themeOrange, borderRadius: 30, backgroundColor: ThemeDefaults.themeOrange }}>
                                <Icon name="close-circle" size={25} color={'white'} style={{paddingHorizontal: 10, paddingVertical: 2}} />
                              </TouchableOpacity>
                              {
                                !didClickCreatAccountButton &&
                                <Image source={{uri: item.uri}} style={{width: 400, height: item.height > 3800 ? item.height / 4 : 300, marginBottom: 20}} />
                              }
                          </View>
                        )
                      })
                    }
                </View>

                {/* Next Button */}
                <View style={styles.btnContainer}>
                  {/* Next page button */}
                    <TouchableOpacity
                      style={[styles.nextBtn, {backgroundColor: ThemeDefaults.themeOrange}]}
                      onPress={() => { 
                        setNext((current) => current + 1)
                      }}
                      >
                      <TText style={styles.nextText}>Next</TText>
                      <Icon name="arrow-right-thin" size={30} color='white' />
                    </TouchableOpacity>
                  </View>
                
              </View>
              : null
          }  

          {next == 2 ? 
            <View>
              {/* Street input */}
              <View style={styles.inputGrp}>
                <View style={[styles.inputContainer]}>
                  <Icon name='road' size={23} color={"#D0CCCB"} />
                    <TextInput style={styles.input} 
                      placeholder={"Street"}
                      placeholderTextColor={"#A1A1A1"}
                      value={user.street}
                      returnKeyType={"next"}
                      textContentType={'street'}
                      onChangeText={ (val) => {
                        setUser((prev) => ({...prev, street: val}))
                        haveBlanks()
                      }}
                      onSubmitEditing={ () => ref_pw.current.focus() } />
                </View>

                {/* Purok input */}
                <View style={styles.inputInRow}>   
                  <View style={[styles.inputContainer, {width: '48%'}]}>
                    <Icon name='home-city' size={23} color={"#D0CCCB"} />
                    <TextInput style={styles.input} 
                      placeholder={"Purok"}
                      placeholderTextColor={"#A1A1A1"}
                      value={user.purok}
                      returnKeyType={"next"}
                      textContentType={'purok'}
                      onChangeText={ (val) => {
                        setUser((prev) => ({...prev, purok: val}))
                        haveBlanks()
                      } }
                      // onSubmitEditing={ () => ref_cpw.current.focus() }
                      ref={ref_pw} />
                  </View>

                  {/* Barangay dropdown selection */}
                  <View style={[styles.inputContainer, {width: '48%'}]}>
                    <Icon name='domain' size={23}color={"#D0CCCB"} />
                    <TouchableOpacity 
                      onPress={() => changeBarangayModalVisibility(true)}
                      style={{
                        width: '85%', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        paddingTop: 8,
                        paddingBottom: 5,
                      }}>
                      <TouchableOpacity 
                        styles={styles.dropdownBtn}
                      >
                      {
                        chooseBarangay ?
                        <TText style={styles.ddText} >{chooseBarangay}</TText>
                        : <TText style={[styles.ddText, {color:"#A1A1A1"}]}>Barangay</TText>
                      }
                      </TouchableOpacity>
                        <Modal
                          transparent={true}
                          animationType='fade'
                          visible={isBarangayModalVisible}
                          onRequestClose={() => changeBarangayModalVisibility(false)}
                        >
                          <ModalPicker 
                            changeModalVisibility={changeBarangayModalVisibility}
                            setData={setBarangay}
                            barangay={true}
                          />
                        </Modal>
                        <Icon name="arrow-down-drop-circle" size={20} color={"#D0CCCB"} style={{paddingRight: 6}} />
                      </TouchableOpacity>
                  </View>
                </View>

                {/* Municipality input */}
                <View style={styles.inputInRow}>
                  <View style={[styles.inputContainer, {width: '48%'}]}>
                    <Icon name='city' size={23} color={"#D0CCCB"} />
                    <TextInput style={styles.input} 
                      placeholder={"Municipality"}
                      placeholderTextColor={"#000"}
                      value={"Daet"}
                      editable={false}
                      returnKeyType={"next"}
                      textContentType={'firstname'}
                      onChangeText={ (val) => {
                        setUser((prev) => ({...prev, city: val}))
                        haveBlanks()
                      } }
                      onSubmitEditing={ () => ref_mn.current.focus() }
                      ref={ref_fn} />
                  </View>
                  
                  {/* Province input */}
                  <View style={[styles.inputContainer, {width: '48%'}]}>
                    <Icon name='town-hall' size={23} color={"#D0CCCB"} />
                    <TextInput style={styles.input} 
                      placeholder={"Province"}
                      placeholderTextColor={"#000"}
                      value={"Camarines Norte"}
                      editable={false}
                      returnKeyType={"next"}
                      textContentType={'middlename'}
                      onChangeText={ (val) => {
                        setUser((prev) => ({...prev, province: val}))
                        haveBlanks()
                      } }
                      onSubmitEditing={ () => ref_ln.current.focus() }
                      ref={ref_mn} />
                  </View>
                </View>
                
                {/* Phone Number input */}
                <View style={styles.inputContainer}>
                  {/* <Icon name='phone-classic' size={23} color={"#D0CCCB"} /> */}
                  {
                    !didClickCreatAccountButton &&
                    <Image source={require("../assets/images/ph-flag.png")} style={{width: 25, height: 25, marginRight: 10}}/>
                  }
                  <View style={{paddingRight: 12, borderRightWidth: 1}}>
                    <TText>+63</TText>
                  </View>
                  <TextInput style={styles.input} 
                    placeholder={placeholderPhoneNum}
                    placeholderTextColor={"#A1A1A1"}
                    value={user.phonenumber.length > 3 ? user.phonenumber : null}
                    keyboardType={'phone-pad'}
                    returnKeyType={"next"}
                    textContentType={'lastname'}
                    onChangeText={ (val) => {
                      setUser((prev) => ({...prev, phonenumber: val}))
                      haveBlanks()
                    } }
                    onFocus={()=> {
                      setPlaceholderPhoneNum("9123456789")
                      }}
                    // onSubmitEditing={ () => ref_bd.current.focus() }
                    ref={ref_ln} />
                </View>

                <View style={{width: '100%', marginTop: 10}}>
                  <TText style={{fontSize: 18}}>Government Issued ID(s):</TText>
                  <TouchableOpacity 
                    onPress={
                      pickImage
                    }
                    style={{alignItems: 'center', marginTop: 20, marginHorizontal: 20, backgroundColor: '#FAFAFA', paddingVertical: 30, borderRadius: 15, elevation: 2}}
                    >
                    <Icon name="camera-plus" size={40} color={"#E7745D"} style={{marginBottom: 10}} />
                    <TText>Attach photo(s) here</TText>
                  </TouchableOpacity>

                  {/* <TText style={{marginTop: 30, textAlign: 'center', color: 'gray', fontSize: 14}}>The uploaded government ID will only be used to validate your personal information.</TText> */}
              
                </View>

                <View style={{width: '100%', alignItems: 'center', pading: 15, marginTop: 30,}}>
                {
                    singleImage ? 
                      <>
                        {
                          !didClickCreatAccountButton &&
                          <Image source={{uri: singleImage}} style={{ marginVertical: 20, width: 380, height: 260,}} />
                        }
                      </>
                    :
                    image.map(function(item, index) {
                      {/* console.log("item: ", item) */}
                      {/* console.log("image length: ", item.length) */}
                      {/* console.log("index: ", index)
                      console.log("image uri: ", item.uri) */}
                      return (
                        <View key={index}>
                            <TouchableOpacity 
                              onPress={()=> handleRemoveImage(index)}
                              style={{justifyContent: 'flex-end', position: 'absolute', top: 10, right: 10, zIndex: 2, borderWidth: 2, borderColor: ThemeDefaults.themeOrange, borderRadius: 30, backgroundColor: ThemeDefaults.themeOrange }}>
                              <Icon name="close-circle" size={25} color={'white'} style={{paddingHorizontal: 10, paddingVertical: 2}} />
                            </TouchableOpacity>
                            {
                              !didClickCreatAccountButton &&
                              <Image source={{uri: item.uri}} style={{width: 400, height: item.height > 3800 ? item.height / 4 : 300, marginBottom: 20}} />
                            }
                        </View>
                      )
                    })
                  }
                </View>
                {/* <View>
                  {image && <Image source={{uri: image}} style={{marginTop: 30, width: imageW / 4, height: imageH / 4}} />}
                </View> */}

                {/* Capture Video */}
                {/* <View>
                  <TText>Record a video of your face</TText>
                </View> */}
                <View style={{width: '100%', marginTop: 10}}>
                  <TText style={{fontSize: 18}}>Record a video of your face:</TText>
                  <TouchableOpacity 
                    onPress={() => {
                      setShowRecordVideoModal(true)
                      setShowRecordVideo(!showRecordVideo)
                    }}
                    style={{alignItems: 'center', marginTop: 20, marginHorizontal: 20, backgroundColor: '#FAFAFA', paddingVertical: 30, borderRadius: 15, elevation: 2}}
                    >
                    <Icon name="video-plus" size={40} color={"#E7745D"} style={{marginBottom: 10}} />
                    <TText>Record Video</TText>
                  </TouchableOpacity>

                  {
                    showRecordVideo &&
                      <Camera style={{backgroundColor: 'gray', width: '100%', height: 550, marginTop: 50}} ref={cameraRef} type={CameraType.front}>

                        <View style={{alignItems:'center', flexDirection:"row", alignItems: 'center', justifyContent:"center", position: 'absolute', bottom: 20, width: '100%'}}>
                          <TouchableOpacity style={{backgroundColor:'white', paddingVertical: 5, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderRadius: 15}}
                            onPress={()=> isRecording ? null : startRecording()}
                          >
                            <Icon name="video-box" size={17} color={isRecording ? "$434343" : ThemeDefaults.themeRed} />
                            <TText style={{fontSize: 14, marginLeft: 5, color: '#434343'}}>{isRecording ? videoCountdown : "Start Record"}</TText>
                          </TouchableOpacity>
                        </View>
                      </Camera>
                  }

                  {
                    !showRecordVideo && video &&
                      <View style={{width: '100%', height: 500, marginTop: 50}}>
                        <Video 
                          style={{width: '100%', height: 500,}}
                          source={{uri: video.uri}}
                          useNativeControls
                          resizeMode='contain'
                          isLooping
                        />
                      </View>
                  }

                  <TText style={{marginTop: 30, textAlign: 'center', color: 'gray', fontSize: 14}}>The uploaded government ID and the recorded video will only be used to validate your personal information.</TText>
              
                </View>

              </View>

              {
                userType === 'worker' ?
                  <View style={styles.btnContainer}>
                  {/* Next page button */}
                    <TouchableOpacity
                      disabled={
                        (!user.street ||
                        !user.purok || !user.barangay ||
                        !user.city || !user.province || !user.phonenumber
                        || (!image || !singleImage) || !video)
                      }
                      style={[styles.nextBtn, 
                        {
                          backgroundColor: (!user.street ||
                        !user.purok || !user.barangay ||
                        !user.city || !user.province || !user.phonenumber || (!image || !singleImage) || !video) ? "#ccc" : ThemeDefaults.themeOrange
                        }
                      ]}
                      onPress={() => { 
                        // console.log("page 3")
                        setNext((current) => current + 1)
                      }}
                      >
                      <TText style={styles.nextText}>Next</TText>
                      <Icon name="arrow-right-thin" size={30} color='white' />
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={styles.confirm}>
                      {/* Control Message | Recruiter button */}
                      <View style={{marginBottom: 15, opacity: hasBlanks ? 1 : 0}}>
                        {/* <TText style={{fontSize: 18, color: ThemeDefaults.appIcon}}>{haveBlanks ? "* Please fill in all the blanks" : null}</TText>
                        <TText style={{fontSize: 18, color: ThemeDefaults.appIcon}}>{!pwMatch ? "* Passwords does not match" : null}</TText> */}
                      </View>
                  {/* Create Account Button */}
                    <TouchableOpacity style={[styles.confirmBtn, {backgroundColor: !(!user.street || !user.purok || !user.barangay || !user.phonenumber || (!singleImage || !image)) ? ThemeDefaults.themeOrange : '#ccc', elevation: !hasBlanks ? 3 : 0}]}  
                      disabled={
                        (!user.street || !user.purok || !user.barangay || !user.phonenumber || (!singleImage || !image))
                      }
                      onPress={() => {
                        setShowDialog(true);
                        setDidClickCreateAccountButton(true)
                        haveBlanks()
                        
                        // createRecruiterAccount();

                        // isConfirmed ? <OTPVerification verified={phoneVerified} handlePhoneVerification={handlePhoneVerification} /> : null
                        // isConfirmed ? navigation.navigate("OTPVerification", {user: user, phoneNum: user.phonenumber, singleImage: singleImage, image: image})

                      }}
                    >
                      <TText style={{fontFamily: 'LexendDeca_SemiBold', fontSize: 18, color: ThemeDefaults.themeWhite}}
                        >Create Account</TText>
                    </TouchableOpacity>

                    <DialogueModal 
                      firstMessage={"All the details you have provided to HanapLingkod will be treated with utmost confidentiality with regards to the Data Privacy Act of 2012."}
                      secondMessage={"By clicking confirm, you hereby acknowledge and agree that HanapLingkod will collect and store your data. Your account will then be registered, and no further changes can be made upon registration."}
                      visible={showDialog}
                      warning
                      numBtn={2}
                      declineButtonText={"Cancel"}
                      confirmButtonText={"Confirm"}
                      onAccept={didConfirm}
                      onDecline={setShowDialog}
                    />
                  </View>
              }

              
              {/* Checks if the user confirms the creation of his/her account  */}
              {
                isConfirmed ? navigation.navigate("OTPVerification", {user: user, phoneNum: user.phonenumber, singleImage: singleImage, image: image, role: user.role, video: video.uri}) : null
              }

              {/* show confirm create account dialog */}
              {/* { showDialog ?
                <Modal
                  transparent={true}
                  animationType='fade'
                  visible={showDialog}
                  onRequestClose={() => changeModalDialogVisibility(false)}
                >
                  <ModalDialog
                    changeModalVisibility={changeModalDialogVisibility}
                    setData={didConfirm}
                    numBtn={2}
                    confirmText={'Confirm'}
                    cancelText={'Cancel'}
                    message={"By clicking confirm, your account will be registered and no further changes can be made upon registration."}
                  />
                </Modal> : null
              } */}
            </View> 
            : null
          }
          {
            next == 1 ?
            <View style={{}}>
            <View style={styles.inputGrp}>
              {/* Username input */}
              <View style={[styles.inputContainer, {marginBottom: isUsernameUnique ? 16 : 5}]}>
                <Icon name='account-circle' size={23} color={"#D0CCCB"} />
                <TextInput style={styles.input} 
                  autoCapitalize={'none'}
                  placeholder={"Username (eg. juan_dcruz, juanDC)"}
                  value={user.username ? user.username : null}
                  placeholderTextColor={"#A1A1A1"}
                  returnKeyType={"next"}
                  textContentType={'username'}
                  onChangeText={ (val) => {
                    handleUsernameAvailable(val)
                    setUser((prev) => ({...prev, username: val}))
                    // username availability checker
                    haveBlanks()
                    } }
                  onSubmitEditing={ () => ref_pw.current.focus() } />
              </View>

              {
                isUsernameUnique ? null : 
                  <View style={{ alignSelf: 'flex-start', marginLeft: 0, marginBottom: 5}}>
                    <TText style={{color: ThemeDefaults.appIcon, fontSize: 14}}>Username already taken. Try again</TText>
                  </View>
              }
              
              {/* Password input */}
              <View style={styles.inputContainer}>
                <View style={{width: '90%', flexDirection: 'row', marginRight: 15}}>
                  <Icon name='lock' size={23} color={"#D0CCCB"} /> 
                  <TextInput style={styles.input} 
                    autoCapitalize={'none'}
                    placeholder={"Password"}
                    placeholderTextColor={"#A1A1A1"}
                    value={user.password ? user.password : null}
                    returnKeyType={"next"}
                    secureTextEntry={hidePW}
                    textContentType={'password'}
                    onChangeText={ (val) => {
                      setUser((prev) => ({...prev, password: val}))
                      haveBlanks()
                    } }
                    onSubmitEditing={ () => ref_cpw.current.focus() }
                    ref={ref_pw} />
                </View>
                <Icon 
                  name= { hidePW ? 'eye-off' : 'eye' }
                  size={22} color={'#a3a096'}
                  onPress={ () => sethidePW(!hidePW) }
                />
              </View>
              {
                user.password && user.password.length < 8 &&
                <View style={{alignSelf: 'flex-start', marginTop: -10, marginBottom: 8}}>
                  <TText style={{fontSize: 14, color: ThemeDefaults.appIcon}}>* Passwords must have at least 8 characters</TText>
                </View>
              }
              
              {/* Confirm Password input */}
              <View style={[styles.inputContainer, {marginBottom: pwMatch ? 0 : 4}]}>
                <View style={{width: '90%', flexDirection: 'row', marginRight: 15}}>
                  <Icon name='lock' size={23} color={"#D0CCCB"} /> 
                  <TextInput style={styles.input} 
                    placeholder={"Confirm Password"}
                    placeholderTextColor={"#A1A1A1"}
                    returnKeyType={"next"}
                    secureTextEntry={hidePW}
                    textContentType={'confirmpw'}
                    onChangeText={(val) => {
                      setConfirmPW(val)
                      // setPWMatch([...user.password === confirmPW])
                      // console.log("pwMatch: ", pwMatch)
                      // console.log("confirmpw: ", confirmPW)
                    }}
                    onSubmitEditing={ () => ref_fn.current.focus() }
                    ref={ref_cpw} />
                </View>
                <Icon 
                  name= { hidePW ? 'eye-off' : 'eye' }
                  size={22} color={'#a3a096'}
                  onPress={ () => sethidePW(!hidePW) }
                />
              </View>
                <View style={{marginTop: pwMatch ? 0 : 5, marginBottom: pwMatch ? 0 : 5, width: '100%', }}>
                  <TText style={{fontSize: 14, color: ThemeDefaults.appIcon, opacity: pwMatch ? 0 : 1}}>Password does not match</TText>
                </View>


              {/* Email input */}
              <View style={[styles.inputContainer]}>
                <Icon name='at' size={23} color={"#D0CCCB"} />
                <TextInput style={styles.input} 
                  autoCapitalize={'none'}
                  placeholder={"Email address"}
                  keyboardType={"email-address"}
                  value={user.email ? user.email : null}
                  placeholderTextColor={"#A1A1A1"}
                  returnKeyType={"next"}
                  textContentType={'email'}
                  onChangeText={ (val) => {
                    setUser((prev) => ({...prev, email: val}))
                    haveBlanks()
                    } }
                  onSubmitEditing={ () => ref_fn.current.focus() } 
                  ref={ref_email}
                  />
              </View>
              
              {/* First Name input */}
              <View style={styles.inputContainer}>
                <Icon name='account-box' size={23} color={"#D0CCCB"} /> 
                <TextInput style={styles.input} 
                  placeholder={"First Name"}
                  placeholderTextColor={"#A1A1A1"}
                  value={user.firstname ? user.firstname : null}
                  returnKeyType={"next"}
                  textContentType={'firstname'}
                  onChangeText={ (val) => {
                    setUser((prev) => ({...prev, firstname: val}))
                    haveBlanks()
                  } }
                  onSubmitEditing={ () => ref_mn.current.focus() }
                  ref={ref_fn} />
              </View>

              {/* Middle Name input */}
              <View style={styles.inputContainer}>
                <Icon name='account-box' size={23} color={"#D0CCCB"} />
                <TextInput style={styles.input} 
                  placeholder={"Middle Name (Optional)"}
                  placeholderTextColor={"#A1A1A1"}
                  value={user.middlename ? user.middlename : null}
                  returnKeyType={"next"}
                  textContentType={'middlename'}
                  onChangeText={ (val) => {
                    setUser((prev) => ({...prev, middlename: val}))
                    haveBlanks()
                  }}
                  onSubmitEditing={ () => ref_ln.current.focus() }
                  ref={ref_mn} />
              </View>
              
              {/* Last Name input */}
              <View style={styles.inputContainer}>
                <Icon name='account-box' size={23} color={"#D0CCCB"} />
                <TextInput style={styles.input} 
                  placeholder={"Last Name"}
                  placeholderTextColor={"#A1A1A1"}
                  value={user.lastname ? user.lastname : null}
                  returnKeyType={"next"}
                  textContentType={'lastname'}
                  onChangeText={ (val) => {
                      setUser((prev) => ({...prev, lastname: val}))
                      haveBlanks()
                  }}
                  ref={ref_ln} />
              </View>
              
              {/* Birthday datepicker */}
              <View style={styles.inputContainerBottom}>
                <View style={styles.bdView}>
                  <Icon name='cake' size={20} color={"#D0CCCB"} />
                  <TouchableOpacity onPress={ () => setDatePickerVisibility(true) } style={styles.bdayBtn} >
                    {
                      dateSelected ?
                        <TText style={styles.bdayText}>{displayDate.toString()}</TText>
                        : <View>
                            <TText style={styles.bdayTextPH}>Birthday</TText>
                        </View>
                    }
                    <Icon name="arrow-down-drop-circle" size={18} color={"gray"} />
                  </TouchableOpacity>
                  <DateTimePickerModal
                      isVisible={datePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={() => setDatePickerVisibility(false)}
                    />
                </View>

                {/* age input */}
                {/* <View style={styles.ageView}>
                  <Icon name='counter' size={15} color={"#D0CCCB"} />
                  <TextInput style={styles.input} 
                    placeholder={"Age"}
                    placeholderTextColor={"#A1A1A1"}
                    value={user.age ? user.age : null}
                    keyboardType={'numeric'}
                    returnKeyType={"next"}
                    textContentType={'age'}
                    onChangeText={ (val) => {
                      setUser((prev) => ({...prev, age: val}))
                      haveBlanks()
                    } }
                    ref={ref_age} />
                </View> */}
                
                {/* Sex Select */}
                <TouchableOpacity style={styles.sexView} onPress={() => changeSexModalVisibility(true)}>
                  <Icon name='gender-male-female' size={15} color={"#D0CCCB"} /> 
                    <View 
                      style={{
                        width: '85%', 
                        flexDirection: 'row', 
                        alignItems: 'center',  
                        justifyContent: 'space-between',
                        paddingTop: 8,
                        paddingBottom: 10,
                      }}>
                      <View 
                        styles={styles.dropdownBtn}
                      >
                      {
                        chooseData ?
                        <TText style={styles.ddText} >{chooseData}</TText>
                        : <TText style={[styles.ddText, {color:"#A1A1A1"}]}>Sex</TText>
                      }
                      </View>
                      <Modal
                        transparent={true}
                        animationType='fade'
                        visible={isSexModalVisible}
                        onRequestClose={() => changeSexModalVisibility(false)}
                      >
                        <ModalPicker 
                          changeModalVisibility={changeSexModalVisibility}
                          setData={setData}
                          sex={true}
                        />
                      </Modal>
                      <Icon name="arrow-down-drop-circle" size={20} color={"#D0CCCB"} style={{paddingRight: 6}} />
                    </View>
                </TouchableOpacity>
              </View>
            {
              ((user?.age < 18 && user.birthday) && !ageChecker()) &&
              <View style={{alignSelf: 'flex-start', marginTop: 10, }}>
                <TText style={{fontSize: 14, color: ThemeDefaults.appIcon}}>* Users need to be at least 18 years old to use HanapLingkod</TText>
              </View>
            }
            </View>
            
            {/* Next page button */}
            <View style={styles.btnContainer}>
              <TouchableOpacity
                // disabled={
                //   (!user.username ||
                //   !(user.password || user.password.length < 8) ||
                //   !user.firstname || !user.lastname || !user.age || 
                //   !user.gender || !user.birthday || !confirmPW || 
                //   !pwMatch || (user.age < 18 || !ageChecker()))
                // }
                style={[styles.nextBtn, 
                   {backgroundColor: (!user.username ||
                  !(user.password || user.password.length < 8) ||
                  !user.firstname || !user.lastname || !user.age || 
                  !user.gender || !user.birthday || !confirmPW || 
                  !pwMatch || (user.age < 18 || !ageChecker())) ? "#ccc" : ThemeDefaults.themeOrange}
                ]}
                onPress={()=> { 
                  if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)){
                    setConfirmPW("")
                    setPWMatch(false)
                    setNext((current) => current + 1)
                    haveBlanks()
                  } else {
                    setViewSubmitModal(true)
                  }
                  }}
                >
                <TText style={styles.nextText}>Next</TText>
                <Icon name="arrow-right-thin" size={30} color='white' />
              </TouchableOpacity>

              <DialogueModal 
                firstMessage={"Invalid email address!"}
                secondMessage={"The email to be submitted should be in the form of 'email@example.com'"}
                visible={viewSubmitModal}
                numBtn={1}
                warning
                onDecline={setViewSubmitModal}
              />
            </View>
          </View> 
          : null
          }
        </ScrollView>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#blue',
        height: HEIGHT,
    },
    header: {
      alignItems: 'center',
      marginTop: 50,
      marginBottom: 60,
    },
    headerTitle: {
      fontFamily: 'LexendDeca_Bold',
      fontSize: 28,
      marginBottom: 24
    },
    headerDesc: {
      fontSize: 18,
      width: '80%',
      textAlign: 'center',
      lineHeight: 28
    },
    inputGrp: {
      alignItems: 'center',
      marginHorizontal: 40,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 7,
      width: '100%',
      marginBottom: 20
    },
    inputContainerBottom: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      // padding: 7,
      width: '100%',
      // marginBottom: 18
    },
    bdView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 10,
      width: '57%',
    },
    bdayBtn: {
      width: '90%', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      paddingLeft: 15,
      paddingRight: 10,
      marginTop: 5
    },
    bdayText: {
      fontSize: 15
    },
    bdayTextPH: {
      fontSize: 18,
      color: '#a1a1a1'
    },
    ageView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 8,
      // marginTop: 1,
      // marginLeft: '1%',
      width: '24%'
    },
    sexView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      width: '40%',
    },
    ddText: {
      marginLeft: 15,
      marginRight: 10,
      fontSize: 18,
    },
    input: {
      width: '90%',
      fontSize: 18,
      marginLeft: 15,
      fontFamily: 'LexendDeca'
    },
    btnContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      width: 160,
      marginTop: 60,
      marginBottom: 40,
    },
    nextBtn: {
      backgroundColor: ThemeDefaults.themeOrange,
      elevation: 4,
      width: '100%',
      height: '100%',
      padding: 10,
      flexDirection: 'row',
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nextText: {
      fontFamily: 'LexendDeca_SemiBold',
      fontSize: 18,
      color: ThemeDefaults.themeWhite,
      marginRight: 8
    },
    dropdownBtn: {
      backgroundColor: 'pink',
      width: '100%',
    },
    inputInRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      width: '100%'
    },
    confirm: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 130,
    },
    confirmBtn: {
      width: '80%',
      backgroundColor: ThemeDefaults.themeOrange,
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 15,
      elevation: 3,
    },
    confirmModal: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(235, 235, 235, 0.7)',
      position: 'absolute',
      height: HEIGHT,
      width: WIDTH,
      zIndex: 5,
    },
    confirmBox: {
      width: '70%',
      borderRadius: 15,
      overflow: 'hidden',
      borderWidth: 1,
      backgroundColor: ThemeDefaults.themeOrange,
      borderColor: ThemeDefaults.themeOrange,
      elevation: 2 
    },
    confirmModalText: {
      fontFamily: 'LexendDeca_SemiBold',
      fontSize: 20,
      color: ThemeDefaults.themeWhite,
      textAlign: 'center',
      paddingHorizontal: 25,
      // paddingVertical: 15,
      marginVertical: 15
    },
    confirmModalBtnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: ThemeDefaults.themeWhite
    },
    confirmModalBtn: {
      alignItems: 'center',
      paddingVertical: 20,
      width: '100%',
    },
    confirmModalCancel: {

    },
    confirmModalBtnText: {
      fontFamily: 'LexendDeca_SemiBold',
      fontSize: 20
    },
    confirmModalConfirm: {

    },
    workDescriptionContainer: {
      alignItems: 'center'
    },
    workDescriptionBox: {
      width: '80%'
    },
})
