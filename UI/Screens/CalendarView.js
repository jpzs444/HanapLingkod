import { StyleSheet, Text, Modal, View, TouchableOpacity, ScrollView, StatusBar, Button, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';

import DateTimePickerModal from "react-native-modal-datetime-picker";


import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import ThemeDefaults from '../Components/ThemeDefaults';
import { RollInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const dayWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WIDTH = Dimensions.get('window').width
const HEIGTH = Dimensions.get('window').height
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

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

    useEffect(() => {
        loadUnavailableTime()

        console.log("unavailable schedule: ", unavailableSchedule)
        console.log("unavailable schedule: ", unavailableSchedule)
        
    }, []);

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

    const handleDateConfirm = (date) => {
        let da = dayjs(date).format("YYYY-MM-DD")
        let dateString = da.toString()
        setFormatedDate(da);

        setDisplayDate(dayjs(date).format("MMM D, YYYY"));
        // setDatePickerVisibility(false);
        setDateSelected(true)
        // setViewCalendarModal(false)
        setViewScheduleModal(true)

        // set as date selected on calendar
        datesWithCustomization[da.toString()] = dateAppointmentsStyles

        // setUser((prev) => ({...prev, birthday: dateString}))
        getSameDateBookings(date)

        // haveBlanks()
        console.log(dateString)
        dateString = dayjs(date).format("MMMM DD").toString()
        // navigation.navigate("ScheduleDrawer", {dateSelected: dateString})
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

        console.log(formatedTime)
        console.log("new date: ", newDate)

    }

    const getSameDateBookings = (date) => {
        fetch(`https://hanaplingkod.onrender.com/booking/${global.userData._id}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json'
            },
        }).then((res) => res.json())
        .then((data) => {
            console.log(data)
            let fd = dayjs(date).utc(true).toISOString()
            console.log("fd", fd)
            
            // console.log("fd", fd)
            let list = data.worker.filter(e => {
                // let aa = dayjs(e.serviceDate).utc(true).format()
                let aa = dayjs(e.serviceDate).toISOString()
                console.log("aa", aa)
                return aa == fd
            })
            setSameDateBooking([...list])

            console.log("list same date accepted bookings - calendar", list)
        }).catch((err) => console.log("get same dates error", err.message))
    }


    const loadUnavailableTime = () => {
        setUnavailableSchedule([...(global.userData.unavailableTime)])

        
    }

    const dateDisabledStyles = {
        disabled:true,
        disableTouchEvent: true,
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

    const itemDays = {
        '2022-10-22': [{time: '09:00 AM - 11:00 AM', service: "Deep Cleaning", estimatedTime: 2, }, {time: '01:00 PM - 02:00 PM', service: "Deep Cleaning", estimatedTime: 1}, {time: '03:00 PM - 04:00 PM', service: "Deep Cleaning", estimatedTime: 1}],
        '2022-10-23': [{time: '09:00 AM - 10:00 AM', service: "Deep Cleaning", estimatedTime: 1, }],
        '2022-10-24': [{time: '09:00 AM - 01:00 PM', service: "Deep Cleaning", estimatedTime: 3, }],
        '2022-10-25': [{time: '09:00 AM - 11:00 AM', service: "Deep Cleaning", estimatedTime: 2, }, {time: '01:00 PM - 02:00 PM', service: "Deep Cleaning", estimatedTime: 1}, {time: '03:00 PM - 04:00 PM', service: "Deep Cleaning", estimatedTime: 1}],
        '2022-10-26': [],
        '2022-10-27': [{time: '09:00 AM - 01:00 PM', service: "Deep Cleaning", estimatedTime: 3, }],
        '2022-10-29': [{time: '09:00 AM - 01:00 PM', service: "Deep Cleaning", estimatedTime: 3, }],
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
                datesWithCustomization        
            }
            onDayPress={day => {
                console.log(day)
                console.log(dayWeek[dayjs(day.timestamp).day()])

                handleDateConfirm(day.dateString)
                setViewScheduleModal(true)
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
                    {/* <View style={styles.schedCard}>
                        <TText style={styles.schedTitle}>Booked: Carpet Cleaning</TText>
                        <TText style={styles.schedTime}>08:00 AM - 09:00 AM</TText>
                    </View>
                    <View style={[styles.schedCard, {paddingBottom: 20 * 3}]}>
                        <TText style={styles.schedTitle}>Booked: Carpet Cleaning</TText>
                        <TText style={styles.schedTime}>08:00 AM - 09:00 AM</TText>
                    </View> */}
                    {
                        sameDateBookings.map(function(item, index){
                            return(
                                <View key={index} style={[styles.schedCard, {height: 'auto'}]}>
                                    <TText style={styles.schedTitle}>Booked: {item.subCategory}</TText>
                                    <TText style={styles.schedTime}>{dayjs(item.startTime).format("hh:mm A")} - {dayjs(item.endTime).format("hh:mm A")}</TText>
                                </View>
                            )
                        })
                    }
                </View>

                

                <View style={styles.addCustomEventBtn}>
                    <TouchableOpacity style={{backgroundColor: ThemeDefaults.themeOrange, borderRadius: 35, padding: 15}}
                        onPress={() => {
                            navigation.navigate("AddEventCalendarUserStack", {selectedDate: formatedDate})
                        }}
                    >
                        <Icon name="plus" size={40} color={ThemeDefaults.themeWhite} />
                    </TouchableOpacity>
                </View>
                
            </ScrollView>
            
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
        backgroundColor: ThemeDefaults.themeWhite
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
        marginVertical: 30
    },
    schedCard: {
        width: '100%',
        backgroundColor: ThemeDefaults.themeFadedBlack,
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    schedTitle: {
        color: ThemeDefaults.themeWhite
    },
    schedTime: {
        color: ThemeDefaults.themeWhite
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
})