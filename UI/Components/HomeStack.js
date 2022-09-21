
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../Screens/Home';
import Messaging from '../Screens/Messaging';
import Notifications from '../Screens/Notifications';
import PostRequests from '../Screens/PostRequests';
import Workers from '../Screens/Workers';


const HomeStack = createNativeStackNavigator();


export default function HomeNavigationStack () {
    return(
      <HomeStack.Navigator initialRouteName="HomeScreen" screenOptions={{headerShown: false}} >
          <HomeStack.Screen name="HomeScreen" component={Home} />
          <HomeStack.Screen name="WorkerScreen" component={Workers} />
          <HomeStack.Screen name="PostRequestScreen" component={PostRequests} />
          <HomeStack.Screen name="MessagingScreen" component={Messaging} />
          <HomeStack.Screen name="NotificationScreen" component={Notifications} />
      </HomeStack.Navigator>
    )
}

