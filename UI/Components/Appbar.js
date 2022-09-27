import React from 'react'
import {
    StatusBar, StyleSheet, View, Image, TouchableOpacity, Modal,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import TText from './TText';
import ThemeDefaults from './ThemeDefaults';

export default function Appbar(props) {

    const navigation = useNavigation();

    const [backBtnPressed, setBackBtnPressed] = React.useState(false)

  return (
    <View style={styles.container}>
        {/* left */}

        <Modal
            transparent={true}
            animationType='fade'
            visible={backBtnPressed}
            onRequestClose={()=> setBackBtnPressed(false)}
        >
            <TouchableOpacity onPress={() => setBackBtnPressed(false)} style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)'}}>
                <View style={{backgroundColor: '#fff', padding: 30}}>
                    <TText>Hello</TText>
                    <TouchableOpacity onPress={() => setBackBtnPressed(false)}>
                        <TText>Close Modal</TText>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

        </Modal>

            {/* Back Button */}
            {
                props.backBtn && !props.accTypeSelect ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => { navigation.goBack() }}
                    >
                        <Icon name="arrow-left" size={30} color={props.light ? '#fff' : '#000'} />
                    </TouchableOpacity> 
                    : null
            }
            {
                props.backBtn && props.accTypeSelect ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => { navigation.goBack() }}
                    >
                        <Icon name="arrow-left" size={30} color={props.light ? '#fff' : '#000'} />
                    </TouchableOpacity> 
                    : null
            }
            {
                props.userProfile ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => { navigation.navigate("Home_Tab") }}
                    >
                        <Icon name="arrow-left" size={30} />
                    </TouchableOpacity> 
                    : null
            }
            {
                props.saveBtn ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => { navigation.navigate("UserProfileScreen") }}
                    >
                        <Icon name="arrow-left" size={30} />
                    </TouchableOpacity> 
                    : null
            }
            {
                props.backBtn && !props.accTypeSelect && !props.otpverificationpage ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => {
                            if (props.screenView == 1) navigation.goBack()
                            else props.stateChangerNext(props.screenView - 1)
                        }}
                    >
                        <Icon name="arrow-left" size={30} />
                    </TouchableOpacity> : null
            }
            {
                props.otpverificationpage ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => { navigation.replace("AccountTypeSelect") }}
                    >
                        <Icon name="arrow-left" size={30} />
                    </TouchableOpacity> 
                    : null
            }


            {/* Menu Button */}
            {
                props.menuBtn ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => navigation.openDrawer()}
                    >
                        <Icon name="menu" size={30} />
                    </TouchableOpacity> : null
            }

        {/* center | HanapLingkod logo */}
        <View style={styles.center}>
            {
                props.showLogo ? <Image source={require('../assets/logo/logo_icon.png')} 
                style={{width: 40, height: 40}} /> : null
            }
        </View>

        {/* right */}
        <TouchableOpacity style={styles.right}>
            {
                props.photo ? 
                    <TText style={[styles.rightText, {color: props.light ? '#fff' : '#000'}]}>1 of 3</TText>
                    : null
            }
            {
                props.hasPicture ? 
                    <TouchableOpacity onPress={() => { navigation.navigate("UserProfileStack", {profile_id: global.userData._id}) }}>
                        <Icon name="account-circle" size={30} style={styles.userPicture} />
                    </TouchableOpacity>
                    : null
            }
            {
                props.accTypeSelect === true && !props.hasPicture ? 
                    <TText style={[styles.rightText, {color: props.light ? '#fff' : '#000'}]}>Page 1 of ?</TText>
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
            {
                props.userProfile &&
                    <TouchableOpacity onPress={() => { navigation.navigate("EditUserProfileScreen") }}>
                        <Icon name="cog" size={25} style={styles.userPicture} />
                    </TouchableOpacity>
            }
            {
                props.saveBtn &&
                    <TouchableOpacity disabled={!props.hasChanges} style={[styles.saveBtn, {backgroundColor: props.hasChanges ? ThemeDefaults.themeDarkBlue : 'lightgray'}]} onPress={() => { setBackBtnPressed(true) }}>
                        <TText style={styles.saveBtnText}>Save</TText>
                    </TouchableOpacity>
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
    saveBtn: {
        // backgroundColor: ThemeDefaults.themeDarkBlue,
        width: '80%',
        alignSelf: 'flex-end',
        alignItems: 'center',
        padding: 4,
        borderRadius: 10
    },
    saveBtnText: {
        color: '#fff'
    },
})
