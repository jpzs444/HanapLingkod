import { StyleSheet, BackHandler, Text, View, TouchableOpacity, Modal, StatusBar, SafeAreaView, ActivityIndicator } from 'react-native'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeDefaults from '../Components/ThemeDefaults';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import React, {useState, useEffect} from 'react'
import dayjs from 'dayjs'
import { IPAddress } from '../global/global';
import { useNavigation } from '@react-navigation/native';

import { FlashList } from '@shopify/flash-list';

const Schedule = ({route}) => {

    const navigation = useNavigation()

    const {selectedDate, workID, workerInformation, selectedJob, fromRequestForm, minPrice, maxPrice, } = route.params

    const [formatedTime, setFormatedTime] = useState(new Date())

    const [displayTime, setDisplayTime] = useState(new Date())
    const [timeSelected, setTimeSelected] = useState(false)
    const [timePickerVisible, setTimePickerVisibility] = useState(false)
    const [confirmDeleteEventModal, setConfirmDeleteEventModal] = useState(false)

    const [customEventID, setCustomEventID] = useState('')
    const [sameDateBookings, setSameDateBookings] = useState([])
    const [hasChanges, setHasChanges] = useState(false)

    const [loading, setLoading] = useState(false)

    // system back button behavior
    useEffect(() => {
        // console.log("backbtn pressed");
        BackHandler.addEventListener("hardwareBackPress", ()=>handleSystemBackButton())
        
        // componentwillunmount
        return () => {
          BackHandler.removeEventListener("hardwareBackPress", ()=>handleSystemBackButton())
        }
      }, []);
  
  
      const handleSystemBackButton = () => {
        if(fromRequestForm) {
            navigation.goBack()
            navigation.navigate("RequestFormDrawer", {workerInformation: workerInformation, workID: workID, selectedDay: new Date(selectedDate).toString(), selectedTime: new Date(formatedTime).toString(), selectedJob: selectedJob})
            return true
        } else {
            navigation.navigate("CalendarViewUserStack")
            console.log("Back pressed hnadlebacnbtn")

            return true
        }

        return false;
      }

    useEffect(() => {
        setSameDateBookings([])
        console.log("schedule")
        return () => {
            setSameDateBookings([])
        }
    }, [route]);
    

    useEffect(() => {
        // getUpdatedUserData()
        // getUnavailableSchedule()
        
        navigation.addListener("focus", () => {
            setLoading(true)
            getUpdatedUserData()
            getUnavailableSchedule()
        })
    }, [route, hasChanges])


    const getUpdatedUserData = async() => {
        let userRoute = global.userData.role === "recruiter" ? "Recruiter" : "Worker"

        try {
            await fetch(`https://hanaplingkod.onrender.com/${userRoute}/${global.userData._id}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "Authorization": global.accessToken,
                },
            }).then((res) => res.json())
            .then((user) => {
                // console.log("user new load: ", route)
                global.userData = user
    
                // setHasChanges(!hasChanges)
                // console.log("imagelist: ", imageList)
            })
            
        } catch (error) {
            console.log(error.message)
        }
    }

    const getUnavailableSchedule = async () => {
        let dddd = new Date(selectedDate)
        let uunn = []
        try {
            let scheduleWhoId = global.userData.role === 'worker' ? global.userData._id : workerInformation._id
            await fetch(`https://hanaplingkod.onrender.com/schedule/${scheduleWhoId}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "Authorization": global.accessToken,
                }
            }).then(res => res.json())
            .then(data => {
                uunn = [...data[0].unavailableTime]
                setLoading(false)
                // console.log("unvTime . unvt: ", uunn)
                
            })
        } catch (error) {
            console.log("error fetching unavailable schedule route", error)
        }
        if(uunn){
            uunn = uunn.filter(e => {
                let sst = new Date(e.startTime)
                return (sst.getFullYear() === dddd.getFullYear() &&
                sst.getMonth() === dddd.getMonth() &&
                sst.getDate() === dddd.getDate())
            })
        } else {
            uunn = uunn.filter(e => {
                let sst = new Date(e.startTime)
                return (sst.getFullYear() === dddd.getFullYear() &&
                sst.getMonth() === dddd.getMonth() &&
                sst.getDate() === dddd.getDate())
            })
        }

        uunn = uunn.filter(e => dayjs(e.startTime).format("YYYY-MM-DD").toString() === dayjs(new Date(selectedDate)).format("YYYY-MM-DD").toString())
        setSameDateBookings(prev => [...uunn])
        // console.log("Filtered unv time to display: ", uunn)
    }

    const handleTimeConfirm = (time) => {
        let timeString = dayjs(time).format("YYYY-MM-DD hh:mm:ss")
        let timetime = dayjs(time).format("hh:mm")
        setDisplayTime(dayjs(time).format("hh:mm A"))
        
        setFormatedTime(time)
        setTimePickerVisibility(false)
        setTimeSelected(true)

        // let newDate = new Date(formatedDate.getFullYear(), formatedDate.getMonth(), formatedDate.getDate(),
                                // formatedTime.getHours(), formatedTime.getMinutes(), formatedTime.getSeconds())

        // console.log(formatedTime)
        // console.log("new date: ", newDate)

    }



    const handleRemoveCustomEvent = async () => {

        try {
            await fetch(`https://hanaplingkod.onrender.com/add-schedule/${global.userData._id}/${customEventID}`, {
                method: "DELETE",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken,
                }
            }).then(res => {
                res.json()
                console.log("Successful removal of the custom event")
                // setViewScheduleModal(false)
                setHasChanges(bool => !bool)
                getUpdatedUserData()
                getUnavailableSchedule()
            })
            
        } catch (error) {
            console.log("Error remove custom event: ", err.msg)
        }
    }

    const ScreenHeaderComponent = () => (
        <>
            <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} fromRequestForm={fromRequestForm} workerInformation={workerInformation} selectedDate={selectedDate} selectedTime={formatedTime.toString()} selectedJob={selectedJob} minPrice={minPrice} maxPrice={maxPrice} />

            {/* Confirm Delete Custom Event */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={confirmDeleteEventModal}
                onRequestClose={() => setConfirmDeleteEventModal(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText,]}>Do you wish to remove the custom event?</TText>
                            {/* <TText style={[styles.dialogueMessageText]}>You make check it by tapping the Bookings icon on the homepage.</TText> */}
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    setConfirmDeleteEventModal(false)
                                    // handleAcceptRequest(requestItem._id)
                                    handleRemoveCustomEvent()
                                    // getUpdatedUserData()
                                    // setViewScheduleModal(false)
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Yes</TText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setConfirmDeleteEventModal(false)
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.headerContainer}>
                <TText style={styles.headerScheduleTitle}>Worker's Schedule</TText>
                <TText style={styles.headerSchedSubTitle}>{sameDateBookings.length > 0 ? "Shown below are the worker's appointments scheduled on" : global.userData.role === 'recruiter' ? "The worker you selected has no appointments scheduled on " : "There are no pending appointments scheduled on "} <TText style={styles.headerSubTitleDate}>{dayjs(new Date(selectedDate)).format("MMMM DD")}</TText></TText>
            </View>

            {
                fromRequestForm &&
                <View>
                    <DateTimePickerModal
                        isVisible={timePickerVisible}
                        mode="time"
                        onConfirm={handleTimeConfirm}
                        onCancel={() => setTimePickerVisibility(false)}
                    />
                    <TouchableOpacity 
                        style={styles.timePickerBtn}
                        onPress={() => setTimePickerVisibility(true)}
                    >
                        <View style={styles.timeTextContainer}>
                            <Icon name="clock-outline" size={20} />
                            <TText style={styles.timePickerText}>{timeSelected ? displayTime.toString() : "Pick a Time"}</TText>
                        </View>
                        <Icon name="chevron-right" size={20} />
                    </TouchableOpacity>
                </View>
            }
            {/* <ScreenFooterComponent /> */}

            {
                sameDateBookings.length !== 0 && global.userData.role === "recruiter" && !loading && 
                <View style={{marginVertical: 15, marginHorizontal: 30}}>
                    <TText>Scheduled Bookings by the Worker:</TText>
                </View>
            }
        </>
    )

    const ScreenFooterComponent = () => {
        return(
            <View style={{}}>
                {
                    global.userData.role === 'recruiter' &&
                    <View>
                        <View style={styles.confirmBtnContainer}>
                            <TouchableOpacity style={styles.confirmBtn}
                                onPress={() => {
                                    // navigation.goBack()
                                    navigation.navigate("RequestFormDrawer", {workerInformation: workerInformation, workID: workID, selectedDay: new Date(selectedDate).toString(), selectedTime: new Date(formatedTime).toString(), selectedJob: selectedJob, minPrice: minPrice, maxPrice: maxPrice})

                                }}
                            >
                                <TText style={styles.confirmBtnText}>Confirm Time</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        )
    }

    const ScreenEmptyComponent = () => {
        return(
            <View style={{paddingVertical: 20, alignItems: 'center', marginTop: 20, marginBottom: 40}}>
                {
                    loading ? 
                        <View style={{width: '100%', marginTop: 50, alignItems: 'center'}}>
                            <ActivityIndicator size={'large'} />
                        </View>
                    :
                    <TText style={{color: 'lightgray'}}>
                        Schedule is clear for {dayjs(new Date(selectedDate)).format("MMMM DD")}
                    </TText>
                }
            </View>
        )
    }



  return (
    <SafeAreaView style={styles.mainContainer}>
        {/* <ScrollView contentContainerStyle={styles.modalCalendar}> */}
            {/* screen header */}
            
            <View style={styles.scheduleList}>
                               
                <FlashList 
                    data={sameDateBookings}
                    extraData={sameDateBookings}
                    keyExtractor={item => item._id}
                    estimatedItemSize={200}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (<ScreenEmptyComponent />)}
                    ListFooterComponent={() => (<ScreenFooterComponent />)}
                    ListHeaderComponent={() => (<ScreenHeaderComponent />)}
                    renderItem={({item}) => {
                        
                        let dif = new Date(item.startTime).getHours()
                        let di = new Date(item.endTime).getHours()
                        let timeDiff = di - dif
                        let hh
                        if(timeDiff > 1.5) {hh = timeDiff * 50}

                        return(
                            <View>
                                <View style={[styles.schedCard, {
                                    height: hh ? hh : 100, 
                                    backgroundColor: item.wholeDay || !item.CannotDelete && global.userData.role === "worker" ? ThemeDefaults.themeFadedBlack : ThemeDefaults.themeOrange
                                }]}>
                                    {
                                        !item.CannotDelete && global.userData.role === "worker" &&
                                        <TouchableOpacity style={{position: 'absolute', top: 10, right: 15, padding: 4, zIndex: 10}}
                                            activeOpacity={0.1}
                                            onPress={() => {
                                                // setConfirmDeleteEventModal(true)
                                                navigation.navigate("AddEventCalendarUserStack", {selectedDate: selectedDate, eventItem: item})
                                                setCustomEventID(item._id)
                                            }}
                                        >
                                            <Icon name='calendar-edit' size={22} color={'white'} />
                                        </TouchableOpacity>
                                    }
                                    
                                    <TText style={{color: 'white', fontSize: 12, marginBottom: 4}}>{!item.CannotDelete && global.userData.role === "worker" ? "Custom Event" : "Booking"}</TText>

                                    <TText style={styles.schedTitle}>{item.title}</TText>
                                    <TText style={styles.schedTime}>{ item.wholeDay ? "Whole Day" : `${dayjs(item.startTime).format("hh:mm A")} - ${dayjs(item.endTime).format("hh:mm A")}` }</TText>
                                </View>
                            </View>
                        )
                        
                    }}
                />
            </View>

            

            
        {/* </ScrollView> */}
        {
            global.userData.role === "worker" &&
            <View style={styles.addCustomEventBtn}>
                <TouchableOpacity style={{backgroundColor: '#e87435', borderRadius: 35, padding: 15, elevation: 3}}
                    onPress={() => {
                        navigation.navigate("AddEventCalendarUserStack", {selectedDate: selectedDate})
                        // setViewScheduleModal(false)
                    }}
                >
                    <Icon name="plus" size={40} color={ThemeDefaults.themeWhite} />
                </TouchableOpacity>
            </View>
        }
    </SafeAreaView>
  )
}

