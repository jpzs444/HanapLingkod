import React from 'react'
import {
    StatusBar, StyleSheet, View, Image, TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function Appbar(props) {

    const navigation = useNavigation();

  return (
    <View style={styles.container}>
        {/* left */}
        {
            props.backBtn ? 
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.left}
                >
                    <Icon name="arrow-left" size={30} />
                </TouchableOpacity> 
                :
                <TouchableOpacity 
                    onPress={() => navigation.popToTop()}
                    style={styles.left}
                >
                    <Icon name="menu" size={30} />
                </TouchableOpacity>
        }

        {/* center */}
        <View style={styles.center}>
            <Image source={require('../assets/logo/logo_icon.png')} 
                style={{width: 40, height: 40}}
            />
        </View>

        {/* right */}
        <TouchableOpacity style={styles.right}>
            {
                props.hasPicture ? 
                    <Icon name="account-circle" size={30} />
                    : <Icon name="account-circle" size={30} color={'transparent'} />

            }
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        // marginTop: StatusBar.currentHeight
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 15,
    },
    left: {
        marginLeft: 25,
        borderRadius: 20
    },
    center: {},
    right: {
        marginRight: 25,
        borderRadius: 20
    },
})
