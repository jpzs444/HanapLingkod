import React from 'react'
import {
    StatusBar, StyleSheet, View, Image, TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import TText from './TText';

export default function Appbar(props) {

    const navigation = useNavigation();

  return (
    <View style={styles.container}>
        {/* left */}

            {/* Back Button */}
            {
                props.backBtn && props.accTypeSelect ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => { navigation.goBack() }}
                    >
                        <Icon name="arrow-left" size={30} />
                    </TouchableOpacity> 
                    : null
            }
            {
                props.backBtn && !props.accTypeSelect ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => {
                            if (props.screenView == 1) navigation.goBack()
                            else props.stateChangerNext(props.screenView - 1)
                        }}
                    >
                        <Icon name="arrow-left" size={30} />
                    </TouchableOpacity> : null
            }

            {/* Menu Button */}
            {
                props.menuBtn ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => navigation.popToTop()}
                    >
                        <Icon name="menu" size={30} />
                    </TouchableOpacity> : null
            }

        {/* center | HanapLingkod logo */}
        <View style={styles.center}>
            <Image source={require('../assets/logo/logo_icon.png')} 
                style={{width: 40, height: 40}}
            />
        </View>

        {/* right */}
        <TouchableOpacity style={styles.right}>
            {
                props.hasPicture ? 
                    <Icon name="account-circle" size={30} style={styles.userPicture} />
                    : null
            }
            {
                props.accTypeSelect === true ? 
                    <TText style={styles.rightText}>Page 1 of ?</TText>
                    : null
            }
            {
                props.registration && props.userType === "worker" ? 
                    <TText style={styles.rightText}>Page {props.screenView ? props.screenView + 1 : 1} of 5</TText>
                    : null
            }
            {
                props.registration && props.userType === "recruiter" ? 
                    <TText style={styles.rightText}>Page {props.screenView ? props.screenView + 1 : 1} of 3</TText>
                    : null
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
        flex: 1,
        marginLeft: 25,
        borderRadius: 20,
    },
    center: {
        flex: 2,
        alignItems: 'center',
    },
    right: {
        flex: 1,
        justifyContent: 'flex-end',
        width: 'auto',
        marginRight: 25,
        borderRadius: 20,
    },
    rightText: {
        textAlign: 'right'
    },
    userPicture: {
        alignSelf: 'flex-end'
    },
})
