import { StyleSheet, Text, View, TouchableOpacity, Modal, StatusBar } from 'react-native'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeDefaults from '../Components/ThemeDefaults';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import React, {useState, useEffect} from 'react'
import dayjs from 'dayjs'

const Schedule = ({route}) => {

    const {dateSelected} = route.params

    const [formatedTime, setFormatedTime] = useState(new Date())

    const [displayTime, setDisplayTime] = useState(new Date())
    const [timeSelected, setTimeSelected] = useState(false)
    const [timePickerVisible, setTimePickerVisibility] = useState(false)


    const handleTimeConfirm = (time) => {
        let timeString = dayjs(time).format("hh:mm A")
        setDisplayTime(timeString.toString())
        
        setFormatedTime(time)
        setTimePickerVisibility(false)
        setTimeSelected(true)

        console.log(formatedTime)

    }

    const ScreenHeaderComponent = () => {
        return(
            <View>
                <Appbar onlyBackBtn={true} reqForm={true} showLogo={true} hasPicture={true} />

                <View style={styles.headerContainer}>
                    <TText style={styles.headerTitle}>Worker's Schedule</TText>
                    <TText style={styles.headerSubTitle}>Shown below are the worker's appointments scheduled on <TText style={styles.headerSubTitleDate}>{dateSelected}</TText></TText>
                </View>

                <View style={styles.timeBtnContainer}>
                    {/* Time Picker */}
                    <View>
                        <TText>Choose Time</TText>
                    </View>

                    <TouchableOpacity 
                        style={styles.timePickerBtn}
                        onPress={() => setTimePickerVisibility(true)}
                    >
                        <View style={styles.timeTextContainer}>
                            <Icon name="clock-outline" size={20} />
                            <TText style={styles.timePickerText}>{timeSelected ? displayTime.toString() : "Time"}</TText>
                        </View>
                        <Icon name="chevron-right" size={20} />
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={timePickerVisible}
                        mode="time"
                        onConfirm={handleTimeConfirm}
                        onCancel={() => setTimePickerVisibility(false)}
                    />
                </View>

            </View>
        )
    }


  return (
    <View style={styles.mainContainer}>
        <ScreenHeaderComponent />

        

        <View style={styles.scheduleList}>
            <View style={styles.schedCard}>
                <TText style={styles.schedTitle}>Booked: Carpet Cleaning</TText>
                <TText style={styles.schedTime}>08:00 AM - 09:00 AM</TText>
            </View>
            <View style={[styles.schedCard, {paddingBottom: 20 * 3}]}>
                <TText style={styles.schedTitle}>Booked: Carpet Cleaning</TText>
                <TText style={styles.schedTime}>08:00 AM - 09:00 AM</TText>
            </View>
        </View>

        

        <View style={styles.confirmBtnContainer}>
            <TouchableOpacity style={styles.confirmBtn}>
                <TText style={styles.confirmBtnText}>Confirm Time</TText>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default Schedule

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: ThemeDefaults.themeWhite,
        marginTop: StatusBar.currentHeight
    },
    headerContainer: {
        alignItems: 'center'
    },
    headerTitle: {
        fontFamily: 'LexendDeca_Medium',
        fontSize: 18,
        marginBottom: 10,
    },
    headerSubTitle: {
        textAlign: 'center',
        paddingHorizontal: 50,
    },
    headerSubTitleDate: {
        fontFamily: 'LexendDeca_Medium'
    },
    timeBtnContainer: {
        paddingHorizontal: 60,
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
        paddingHorizontal: 60,
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
        width: '100%',
        paddingHorizontal: 50,
        position: 'absolute',
        bottom: 60,
        // left: 50,
        // righ: 50,
        // backgroundColor: 'pink'
    },
    confirmBtn: {
        width: '100%',
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
})