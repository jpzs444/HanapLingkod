
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostRequests from '../Screens/PostRequests';
import ViewComments from '../Screens/ViewComments';


const PRStack = createNativeStackNavigator();

export default function PostRequestStack () {
    return(
      <PRStack.Navigator initialRouteName="PostRequestPRStack" screenOptions={{headerShown: false, tabBarVisible: false}} >
          <PRStack.Screen name="PostRequestPRStack" component={PostRequests} />
          <PRStack.Screen name="ViewCommentsPRStack" component={ViewComments} />
      </PRStack.Navigator>
    )
}