export default Schedule;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: ThemeDefaults.themeWhite,
        marginTop: StatusBar.currentHeight
    },
    
    modalCalendar: {
        flexGrow: 1,
        backgroundColor: ThemeDefaults.themeWhite,
        paddingBottom: 150
    },
    calendarMonthHeader: {
        width: 250,
        alignItems: 'center',
        paddingVertical: 3,
        backgroundColor: '#D9D9D9',
        borderRadius: 30,
    },
    calendarMonthHeaderTxt: {
        fontSize: 18
    },
    legendTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    legendColor: {
        width: 30,
        height: 30,
        borderRadius: 5,
    },
    legendTxt: {
        marginLeft: 15,
        fontFamily: 'LexendDeca_Medium'
    },
    timeBtnContainer: {
        paddingHorizontal: 50,
        width: '100%',
        marginTop: 30
    },
    timePickerBtn: {
        borderWidth: 1.5,
        borderColor: ThemeDefaults.themeDarkBlue,
        borderRadius: 10,
        padding: 12,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeTextContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    timePickerText: {
        marginLeft: 10
    },
    scheduleList: {
        // marginHorizontal: 50,
        width: '100%',
        // paddingBottom: 150,
        // marginVertical: 30,
        flex: 1,
    },
    schedCard: {
        // width: '100%',
        backgroundColor: ThemeDefaults.themeFadedBlack,
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 30,
        marginBottom: 15,
        // elevation: 3
    },
    schedTitle: {
        color: ThemeDefaults.themeWhite,
        fontSize: 18
    },
    schedTime: {
        color: ThemeDefaults.themeWhite,
        fontSize: 14,
        marginTop: 3,
        // marginLeft: 3
    },
    confirmBtn: {
        // width: '100%',
        flexGrow: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: ThemeDefaults.themeOrange
    },
    confirmBtnText: {
        color: ThemeDefaults.themeWhite,
        fontSize: 18,
        fontFamily: "LexendDeca_SemiBold"
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
        marginBottom: 40
    },
    headerScheduleTitle: {
        fontSize: 20,
        marginBottom: 10
    },
    headerSchedSubTitle: {
        fontSize: 15,
        marginHorizontal: 50,
        textAlign: 'center'
    },
    headerSubTitleDate: {
        fontFamily: 'LexendDeca_Medium'
    },
    addCustomEventBtn: {
        position: 'absolute',
        bottom: 60,
        right: 40,
        backgroundColor: 'white',
        borderRadius: 35,
    },
    modalDialogue: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    dialogueContainer: {
        borderWidth: 1.5,
        borderColor: ThemeDefaults.themeLighterBlue,
        borderRadius: 15,
        overflow: 'hidden',
    },
    dialogueMessage: {
        paddingVertical: 40,
        paddingHorizontal: 50,
        backgroundColor: ThemeDefaults.themeLighterBlue,
    },
    dialogueMessageText: {
        color: ThemeDefaults.themeWhite,
        textAlign: 'center',
        fontFamily: 'LexendDeca_Medium',
    },
    modalDialogueBtnCont: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: ThemeDefaults.themeWhite,
    },
    dialogueBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    dialogueCancel: {

    },
    dialogueConfirm: {
        color: ThemeDefaults.themeDarkerOrange,
        fontFamily: 'LexendDeca_Medium',
    },
    timePickerBtn: {
        borderWidth: 1.5,
        borderColor: ThemeDefaults.themeDarkBlue,
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 30,
        marginTop: 5,
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: ThemeDefaults.themeWhite,
        elevation: 3
    },
    timeTextContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    timePickerText: {
        marginLeft: 10
    },
    confirmBtnContainer: {
        // flexGrow: 1,
        width: '100%',
        paddingHorizontal: 50,
        marginTop: 50
        // position: 'absolute',
        // bottom: 60,
        // left: 50,
        // righ: 50,
        // backgroundColor: 'pink'
    },
    confirmBtn: {
        width: '100%',
        flexGrow: 1,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: ThemeDefaults.themeLighterBlue,
        elevation: 3
    },
    confirmBtnText: {
        color: ThemeDefaults.themeWhite,
        fontSize: 18,
        fontFamily: "LexendDeca_SemiBold"
    },
})