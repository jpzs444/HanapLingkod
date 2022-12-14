import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from './TText';
import { useNavigation } from '@react-navigation/native';



const CustomDrawer = (props) => {
    const navigation = useNavigation()
  return (
    <View style={{flexGrow: 1, backgroundColor: "#fafafa"}}>
        <DrawerContentScrollView {...props} >

            {/* Header view for drawer */}
            <View style={{padding: 20}}>
                <Icon name="arrow-left" size={30} onPress={() => props.navigation.closeDrawer()} style={{alignSelf: 'flex-end', marginBottom: 20, marginRight: 10, padding: 7}} />
                <Image source={require("../assets/logo/logo_full.png")} style={{width: '90%', height: 150}} />
            </View>

            {/* Drawer screen list */}
            <View style={{flexGrow: 1, paddingTop: 20, marginBottom: Dimensions.get('window').height / 4,}}>
                <View style={{height: '100%',}}>
                    <DrawerItemList {...props} />
                </View>
            </View>


        </DrawerContentScrollView>
        {/* Drawer Bottom options */}
        <View style={{borderTopColor: '#ccc', borderTopWidth: 0.5, padding: 20, marginTop: 'auto', marginBottom: 20}}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => {
                    global.userData = ""
                    navigation.replace("Login")
                    console.log("logout btn")
                }}
            >
                <Icon name="logout" size={25} style={{marginRight: 15}} />
                <TText>Logout</TText>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default CustomDrawer

const styles = StyleSheet.create({})