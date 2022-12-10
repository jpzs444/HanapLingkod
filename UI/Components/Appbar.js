import React, {useState, useEffect} from 'react'
import {
    StatusBar, StyleSheet, View, Image, TouchableOpacity, Modal,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import TText from './TText';
import ThemeDefaults from './ThemeDefaults';
import { IPAddress } from '../global/global';

export default function Appbar(props) {

    const navigation = useNavigation();

    const [backBtnPressed, setBackBtnPressed] = useState(false)

    const [profilePic, setProfilePic] = useState('')

    // useEffect(() => {
    //     let userRoute = global.userData.role === 'recruiter' ? "Recruiter/" : "Worker/"
    //     fetch(`http://${IPAddress}:3000/${userRoute}/${global.userData._id}`, {
    //         method: "GET",
    //         headers: {
    //             'content-type': 'application.json',
    //         },
    //     }).then((res) => res.json())
    //     .then((data) => {
    //         console.log(data)
    //         // setProfilePic(data.profilePic)
    //     })
    // }, [])

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
                props.onlyBackBtn && 
                    <TouchableOpacity style={styles.left}
                        onPress={() => { 
                            if(props.reqForm){
                                navigation.navigate("RequestFormDrawer", {showCalendar: true})
                            } else if(props.modalSchedule) {
                                props.changeSchedModalState(false)
                                if(props.noCalendar){
                                    return
                                }else {
                                    props.changeCalendarModalState(true)
                                }
                            } else if(props.modalCalendar){
                                props.changeCalendarModalState(false)
                            } else if(props.fromRequestForm){
                                navigation.navigate("RequestFormDrawer", {workerInformation: props.workerInformation, selectedDay: props.selectedDate, selectedTime: props.selectedTime, selectedJob: props.selectedJob, minPrice: props.minPrice, maxPrice: props.maxPrice})
                            } else if(props.fromCB){
                                navigation.navigate("CompletedBookingsDrawer")
                            } else {
                                navigation.goBack()
                            }
                        }}
                    >
                        <Icon name="arrow-left" size={30} color={props.light ? '#fff' : '#000'} />
                    </TouchableOpacity> 
            }
            {
                props.registrationFormPage ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => {
                            console.log("screenView", props.screenView)
                            if (props.screenView == 1) navigation.goBack()
                            else props.stateChangerNext(props.screenView - 1)
                        }}
                    >
                        <Icon name="arrow-left" size={30} />
                    </TouchableOpacity> : null
            }
            {
                props.backBtn && !props.accTypeSelect && props.registration ? 
                    <TouchableOpacity style={styles.left}
                        onPress={() => { 
                            navigation.goBack() 
                        }}
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
                props.showLogo || props.registration ? <Image source={require('../assets/logo/logo_icon.png')} 
                style={{width: 40, height: 40}} /> : null
            }
        </View>

        {/* right */}
        <TouchableOpacity style={[styles.right,]}>
            {
                props.hasPicture ? 
                    <TouchableOpacity style={{borderRadius: 20, elevation: 7, alignSelf: 'flex-end', width: 40, height: 40, borderRadius: 20,}} onPress={() => { navigation.navigate("UserProfileStack", {profile_id: global.userData._id}) }}>
                        <View>
                            <Image source={global.userData.profilePic !== 'pic' ? {uri: global.userData.profilePic} : require("../assets/images/default-profile.png")} style={[styles.userPicture, {width: 40, height: 40, borderRadius: 20, elevation: 4}]} />
                        </View>
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
                props.userProfile && props.settingsBtn ?
                    <TouchableOpacity onPress={() => { navigation.push("EditUserProfileScreen") }}>
                        <Icon name="cog" size={25} style={styles.userPicture} />
                    </TouchableOpacity> : null
            }
            {
                props.saveBtn &&
                    <TouchableOpacity disabled={!props.hasChanges} style={[styles.saveBtn, {backgroundColor: props.hasChanges ? ThemeDefaults.themeDarkBlue : 'lightgray'}]} onPress={() => { setBackBtnPressed(true) }}>
                        <TText style={styles.saveBtnText}>Save</TText>
                    </TouchableOpacity>
            }
            {
                props.chatBtn &&
                <TouchableOpacity style={{backgroundColor: ThemeDefaults.themeOrange, borderRadius: 20, padding: 8, elevation: 4, alignSelf: 'flex-end'}}
                    activeOpacity={0.5}
                    onPress={() => {
                        console.log("HI")
                        // go to convo
                        // handleCreateConversation()
                    }}
                >
                    <Image source={require('../assets/icons/chat-bubble.png')} style={{width: 25, height: 25,}} />
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
        flex: 1.2,
        marginLeft: 25,
        borderRadius: 20,
    },
    center: {
        flex: 1.8,
        alignItems: 'center',
    },
    right: {
        flex: 1.2,
        justifyContent: 'flex-end',
        width: 'auto',
        marginRight: 25,
        borderRadius: 20,
        // backgroundColor: 'pink'
    },
    rightText: {
        textAlign: 'right',
        fontSize: 14
    },
    userPicture: {
        alignSelf: 'flex-end'
    },
    saveBtn: {
        // backgroundColor: ThemeDefaults.themeDarkBlue,
        width: '80%',
        alignSelf: 'flex-end',
        alignItems: 'center',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    saveBtnText: {
        color: '#fff'
    },
})
