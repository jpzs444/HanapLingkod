import React from 'react'
import { SafeAreaView, View, Image, StatusBar, ScrollView, StyleSheet } from 'react-native';
import TText from '../Components/TText'
import { useNavigation } from '@react-navigation/native';
import Appbar from '../Components/Appbar';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { role, userID } from '../global/global';

export default function Home({route}) {


  const navigation = useNavigation();
  // const {user, role} = route.params;

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: StatusBar.currentHeight, backgroundColor: '#fff'}}>
        <ScrollView style={{flex: 1, width: '100%'}}>
            <Appbar hasPicture={true} menuBtn={true} />
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <TText>Welcome to the Home Screen of HanapLingkod</TText>
              <TText>{global.userData.firstname} {global.userData.lastname}</TText>
              <TText>{global.userData.role}</TText>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}
