import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Screens/Login'
import Welcome from '../Screens/Welcome';
import RegisterUserAccountType from '../Screens/RegisterUserAccountType';
import OTPVerification from '../Screens/OTPVerification';
import Registration from '../Screens/Registration';
import Home from '../Screens/Home';

import HomeStack from '../Components/HomeStack';

const LoginStack = createNativeStackNavigator();


export default function LoginNavigationStack(){
    return(
      <LoginStack.Navigator initialRouteName="HomeStack" screenOptions={{headerShown: false}} >
          <LoginStack.Screen name="Login" component={Login} />
          <LoginStack.Screen name="AccountTypeSelect" component={RegisterUserAccountType} />
          <LoginStack.Screen name="Register" component={Registration} />
          <LoginStack.Screen name="OTPVerification" component={OTPVerification} />
          <LoginStack.Screen name="WelcomeScreen" component={Welcome} />
          <LoginStack.Screen name="HomeStack" component={HomeStack} />
      </LoginStack.Navigator>
    )
  }