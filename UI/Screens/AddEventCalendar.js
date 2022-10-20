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

    const {selectedDate} = route.params

    const navigation = useNavigation()

    const radioOptions = [
        {label: 'Time'},
        {label: 'All Day'},
    ]

    const [radioBtn, setRadioBtn] = useState(null)
    const [isChecked, setChecked] = useState(false);

    const [startTimePicker, setStartTimePicker] = useState(false)
    const [endTimePicker, setEndTimePicker] = useState(false)
    const [scheduleConflicting, setScheduleConflicting] = useState(false)

    const [formatedStartTime, setFormatedStartTime] = useState(new Date())
    const [formatedEndTime, setFormatedEndTime] = useState(new Date())
    const [startTimeSelected, setStartTimeSelected] = useState(false)
    const [endTimeSelected, setEndTimeSelected] = useState(false)
    
    const [endTimeLesser, setEndTimeLesser] = useState(false)

    const [eventTitle, setEventTitle] = useState("")

    const [hasCreatedAnEvent, setHasCreatedAnEvent] = useState(false)


    const handleTimeConfirm = (time) => {
        let timeString = dayjs(time).format("YYYY-MM-DD hh:mm:ss")
        let timetime = dayjs(time).format("HH:mm")

        if(startTimePicker){
            setFormatedStartTime(timetime)
            setStartTimePicker(false)
            setStartTimeSelected(true)
        } else if(endTimePicker){
            if(time < formatedStartTime){
                console.log("end time lesser")
                setEndTimeLesser(true)
            }
            setFormatedEndTime(timetime)
            setEndTimePicker(false)
            setEndTimeSelected(true)
        }
    }

    const handleAddEvent = () => {
        console.log("add event")
        fetch(`https://hanaplingkod.onrender.com/add-schedule/${global.userData._id}`, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                inputDate: selectedDate,
                title: eventTitle ? eventTitle : '',
                startTime: formatedStartTime,
                endTime: formatedEndTime,
                wholeDay: radioBtn.toString()
            })
        }).then(res => {
            console.log("Successfull adding an event")
            setHasCreatedAnEvent(true)
        }).catch(err => console.log("error add event: ", err.message))
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
                        <TText style={[styles.dialogueMessageText]}>End Time should be set on a later time than the Start Time. Please try again</TText>
                    </View>
                    {/* Modal Buttons */}
                    <View style={styles.modalDialogueBtnCont}>
                        <TouchableOpacity
                            style={[styles.dialogueBtn]}
                            onPress={() => {
                                setEndTimeLesser(false)
                                setEndTimePicker(true)
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
                        <TText style={[styles.dialogueMessageText]}>You have successfully added a custom event!</TText>
                    </View>
                    {/* Modal Buttons */}
                    <View style={styles.modalDialogueBtnCont}>
                        <TouchableOpacity
                            style={[styles.dialogueBtn]}
                            onPress={() => {
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
                    initial={1}
                    activeColor={ThemeDefaults.themeOrange}
                    selectedBtn={(e) => {
                        console.log(e.label)
                        if(e.label === "Time"){
                            setRadioBtn(false)
                        } else if(e.label === "All Day") {
                            setRadioBtn(true)
                        } else {
                            setRadioBtn(null)
                        }
                    }}
                    textStyle={{marginLeft: 10}}
                    style={styles.radioBtn}
                />
            </View>

            <View style={styles.timeSelectionContainer}>
                <View style={[styles.startTimeBtn, {borderRadius: 10, backgroundColor: radioBtn ? '#f1f1f1' : null, borderColor: radioBtn ? '#c2c2c2' : ThemeDefaults.themeDarkBlue}]}>
                    <TouchableOpacity style={styles.btnbtn}
                        disabled={radioBtn}
                        onPress={() => {
                            setStartTimePicker(true)
                        }}
                    >
                        <View style={styles.timeTextContainer}>
                            <Icon name="clock-outline" size={20} color={!radioBtn ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue} />
                            <TText style={[styles.timeText, {color:!radioBtn ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue}]}>{startTimeSelected ? dayjs(formatedStartTime).format("hh:mm A").toString() : "Start Time"}</TText>
                        </View>
                        <Icon name="chevron-right" size={20} color={!radioBtn ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue} />
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
                            <Icon name="clock-outline" size={20} color={!radioBtn ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue} />
                            <TText style={[styles.timeText, {color:!radioBtn ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue}]}>{endTimeSelected ? dayjs(formatedEndTime).format("hh:mm A").toString() : "End Time"}</TText>
                        </View>
                        <Icon name="chevron-right" size={20} color={!radioBtn ? 'rgba(0,0,0,0.4)' : ThemeDefaults.themeDarkBlue} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.checkboxContainer}>
                <Checkbox
                    style={{}}
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? ThemeDefaults.themeOrange : undefined}
                />
                <TText style={styles.checkboxMessage}>Make the remaining time slots unavailable</TText>
            </View>
        </View>

        <View style={styles.saveBtnContainer}>
            <TouchableOpacity style={[styles.saveBtn, {backgroundColor: !startTimeSelected || !endTimeSelected || radioBtn === null ? '#c2c2c2' : ThemeDefaults.themeOrange}]} activeOpacity={0.5}
                disabled={!startTimeSelected || !endTimeSelected || radioBtn === null }
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
})