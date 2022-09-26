
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../Screens/Home';
import ListSpecificWorkers from '../Screens/ListSpecificWorkers';
import Messaging from '../Screens/Messaging';
import Notifications from '../Screens/Notifications';
import PostRequests from '../Screens/PostRequests';
import SubCategory from '../Screens/SubCategory';
import Workers from '../Screens/Workers';


const HomeStack = createNativeStackNavigator();


export default function HomeNavigationStack () {
    return(
      <HomeStack.Navigator initialRouteName="HomeScreen" screenOptions={{headerShown: false}} >
          <HomeStack.Screen name="HomeScreen" component={Home} />
          <HomeStack.Screen name="SubCategoryScreen" component={SubCategory} />
          <HomeStack.Screen name="ListSpecificWorkerScreen" component={ListSpecificWorkers} />
          <HomeStack.Screen name="WorkerScreen" component={Workers} />
          <HomeStack.Screen name="PostRequestScreen" component={PostRequests} />
          <HomeStack.Screen name="MessagingScreen" component={Messaging} />
          <HomeStack.Screen name="NotificationScreen" component={Notifications} />
      </HomeStack.Navigator>
    )
}

