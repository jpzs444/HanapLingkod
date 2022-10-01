import React, {useRef, useState, useEffect} from 'react';
import { SafeAreaView, 
    View, 
    Text, 
    Image, 
    TextInput, 
    StatusBar, 
    StyleSheet, 
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView
   } from 'react-native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeDefaults from '../Components/ThemeDefaults';
import TText from '../Components/TText';
import { IPAddress, userData } from '../global/global';

// import RNFetchBlob from 'rn-fetch-blob'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default function Login({navigation}) {

    const pw_ref = useRef();

    const [user, setUser] = useState({
        username: '',
        password: ''
    })
    const [hidePW, sethidePW] = useState(true);
    const [isWrongCredentials, setIsWrongCredentials] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);

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

    if(isLoading){
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)'}}>
          <ActivityIndicator size={'large'} />
        </View>
      )
    }

    // FETCH DATA FROM SERVER
    const login = () => {
      fetch("http://" + IPAddress + ":3000/login?username="+user.username, {
        method: "POST",
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((user) => {

          // console.log("user data: ", user)

          if(user._id){
            setIsLoading(true)
            setIsWrongCredentials(false);
            
            global.userData = user;
            
            setIsLoading(false)
            setUser({username: "", password: ""});
            navigation.replace("HomeStack");
            // navigation.navigate("OTPVerification", {isLogin: true, phoneNum: user.phoneNumber})

          } else {
            setIsLoading(false)
            setIsWrongCredentials(true)
            setUser({username: "", password: ""});

            // alert("username and password are incorrect. please try again")
          }

          // navigation.navigate("HomeStack");
        })
        .catch((error) => {
          setIsWrongCredentials(true)
          // alert("Incorrect Credentials. Try again", error);
          setIsLoading(false)
          setUser({username: "", password: ""});
        });

    };


  return (
    <View style={styles.container}>
    {/* Header */}
      <View style={styles.orangebg}>
        <View style={styles.darkbluebg}>
          <View style={styles.whitebg}>
            <Image source={require('../assets/logo/logo_full.png')} style={styles.image} />
          </View>
        </View>
      </View>

        {/* Username or Password error */}
     <View style={{alignItems: 'center'}}>

        {/* Inputs */}
        <View style={styles.inputContainer}>
          {/* Username */}
          <View style={styles.inputView}>
              <Icon name='account-circle' size={22} color={'1B233A'} />
              <TextInput style={styles.input} 
                  autoCapitalize={'none'}
                  placeholder={"Username"}
                  placeholderTextColor={"#1B233A"}
                  value={user.username && user.username}
                  returnKeyType={"next"}
                  textContentType={'username'}
                  onChangeText={ (val) => setUser((prev) => ({...prev, username: val})) }
                  onSubmitEditing={ () => pw_ref.current.focus() } />
          </View>

          {/* Password */}
          <View style={styles.inputView}>
              <Icon name='lock' size={22} color={'#1B233A'} />
              <TextInput style={[styles.input, styles.inputPW]} 
                  autoCapitalize='none'
                  placeholder={"Password"}
                  placeholderTextColor={"#1B233A"}
                  value={user.password && user.password}
                  returnKeyType={"go"}
                  secureTextEntry={hidePW}
                  textContentType={'password'}
                  onChangeText={ (val) => setUser((prev) => ({...prev, password: val})) }
                  onSubmitEditing={()=>login()}
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

     <View style={{ width: '80%', alignContent: 'center', position: 'relative', top: 50}}>  
        <View style={[styles.inputErrorView, {opacity: isWrongCredentials ? 1 : 0,  marginBottom: isWrongCredentials ? 10 : 0}]}>
          <Text style={styles.inputErrorText}>The username or password you entered is incorrect</Text>
        </View>
        {/* Sign in button */}
        <View style={styles.sign_in}>
          <TouchableOpacity style={styles.btn}
          disabled={user.username && user.password ? false : true}
            onPress={() => {
              // setIsLoading(true)
              login()
              // navigation.navigate("HomeStack")

            }}
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

    </View>
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
        width: '100%',
        // paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: '10%',
        // marginBottom: 10
    },
    inputErrorText: {
        fontSize: 17,
        textAlign: "center",
        color: ThemeDefaults.appIcon
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: HEIGHT / 20,        
    },
    inputView: {
        flexDirection: 'row',
        width: '75%',
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
        marginTop: '5%',
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
        fontSize: 17,
        color: '#FF803C'
    },
    image: {
      width: 280,
      height: 180,
    },
    orangebg: {
      // flex: 1.5,
      backgroundColor: '#FF803C',
      width: '100%',
      height: HEIGHT /2.4,
      borderBottomRightRadius: 50,
    },
    darkbluebg: {
      backgroundColor: '#1B233A',
      width: '100%',
      height: HEIGHT / 2.7,
      borderBottomRightRadius: 70,
    },
    whitebg: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      width: '100%',
      height: HEIGHT / 3.1,
      borderBottomRightRadius: 80,
    },
  });
  
