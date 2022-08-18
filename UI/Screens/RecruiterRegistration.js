import React, {useRef, useState, useEffect} from 'react';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, 
  Image, Button, StyleSheet, StatusBar, ScrollView, Modal, Platform } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import { ModalPicker } from '../Components/ModalPicker';

import ImagePickerButton from '../Components/ImagePickerButton';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

import dayjs from 'dayjs';
import TText from '../Components/TText';
import ThemeDefaults from '../Components/ThemeDefaults';
import Appbar from '../Components/Appbar';

export default function RecruiterRegistration() {

     const [user, setUser] = useState({
      username: "",
      password: "",
      firstname: "",
      middlename: "",
      lastname: "",
      birthday: "",
      age: "",
      gender: "",
      street: "",
      purok: "",
      barangay: "",
      city: "",
      province: "",
      phonenumber: "",
      image: ''
    })

    const [idImage, setIdImage] = useState(null)
    
    const [ddopen, setDDOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Male', value: 'M'},
      {label: 'Female', value: 'F'}
    ]);

    const [chooseData, setchooseData] = useState("")
    const [isModalVisible, setModalVisible] = useState(false)

    const setData = (option) => {
      setchooseData(option)
    }

    const changeModalVisibility = (bool) => {
      setModalVisible(bool)
    }

    const [next, setNext] = useState(false)
    const [formatedDate, setFormatedDate] = useState(new Date())
    const [displayDate, setDisplayDate] = useState(new Date())
    const [dateSelected, setSelected] = useState(false)

    const [datePickerVisible, setDatePickerVisibility] = useState(false);
    const [timePickerVisible, setTimePickerVisibility] = useState(false);

    const handleConfirm = (date) => {
      // console.warn("A date has been picked: ", date);
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
        // props.changeWord(result.uri);
      }
    };

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
        <ScrollView style={{height: '100%', width: '100%',}}>

          <Appbar backBtn={true} hasPicture={false} />

          <View style={styles.header}>
              <TText style={styles.headerTitle}>Recruiter Information</TText>
              <TText style={styles.headerDesc}>Please fill in your personal information carefully. The details will be needed for verification.</TText>
              {/* <TText style={styles.headerDesc}>The details will be needed for verification.</TText> */}
          </View>

          {next ? 
          <View>
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
            
              <View style={[styles.inputContainer, {width: '48%'}]}>
                <Icon name='domain' size={23}color={"#D0CCCB"} />
                <TextInput style={styles.input} 
                  placeholder={"Barangay"}
                  placeholderTextColor={"#A1A1A1"}
                  returnKeyType={"next"}
                  textContentType={'confirmpw'}
                  // onChangeText={ (val) => setUser((prev) => ({...prev, username: val})) }
                  onSubmitEditing={ () => ref_fn.current.focus() }
                  ref={ref_cpw} />
              </View>
            </View>


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
              {/* <ImagePickerButton changeWord={(image) => { setUser((prev) => ({...prev, image: image})) }} /> */}
            </View>

            <View>
              {image && <Image source={{uri: image}} style={{marginTop: 30, width: imageW / 4, height: imageH / 4}} />}
            </View>

          
            {/* <View>
              <TText>{user.username} {user.password} {user.firstname} {user.lastname}</TText>
            </View> */}

          </View>
            {/* Back Button | to be removed later after implementation of appbar */}
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={()=> { setNext(false)}}
              >
              <TText style={styles.nextText}>Back</TText>
              <Icon name="arrow-left-thin" size={30} color='white' />
            </TouchableOpacity>
          </View>

            {/* Create Account Button */}
          <View style={styles.confirm}>
              <TouchableOpacity style={styles.confirmBtn}>
                <TText style={{fontFamily: 'LexendDeca_SemiBold', fontSize: 18, color: ThemeDefaults.themeWhite}}>Create Account</TText>
              </TouchableOpacity>
            </View>
          </View> 
          : 
          <View>
          <View style={styles.inputGrp}>
            <View style={styles.inputContainer}>
              <Icon name='account-circle' size={23} color={"#D0CCCB"} />
              <TextInput style={styles.input} 
                autoCapitalize={'none'}
                placeholder={"Username"}
                value={user.username ? user.username : null}
                placeholderTextColor={"#A1A1A1"}
                returnKeyType={"next"}
                textContentType={'username'}
                onChangeText={ (val) => setUser((prev) => ({...prev, username: val})) }
                onSubmitEditing={ () => ref_pw.current.focus() } />
            </View>
            
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

            <View style={styles.inputContainer}>
              <Icon name='lock' size={23} color={"#D0CCCB"} />
              <TextInput style={styles.input} 
                placeholder={"Confirm Password"}
                placeholderTextColor={"#A1A1A1"}
                returnKeyType={"next"}
                secureTextEntry={true}
                textContentType={'confirmpw'}
                // onChangeText={ (val) => setUser((prev) => ({...prev, username: val})) }
                onSubmitEditing={ () => ref_fn.current.focus() }
                ref={ref_cpw} />
            </View>

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

            <View style={styles.inputContainer}>
              <Icon name='account-box' size={23} color={"#D0CCCB"} />
              <TextInput style={styles.input} 
                placeholder={"Last Name"}
                placeholderTextColor={"#A1A1A1"}
                value={user.lastname ? user.lastname : null}
                returnKeyType={"next"}
                textContentType={'lastname'}
                onChangeText={ (val) => setUser((prev) => ({...prev, lastname: val})) }
                // onSubmitEditing={ () => ref_bd.current.focus() }
                ref={ref_ln} />
            </View>

            <View style={styles.inputContainerBottom}>
              <View style={styles.bdView}>
                <Icon name='cake' size={20} color={"#D0CCCB"} />
                <TouchableOpacity onPress={ () => setDatePickerVisibility(true) } style={styles.bdayBtn} >
                  {/* <TText style={styles.bdayText}>{dateSelected ? displayDate.toString() : 'Birthday'}</TText> */}
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
                  // onSubmitEditing={ () => ref_bd.current.focus() }
                  ref={ref_age} />
              </View>
              <View style={styles.sexView}>
                <Icon name='gender-male-female' size={15} color={"#D0CCCB"} />
                {/* <TextInput style={styles.input} 
                  placeholder={"Sex"}
                  placeholderTextColor={"#1B233A"}
                  returnKeyType={"next"}
                  textContentType={'sex'}
                  onChangeText={ (val) => setUser((prev) => ({...prev, gender: val})) }
                  ref={ref_gender} /> */}
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
                      />
                    </Modal>
                    <Icon name="arrow-down-drop-circle" size={20} color={"#D0CCCB"} style={{paddingRight: 6}} />
                  </TouchableOpacity>
              </View>
            </View>
            

            {/* <View>
              <TText>{user.username} {user.password} {user.firstname} {user.lastname}</TText>
            </View> */}

          </View>

            {/* <View><Text>{birthday}</Text></View> */}
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={()=> { setNext(true)}}
              >
              <TText style={styles.nextText}>Next</TText>
              <Icon name="arrow-right-thin" size={30} color='white' />
            </TouchableOpacity>
          </View>
          {/* <View><Text>{displayDate.toString()}</Text></View> */}
          </View>
          }

        </ScrollView>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        alignItems: 'center',
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
      marginLeft: 8,
      marginRight: 5,
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
      padding: 8,
      flexDirection: 'row',
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nextText: {
      fontFamily: 'LexendDeca_SemiBold',
      color: ThemeDefaults.themeWhite,
      marginRight: 5
    },
    dropdownBtn: {
      backgroundColor: 'pink',
      width: '100%',
    },
    inputInRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '80%'
    },
    confirm: {
      alignItems: 'center',
      elevation: 4
    },
    confirmBtn: {
      width: '80%',
      backgroundColor: ThemeDefaults.themeOrange,
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 15,
    },
})
