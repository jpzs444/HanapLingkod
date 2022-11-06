import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, TextInput, StatusBar, Image, Modal, ScrollView, Dimensions, ActivityIndicator  } from 'react-native'
import React, {useState, useEffect} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import Appbar from '../Components/Appbar';
import ThemeDefaults from '../Components/ThemeDefaults';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

import * as Location from 'expo-location';

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { IPAddress } from '../global/global';
import { ModalPicker } from '../Components/ModalPicker';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import Schedule from './Schedule';
import MapView, {Geojson} from 'react-native-maps';


const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const HEIGTH = Dimensions.get('window').height
dayjs.extend(utc)
dayjs.extend(timezone)

const RequestForm = ({route, navigation}) => {

    const screenFocused = useIsFocused()

    const {workerID, workID, workerInformation, selectedJob, minPrice, maxPrice, showMultiWorks, dateService, timeService, fromPostReq, selectedDay, selectedTime} = route.params;
    // console.log(workerInformation)

    const [loading, setIsLoading] = useState(false)
    const [loadedWorkerInfo, setLoadedWorkerInfo] = useState({})
    const [hasLoadedWorkerInfo, setHasLoadedWorkerInfo] = useState(showMultiWorks)
    const [workListModalOpened, setWorkListModalOpened] = useState(false)

    const [workSelected, setWorkSelected] = useState("")
    
    const [timePickerVisible, setTimePickerVisibility] = useState(false)
    const [datePickerVisible, setDatePickerVisibility] = useState(false)

    const [formatedDate, setFormatedDate] = useState(new Date)
    const [displayDate, setDisplayDate] = useState(new Date())

    const [dateSelected, setDateSelected] = useState(false)
    const [formatedTime, setFormatedTime] = useState(new Date())

    const [displayTime, setDisplayTime] = useState(new Date())
    const [timeSelected, setTimeSelected] = useState(false)

    const [serviceSelected, setServiceSelected] = useState(false)

    const [requestDescription, setRequestDescription] = useState("")

    const [postBtnModal, setPostBtnModal] = useState(false)
    const [confirmServiceRequest, setConfirmServiceRequest] = useState(false)
    const [scheduleModalView, setScheduleModalView] = useState(false)

    const [viewCalendarModal, setViewCalendarModal] = useState(false)
    const [viewScheduleModal, setViewScheduleModal] = useState(false)

    const [hasPendingRequest, sethasPendingRequest] = useState(false)

    const [sameDateBookings, setSameDateBookings] = useState([])

    const [viewScheduleErrorModal, setViewScheduleErrorModal] = useState(false)
    const [requestpostedModal, setRequestPostedModal] = useState(false)

    const [location, setLocation] = useState(null);
    const [coordLati, setCoordLati] = useState(null)
    const [coordLongi, setCoordLongi] = useState(null)
    const [currentCoords, setCurrentCoords] = useState({})

    const [customAddress, setCustomAddress] = useState("")
    const [useCustomAddress, setUseCustomAddress] = useState(false)

    const [status, requestPermission] = Location.useBackgroundPermissions()

    const [reloading, setReloading] = useState(false)

    const [listUnavailableSched, setListUnavailableSched] = useState({
        // '2022-10-20': dateAppointmentsStyles,
        // '2022-10-29': dateDisabledStyles,
        // [dayjs(new Date()).format("YYYY-MM-DD").toString()]: dateTodayStyles
    })

    const [calendarSelectedDate, setCalendarSelectedDate] = useState(
        {
            ...datesWithCustomization
        }
    )

    let uunn = []
    let lll = []

    useEffect(() => {
        console.log("Worker infromation: ", workerInformation)
        setLoadedWorkerInfo({...workerInformation})
        loadUnavailableTime()
        setIsLoading(false)
        
        setDateSelected(false)
        setTimeSelected(false)
        setServiceSelected(false)
        
        setFormatedDate(new Date())
        setFormatedTime(new Date())
        setDisplayDate(new Date())
        setDisplayTime(new Date())

        setUseCustomAddress(false)
        setCustomAddress("")

        if(selectedDay){
            setFormatedDate(selectedDay)
            setDisplayDate(dayjs(new Date(selectedDay)).format("MMMM DD"))
            setDateSelected(true)
        }

        if(selectedTime){
            setFormatedTime(selectedTime)
            setDisplayTime(dayjs(new Date(selectedTime)).format("hh:mm A"))
            setTimeSelected(true)
        }
        
        if(selectedJob){
            setServiceSelected(true)
        }

        (async () => {
          
            let { status } = await Location.requestForegroundPermissionsAsync();
            // if (status !== 'granted') {
            //   setErrorMsg('Permission to access location was denied');
            //   return;
            // }
      
            let alocation = await Location.getCurrentPositionAsync({});
            // console.log(alocation)
            setLocation({...alocation})

            setCoordLati(alocation.coords.latitude)
            setCoordLongi(alocation.coords.longitude)
  
            setCurrentCoords({
                latitude: alocation.coords.latitude,
                longitude: alocation.coords.longitude,
                latitudeDelta: 0.0032,
                longitudeDelta: 0.0141,
            })
        })();


        return () => {
            setLoadedWorkerInfo({...workerInformation})
            if(workSelected) setWorkSelected("")
            // if(selectedJob){
            //     setServiceSelected(true)
            // }
        }
    }, [screenFocused, route])
    
    useEffect(() => {
        setLoadedWorkerInfo({...workerInformation})
        setCalendarSelectedDate({...datesWithCustomization})
        // if(workSelected) setWorkSelected({})

        // console.log("workerInformation: ", workerInformation)

        // console.log(coordLati)
        // console.log(coordLongi)
    }, [showMultiWorks])


    const loadUnavailableTime = () => {

        uunn = [...(workerInformation.unavailableTime)]
        console.log("listUnvSched uunn: ", uunn)

        
        uunn.forEach(e => {
            if(dayjs(e.endDate).subtract){
                
            }
            
            let dif = new Date(e.startTime).getDate()
            let di = new Date(e.endDate).getDate()
            let timeDiff = di - dif
            
            if(timeDiff > 0) {
                for(let i = 0; i <= timeDiff; i++){
                    lll[dayjs(e.startTime).add(i, "day").toString()] = e.wholeDay ? dateDisabledStyles : dateAppointmentsStyles
                }
            } else {
                let ff = dayjs(new Date(e.startTime)).format("YYYY-MM-DD")
                let dn = dayjs(new Date())
                // console.log(dn.diff(ff, 'day', true) > '0')

                if(dayjs(e.startTime).format("YYYY-MM-DD").toString() === dayjs(new Date()).format("YYYY-MM-DD").toString()){
                    // console.log("the same")
                    lll[dayjs(e.startTime).format("YYYY-MM-DD").toString()] = e.wholeDay ? dateTodayDisabledStyles : null

                } else if(dn.diff(ff, 'day', true) > '0'){
                    lll[dayjs(e.startTime).format("YYYY-MM-DD").toString()] = pastDates

                } else if(e.wholeDay){
                    lll[dayjs(e.startTime).format("YYYY-MM-DD").toString()] = dateDisabledStyles

                }
                lll[dayjs(new Date()).format("YYYY-MM-DD")] = dateTodayStyles
            }

        })

        getUnavailableSchedule()

        // console.log("display lll: ", lll)
        setListUnavailableSched({...lll})
        
    }

    const pastDates = {
        customStyles: {
            text: {
                color: '#e5e5e5'
            }
        }
    }


    // calendar things
    const dateDisabledStyles = {
        disabled:true,
        disableTouchEvent: true,
        customStyles: {
            container: {
                // backgroundColor: ThemeDefaults.dateDisabled,
                borderRadius: 5,
            },
            text: {
                color: '#c2c2c2'
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

    const dateAppointmentsStyles = {
        customStyles: {
            container: {
                backgroundColor: ThemeDefaults.themeOrange,
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
                // backgroundColor: ThemeDefaults.themeOrange,
                borderRadius: 7,
            },
            text: {
                color: 'black',
                // color: ThemeDefaults.themeWhite,
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
        '2022-10-19': dateDisabledStyles,
        [dateToday.toString()] : dateTodayStyles,
    }

    const CalendarMonthArrow = (props) => {
        return(
            <Icon name={`arrow-${props.direction}`} size={22} color={ThemeDefaults.themeDarkBlue} />
        )
    }

    // calendar things -------

    const handleDateConfirm = (date) => {
        setReloading(true)
        
        let da = new Date(date).toISOString()
        let nn = dayjs(date).format("YYYY-MM-DD")
        
        setFormatedDate(date);

        setDisplayDate(dayjs(date).format("MMMM D, YYYY"));
        setDatePickerVisibility(false);
        setDateSelected(true)
        setViewCalendarModal(false)
        
        // set as date selected on calendar
        datesWithCustomization[da.toString()] = dateAppointmentsStyles
        
        // getSameDateBookings(date)
        loadUnavailableTime()
        getUnavailableSchedule()
        
        // setViewScheduleModal(true)
        navigation.navigate("ScheduleDrawer", {selectedDate: new Date(date).toString(), workerInformation: workerInformation, selectedJob: selectedJob, fromRequestForm: true, minPrice: minPrice, maxPrice: maxPrice })
        setReloading(false)
        // setViewScheduleModal(true)
        
    }
    
    const getUnavailableSchedule = () => {
        let dddd = new Date(formatedDate)
        let uunn = workerInformation.unavailableTime.filter(e => {
            let sst = new Date(e.startTime)
            return (sst.getFullYear() === dddd.getFullYear() &&
            sst.getMonth() === dddd.getMonth() &&
            sst.getDate() === dddd.getDate())
        })
        
        uunn = uunn.filter(e => dayjs(e.startTime).format("YYYY-MM-DD").toString() === dayjs(new Date(formatedDate)).format("YYYY-MM-DD").toString())
        setSameDateBookings(prev => [...uunn])
        // setReloading(false)
        // console.log("Filtered unv time to display: ", uunn)
    }

    const getSameDateBookings = (date) => {
        fetch(`https://hanaplingkod.onrender.com/worker/${workerID}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json'
            },
        }).then((res) => res.json())
        .then((data) => {
            let fd = dayjs(date).utc(true).format()
            
            // // console.log("fd", fd)
            // let list = data.worker.filter(e => {
            //     let aa = dayjs(e.serviceDate).utc(true).format()
            //     // console.log("aa", aa)
            //     return aa === fd
            // })
            // setSameDateBooking([...list])

            // unavailableTime from worker
            // console.log(data.unavailableTime)
            let list = []

            let startDate

            list = data.unavailableTime.filter(e => {
                dayjs(e.startTime).format("YYYY-MM-DD") === dayjs(fd).format("YYYY-MM-DD")
            })

            // console.log("List of unvailable dates same time: ", list)

            // console.log("list same date accepted bookings - calendar", list)
        }).catch((err) => console.log("get same dates error", err.message))
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

        // console.log(formatedTime)
        // console.log("new date: ", newDate)

    }

    const changeWorkListModalVisibility = (bool) => {
        setWorkListModalOpened(bool)
    }

    const handlePendingRequestChecker = () => {
        setIsLoading(true)
        fetch(`http://${IPAddress}:3000/service-request/${global.userData._id}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json'
            },
        }).then(res => res.json())
        .then(data => {
            console.log("pending checker: ", data)
            let list = [...data.recruiter]
            list = list.filter(e => e.requestStatus == '1')
            if(list.length > 0){
                // has a pending request
                sethasPendingRequest(true)
            } else {
                setPostBtnModal(true)
                // postRequest()
            }
        })
    }

    const postRequest = () => {
        console.log("worker id", workerInformation._id)
        console.log("user id: ", global.userData._id)
        console.log(selectedJob)
        // console.log(workSelected.ServiceSubId.ServiceSubCategory)
        console.log(minPrice)
        console.log(maxPrice)
        console.log(formatedDate)
        console.log(formatedTime)

        let user = global.userData

        fetch(`http://${IPAddress}:3000/service-request`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                "workerId": workerInformation._id,
                "recruiterId": global.userData._id,
                'workId': workID,
                "address": useCustomAddress ? customAddress : `${user.street}, ${user.purok}, ${user.barangay} ${user.city}, ${user.province}`,
                "subCategory": selectedJob ? selectedJob : workSelected.ServiceSubId.ServiceSubCategory,
                "minPrice": minPrice ? minPrice : workSelected.minPrice,
                "maxPrice": maxPrice ? maxPrice : workSelected.maxPrice,
                "serviceDate": dayjs(formatedDate).format("YYYY-MM-DD"),
                "startTime": dayjs(formatedTime).format("HH:mm"),
                "description": requestDescription,
                "lat": coordLati,
                "long": coordLongi,
            })
        }).then((res) => {
            console.log("Service Request Posted! ")
            // global.serviceRequestPosted = true
            setRequestDescription("")
            setFormatedDate(new Date())
            setFormatedTime(new Date())
            // navigation.navigate("HomeScreen")
        })
        .catch((err) => console.log("Service Request Error: ", err))
    }

    const customMapStyle = [
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
    ]

  return (
        <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: ThemeDefaults.themeWhite, paddingTop: StatusBar.currentHeight, paddingBottom: 50}}>
            <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

            {/* Modals */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={postBtnModal}
                onRequestClose={() => setPostBtnModal(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText, {marginBottom: 20}]}>Are you sure you want to send a service request?</TText>
                            <TText style={[styles.dialogueMessageText, {fontSize: 14,}]}>(Reminder: You can only send one service request at a time)</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    setConfirmServiceRequest(true)
                                    setRequestPostedModal(true)
                                    // check if recruiter has a pending request
                                    // handlePendingRequestChecker()
                                    // fetch post request
                                    postRequest()
                                    setPostBtnModal(false)
                                    // navigation.navigate("HomeScreen")
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Yes</TText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setPostBtnModal(false)
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Schedule error modal */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={viewScheduleErrorModal}
                onRequestClose={() => setViewScheduleErrorModal(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText]}>The time you picked conflicts with the worker’s schedule. You may check their schedule and choose  another time slot.</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    // fetch post request
                                    // navigation.navigate("HomeScreen")

                                    setViewScheduleErrorModal(false)
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Okay</TText>
                            </TouchableOpacity>
                            {/* <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setPostBtnModal(false)
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Service Request success || Request has been made */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={requestpostedModal}
                onRequestClose={() => {
                //   global.serviceRequestPosted = false
                setRequestPostedModal(false)
                }}
            >

                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText]}>Your request has been made.</TText>
                            <TText style={[styles.dialogueMessageText, {marginTop: 20}]}>Kindly wait for the worker to respond.</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                setRequestPostedModal(false)
                                navigation.navigate("HomeScreen")
                                // navigation.navigate("RequestsScreen")
                                //   global.serviceRequestPosted = false
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>Got it</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                transparent={true}
                animationType='fade'
                visible={hasPendingRequest}
                onRequestClose={() => sethasPendingRequest(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText, {marginBottom: 20}]}>Sorry, you currently have a pending service request</TText>
                            <TText style={[styles.dialogueMessageText, {fontSize: 14,}]}>Create a service request once the active request has been completed</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    setIsLoading(false)
                                    navigation.navigate("HomeScreen")
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Okay</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            {/* Modal Calendar View */}
            <Modal
                transparent={true}
                animationType='slide'
                visible={viewCalendarModal}
                onRequestClose={() => setViewCalendarModal(false)}
            >

                <View style={styles.modalCalendar}>
                    {/* screen header */}
                    <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} changeCalendarModalState={setViewCalendarModal} modalCalendar={true} />
                    
                    <View style={styles.calendaHeaderCont}>
                    {
                        global.userData.role === "recruiter" ?
                            <View style={styles.header}>
                                <TText style={styles.headerTitle}>Date Selection</TText>
                                <TText style={styles.headerSubTitle}>Select and confirm date of appointment</TText>
                            </View>
                            :
                            <View style={styles.header}>
                                <TText style={styles.headerTitle}>Calendar</TText>
                                <TText style={styles.headerSubTitle}>Select dates where you will be unavailable</TText>
                            </View>
                    }
                    </View>

                    <Calendar 
                        minDate={dateToday.toString()}
                        enableSwipeMonths={true}
                        markingType={'custom'}
                        markedDates={
                            listUnavailableSched        
                        }
                        onDayPress={day => {
                            datesWithCustomization[day.dateString] = dateAppointmentsStyles
                            setCalendarSelectedDate({...datesWithCustomization})
                            loadUnavailableTime()
                            getUnavailableSchedule()
                            handleDateConfirm(day.timestamp)

                            // setViewScheduleModal(true)
                            // setViewScheduleModal


                            // navigation.navigate("ScheduleDrawer", {selectedDate: formatedDate.toString(), workerUT: workerInformation.unavailableTime})
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
                        {/* <View style={styles.legendItem}>
                            <View style={{backgroundColor: ThemeDefaults.themeLighterBlue, width: 25, height: 25, borderRadius: 8}} />
                            <TText style={styles.legendTxt}>Date Unavailable</TText>
                        </View> */}
                    </View>

                    {/* Confirm Select */}
                    
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
                    <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} changeSchedModalState={setViewScheduleModal} changeCalendarModalState={setViewCalendarModal} modalSchedule={true} />

                    <View style={styles.headerContainer}>
                        <TText style={styles.headerTitle}>Worker's Schedule</TText>
                        <TText style={styles.headerSchedSubTitle}>{sameDateBookings.length > 0 ? "Shown below are the worker's appointments scheduled on " : "The worker you selected has no appointments scheduled on "}<TText style={styles.headerSubTitleDate}>{dayjs(new Date(formatedDate)).format("MMMM D")}</TText></TText>
                    </View>

                    <View style={styles.timeBtnContainer}>
                        {/* Time Picker */}
                        <View>
                            {/* <TText>Select Time</TText> */}
                        </View>

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

                        <DateTimePickerModal
                            isVisible={timePickerVisible}
                            mode="time"
                            onConfirm={handleTimeConfirm}
                            onCancel={() => setTimePickerVisibility(false)}
                        />

                        {/* show if time is taken */}
                        {/* <View style={{marginTop: 2, paddingLeft: 5}}>
                            <TText style={{fontSize: 14, color: ThemeDefaults.themeOrange}}>Time is already taken by another recruiter</TText>
                        </View> */}
                    </View>
                    <View style={styles.confirmBtnContainer}>
                        <TouchableOpacity style={styles.confirmBtn}
                            onPress={() => {
                                setViewCalendarModal(false)
                                setViewScheduleModal(false)

                                //---
                                setViewScheduleErrorModal(true)
                            }}
                        >
                            <TText style={styles.confirmBtnText}>Confirm Time</TText>
                        </TouchableOpacity>
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
                            !reloading && 
                            <>
                                {
                                    sameDateBookings.map(function(item, index){
                                        
                                            let dif = new Date(item.startTime).getHours()
                                            let di = new Date(item.endTime).getHours()
                                            const timeDiff = (di - dif) * 50
            
                                            return(
                                                <View key={index}>
                                                    <View style={[styles.schedCard, {height: timeDiff ? timeDiff : 100}]}>
                                                        {
                                                            !item.CannotDelete && global.userData.role === "worker" &&
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
                                        
                                    })
                                }
                            </>
                        }
                    </View>

                    

                    {/* <View style={styles.confirmBtnContainer}>
                        <TouchableOpacity style={styles.confirmBtn}
                            onPress={() => {
                                setViewCalendarModal(false)
                                setViewScheduleModal(false)

                                //---
                                setViewScheduleErrorModal(true)
                            }}
                        >
                            <TText style={styles.confirmBtnText}>Confirm Time</TText>
                        </TouchableOpacity>
                    </View> */}
                    
                </ScrollView>
                
            </Modal>

            

            {/* Date Picker */}
            {/* May use a different screen instead to control the selection of dates based from the workers availability */}
            <DateTimePickerModal
                isVisible={datePickerVisible}
                mode="date"
                minimumDate={new Date()}
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisibility(false)}
            />

            {/* Time Picker */}
            <DateTimePickerModal
                isVisible={timePickerVisible}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={() => setTimePickerVisibility(false)}
            />

            {/* Header */}
            <View style={styles.headerContainer}>
                <TText style={styles.headerTitle}>Request Form</TText>
                <TText style={styles.headerSubTitle}>Please fill in the request form carefully.</TText>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                {/* Form Title */}
                <TText style={styles.formTitle}>Delivery Address of Service</TText>
                
                {/* Form inputs */}
                <View style={styles.inputsContainer}>
                    {/* Recruiter's Address */}
                    <View style={{borderRadius: 10, borderWidth: 1.8, borderColor: 'rgba(0,0,0,0.4)', overflow: 'hidden',}}>
                        {/* <View style={{width: '100%', height: 200, }}>
                            <MapView 
                                style={{width: '100%', height: '100%'}}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                pitchEnabled={false}
                                rotateEnabled={false}
                                // initialRegion={{
                                //     latitude: 14.0996,
                                //     longitude: 122.9550,
                                //     latitudeDelta: 0.0422,
                                //     longitudeDelta: 0.0422
                                // }}
                                region={currentCoords}
                                customMapStyle={customMapStyle}
                            />
                        </View> */}
                        <View style={[styles.formAddressBar, {marginBottom:5}]}>
                            <View style={styles.formAddTxtContainer}>
                                <Icon name='map' size={22} color={ThemeDefaults.themeLighterBlue} />
                                <View style={styles.formAddTxt}>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.addressInfo}>{global.userData.street}, Purok {global.userData.purok}, {global.userData.barangay}, {global.userData.city}, {global.userData.province}</Text>
                                    <TText style={styles.addressSubTitle}>Default Home Address</TText>
                                </View>
                            </View>
                            <Icon name='map-marker' size={22} />
                        </View>
                    </View>

                    {/* Custom address */}
                    <TText style={{marginTop: 15, fontSize: 15}}>Use a different address for the service?</TText>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1.8, borderColor: 'rgba(0,0,0,0.4)', overflow: 'hidden', marginTop: 5}}>
                        <Icon name="map-plus" size={22} color={ThemeDefaults.themeLighterBlue}  />
                        <TextInput 
                            value={useCustomAddress ? customAddress : ""}
                            placeholder='Write the address'
                            multiline
                            onChangeText={(val) => {
                                if(val.length > 0){
                                    setCustomAddress(val)
                                    setUseCustomAddress(true)
                                } else {
                                    setCustomAddress("")
                                    setUseCustomAddress(false)
                                }
                            }}
                            style={{
                                fontFamily: "LexendDeca",
                                fontSize: 16,
                                marginLeft: 10,
                                flex: 1
                            }}
                        />

                    </View>

                    {/* Select Date */}
                    <TouchableOpacity style={[styles.formAddressBar, { paddingTop: 12, borderWidth: 1.8, borderColor: 'rgba(0,0,0,0.4)', borderRadius: 10, marginTop: 20}]}
                        onPress={() => {
                            // setDatePickerVisibility(true)
                            setViewCalendarModal(true)
                            // navigation.navigate("CalendarDrawer")
                        }}
                    >
                        <View style={styles.formAddTxtContainer}>
                            <Icon name='calendar-month' size={22} />
                            <View style={styles.formAddTxt}>
                                <TText style={styles.addressInfo}>{dateSelected ? displayDate : dateService ? dayjs(new Date(formatedDate)).format("MMMM D").toString() : "Date"}</TText>
                            </View>
                        </View>
                        <Icon name='chevron-down' size={22} />
                    </TouchableOpacity>

                    {/* Time Select Schedule | ROW */}
                    <View style={styles.timeRowContainer}>
                        <TouchableOpacity style={styles.timeAddressBar}
                            onPress={() => setTimePickerVisibility(true)}
                        >
                            <View style={styles.timeAddressContainer}>
                                <Icon name='clock-outline' size={22} />
                                <View style={styles.formTimeTxt}>
                                    <TText style={styles.timeTxt}>{ timeSelected ? displayTime : timeService ? dayjs(timeService).format("hh:mm A").toString() : "Time"}</TText>
                                </View>
                            </View>
                            <Icon name='chevron-down' size={22} />
                        </TouchableOpacity>
                        <View style={styles.checkScheduleContainer}>
                            <TouchableOpacity style={[styles.checkScheduleBtn, {backgroundColor: dateSelected ? ThemeDefaults.themeLighterBlue : "#c2c2c2"}]}
                                disabled={!dateSelected}
                                onPress={()=> {
                                    if(dateSelected){
                                        // navigation.navigate("ScheduleDrawer", {selectedDate: new Date(formatedDate).toString(), workerInformation: workerInformation, selectedJob: selectedJob, fromRequestForm: true.valueOf, minPrice: minPrice, maxPrice: maxPrice})
                                        navigation.navigate("ScheduleDrawer", {selectedDate: new Date(formatedDate).toString(), workerInformation: workerInformation, selectedJob: selectedJob, fromRequestForm: true, minPrice: minPrice, maxPrice: maxPrice })

                                        // setViewScheduleModal(true)
                                    }
                                }}
                            >
                                <TText style={styles.checkSchedTxt}>Check Schedule</TText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Selected Service */}
                    <TouchableOpacity disabled={!showMultiWorks} style={[styles.formAddressBar, {paddingTop: 12, borderWidth: 1.8, borderColor: 'rgba(0,0,0,0.4)', borderRadius: 10}]}
                        onPress={() => setWorkListModalOpened(true)}
                    >
                        <View style={[styles.formAddTxtContainer, ]}>
                            <Icon name='briefcase' size={22} />
                            <View style={styles.formAddTxt}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.workSubCategory}>{workSelected ? workSelected.ServiceSubId.ServiceSubCategory : serviceSelected ? selectedJob : "Select the service you need.."}</Text>
                                {
                                    showMultiWorks && <TText style={styles.addressSubTitle}>Select one of the worker’s services here</TText>
                                }
                            </View>
                        </View>
                        {
                            showMultiWorks &&
                            <Icon name="chevron-down" size={22} />
                        }

                        {/* Modal Picker for WorkList */}
                        {
                            showMultiWorks &&
                            <Modal
                                transparent={true}
                                animationType='fade'
                                visible={workListModalOpened}
                                onRequestClose={() => setWorkListModalOpened(false)}
                            >
                                <ModalPicker 
                                    changeModalVisibility={changeWorkListModalVisibility}
                                    setData={(wl) => {
                                        setWorkSelected({...wl})
                                        setServiceSelected(true)
                                    }}
                                    workList={true}
                                    workerID={workerID}
                                />
                            </Modal>
                        }

                    </TouchableOpacity>

                </View>

                {/* Addditional request information/description */}
                <View style={styles.requestDescriptionContainer}>
                    <Icon name="text-box" size={22} />
                    <TextInput 
                        multiline
                        numberOfLines={5}
                        style={styles.requestDescriptionTextInput}
                        placeholder='Additional service request description (Optional)'
                        value={requestDescription ? requestDescription : null}
                        keyboardType='default'
                        onChangeText={(val) => setRequestDescription(val)}
                    />
                </View>

                {/* Worker Information */}
                <View style={styles.workerInformationContainer}>
                    <View style={styles.workerInfoRow}>
                        <View style={styles.iconTxtContainer}>
                            <Icon name="tag" size={22} style={styles.iconFlip} />
                            <TText style={styles.feeTitleTxt}>Service Fee Range</TText>
                        </View>
                        <TText style={styles.feeTxt}>₱ {workSelected ? (`${workSelected.minPrice} - ${workSelected.maxPrice}`) : minPrice ? (`${minPrice} - ${maxPrice}`) : '0.00'}</TText>
                    </View>

                    {/* Worker Name */}
                    <View style={styles.workerInfoRow}>
                        <View style={styles.iconTxtContainer}>
                            <Icon name="account-hard-hat" size={22} style={styles.iconFlip} />
                            <TText style={styles.feeTitleTxt}>Worker Requested</TText>
                        </View>
                        <TText style={styles.workerNamefeeTxt}>{loadedWorkerInfo.firstname} {loadedWorkerInfo.lastname}</TText>
                    </View>

                    {/* Worker Profile Bar */}
                    <View style={styles.workerBarContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={ loadedWorkerInfo.profilePic === 'pic' ? require("../assets/images/default-profile.png") : {uri: loadedWorkerInfo.profilePic}} style={styles.imageStyle} />
                        </View>
                        <View style={styles.workerInformation}>
                            <View>
                                <View style={styles.workerNameContainer}>
                                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.workerName}>{loadedWorkerInfo.firstname}{loadedWorkerInfo.middlename !== "undefined" ? loadedWorkerInfo.middlename : ""} {loadedWorkerInfo.lastname}</Text>
                                    {
                                        loadedWorkerInfo.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null
                                    }
                                </View>
                                <View style={styles.nameStarContainer}>
                                    <Icon name='star' size={20} color="gold" />
                                    <TText style={styles.workerStars}>4.7</TText>
                                </View>
                            </View>
                            {/* <View style={styles.viewBtnContainer}> */}
                                <TouchableOpacity style={styles.viewProfileBtn}
                                    onPress={() => {
                                        navigation.navigate("WorkerProfileDrawer", {workerID: workerID})
                                    }}
                                >
                                    <TText style={styles.viewProfileText}>Profile</TText>
                                </TouchableOpacity>
                            {/* </View> */}
                        </View>
                        {/* <View style={styles.viewBtnContainer}>
                            <TouchableOpacity style={styles.viewProfileBtn}
                                onPress={() => {
                                    navigation.navigate("WorkerProfileDrawer", {workerID: workerID})
                                }}
                            >
                                <TText style={styles.viewProfileText}>Profile</TText>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                    

                </View>
                
            </View>

            {/* Summary */}
            

            {/* Submit Request Button */}
            <View style={styles.submitBtnContainer}>
                <TouchableOpacity 
                    style={[styles.submitBtn, {backgroundColor: dateSelected && timeSelected && serviceSelected || fromPostReq ? ThemeDefaults.themeOrange : '#c2c2c2', elevation: 0}]}
                    disabled={!dateSelected && !timeSelected && serviceSelected && !fromPostReq}
                    onPress={() => {
                        // setIsLoading(true)
                        handlePendingRequestChecker()
                    }}
                >
                    <TText style={styles.submitBtnTxt}>{ loading ? <ActivityIndicator size={'large'} style={{width: '100%', height: '100%'}} /> :"Submit Request"}</TText>
                </TouchableOpacity>


            </View>
        </ScrollView>

  )
}

