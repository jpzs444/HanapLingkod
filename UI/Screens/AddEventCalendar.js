import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, StatusBar, SafeAreaView } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs'
import ThemeDefaults from '../Components/ThemeDefaults';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import RadioButtonRN from 'radio-buttons-react-native';
import Checkbox from 'expo-checkbox';
import { IPAddress } from '../global/global';
import { useNavigation } from '@react-navigation/native';



const AddEventCalendar = ({route}) => {

    const {selectedDate, eventItem} = route.params

    const navigation = useNavigation()

    const radioOptions = [
        {label: 'Time'},
        {label: 'Whole Day'},
    ]

    const [radioBtn, setRadioBtn] = useState(false)
    const [isChecked, setChecked] = useState(false)
    const [initialRB, setInitialRB] = useState(1)

    const [startTimePicker, setStartTimePicker] = useState(false)
    const [endTimePicker, setEndTimePicker] = useState(false)
    const [scheduleConflicting, setScheduleConflicting] = useState(false)

    const [formatedStartTime, setFormatedStartTime] = useState(new Date())
    const [formatedEndTime, setFormatedEndTime] = useState(new Date())
    const [datePickerVisible, setDatePickerVisibility] = useState(false)

    const [formatedDate, setFormatedDate] = useState(new Date)
    const [displayDate, setDisplayDate] = useState(new Date())

    const [dateSelected, setDateSelected] = useState(false)

    const [startTimeSelected, setStartTimeSelected] = useState(false)
    const [endTimeSelected, setEndTimeSelected] = useState(false)
    
    const [endTimeLesser, setEndTimeLesser] = useState(false)

    const [eventTitle, setEventTitle] = useState("")

    const [hasCreatedAnEvent, setHasCreatedAnEvent] = useState(false)

    const [confirmDeleteEventModal, setConfirmDeleteEventModal] = useState(false)


    useEffect(() => {
        console.log("Event item: ", eventItem)
        
        if(eventItem){
            setInitialRB(2)
            setEventTitle(eventItem.title)

            if (eventItem.startTime) {
                setFormatedStartTime(eventItem.startTime)
                setStartTimeSelected(true)
            }
            if (eventItem.endTime) {
                setFormatedEndTime(eventItem.endTime)
                setEndTimeSelected(true)

                setFormatedDate(dayjs(eventItem.endTime).format("YYYY-MM-DD"))
                setDateSelected(true)
            }
            
        }
    }, [route]);

    const getUpdatedUserData = () => {
        console.log("getUpdatedUserData")
        let userRoute = global.userData.role === "recruiter" ? "Recruiter/" : "Worker/"

        fetch("http://" + IPAddress + ":3000/" + userRoute + global.userData._id, {
            method: "GET",
            header: {
                "conten-type": "application/json",
                "Authorization": global.accessToken
            },
        }).then((res) => res.json())
        .then((user) => {
            global.userData = user
        }).catch((error) => console.log(error.message))
    }


    const handleTimeConfirm = (time) => {
        let timeString = dayjs(time).format("YYYY-MM-DD hh:mm:ss")
        let timetime = dayjs(time).format("HH:mm")

        if(startTimePicker){
            setFormatedStartTime(time)
            setStartTimePicker(false)
            setStartTimeSelected(true)
        } else if(endTimePicker){
            if(time < formatedStartTime){
                console.log("end time lesser")
                setEndTimeLesser(true)
            }
            setFormatedEndTime(time)
            setEndTimePicker(false)
            setEndTimeSelected(true)
        }
    }

    const handleDateConfirm = (date) => {

        let nn = dayjs(date).format("YYYY-MM-DD")
        setDateSelected(true)
        
        if(nn < new Date(selectedDate)){
            setDatePickerVisibility(false)
            setEndTimeLesser(true)
        } else {
            let da = new Date(date).toISOString()
            
            setFormatedDate(dayjs(date).format("YYYY-MM-DD"));
            
            setDisplayDate(dayjs(date).format("MMM D, YYYY"));
            setDatePickerVisibility(false);
            setViewCalendarModal(false)

            datesWithCustomization[da.toString()] = dateAppointmentStyles

            getSameDateBookings(date)
        }
        // set as date selected on calendar


    }

    const handleAddEvent = () => {
        console.log("add event")
        let API = eventItem ?
            `http://${IPAddress}:3000/add-schedule/${global.userData._id}/${eventItem._id}`
            :
            `http://${IPAddress}:3000/add-schedule/${global.userData._id}`

        if(radioBtn){
            fetch(API, {
                method: eventItem ? "PUT" : "POST",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
                body: JSON.stringify({
                    inputDate: dayjs(selectedDate).format("YYYY-MM-DD"),
                    title: eventTitle ? eventTitle : 'untitled event',
                    startDate: dayjs(selectedDate).format("YYYY-MM-DD"),
                    endDate: dayjs(formatedDate).format("YYYY-MM-DD"),
                    startTime: dayjs(new Date()).format("HH:mm"),
                    endTime: dayjs(new Date()).format("HH:mm"),
                    wholeday: "1" // radioBtn
                })
            }).then(res => {
                console.log("Successfull adding/updating an event: ", res.body)
                getUpdatedUserData()
                setHasCreatedAnEvent(true)
            }).catch(err => console.log("error add event: ", err.message))
        } else {
            fetch(API, {
                method: eventItem ? "PUT" : "POST",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
                body: JSON.stringify({
                    inputDate: dayjs(selectedDate).format("YYYY-MM-DD"),
                    title: eventTitle ? eventTitle : 'untitled event',
                    startDate: dayjs(new Date(selectedDate)).format("YYYY-MM-DD"),
                    endDate: dayjs(new Date(selectedDate)).format("YYYY-MM-DD"),
                    startTime: dayjs(formatedStartTime).format("HH:mm"),
                    endTime: dayjs(formatedEndTime).format("HH:mm"),
                    wholeday: isChecked ? "1" : "0",
                })
            }).then(res => {
                if(res === 'conflict sched'){
                    console.log('has conflicting schedule')
                }
                console.log("Successfull adding/updating an event: ", res.json())
                getUpdatedUserData()
                setHasCreatedAnEvent(true)
            }).catch(err => console.log("error add event: ", err.message))
        }
    }


    const handleRemoveCustomEvent = () => {
        fetch(`http://${IPAddress}:3000/add-schedule/${global.userData._id}/${eventItem._id}`, {
            method: "DELETE",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.accessToken
            }
        }).then(res => {
            console.log("Successful removal of the custom event")
            // setHasCreatedAnEvent(true)
            getUpdatedUserData()
            navigation.navigate("CalendarViewUserStack")
        })
        .catch(err => console.log("Error remove custom event: ", err.msg))
    }



  return (
    <SafeAreaView style={styles.mainContainer}>
      <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} calendarWorker={true} />

        {/* Time Picker */}
        <DateTimePickerModal
            isVisible={startTimePicker}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={() => {
                setStartTimePicker(false)
            }}
        />
        <DateTimePickerModal
            isVisible={endTimePicker}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={() => {
                setEndTimePicker(false)
                setEndTimeSelected(false)
            }}
        />

        {/* Modals */}
        <Modal
            transparent={true}
            animationType='fade'
            visible={endTimeLesser}
            onRequestClose={() => setEndTimeLesser(false)}
        >
            <View style={styles.modalDialogue}>
                {/* Modal Container */}
                <View style={styles.dialogueContainer}>
                    {/* Modal Message/Notice */}
                    <View style={styles.dialogueMessage}>
                        <TText style={[styles.dialogueMessageText]}>End Date/Time should be set on a later time than the Start Date/Time. Please try again</TText>
                    </View>
                    {/* Modal Buttons */}
                    <View style={styles.modalDialogueBtnCont}>
                        <TouchableOpacity
                            style={[styles.dialogueBtn]}
                            onPress={() => {
                                setEndTimeLesser(false)
                                if(dateSelected){
                                    
                                    setDatePickerVisibility(true)
                                } else {
                                    setEndTimePicker(true)
                                }
                            }}
                        >
                            <TText style={styles.dialogueCancel}>Okay</TText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
        </Modal>

        {/* Has created an event */}
        <Modal
            transparent={true}
            animationType='fade'
            visible={hasCreatedAnEvent}
            onRequestClose={() => setHasCreatedAnEvent(false)}
        >
            <View style={styles.modalDialogue}>
                {/* Modal Container */}
                <View style={styles.dialogueContainer}>
                    {/* Modal Message/Notice */}
                    <View style={styles.dialogueMessage}>
                        <TText style={[styles.dialogueMessageText]}>You have successfully {eventItem ? "updated" : "added"} a custom event!</TText>
                    </View>
                    {/* Modal Buttons */}
                    <View style={styles.modalDialogueBtnCont}>
                        <TouchableOpacity
                            style={[styles.dialogueBtn]}
                            onPress={() => {
                                getUpdatedUserData()
                                setHasCreatedAnEvent(false)
                                // setEndTimePicker(true)
                                navigation.navigate("CalendarViewUserStack")
                            }}
                        >
                            <TText style={styles.dialogueCancel}>Okay</TText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
        </Modal>

        {/* Time conflict Modal */}
        <Modal
            transparent={true}
            animationType='fade'
            visible={scheduleConflicting}
            onRequestClose={() => setScheduleConflicting(false)}
        >
            {/* Modal View */}
            <View style={styles.modalDialogue}>
                {/* Modal Container */}
                <View style={styles.dialogueContainer}>
                    {/* Modal Message/Notice */}
                    <View style={styles.dialogueMessage}>
                        <TText style={[styles.dialogueMessageText, {marginBottom: 20}]}>The time you picked conflicts with your schedule. You may check your schedule and choose  another time slot, cancel your scheduled bookings, or delete custom events</TText>
                    </View>
                    {/* Modal Buttons */}
                    <View style={styles.modalDialogueBtnCont}>
                        <TouchableOpacity
                            style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                            onPress={() => {
                                setScheduleConflicting(false)
                            }}
                        >
                            <TText style={styles.dialogueCancel}>Okay</TText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {/* Confirm delete custom event/schedule */}
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

        <View style={styles.screenHeader}>
            <TText style={styles.screenHeaderTitle}>Edit Event</TText>
            <TText style={styles.screenHeaderSubTitle}>Please specifiy the details of the event. This will appear in your calendar</TText>
        </View>

        <View style={styles.formContainer}>
            <View style={{alignItems: 'center', marginBottom: 20}}>
                <TText style={{fontFamily: 'LexendDeca_Medium'}}>{dayjs(selectedDate).format("MMMM D, YYYY")}</TText>
            </View>
            <View style={styles.textInputContainer}>
                <Icon name="text" size={20} />
                <TextInput 
                    editable={eventItem ? false : true}

                    defaultValue={eventItem ? eventItem.title : null}
                    placeholder='Event title'
                    style={styles.textInputStyle}
                    onChangeText={text => setEventTitle(text)}
                />
            </View>

            <View style={styles.radioBtnContainer}>
                <RadioButtonRN
                    data={radioOptions}
                    box={false}
                    circleSize={14}
                    duration={200}
                    initial={eventItem ? initialRB : 1}
                    activeColor={ThemeDefaults.themeOrange}
                    selectedBtn={(e) => {
                        console.log(e.label)
                        setDateSelected(false)
                        setStartTimeSelected(false)
                        setEndTimeSelected(false)

                        if(e.label === "Time"){
                            setRadioBtn(false)
                        } else if(e.label === "Whole Day") {
                            setRadioBtn(true)
                        } else {
                            setRadioBtn(null)
                        }
                    }}
                    textStyle={{marginLeft: 10}}
                    style={styles.radioBtn}
                />
            </View>

            {
                radioBtn &&
                <View style={{marginTop: 40}}>
                    <DateTimePickerModal
                        isVisible={datePickerVisible}
                        mode="date"
                        minimumDate={new Date(selectedDate)}
                        onConfirm={handleDateConfirm}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    <TText>Set the end date of the event</TText>
                    <View style={[{marginTop: 10, borderWidth: 1.4, borderColor: ThemeDefaults.themeDarkBlue, borderRadius: 10, padding: 10}]}>
                        <TouchableOpacity style={styles.btnbtn}
                            onPress={() => {
                                setDatePickerVisibility(true)
                            }}
                        >
                            <View style={styles.timeTextContainer}>
                                <Icon name="calendar-month" size={20} color={!dateSelected || !eventItem ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue} />
                                <TText style={[styles.timeText, {color: !dateSelected || !eventItem ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue}]}>{dateSelected ? dayjs(formatedDate).format("MMMM DD").toString() : eventItem ? dayjs(eventItem.endTime).format("MMMM DD").toString() : "End Date"}</TText>
                            </View>
                            <Icon name="chevron-right" size={20} color={!radioBtn ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue} />
                        </TouchableOpacity>
                    </View>
                </View>
            }

            {
                !radioBtn &&
                <View style={styles.timeSelectionContainer}>
                    <View style={[styles.startTimeBtn, {borderRadius: 10, backgroundColor: radioBtn ? '#f1f1f1' : null, borderColor: radioBtn ? '#c2c2c2' : ThemeDefaults.themeDarkBlue}]}>
                        <TouchableOpacity style={styles.btnbtn}
                            disabled={radioBtn}
                            onPress={() => {
                                setStartTimePicker(true)
                            }}
                        >
                            <View style={styles.timeTextContainer}>
                                <Icon name="clock-outline" size={20} color={!startTimeSelected ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue} />
                                <TText style={[styles.timeText, {color: !startTimeSelected ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue}]}>{startTimeSelected ? dayjs(formatedStartTime).format("hh:mm A").toString() : "Start Time"}</TText>
                            </View>
                            <Icon name="chevron-right" size={20} color={!startTimeSelected ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.startTimeBtn, {borderRadius: 10, backgroundColor: radioBtn ? '#f1f1f1' : null, borderColor: radioBtn ? '#c2c2c2' : ThemeDefaults.themeDarkBlue}]}>
                        <TouchableOpacity style={styles.btnbtn}
                            disabled={radioBtn}
                            onPress={() => {
                                setEndTimePicker(true)
                            }}
                        >
                            <View style={styles.timeTextContainer}>
                                <Icon name="clock-outline" size={20} color={!endTimeSelected ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue} />
                                <TText style={[styles.timeText, {color: !endTimeSelected ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue}]}>{endTimeSelected ? dayjs(formatedEndTime).format("hh:mm A").toString() : "End Time"}</TText>
                            </View>
                            <Icon name="chevron-right" size={20} color={!endTimeSelected ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue} />
                        </TouchableOpacity>
                    </View>
                </View>
            }

            {
                !radioBtn &&
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        style={{}}
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? ThemeDefaults.themeOrange : undefined}
                    />
                    <TText style={styles.checkboxMessage}>Make the remaining time slots unavailable</TText>
                </View>
            }
        </View>

        {
            eventItem &&
            <View style={styles.deleteContainer}>
                <TouchableOpacity
                    style={styles.deleteEventBtn}
                    activeOpacity={0.5}
                    onPress={() => {
                        console.log("deleted")
                        setConfirmDeleteEventModal(true)
                        // handleRemoveCustomEvent()
                    }}
                >
                    <TText style={styles.deleteEventBtnText}>Delete Event</TText>
                </TouchableOpacity>
            </View>
        }

        <View style={styles.saveBtnContainer}>
            <TouchableOpacity style={[styles.saveBtn, {backgroundColor: (startTimeSelected && endTimeSelected && eventTitle) || (dateSelected && eventTitle) || eventItem ? ThemeDefaults.themeOrange : '#c2c2c2', elevation: (startTimeSelected && endTimeSelected && eventTitle) || (dateSelected && eventTitle) ? 4 : 0}]} activeOpacity={0.5}
                disabled={(!startTimeSelected && !endTimeSelected && !eventTitle) || (!dateSelected && !eventTitle) }
                onPress={() => {
                    handleAddEvent()
                }}
            >
                <TText style={styles.saveBtnTxt}>Save Event</TText>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default AddEventCalendar

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        backgroundColor: ThemeDefaults.themeWhite
    },
    screenHeader: {
        alignItems: 'center',
        marginTop: 15
    },
    screenHeaderTitle: {
        fontFamily: "LexendDeca_SemiBold",
        fontSize: 18,
        marginBottom: 15
    },
    screenHeaderSubTitle: {
        paddingHorizontal: 50,
        textAlign: 'center'
    },
    formContainer: {
        paddingHorizontal: 40,
        marginTop: 50
    },
    textInputContainer: {
        borderWidth: 1.3,
        borderColor: ThemeDefaults.themeDarkBlue,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'

    },
    textInputStyle: {
        flexGrow: 1,
        marginLeft: 10,
        fontFamily: "LexendDeca",
        fontSize: 16,
    },
    radioBtnContainer: {
        paddingHorizontal: 50,
        marginTop: 8
    },
    radioBtn: {
        marginLeft: 0,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    timeSelectionContainer: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    startTimeBtn: {
        flex: 0.48,
        // width: '48%',
        borderWidth: 1.3,
        borderColor: ThemeDefaults.themeDarkBlue,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 10,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    btnbtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    timeTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        marginLeft: 8
    },
    checkboxContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxMessage: {
        marginLeft: 15
    },
    saveBtnContainer: {
        position: 'absolute',
        bottom: 50,
        left: 40,
        right: 40
    },
    saveBtn: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: ThemeDefaults.themeOrange,
        borderRadius: 15,
        elevation: 4
    },
    saveBtnTxt: {
        fontFamily: "LexendDeca_SemiBold",
        fontSize: 18,
        color: ThemeDefaults.themeWhite
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
        borderColor: ThemeDefaults.appIcon,
        borderRadius: 15,
        overflow: 'hidden',
    },
    dialogueMessage: {
        paddingVertical: 40,
        paddingHorizontal: 50,
        backgroundColor: ThemeDefaults.themeOrange,
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
        fontFamily: 'LexendDeca_Medium'
    },
    dialogueConfirm: {
        color: ThemeDefaults.themeDarkerOrange,
        fontFamily: 'LexendDeca_Medium',
    },
    deleteContainer: {
        marginTop: 40,
        paddingHorizontal: 40
    },
    deleteEventBtn: {
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: ThemeDefaults.themeWhite,
        borderWidth: 1.5,
        borderColor: "#d7d7d7",
        borderRadius: 15,
        elevation: 2
    },
    deleteEventBtnText: {
        fontFamily: 'LexendDeca_Medium',
        fontSize: 16,
        color: ThemeDefaults.themeDarkBlue,
    },
})