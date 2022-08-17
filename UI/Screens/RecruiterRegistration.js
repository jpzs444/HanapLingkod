import React, {useRef, useState} from 'react';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, 
  Image, Button, StyleSheet, StatusBar, ScrollView, Modal } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import { ModalPicker } from '../Components/ModalPicker';

import dayjs from 'dayjs';
import TText from '../Components/TText';
import ThemeDefaults from '../Components/ThemeDefaults';

export default function RecruiterRegistration() {

  const getCurrentDate=()=>{

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    //Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    // return year + '-' + month + '-' + date;//format: yyyy-mm-dd;
    return `${year} - ${month} - ${date}`;
}

    const [user, setUser] = useState({
      username: "",
      password: "",
      firstname: "",
      middlename: "",
      lastname: "",
      birthday: "",
      age: "",
      gender: "",
    })
    
    const [ddopen, setDDOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Male', value: 'M'},
      {label: 'Female', value: 'F'}
    ]);

    const [chooseData, setchooseData] = useState("Sex")
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

    const ref_pw = useRef();
    const ref_cpw = useRef();
    const ref_fn = useRef();
    const ref_mn = useRef();
    const ref_ln = useRef();
    const ref_bd = useRef();
    const ref_age = useRef();
    const ref_gender = useRef();

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
        <Appbar.Header style={{height: 30, backgroundColor: 'transparent', alignItems: 'center', alignSelf: 'flex-start'}}>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content title={<Image source={require('../assets/logo/logo_icon.png')} style={{width: 60, height: 60}} />} />
        </Appbar.Header>
          <View style={styles.header}>
              <TText style={styles.headerTitle}>Recruiter Information</TText>
              <TText style={styles.headerDesc}>Please fill in your personal information carefully. The details will be needed for verification.</TText>
              {/* <TText style={styles.headerDesc}>The details will be needed for verification.</TText> */}
          </View>

        {next ? 
        <View>
        <View style={styles.inputGrp}>
          <View style={styles.inputContainer}>
            <Icon name='account-circle' size={23} />
            <TextInput style={styles.input} 
              placeholder={"Street"}
              placeholderTextColor={"#1B233A"}
              returnKeyType={"next"}
              textContentType={'street'}
              onChangeText={ (val) => setUser((prev) => ({...prev, username: val})) }
              onSubmitEditing={ () => ref_pw.current.focus() } />
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name='lock' size={23} />
            <TextInput style={styles.input} 
              placeholder={"Purok"}
              placeholderTextColor={"#1B233A"}
              returnKeyType={"next"}
              secureTextEntry={true}
              textContentType={'purok'}
              onChangeText={ (val) => setUser((prev) => ({...prev, password: val})) }
              onSubmitEditing={ () => ref_cpw.current.focus() }
              ref={ref_pw} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name='lock' size={23} />
            <TextInput style={styles.input} 
              placeholder={"Barangay"}
              placeholderTextColor={"#1B233A"}
              returnKeyType={"next"}
              secureTextEntry={true}
              textContentType={'confirmpw'}
              // onChangeText={ (val) => setUser((prev) => ({...prev, username: val})) }
              onSubmitEditing={ () => ref_fn.current.focus() }
              ref={ref_cpw} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name='account-box' size={23} />
            <TextInput style={styles.input} 
              placeholder={"City"}
              placeholderTextColor={"#1B233A"}
              returnKeyType={"next"}
              textContentType={'firstname'}
              onChangeText={ (val) => setUser((prev) => ({...prev, firstname: val})) }
              onSubmitEditing={ () => ref_mn.current.focus() }
              ref={ref_fn} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name='account-box' size={23} />
            <TextInput style={styles.input} 
              placeholder={"Province"}
              placeholderTextColor={"#1B233A"}
              returnKeyType={"next"}
              textContentType={'middlename'}
              onChangeText={ (val) => setUser((prev) => ({...prev, middlename: val})) }
              onSubmitEditing={ () => ref_ln.current.focus() }
              ref={ref_mn} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name='account-box' size={23} />
            <TextInput style={styles.input} 
              placeholder={"Phone Number"}
              placeholderTextColor={"#1B233A"}
              returnKeyType={"next"}
              textContentType={'lastname'}
              onChangeText={ (val) => setUser((prev) => ({...prev, lastname: val})) }
              onSubmitEditing={ () => ref_bd.current.focus() }
              ref={ref_ln} />
          </View>

        
          {/* <View>
            <TText>{user.username} {user.password} {user.firstname} {user.lastname}</TText>
          </View> */}

        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={()=> { setNext(false)}}
            >
            <TText style={styles.nextText}>Back</TText>
            <Icon name="arrow-left-thin" size={30} color='white' />
          </TouchableOpacity>
        </View>
        </View> 
        : 
        <View>
        <View style={styles.inputGrp}>
          <View style={styles.inputContainer}>
            <Icon name='account-circle' size={23} />
            <TextInput style={styles.input} 
              placeholder={"Username"}
              value={user.username ? user.username : null}
              placeholderTextColor={"#1B233A"}
              returnKeyType={"next"}
              textContentType={'username'}
              onChangeText={ (val) => setUser((prev) => ({...prev, username: val})) }
              onSubmitEditing={ () => ref_pw.current.focus() } />
          </View>
          
          <View style={styles.inputContainer}>
            <Icon name='lock' size={23} />
            <TextInput style={styles.input} 
              placeholder={"Password"}
              placeholderTextColor={"#1B233A"}
              value={user.username ? user.password : null}
              returnKeyType={"next"}
              secureTextEntry={true}
              textContentType={'password'}
              onChangeText={ (val) => setUser((prev) => ({...prev, password: val})) }
              onSubmitEditing={ () => ref_cpw.current.focus() }
              ref={ref_pw} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name='lock' size={23} />
            <TextInput style={styles.input} 
              placeholder={"Confirm Password"}
              placeholderTextColor={"#1B233A"}
              returnKeyType={"next"}
              secureTextEntry={true}
              textContentType={'confirmpw'}
              // onChangeText={ (val) => setUser((prev) => ({...prev, username: val})) }
              onSubmitEditing={ () => ref_fn.current.focus() }
              ref={ref_cpw} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name='account-box' size={23} />
            <TextInput style={styles.input} 
              placeholder={"First Name"}
              placeholderTextColor={"#1B233A"}
              value={user.username ? user.firstname : null}
              returnKeyType={"next"}
              textContentType={'firstname'}
              onChangeText={ (val) => setUser((prev) => ({...prev, firstname: val})) }
              onSubmitEditing={ () => ref_mn.current.focus() }
              ref={ref_fn} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name='account-box' size={23} />
            <TextInput style={styles.input} 
              placeholder={"Middle Name (Optional)"}
              placeholderTextColor={"#1B233A"}
              value={user.username ? user.middlename : null}
              returnKeyType={"next"}
              textContentType={'middlename'}
              onChangeText={ (val) => setUser((prev) => ({...prev, middlename: val})) }
              onSubmitEditing={ () => ref_ln.current.focus() }
              ref={ref_mn} />
          </View>

          <View style={styles.inputContainer}>
            <Icon name='account-box' size={23} />
            <TextInput style={styles.input} 
              placeholder={"Last Name"}
              placeholderTextColor={"#1B233A"}
              value={user.username ? user.lastname : null}
              returnKeyType={"next"}
              textContentType={'lastname'}
              onChangeText={ (val) => setUser((prev) => ({...prev, lastname: val})) }
              onSubmitEditing={ () => ref_bd.current.focus() }
              ref={ref_ln} />
          </View>

          <View style={styles.inputContainerBottom}>
            <View style={styles.bdView}>
              <Icon name='cake' size={20} />
              <TouchableOpacity onPress={ () => setDatePickerVisibility(true) } style={styles.bdayBtn} >
                <TText style={styles.bdayText}>{dateSelected ? displayDate.toString() : 'Birthday'}</TText>
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
              <Icon name='counter' size={15} />
              <TextInput style={styles.input} 
                placeholder={"Age"}
                placeholderTextColor={"#1B233A"}
                value={user.username ? user.age : null}
                keyboardType={'numeric'}
                returnKeyType={"next"}
                textContentType={'age'}
                onChangeText={ (val) => setUser((prev) => ({...prev, age: val})) }
                onSubmitEditing={ () => ref_bd.current.focus() }
                ref={ref_age} />
            </View>
            <View style={styles.sexView}>
              <Icon name='gender-male-female' size={15} />
              {/* <TextInput style={styles.input} 
                placeholder={"Sex"}
                placeholderTextColor={"#1B233A"}
                returnKeyType={"next"}
                textContentType={'sex'}
                onChangeText={ (val) => setUser((prev) => ({...prev, gender: val})) }
                ref={ref_gender} /> */}

                {/* <DropDownPicker
                  placeholder='Sex'
                  placeholderStyle={{fontFamily: 'LexendDeca'}}
                  open={ddopen}
                  value={value}
                  items={items}
                  setOpen={setDDOpen}
                  setValue={setValue}
                  setItems={setItems}
                  listItemContainerStyle={{borderColor: 'red'}}
                  listItemLabelStyle={{fontFamily: 'LexendDeca_SemiBold'}}
                  customItemContainerStyle={{borderColor: 'transparent'}}
                  style={{borderWidth: 0, padding: 0}}
                  zIndex={5}
                /> */}

                {/* <ModalDropdown options={['Male', 'Female']}
                  dropdownStyle={{backgroundColor: 'pink', paddingTop: 0}}
                  
                /> */}

                {/* Custom Dropdown */}
                <TouchableOpacity 
                  onPress={() => changeModalVisibility(true)}
                  style={{
                    // backgroundColor: 'pink', 
                    width: '85%', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    paddingVertical: 7,
                    marginTop: 7,
                  }}>
                  <TouchableOpacity 
                    styles={styles.dropdownBtn}
                  >
                    <TText style={styles.ddText} >{chooseData}</TText>
                  </TouchableOpacity>
                  <Modal
                    transparent={true}
                    animationType='fade'
                    visible={isModalVisible}
                    nRequestClose={() => changeModalVisibility(false)}
                  >
                    <ModalPicker 
                      changeModalVisibility={changeModalVisibility}
                      setData={setData}
                    />
                  </Modal>
                  <Icon name="arrow-down-drop-circle" size={20} color='gray' style={{paddingRight: 10}} />
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
        <View><Text>{displayDate.toString()}</Text></View>
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
      marginTop: 80,
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
      alignItems: 'center',
      // padding: 7,
      width: '80%',
      marginBottom: 18
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
    ageView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 8,
      marginTop: 1,
      marginLeft: '1%',
      width: '20%'
    },
    sexView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      // padding: 8,
      // marginTop: ,
      marginLeft: '1%',
      width: '28%'
    },
    ddText: {
      marginLeft: 15, 
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
      color: ThemeDefaults.themeWhite,
      marginRight: 5
    },
    dropdownBtn: {
      backgroundColor: 'pink',
      width: '100%',
    },
})