export default RequestForm

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#fff',
    },
    scrollViewContainer: {
        // flex: 1,
        height: HEIGTH,
        paddingBottom: 150,
        paddingTop: StatusBar.currentHeight,
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10
    },
    headerTitle: {
        fontSize: 20,
        marginBottom: 10
    },
    headerSubTitle: {
        fontSize: 15
    },
    headerSchedSubTitle: {
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    headerSubTitleDate: {
        fontFamily: 'LexendDeca_Medium'
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: 20
    },
    formTitle: {
        fontSize: 15
    },
    inputsContainer: {
        marginTop: 8
    },
    formAddressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        padding: 12,
        marginBottom: 10,
        paddingTop: 15,

        // borderWidth: 1.8,
        // borderTopWidth: 0,
        // borderColor: 'rgba(0,0,0,0.4)',
        // borderRadius: 10,

        backgroundColor: ThemeDefaults.themeWhite
    },
    formAddTxtContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    formAddTxt: {
        flex: 0.93,
        marginLeft: 12
    },
    addressInfo: {
        fontFamily: 'LexendDeca',
        fontSize: 16,
        fontFamily: 'LexendDeca'
    },
    workSubCategory: {
        fontFamily: 'LexendDeca_Medium',
        fontSize: 18,
    },
    addressSubTitle: {
        fontSize: 12,
        color: ThemeDefaults.themeOrange
    },
    timeRowContainer: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 10,
    },
    checkScheduleContainer: {
        flex: 0.9,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        // paddingLeft: 12
    },
    checkScheduleBtn: {
        width: '90%',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 0,

        borderRadius: 10,

        backgroundColor: ThemeDefaults.themeLighterBlue,
    },
    checkSchedTxt: {
        color: ThemeDefaults.themeWhite,
        fontFamily: 'LexendDeca_Medium',
        fontSize: 14
    },
    timeAddressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 12
    },
    timeAddressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // width: '90%',

        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 14,
        // marginBottom: 10,

        borderWidth: 1.8,
        borderColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,

        backgroundColor: ThemeDefaults.themeWhite
    },
    timeTxt: {
        // width: '90%',
        fontSize: 18,
        fontFamily: 'LexendDeca',
        color: ThemeDefaults.themeLighterBlue,
    },
    formTimeTxt: {
        // width: '80%',
        paddingLeft: 12,
    },
    workerInformationContainer: {
        marginTop: 20,
    },
    workerInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 10
    },
    iconTxtContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    feeTitleTxt: {
        marginLeft: 10,
        fontSize: 15,
        color: 'gray',
    },
    feeTxt: {
        fontSize: 18,
        color: ThemeDefaults.appIcon
    },
    workerNamefeeTxt: {
        fontSize: 18,
    },
    iconFlip: {
        transform: [
            {
                scaleX: -1,
            },
        ]
    },
    workerBarContainer: {
        height: 80,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: ThemeDefaults.themeWhite,

        overflow: 'hidden',

        borderRadius: 10,
        elevation: 4
    },
    imageContainer: {
        // flex: 1,
        width: 80,
        height: 80,
    },
    imageStyle: {
        width: 80,
        height: 80,
    },
    nameStarContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    workerInformation: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    workerNameContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    workerName: {
        fontSize: 18,
        fontFamily: 'LexendDeca_Medium'
    },
    workerStars: {
        fontSize: 14,
        alignContent: 'center',
        marginLeft: 5
    },
    viewBtnContainer: {
        flex: 1,
        alignItems: 'center',
        paddingRight: 5
    },
    viewProfileBtn: {
        backgroundColor: ThemeDefaults.themeLighterBlue,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },
    viewProfileText: {
        color: ThemeDefaults.themeWhite,
        fontSize: 14,
    },
    submitBtnContainer: {
        // position: 'absolute',
        // bottom: 50,
        // left: 40,
        // right: 40,

        paddingHorizontal: 40,
        marginTop: 50,
        marginBottom: 40
    },
    submitBtn: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 20,
        backgroundColor: ThemeDefaults.themeOrange,
        elevation: 4
    },
    submitBtnTxt: {
        color: ThemeDefaults.themeWhite,
        fontSize: 18,
        fontFamily: 'LexendDeca_SemiBold'
    },
    requestDescriptionContainer: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',

        borderWidth: 1.8,
        borderColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,
    },
    requestDescriptionTextInput: {
        width: '90%',
        paddingTop: 2,
        marginLeft: 10,
        fontFamily: 'LexendDeca',
        fontSize: 16,
        textAlignVertical: 'top',
    },
    summaryContainer: {
        paddingHorizontal: 20,
        marginTop: 30
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: 8
    },
    summaryTitle: {
        fontSize: 18
    },
    summaryAddressTxt: {
        flex: 0.4,
        marginRight: 10
    },
    summaryAddressVal: {
        flex: 1,
        textAlign: 'right'
    },
    summaryServiceTxt: {

    },
    summaryServiceVal: {

    },
    summaryDate: {

    },
    summaryDateVal: {

    },
    summaryTime: {

    },
    summaryTimeVal: {

    },
    summaryWorkerTxt: {

    },
    summaryWorkerVal: {

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
    calendaHeaderCont: {
        alignItems: 'center', 
        marginBottom: 30
    },
    header: {
        alignItems: 'center'
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
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    timeBtnContainer: {
        paddingHorizontal: 30,
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
    scheduleList: {
        paddingHorizontal: 30,
        width: '100%',
        marginVertical: 30,
        marginBottom: 200,
    },
    schedCard: {
        width: '100%',
        backgroundColor: ThemeDefaults.themeOrange,
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
        width: '100%',
        paddingHorizontal: 60,
        marginVertical: 20,
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
        backgroundColor: ThemeDefaults.themeOrange,
        elevation: 3
    },
    confirmBtnText: {
        color: ThemeDefaults.themeWhite,
        fontSize: 18,
        fontFamily: "LexendDeca_SemiBold"
    },
})