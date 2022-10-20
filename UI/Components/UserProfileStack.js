import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserProfile from '../Screens/UserProfile';
import Home from '../Screens/Home';
import Edit_UserProfile from '../Screens/Edit_UserProfile';
import ViewImage from './ViewImage';
import OTPVerification from '../Screens/OTPVerification';
import CalendarView from '../Screens/CalendarView';
import AddEventCalendar from '../Screens/AddEventCalendar';

const UserProfileStacks = createNativeStackNavigator();


export default function UserProfileStack () {
    return(
      <UserProfileStacks.Navigator initialRouteName="UserProfileScreen" screenOptions={{headerShown: false}} >
          <UserProfileStacks.Screen name="HomeProfileStack" component={Home} />
          <UserProfileStacks.Screen name="UserProfileScreen" component={UserProfile} />
          <UserProfileStacks.Screen name="EditUserProfileScreen" component={Edit_UserProfile} />
          <UserProfileStacks.Screen name="ViewImageScreen" component={ViewImage} />
          <UserProfileStacks.Screen name="OTPVScreen" component={OTPVerification} />
          <UserProfileStacks.Screen name="CalendarViewUserStack" component={CalendarView} />
          <UserProfileStacks.Screen name="AddEventCalendarUserStack" component={AddEventCalendar} />
      </UserProfileStacks.Navigator>
    )
}
