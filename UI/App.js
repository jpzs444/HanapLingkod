import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import TabNavigation from './Components/TabNavigation';
import DrawerNavigator from './Components/DrawerNavigation';

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

        {/* <LoginStack /> */}
        <DrawerNavigator />

      </NavigationContainer>
  );
}

