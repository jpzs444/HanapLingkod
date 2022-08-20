import React from 'react'
import { SafeAreaView, View, Image, StatusBar, ScrollView, StyleSheet } from 'react-native';
import TText from '../Components/TText'
import { useNavigation } from '@react-navigation/native';
import Appbar from '../Components/Appbar';
import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Home() {

    const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: StatusBar.currentHeight, backgroundColor: '#fff'}}>
        <ScrollView style={{flex: 1, width: '100%'}}>
            <Appbar hasPicture={true} menuBtn={true} />
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TText>Home</TText>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}
