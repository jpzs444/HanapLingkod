import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Screens/Login'
import RegisterUserAccountType from '../Screens/RegisterUserAccountType';
import Registration from '../Screens/Registration';
import OTPVerification from '../Screens/OTPVerification';
import Welcome from '../Screens/Welcome';
import DrawerNavigation from './DrawerNavigation';

const LoginStack = createNativeStackNavigator();


export default function LoginNavigationStack(){
    return(
      <LoginStack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}} >
          <LoginStack.Screen name="Login" component={Login} />
          <LoginStack.Screen name="AccountTypeSelect" component={RegisterUserAccountType} />
          <LoginStack.Screen name="Register" component={Registration} />
          <LoginStack.Screen name="OTPVerification" component={OTPVerification} />
          <LoginStack.Screen name="WelcomePage" component={Welcome} />
          <LoginStack.Screen name="HomeStack" component={DrawerNavigation} />
      </LoginStack.Navigator>
    )
  }