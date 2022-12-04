import { StyleSheet, Text, Modal, View, TouchableOpacity, ScrollView, StatusBar, Button, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FlashList } from '@shopify/flash-list'

import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import ThemeDefaults from '../Components/ThemeDefaults';
import { RollInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import { IPAddress } from '../global/global';

const dayWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WIDTH = Dimensions.get('window').width
const HEIGTH = Dimensions.get('window').height
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

const CalendarView = () => {

    const navigation = useNavigation()

    const [modalVisible, setModalVisible] = useState(false)
    const [dateItem, setDateItem] = useState({})

    const [viewScheduleModal, setViewScheduleModal] = useState(false)
    const [timePickerVisible, setTimePickerVisibility] =  useState(false)

    const [datePickerVisible, setDatePickerVisibility] = useState(false)

    const [formatedDate, setFormatedDate] = useState(new Date())
    const [displayDate, setDisplayDate] = useState(new Date())

    const [dateSelected, setDateSelected] = useState(false)
    const [formatedTime, setFormatedTime] = useState(new Date())

    const [displayTime, setDisplayTime] = useState(new Date())
    const [timeSelected, setTimeSelected] = useState(false)

    const [sameDateBookings, setSameDateBooking] = useState([])

    const [unavailableSchedule, setUnavailableSchedule] = useState([])

    const [listUnavailableSched, setListUnavailableSched] = useState({
        // '2022-10-20': dateAppointmentsStyles,
        // '2022-10-29': dateDisabledStyles,
        // [dayjs(new Date()).format("YYYY-MM-DD").toString()]: dateTodayStyles
    })

    const [customEventID, setCustomEventID] = useState('')
    const [confirmDeleteEventModal, setConfirmDeleteEventModal] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    let uunn = {}
    let lll = {}

    useEffect(() => {
        getUpdatedUserData()
        loadUnavailableTime()
        getSameDateBookings()

        navigation.addListener("focus", () => {
            getUpdatedUserData()
            getUpdatedUserData()
            loadUnavailableTime()
            // getSameDateBookings()
        })
        
        navigation.addListener("blur", () => {
            loadUnavailableTime()
            setFormatedDate(new Date())
            setDateSelected(false)
            // setViewScheduleModal(false)
        })
        
    }, [global.userData]);


    const getUpdatedUserData = () => {
        let userRoute = global.userData.role === "recruiter" ? "Recruiter/" : "Worker/"

        fetch("http://" + IPAddress + ":3000/" + userRoute + global.userData._id, {
            method: "GET",
            header: {
                "conten-type": "application/json",
                "Authorization": global.userData.accessToken
            },
        }).then((res) => res.json())
        .then((user) => {
            global.userData = user

            // let imageList = []
            for(let i = 0; i < user.prevWorks.length; i++){
                imageList.push("http://" + IPAddress + ":3000/images/" + user.prevWorks[i])
            }
            // setHasChanges(!hasChanges)
            // console.log("imagelist: ", imageList)
        })
        .catch((error) => console.log(error.message))
    }

    const dateAppointmentsStyles = {
        customStyles: {
            container: {
                backgroundColor: ThemeDefaults.dateAppointments,
                borderRadius: 5,
            },
            text: {
                color: ThemeDefaults.themeWhite
            }
        }
    }
    const dateTodayAppointmentsStyles = {
        customStyles: {
            container: {
                borderColor: 'black',
                borderWidth: 1.2,
                backgroundColor: ThemeDefaults.dateAppointments,
                borderRadius: 7,
            },
            text: {
                color: ThemeDefaults.themeWhite,
            }
        }
    }

    const handleDateConfirm = (date) => {
        let da = dayjs(date).format("YYYY-MM-DD")
        let dateString = da.toString()
        setFormatedDate(da);

        setDisplayDate(dayjs(date).format("MMM D, YYYY"));
        // setDatePickerVisibility(false);
        setDateSelected(true)
        // setViewCalendarModal(false)
        
        // set as date selected on calendar
        datesWithCustomization[da.toString()] = dateAppointmentsStyles
        
        // setUser((prev) => ({...prev, birthday: dateString}))
        
        // filter unavailable list
        uunn = []
        let dddd = new Date(date)
        uunn = global.userData.unavailableTime.filter(e => {
            let sst = new Date(e.startTime)
            return (sst.getFullYear() === dddd.getFullYear() &&
            sst.getMonth() === dddd.getMonth() &&
            sst.getDate() === dddd.getDate())
        })
        setSameDateBooking([...uunn])
        
        // haveBlanks()
        dateString = dayjs(date).format("MMMM DD").toString()
        // navigation.navigate("ScheduleDrawer", {dateSelected: dateString})
        
        
        // getSchedules()
        getSameDateBookings(date)
        // setViewScheduleModal(true)
        navigation.navigate("ScheduleUserStack", {'selectedDate': new Date(date).toString()})

    }

    const handleTimeConfirm = (time) => {
        let timeString = dayjs(time).format("YYYY-MM-DD hh:mm:ss")
        let timetime = dayjs(time).format("hh:mm")
        setDisplayTime(dayjs(time).format("hh:mm A"))
        
        setFormatedTime(timetime)
        setTimePickerVisibility(false)
        setTimeSelected(true)
        


        let newDate = new Date(formatedDate.getFullYear(), formatedDate.getMonth(), formatedDate.getDate(),
                                formatedTime.getHours(), formatedTime.getMinutes(), formatedTime.getSeconds())


    }

    const handleRemoveCustomEvent = () => {
        fetch(`http://${IPAddress}:3000/add-schedule/${global.userData._id}/${customEventID}`, {
            method: "DELETE",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.userData.accessToken
            }
        }).then(res => {
            console.log("Successful removal of the custom event")
            // setViewScheduleModal(false)
        })
        .catch(err => console.log("Error remove custom event: ", err.msg))
    }


    // const getSchedules = () => {
    //     let uL = [...(global.userData.unavailableTime)]
    //     console.log("uL: ", uL)
    // }

    const getSameDateBookings = (date) => {
        fetch(`http://${IPAddress}:3000/booking/${global.userData._id}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.userData.accessToken
            },
        }).then((res) => res.json())
        .then((data) => {
            let fd = dayjs(date).utc(true).toISOString()
            
            // console.log("fd", fd)
            let list = data.worker.filter(e => {
                // let aa = dayjs(e.serviceDate).utc(true).format()
                let aa = dayjs(e.serviceDate).toISOString()
                return aa == fd
            })
            // setSameDateBooking([...list])
            // navigation.navigate("ScheduleUserStack", {'selectedDate': new Date(formatedDate).toString(), 'sameDateBookings': sameDateBookings})

        }).catch((err) => console.log("get same dates error", err.message))
    }


    const loadUnavailableTime = () => {

        lll = {}
        setListUnavailableSched({})

        uunn = [...(global.userData.unavailableTime)]
        console.log("listUnvSched uunn: ", uunn)
        // let lll = {}


        // format unavailable datesD
        // let jk = uunn.filter(e => {

        // })


        
        uunn.forEach(e => {
            if(dayjs(e.endDate).subtract){
                
            }
            
            let dif = new Date(e.startTime).getDate()
            let di = new Date(e.endDate).getDate()
            let timeDiff = di - dif

            let dateWholeDay = []
            
            if(timeDiff > 0) {
                for(let i = 0; i <= timeDiff; i++){
                    lll[dayjs(e.startTime).add(i, "day").toString()] = e.wholeDay ? dateDisabledStyles : dateAppointmentsStyles
                }
            } else {
                let ff = dayjs(new Date(e.startTime)).format("YYYY-MM-DD")
                let dn = dayjs(new Date())
                // console.log(dn.diff(ff, 'day', true) > '0')

                

                // lll[dayjs(new Date()).format("YYYY-MM-DD").toString()] = dateTodayStyles

                if(dayjs(e.startTime).format("YYYY-MM-DD").toString() === dayjs(new Date()).format("YYYY-MM-DD").toString()){
                    // console.log("the same")
                    lll[dayjs(e.startTime).format("YYYY-MM-DD").toString()] = e.wholeDay ? dateDisabledStyles : dateAppointmentsStyles

                } else if(dn.diff(ff, 'day', true) > '0'){
                    lll[dayjs(e.startTime).format("YYYY-MM-DD").toString()] = pastDates

                } else{
                    lll[dayjs(e.startTime).format("YYYY-MM-DD").toString()] = e.wholeDay ? dateDisabledStyles : dateAppointmentsStyles
                }
            }
        })

        console.log("display lll: ", lll)
        setListUnavailableSched({...lll})
        
    }

    const pastDates = {
        customStyles: {
            text: {
                color: 'lightgray'
            }
        }
    }

    const dateDisabledStyles = {
        // disabled:true,
        // disableTouchEvent: true,
        customStyles: {
            container: {
                backgroundColor: ThemeDefaults.dateDisabled,
                borderRadius: 5,
            },
            text: {
                color: 'lightgray'
            }
        }
    }
    const dateTodayDisabledStyles = {
        // disabled:true,
        // disableTouchEvent: true,
        customStyles: {
            container: {
                borderColor: 'white',
                borderWidth: 1.4,
                backgroundColor: ThemeDefaults.dateDisabled,
                borderRadius: 5,
            },
            text: {
                color: 'lightgray'
            }
        }
    }


    const dateTodayStyles = {
        customStyles: {
            container: {
                borderWidth: 1.2,
                borderColor: ThemeDefaults.themeDarkBlue,
                borderRadius: 5,
            },
            text: {
                color: ThemeDefaults.themeDarkBlue,
            }
        }
    }

    // array of dates which have appointments and unavailable dates
    const dateToday = dayjs(new Date()).format("YYYY-MM-DD")
    const datesWithCustomization = {
        '2022-10-27': dateDisabledStyles,
        '2022-10-19': dateAppointmentsStyles,
        [dateToday.toString()] : dateTodayStyles
    }

    const CalendarMonthArrow = (props) => {
        return(
            <Icon name={`arrow-${props.direction}`} size={22} color={ThemeDefaults.themeDarkBlue} />
        )
    }



  return (
    <View style={{flexGrow: 1, marginTop: StatusBar.currentHeight, backgroundColor: 'white'}}>
        <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

        <View style={styles.header}>
            <TText style={styles.headerTitle}>Calendar</TText>
            <TText style={styles.headerSubTitle}>Select dates where you will be unavailable</TText>
        </View>

        <Calendar 
            minDate={dateToday.toString()}
            enableSwipeMonths={true}
            markingType={'custom'}
            markedDates={
                listUnavailableSched      
            }
            onDayPress={day => {
                console.log(day)
                console.log(dayWeek[dayjs(day.timestamp).day()])

                console.log("")

                getUpdatedUserData()
                handleDateConfirm(day.dateString)

                // navigation.navigate("ScheduleUserStack", {'selectedDate': new Date(formatedDate).toString(), 'sameDateBookings': sameDateBookings})
                // setViewScheduleModal(true)
            }}
            theme={{
                indicatorColor: ThemeDefaults.themeDarkBlue,
                todayTextColor: 'white',
                
            }}
            renderArrow={direction => <CalendarMonthArrow direction={direction} /> }
            renderHeader={date => {
                let timeString = dayjs(date).format("MMMM YYYY")
                return(
                    <View style={styles.calendarMonthHeader}>
                        <TText style={styles.calendarMonthHeaderTxt}>{timeString}</TText>
                    </View>
                )
                
            }}
        />

        <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
                <View style={{backgroundColor: ThemeDefaults.themeOrange, width: 25, height: 25, borderRadius: 8}} />
                <TText style={styles.legendTxt}>{global.userData.role === "recruiter" ? "Date Selected" : "Available Date with Appointments"}</TText>
            </View>
            <View style={styles.legendItem}>
                <View style={{backgroundColor: ThemeDefaults.themeLighterBlue, width: 25, height: 25, borderRadius: 8}} />
                <TText style={styles.legendTxt}>Unavailable Date</TText>
            </View>
        </View>

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
                                // loadUnavailableTime()
                                // getSameDateBookings()
                                // setHasChanges(prev => !prev)

                                // setViewScheduleModal(false)
                                // setViewScheduleModal(true)
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


        {/* Schedule Modal */}
        <Modal
            transparent={true}
            animationType='slide'
            visible={viewScheduleModal}
            onRequestClose={() => setViewScheduleModal(false)}
        >
            <ScrollView contentContainerStyle={styles.modalCalendar}>
                {/* screen header */}
                <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} changeSchedModalState={setViewScheduleModal} noCalendar={true} modalSchedule={true} />

                <View style={styles.headerContainer}>
                    <TText style={styles.headerScheduleTitle}>Worker's Schedule</TText>
                    <TText style={styles.headerSchedSubTitle}>Shown below are the worker's appointments scheduled on <TText style={styles.headerSubTitleDate}>{dayjs(displayDate).format("MMM DD")}</TText></TText>
                </View>


                <View style={styles.scheduleList}>
                    {
                        sameDateBookings.map(function(item, index){
                            if(dayjs(item.startTime).format("YYYY-MM-DD").toString() === dayjs(new Date(formatedDate)).format("YYYY-MM-DD").toString()){
                                let dif = new Date(item.startTime).getHours()
                                let di = new Date(item.endTime).getHours()
                                const timeDiff = (di - dif) * 60

                                return(
                                    <View key={index}>
                                    <View style={[styles.schedCard, {height: timeDiff ? timeDiff : 'auto', backgroundColor: item.wholeDay ? ThemeDefaults.themeFadedBlack : ThemeDefaults.themeOrange}]}>
                                        {
                                            !item.CannotDelete &&
                                            <TouchableOpacity style={{position: 'absolute', top: 10, right: 15, padding: 4, zIndex: 10}}
                                                activeOpacity={0.1}
                                                onPress={() => {
                                                    setConfirmDeleteEventModal(true)
                                                    setCustomEventID(item._id)
                                                }}
                                            >
                                                <Icon name='trash-can' size={22} color={'white'} />
                                            </TouchableOpacity>
                                        }
                                        <TText style={styles.schedTitle}>{item.title}</TText>
                                        <TText style={styles.schedTime}>{ item.wholeDay ? "Whole Day" : `${dayjs(item.startTime).format("hh:mm A")} - ${dayjs(item.endTime).format("hh:mm A")}` }</TText>
                                    </View>
                                    </View>
                                )
                            }
                        })
                    }

                    
                </View>

                

                
            </ScrollView>
            <View style={styles.addCustomEventBtn}>
                <TouchableOpacity style={{backgroundColor: '#e87435', borderRadius: 35, padding: 15, elevation: 3}}
                    onPress={() => {
                        navigation.navigate("AddEventCalendarUserStack", {selectedDate: formatedDate})
                        setViewScheduleModal(false)
                    }}
                >
                    <Icon name="plus" size={40} color={ThemeDefaults.themeWhite} />
                </TouchableOpacity>
            </View>
            
        </Modal>

    </View>
  )
}

export default CalendarView

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        marginTop: StatusBar.currentHeight,
        backgroundColor: ThemeDefaults.themeWhite,
        // paddingBottom: 100
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'LexendDeca_Medium',
        marginBottom: 12
    },
    headerSubTitle: {},
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
    legendContainer: {
        paddingHorizontal: 30,
        marginTop: 50
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
    legendBottomRow: {

    },
    colorAvailable: {
        backgroundColor: ThemeDefaults.dateAvailable,
        borderRadius: 5,
    },
    colorDateSelected: {
        backgroundColor: ThemeDefaults.dateAppointments,
        borderRadius: 5,
    },
    colorDateUnavailable: {
        backgroundColor: ThemeDefaults.dateDisabled,
        borderRadius: 5,
    },
    buttonContainer: {
        paddingHorizontal: 40,
        marginTop: 60,

        // position: 'absolute',
        // bottom: 50,
        // left: 40,
        // right: 40
    },
    saveBtn: {
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: ThemeDefaults.themeOrange,
        borderRadius: 10
    },
    saveBtnTxt: {
        fontFamily: 'LexendDeca_Medium',
        fontSize: 18,
        color: ThemeDefaults.themeWhite
    },
    workerNotes: {
        alignItems: 'center',
        marginTop: 20
    },
    notesTxt: {
        marginTop: 10 ,
        fontSize: 18
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
        paddingHorizontal: 50,
        width: '100%',
        marginVertical: 30,
        // flex: 1,
    },
    schedCard: {
        width: '100%',
        backgroundColor: ThemeDefaults.themeFadedBlack,
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
        elevation: 3
    },
    schedTitle: {
        color: ThemeDefaults.themeWhite
    },
    schedTime: {
        color: ThemeDefaults.themeWhite,
        fontSize: 14,
        marginTop: 3,
        // marginLeft: 3
    },
    confirmBtnContainer: {
        // flexGrow: 1,
        // width: '100%',
        position: 'absolute',
        bottom: 60,
        // left: 50,
        righ: 50,
        // backgroundColor: 'pink'
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
        marginVertical: 10
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
})