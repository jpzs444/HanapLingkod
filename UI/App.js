import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import 'react-native-gesture-handler';

import LoginNavigationStack from './Components/LoginStack';

import TabNavigation from './Components/TabNavigation';
import DrawerNavigator from './Components/DrawerNavigation';

const AppStack = createNativeStackNavigator();

export default function App() {
  // const {isLoading, userToken} = useContext(AuthContext);

  // if(isLoading) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator size={"large"} />
  //     </View>
  //   );
  // }

  return (
      <NavigationContainer>
        <AppStack.Navigator initialRouteName="LoginNavigationStack" screenOptions={{headerShown: false}} >
          <AppStack.Screen name="LoginNavigationStack" component={LoginNavigationStack} /> 
          <AppStack.Screen name="DrawerNavigation" component={DrawerNavigator} /> 
        </AppStack.Navigator>

        {/* <LoginNavigationStack /> */}
        {/* <DrawerNavigator /> */}

      </NavigationContainer>
  );
}

