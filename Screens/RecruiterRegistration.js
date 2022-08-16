import React, {useRef, useState} from 'react';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import TText from '../Components/TText';
import ThemeDefaults from '../Components/ThemeDefaults';

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
  })
  const [next, setNext] = useState(false)

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
            <TText style={styles.headerDesc}>Please fill in your personal information carefully.</TText>
            <TText style={styles.headerDesc}>The details will be needed for verification.</TText>
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
            returnKeyType={"next"}
            textContentType={'lastname'}
            onChangeText={ (val) => setUser((prev) => ({...prev, lastname: val})) }
            onSubmitEditing={ () => ref_bd.current.focus() }
            ref={ref_ln} />
        </View>

        <View style={styles.inputContainerBottom}>
          <View style={styles.bdView}>
            <Icon name='cake' size={20} />
            <TextInput style={styles.input} 
              placeholder={"Birthday"}
              placeholderTextColor={"#1B233A"}
              returnKeyType={"next"}
              textContentType={'birthday'}
              onChangeText={ (val) => setUser((prev) => ({...prev, birthday: val})) }
              onSubmitEditing={ () => ref_age.current.focus() }
              ref={ref_bd} />
          </View>
          <View style={styles.ageView}>
            <Icon name='counter' size={20} />
            <TextInput style={styles.input} 
              placeholder={"Age"}
              placeholderTextColor={"#1B233A"}
              keyboardType={'numeric'}
              returnKeyType={"next"}
              textContentType={'age'}
              onChangeText={ (val) => setUser((prev) => ({...prev, age: val})) }
              onSubmitEditing={ () => ref_bd.current.focus() }
              ref={ref_age} />
          </View>
          <View style={styles.ageView}>
            <Icon name='gender-male-female' size={20} />
            <TextInput style={styles.input} 
              placeholder={"Sex"}
              placeholderTextColor={"#1B233A"}
              returnKeyType={"next"}
              textContentType={'sex'}
              onChangeText={ (val) => setUser((prev) => ({...prev, gender: val})) }
              ref={ref_gender} />
          </View>
        </View>

        {/* <View>
          <TText>{user.username} {user.password} {user.firstname} {user.lastname}</TText>
        </View> */}

      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={()=> { setNext(true)}}
          >
          <TText style={styles.nextText}>Next</TText>
          <Icon name="arrow-right-thin" size={30} color='white' />
        </TouchableOpacity>
      </View>
      </View>
      }

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: StatusBar.currentHeight,
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
      fontSize: 18
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
      width: '50%',
    },
    ageView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      padding: 10,
      marginLeft: '1%',
      width: '24%'
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
})
