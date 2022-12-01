import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPassword from '../Screens/ForgotPassword';
import OTPVerification from '../Screens/OTPVerification';
import ResetPassword from '../Screens/ResetPassword';

const FPStack = createNativeStackNavigator();

const ForgotPasswordStack = () => {
  return (
    <FPStack.Navigator initialRouteName="FP_Username" screenOptions={{headerShown: false}}>
        <FPStack.Screen name="FP_Username" component={ForgotPassword}/>
        <FPStack.Screen name="FP_Reset" component={ResetPassword}/>
        <FPStack.Screen name="FP_OTPVerification" component={OTPVerification}/>
    </FPStack.Navigator>
  )
}

export default ForgotPasswordStack