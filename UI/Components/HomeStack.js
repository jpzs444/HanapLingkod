
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../Screens/Home';


const HomeStack = createNativeStackNavigator();

export default function HomeNavigationStack () {
    return(
      <HomeStack.Navigator initialRouteName="HomeScreen" screenOptions={{headerShown: false}} >
          <HomeStack.Screen name="HomeScreen" component={Home} />
      </HomeStack.Navigator>
    )
}
