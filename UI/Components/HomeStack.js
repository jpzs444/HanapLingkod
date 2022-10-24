
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../Screens/Home';
import ListSpecificWorkers from '../Screens/ListSpecificWorkers';
import Messaging from '../Screens/Messaging';
import Notifications from '../Screens/Notifications';
import PostRequests from '../Screens/PostRequests';
import SubCategory from '../Screens/SubCategory';
import UserProfile from '../Screens/UserProfile';
import Workers from '../Screens/Workers';
import UserProfileStack from './UserProfileStack';
import WorkerProfile from '../Screens/WorkerProfile';
import RequestForm from '../Screens/RequestForm';
import Requests from '../Screens/Requests';
import ViewComments from '../Screens/ViewComments';


const HomeStack = createNativeStackNavigator();

export default function HomeNavigationStack () {
    return(
      <HomeStack.Navigator initialRouteName="HomeScreen" screenOptions={{headerShown: false, tabBarVisible: false}} >
          <HomeStack.Screen name="HomeScreen" component={Home} />
          <HomeStack.Screen name="SubCategoryScreen" component={SubCategory} />
          <HomeStack.Screen name="ListSpecificWorkerScreen" component={ListSpecificWorkers} />
          <HomeStack.Screen name="WorkerScreen" component={Workers} />
          <HomeStack.Screen name="PostRequestScreen" component={PostRequests} />
          <HomeStack.Screen name="MessagingScreen" component={Messaging} />
          <HomeStack.Screen name="NotificationScreen" component={Notifications} />
          <HomeStack.Screen name="RequestsScreen" component={Requests} />
          {/* <HomeStack.Screen name="ViewCommentsScreen" component={ViewComments} /> */}
          {/* <HomeStack.Screen name="WorkerProfileScreen" component={WorkerProfile} /> */}
          {/* <HomeStack.Screen name="RequestFormScreen" component={RequestForm} /> */}
      </HomeStack.Navigator>
    )
}

