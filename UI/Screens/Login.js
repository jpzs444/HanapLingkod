import React, {useRef, useState} from 'react';
import { SafeAreaView, 
    View, 
    Text, 
    Image, 
    TextInput, 
    StatusBar, 
    StyleSheet, 
    TouchableOpacity, } from 'react-native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Login({navigation}) {

    const pw_ref = useRef();

    const [user, setUser] = useState({
        username: '',
        password: ''
    })
    const [username, setUsername] = useState('')
    const [hidePW, sethidePW] = useState(true);

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
    {/* Header */}
      <View style={styles.orangebg}>
        <View style={styles.darkbluebg}>
          <View style={styles.whitebg}>
            <Image source={require('../assets/logo/logo_full.png')} style={styles.image} />
          </View>
        </View>
      </View>

        {/* Username or Password error */}
     <View style={{flex: 1}}>
      <View style={styles.inputErrorView}>
          <Text style={styles.inputErrorText}>The username or password you entered is incorrect</Text>
        </View>

      {/* Inputs */}
        <View style={styles.inputContainer}>
          {/* Username */}
          <View style={styles.inputView}>
              <Icon name='account-circle' size={22} color={'1B233A'} />
              <TextInput style={styles.input} 
                  autoCapitalize={'none'}
                  placeholder={"Username"}
                  placeholderTextColor={"#1B233A"}
                  returnKeyType={"next"}
                  textContentType={'username'}
                  onChangeText={ (val) => setUser((prev) => ({...prev, username: val})) }
                  onSubmitEditing={ () => pw_ref.current.focus() } />
          </View>

          {/* Password */}
          <View style={styles.inputView}>
              <Icon name='lock' size={22} color={'#1B233A'} />
              <TextInput style={[styles.input, styles.inputPW]} 
                  placeholder={"Password"}
                  placeholderTextColor={"#1B233A"}
                  returnKeyType={"go"}
                  secureTextEntry={hidePW}
                  textContentType={'password'}
                  onChangeText={ (val) => setUser((prev) => ({...prev, password: val})) }
                  ref={pw_ref} />
              {
                  <Icon 
                      name= { hidePW ? 'eye-off' : 'eye' }
                      size={22} color={'#a3a096'}
                      onPress={ () => sethidePW(!hidePW) }
                  />
              }
          </View>

          {/* Forgot password button */}
          <TouchableOpacity style={styles.fp_btn}>
              <Text style={styles.forgotPw}>Forgot Password?</Text>
          </TouchableOpacity>

        </View>
     </View>

     <View style={{flex: 1, width: '80%', alignContent: 'center'}}>
                 {/* Sign in button */}
        <View style={styles.sign_in}>
          <TouchableOpacity style={styles.btn}
            onPress={() => navigation.navigate("Home")}
          >
              <Text style={styles.btnTxt}>Sign in</Text>
          </TouchableOpacity>
        </View>

          {/* Create Account */}
        <View style={styles.createAccountView}>
          <Text style={styles.text}>Don't have an account?</Text>
          <TouchableOpacity style={styles.registerBtn}
            onPress={() => navigation.navigate('AccountTypeSelect')}
          >
              <Text style={styles.registerTxt}>Register</Text>
          </TouchableOpacity>
        </View>
     </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#fff',
      alignItems: 'center',
      padding: 0,
      paddingTop: StatusBar.currentHeight,
    },
    text: {
      fontFamily: 'LexendDeca',
      fontSize: 16
    },
    inputErrorView: {
        opacity: 0,
        width: '80%',
        // paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: 'red',
        marginTop: '10%',
        marginBottom: 10
    },
    inputErrorText: {
        color: '#fff'
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputView: {
        flexDirection: 'row',
        width: '80%',
        marginHorizontal: '10%',
        alignItems: 'center',
        marginBottom: 20,
        padding: 6,
        borderBottomWidth: 1,
        borderColor: 'black',
    },
    input: {
        fontFamily: 'LexendDeca',
        width: '100%',
        padding: 5,
        marginLeft: 8,
        fontSize: 18,
    },
    inputPW: {
        width: '94%'
    },
    fp_btn: {
        alignSelf: 'flex-end',
        marginHorizontal: '10%',
    },
    forgotPw: {
        fontFamily: 'LexendDeca',
        fontSize: 16,
    },
    sign_in: {
        // width: '80%',
        marginTop: '25%',
    },
    btn: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 14,
        backgroundColor: '#FF803C',
        borderRadius: 15,
        elevation: 2
    },
    btnTxt: {
        fontFamily: 'LexendDeca_SemiBold',
        fontSize: 20,
        color: '#fff'
    },
    createAccountView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5%',
        textAlign: 'center',
    },
    registerTxt: {
        marginLeft: 3,
        fontFamily: 'LexendDeca_Medium',
        fontSize: 16,
        color: '#FF803C'
    },
    image: {
      width: 280,
      height: 180,
    },
    orangebg: {
      flex: 1.15,
      backgroundColor: '#FF803C',
      width: '100%',
      height: "42%",
      borderBottomRightRadius: 70,
    },
    darkbluebg: {
      backgroundColor: '#1B233A',
      width: '100%',
      height: "88%",
      borderBottomRightRadius: 70,
    },
    whitebg: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      width: '100%',
      height: '86%',
      borderBottomRightRadius: 70,
    },
  });
  
