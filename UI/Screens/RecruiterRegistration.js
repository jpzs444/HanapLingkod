import React, {useRef, useState, useEffect} from 'react';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, 
  Image, Button, StyleSheet, StatusBar, ScrollView, Modal, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ModalPicker } from '../Components/ModalPicker';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

import dayjs from 'dayjs';
import Appbar from '../Components/Appbar';
import TText from '../Components/TText';
import ConfirmDialog from '../Components/ConfirmDialog';

import ThemeDefaults from '../Components/ThemeDefaults';
import ModalDialog from '../Components/ModalDialog';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default function RecruiterRegistration({route}) {

    const {userType} = route.params;

    const navigation = useNavigation();
    
    const [user, setUser] = useState({
      username: "", password: "", firstname: "", middlename: "",
      lastname: "", birthday: "", age: "", gender: "", street: "",
      purok: "", barangay: "", city: "", province: "", phonenumber: "", image: '',
      workDescription: "", lowestPrice: "", highestPrice: "",
    })

    const [next, setNext] = useState(1)
    const [nextNum, setNextNum] = useState(1)

    const updateNextNum = () => {
      setNextNum(next)
    }

    const [isConfirm, setisConfirm] = useState(false)
    const [chooseData, setchooseData] = useState("")
    const [chooseBarangay, setchooseBarangay] = useState("")
    const [services, setServices] = useState([
      {
        service:"",
        lowestPrice: "",
        highestPrice: ""
      },
    ])

    const [isModalVisible, setModalVisible] = useState(false)
    const [isModalServiceVisible, setModalServiceVisible] = useState(false)
    
    const [showDialog, setShowDialog] = useState(false)
    const [isConfirmed, setisConfirmed] = useState(false)

    const [formatedDate, setFormatedDate] = useState(new Date())
    const [displayDate, setDisplayDate] = useState(new Date())
    const [dateSelected, setSelected] = useState(false)

    const [datePickerVisible, setDatePickerVisibility] = useState(false);

    const handleServiceAdd = () => {
      setServices([...services, {service: ""}])
    }

    const handleServiceChange = (val, index, field) => {
      // const {value} = val.value;
      const list = [...services];
      list[index]['service'] = val;
      setServices(list)
      console.log(services)
    }

    const handleServiceLowPrice = (val, index) => {
      // const {value} = val.value;
      const list = [...services];
      list[index]['lowestPrice'] = val;
      setServices(list)
      console.log(services)
    }

    const handleServiceHighPrice = (val, index) => {
      // const {value} = val.value;
      const list = [...services];
      list[index]['highestPrice'] = val;
      setServices(list)
      console.log(services)
    }

    const handleServiceUnlisted = (index) => {
      const list = [...services];
      list[index]['status'] = "unlisted"
      setServices(list)
      console.log(services)
    }

    const handleServiceRemove = (index) => {
      const list = [...services];
      list.splice(index, 1);
      setServices(list)
    }

    const setData = (option) => {
      setchooseData(option)
    }

    const setBarangay = (option) => {
      setchooseBarangay(option)
    }

    const setServiceOffered = (option) => {
      setServices(option)
    }

    const didConfirm = (isConfirmed) => {
      setisConfirmed(true)
      console.log("didConfirm")
    }
   
    const changeModalVisibility = (bool) => {
      setModalVisible(bool)
    }

    const changeModalDialogVisibility = (bool) => {
      setShowDialog(bool)
    }

    // const changeModalServiceVisibility = (bool) => {
    //   setModalServiceVisible(bool)
    // }

    const handleConfirm = (date) => {
      setFormatedDate(dayjs(date).format("YYYY-MM-DD"));
      setDisplayDate(dayjs(date).format("MMM D, YYYY"));
      setDatePickerVisibility(false);
      setSelected(true)
      console.log(displayDate)
    };

    // OPEN IMAGE PICKER
    const [image, setImage] = useState(null);
    const [imageW, setImageW] = useState(Number);
    const [imageH, setImageH] = useState(Number);

    useEffect(() => {
      (async () => {
        if (Platform.OS !== "web") {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
          }
        }
      })();
    }, []);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      console.log(result);

      if (!result.cancelled) {
        setImage(result.uri);
        setImageW(result.width);
        setImageH(result.height);
      }
    };

    // references for textinput onSubmit
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
  
      
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{height: '100%', width: '100%'}}>

          <Appbar 
            stateChangerNext={setNext} 
            backBtn={true} hasPicture={false} 
            registration={true} 
            currentRegistrationScreen={nextNum} 
            userType={userType} screenView={next}  />

          {/* Page Header */}
          <View style={styles.header}>
              <TText style={styles.headerTitle}>{userType === "recruiter" ? 'Recruiter' : 'Worker'} Information</TText>
              {
                next == 4 ? 
                <TText style={styles.headerDesc}>Please fill in the form carefully. The details will be needed for verification.</TText>
                : <TText style={styles.headerDesc}>Please fill in your personal information carefully. The details will be needed for verification.</TText>
              }
          </View>

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

          {
            next == 4 ?
              <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                {
                  services.map((serviceOffered, index) => (
                    <View key={index} style={{width: '100%', alignItems: 'center', marginBottom: 30,}}>
                      {
                        services.length > 1 ?
                          <View style={{width: '80%', alignItems: 'flex-end', marginBottom: 5}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: ThemeDefaults.appIcon, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3}}
                              onPress={() => handleServiceRemove(index)}
                            >
                              <TText style={{color: '#a1a1a1'}}>Remove Category</TText>
                              <Icon name="close-circle" size={18} color={'#a1a1a1'} style={{marginLeft: 10}} />
                            </TouchableOpacity>
                          </View> 
                        : null
                      }
                      <View style={[styles.inputContainer, {width: '80%', justifyContent: 'space-evenly', paddingHorizontal: 15}]}>
                        <Icon name='briefcase' size={23} color={"#D0CCCB"} />
                        <TouchableOpacity 
                          onPress={() => changeModalVisibility(true)}
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
                            serviceOffered.service ?
                              <TText style={[styles.ddText, {color:"#000"}]}>{serviceOffered.service}</TText>
                              : <TText style={[styles.ddText, {color:"#A1A1A1"}]}>Specific Service Offered</TText>

                          }
                          </TouchableOpacity>
                            <Modal
                              transparent={true}
                              animationType='fade'
                              visible={isModalVisible}
                              onRequestClose={() => changeModalVisibility(false)}
                            >
                              <ModalPicker 
                                changeModalVisibility={changeModalVisibility}
                                setData={() => handleServiceUnlisted(index)}
                                services={true}
                              />
                            </Modal>
                            <Icon name="arrow-down-drop-circle" size={20} color={"#D0CCCB"} />
                          </TouchableOpacity>
                      </View>
                      {
                        serviceOffered.service === "Unlisted (Add new subcategory)" ? 
                          <View style={[styles.inputContainer, {width: '80%'}]}>
                            <Icon name='briefcase-outline' size={20} color={"#D0CCCB"} />
                            <TextInput style={styles.input} 
                              placeholder={"Custom Service Offered"}
                              placeholderTextColor={"#A1A1A1"}
                              keyboardType={'default'}
                              returnKeyType={"next"}
                              textContentType={'purok'}
                              onChangeText={ (val) => handleServiceChange(val, index) }
                              onSubmitEditing={ () => ref_cpw.current.focus() }
                              ref={ref_pw} />
                          </View> : null
                      }
                      <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={[styles.inputContainer, {width: '48%'}]}>
                            <Icon name='currency-php' size={20} color={"#D0CCCB"} />
                            <TextInput style={styles.input} 
                              placeholder={"Lowest Price"}
                              placeholderTextColor={"#A1A1A1"}
                              keyboardType={'numeric'}
                              returnKeyType={"next"}
                              textContentType={'price'}
                              onChangeText={ (val) => handleServiceLowPrice(val, index) }
                              ref={ref_pw} />
                        </View>

                        <View style={[styles.inputContainer, {width: '48%'}]}>
                          <Icon name='currency-php' size={20} color={"#D0CCCB"} />
                          <TextInput style={styles.input} 
                            placeholder={"Highest Price"}
                            placeholderTextColor={"#A1A1A1"}
                            keyboardType={'numeric'}
                            returnKeyType={"next"}
                            textContentType={'price'}
                            onChangeText={ (val) => handleServiceHighPrice(val, index) }
                            ref={ref_cpw} />
                        </View>
                      </View>
                  
                      {
                        services.length - 1 === index &&
                          <View style={{alignItems: 'center', marginTop: 40}}>
                          <TouchableOpacity style={{width: 60, height: 60, borderRadius: 30, backgroundColor: '#595959', alignItems: 'center', justifyContent: 'center' ,marginBottom: 15}}
                            onPress={handleServiceAdd}
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
                  workSpecifics ? 
                  <View style={{marginTop: '18%', marginBottom: '5%'}}>
                    <TText style={{fontSize: 18, color: ThemeDefaults.appIcon}}>* Please fill in the required fields.</TText>
                  </View> : null
                } */}

                <View style={[styles.confirm, {width: '90%'}]}>
                  {/* Create Account Button */}
                    <TouchableOpacity style={styles.confirmBtn} 
                      onPress={() => {console.log("confirm from worker information work description")
                        setShowDialog(true)
                      }}
                    >
                      <TText style={{fontFamily: 'LexendDeca_SemiBold', fontSize: 18, color: ThemeDefaults.themeWhite}}
                        >Create Account</TText>
                    </TouchableOpacity>
                  </View>
                
                { showDialog ?
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
                }

                {
                  isConfirmed ? navigation.navigate("OTPVerification", {phoneNum: user.phonenumber}) : null
                }

              </View>
              : null
          }

          {
            next == 3 ? 
              <View style={styles.workDescriptionContainer}>
                <View style={styles.workDescriptionBox}>
                  <TText style={{marginBottom: 15, fontFamily: 'LexendDeca_Medium', fontSize: 18}}>Work Description</TText>
                  <View style={{
                      // minHeight: 150, 
                      backgroundColor: '#F4F4F4',
                      paddingVertical: 7,
                      paddingHorizontal: 12,
                      alignItems: 'flex-start',
                      borderRadius: 15,
                      elevation: 3,
                  }}>
                  <TextInput multiline 
                    placeholder='Write work description here..'
                    style={[styles.inputMultiLine, {
                      fontSize: 18,
                      width: '100%',
                      height: 100,
                      maxHeight: 150,
                      padding: 10,
                      textAlignVertical: 'top',
                    }]}
                    defaultValue={user.workDescription}
                    onChangeText={ (val) => setUser((prev) => ({...prev, workDescription: val})) }
                  />
                  </View>
                </View>

                <View style={{width: '100%', alignItems: 'center', marginBottom: 20}}>
                <View style={{width: '80%', marginTop: 40,}}>
                  <TText style={{fontSize: 18}}>License(s)/Certificate(s):</TText>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity 
                      onPress={pickImage}
                      style={{alignItems: 'center', marginTop: 20, backgroundColor: '#F4F4F4', paddingVertical: 30, borderRadius: 15, elevation: 2, width: '100%'}}
                      >
                      <Icon name="camera-plus" size={40} color={"#E7745D"} style={{marginBottom: 10}} />
                      <TText>Attach photo(s) here</TText>
                    </TouchableOpacity>
                  </View>
                </View>
                </View>

                {/* Next Button */}
                <View style={styles.btnContainer}>
                  {/* Next page button */}
                    <TouchableOpacity
                      style={styles.nextBtn}
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
                      returnKeyType={"next"}
                      textContentType={'street'}
                      onChangeText={ (val) => setUser((prev) => ({...prev, street: val})) }
                      onSubmitEditing={ () => ref_pw.current.focus() } />
                </View>

                {/* Purok input */}
                <View style={styles.inputInRow}>   
                  <View style={[styles.inputContainer, {width: '48%'}]}>
                    <Icon name='home-city' size={23} color={"#D0CCCB"} />
                    <TextInput style={styles.input} 
                      placeholder={"Purok"}
                      placeholderTextColor={"#A1A1A1"}
                      returnKeyType={"next"}
                      textContentType={'purok'}
                      onChangeText={ (val) => setUser((prev) => ({...prev, purok: val})) }
                      onSubmitEditing={ () => ref_cpw.current.focus() }
                      ref={ref_pw} />
                  </View>

                  {/* Barangay dropdown selection */}
                  <View style={[styles.inputContainer, {width: '48%'}]}>
                    <Icon name='domain' size={23}color={"#D0CCCB"} />
                    <TouchableOpacity 
                      onPress={() => changeModalVisibility(true)}
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
                          visible={isModalVisible}
                          onRequestClose={() => changeModalVisibility(false)}
                        >
                          <ModalPicker 
                            changeModalVisibility={changeModalVisibility}
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
                      onChangeText={ (val) => setUser((prev) => ({...prev, city: val})) }
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
                      onChangeText={ (val) => setUser((prev) => ({...prev, province: val})) }
                      onSubmitEditing={ () => ref_ln.current.focus() }
                      ref={ref_mn} />
                  </View>
                </View>
                
                {/* Phone Number input */}
                <View style={styles.inputContainer}>
                  <Icon name='phone-classic' size={23} color={"#D0CCCB"} />
                  <TextInput style={styles.input} 
                    placeholder={"Phone Number"}
                    placeholderTextColor={"#A1A1A1"}
                    value={user.phonenumber}
                    keyboardType={'phone-pad'}
                    returnKeyType={"next"}
                    textContentType={'lastname'}
                    onChangeText={ (val) => setUser((prev) => ({...prev, phonenumber: val})) }
                    onSubmitEditing={ () => ref_bd.current.focus() }
                    ref={ref_ln} />
                </View>

                <View style={{width: '80%', marginTop: 10}}>
                  <TText style={{fontSize: 18}}>Government Issued ID(s):</TText>
                  <TouchableOpacity 
                    onPress={pickImage}
                    style={{alignItems: 'center', marginTop: 20, backgroundColor: '#F4F4F4', paddingVertical: 30, borderRadius: 15, elevation: 2}}
                    >
                    <Icon name="camera-plus" size={40} color={"#E7745D"} style={{marginBottom: 10}} />
                    <TText>Attach photo(s) here</TText>
                  </TouchableOpacity>
                </View>

                <View>
                  {image && <Image source={{uri: image}} style={{marginTop: 30, width: imageW / 4, height: imageH / 4}} />}
                </View>
              </View>

              {
                userType === 'worker' ?
                  <View style={styles.btnContainer}>
                  {/* Next page button */}
                    <TouchableOpacity
                      style={styles.nextBtn}
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
                  {/* Create Account Button */}
                    <TouchableOpacity style={styles.confirmBtn} 
                      onPress={() => setShowDialog(true)}
                    >
                      <TText style={{fontFamily: 'LexendDeca_SemiBold', fontSize: 18, color: ThemeDefaults.themeWhite}}
                        >Create Account</TText>
                    </TouchableOpacity>
                  </View>
              }

              
              {/* Checks if the user confirms the creation of his/her account  */}
              {
                isConfirmed ? navigation.navigate("OTPVerification", {phoneNum: user.phonenumber}) : null
              }

              {/* show confirm create account dialog */}
              { showDialog ?
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
              }
            </View> 
            : null
          }
          {
            next == 1 ?
            <View>
            <View style={styles.inputGrp}>
              {/* Username input */}
              <View style={styles.inputContainer}>
                <Icon name='account-circle' size={23} color={"#D0CCCB"} />
                <TextInput style={styles.input} 
                  autoCapitalize={'none'}
                  placeholder={"Username"}
                  value={user.username ? user.username : null}
                  placeholderTextColor={"#A1A1A1"}
                  returnKeyType={"next"}
                  textContentType={'username'}
                  onChangeText={ (val) => {
                    setUser((prev) => ({...prev, username: val}))
                    } }
                  onSubmitEditing={ () => ref_pw.current.focus() } />
              </View>
              
              {/* Password input */}
              <View style={styles.inputContainer}>
                <Icon name='lock' size={23} color={"#D0CCCB"} /> 
                <TextInput style={styles.input} 
                  autoCapitalize={'none'}
                  placeholder={"Password"}
                  placeholderTextColor={"#A1A1A1"}
                  value={user.password ? user.password : null}
                  returnKeyType={"next"}
                  secureTextEntry={true}
                  textContentType={'password'}
                  onChangeText={ (val) => setUser((prev) => ({...prev, password: val})) }
                  onSubmitEditing={ () => ref_cpw.current.focus() }
                  ref={ref_pw} />
              </View>
              
              {/* Confirm Password input */}
              <View style={styles.inputContainer}>
                <Icon name='lock' size={23} color={"#D0CCCB"} /> 
                <TextInput style={styles.input} 
                  placeholder={"Confirm Password"}
                  placeholderTextColor={"#A1A1A1"}
                  returnKeyType={"next"}
                  secureTextEntry={true}
                  textContentType={'confirmpw'}
                  onSubmitEditing={ () => ref_fn.current.focus() }
                  ref={ref_cpw} />
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
                  onChangeText={ (val) => setUser((prev) => ({...prev, firstname: val})) }
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
                  onChangeText={ (val) => setUser((prev) => ({...prev, middlename: val})) }
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
                  onChangeText={ (val) => setUser((prev) => ({...prev, lastname: val})) }
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
                <View style={styles.ageView}>
                  <Icon name='counter' size={15} color={"#D0CCCB"} />
                  <TextInput style={styles.input} 
                    placeholder={"Age"}
                    placeholderTextColor={"#A1A1A1"}
                    value={user.age ? user.age : null}
                    keyboardType={'numeric'}
                    returnKeyType={"next"}
                    textContentType={'age'}
                    onChangeText={ (val) => setUser((prev) => ({...prev, age: val})) }
                    ref={ref_age} />
                </View>
                <View style={styles.sexView}>
                  <Icon name='gender-male-female' size={15} color={"#D0CCCB"} /> 
                    <TouchableOpacity 
                      onPress={() => changeModalVisibility(true)}
                      style={{
                        width: '85%', 
                        flexDirection: 'row', 
                        alignItems: 'center',  
                        justifyContent: 'space-between',
                        paddingTop: 8,
                        paddingBottom: 10,
                      }}>
                      <TouchableOpacity 
                        styles={styles.dropdownBtn}
                      >
                      {
                        chooseData ?
                        <TText style={styles.ddText} >{chooseData}</TText>
                        : <TText style={[styles.ddText, {color:"#A1A1A1"}]}>Sex</TText>
                      }
                      </TouchableOpacity>
                      <Modal
                        transparent={true}
                        animationType='fade'
                        visible={isModalVisible}
                        onRequestClose={() => changeModalVisibility(false)}
                      >
                        <ModalPicker 
                          changeModalVisibility={changeModalVisibility}
                          setData={setData}
                          sex={true}
                        />
                      </Modal>
                      <Icon name="arrow-down-drop-circle" size={20} color={"#D0CCCB"} style={{paddingRight: 6}} />
                    </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Next page button */}
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={()=> { 
                  setNext((current) => current + 1)
                  }}
                >
                <TText style={styles.nextText}>Next</TText>
                <Icon name="arrow-right-thin" size={30} color='white' />
              </TouchableOpacity>
            </View>
          </View> : null
          }
        </ScrollView>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        alignItems: 'center',
        backgroundColor: '#fff'
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
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 7,
      width: '80%',
      marginBottom: 20
    },
    inputContainerBottom: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      // padding: 7,
      width: '80%',
      // marginBottom: 18
    },
    bdView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 10,
      width: '45%',
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
      width: '28%',
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
      width: '80%'
    },
    confirm: {
      alignItems: 'center',
      marginTop: 50,
      marginBottom: 50,
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
      paddingHorizontal: 30,
      paddingVertical: 40,
    },
    confirmModalBtnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: ThemeDefaults.themeWhite
    },
    confirmModalBtn: {
      alignItems: 'center',
      paddingVertical: 20
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
