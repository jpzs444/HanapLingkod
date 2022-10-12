import { StyleSheet, Text, Modal, View, TouchableOpacity, ScrollView, StatusBar, Button, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';

import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import ThemeDefaults from '../Components/ThemeDefaults';
import { RollInRight } from 'react-native-reanimated';

const dayWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WIDTH = Dimensions.get('window').width
const HEIGTH = Dimensions.get('window').height

const CalendarView = () => {

    const [modalVisible, setModalVisible] = useState(false)
    const [dateItem, setDateItem] = useState({})

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

    const renderItem = (item) => {
        return(
            <TouchableOpacity style={{height: 50 + 30 * item.estimatedTime, borderRadius: 15, backgroundColor: '#fff', elevation: 3, marginBottom: 15, marginRight: 20, padding: 15}}>
                <TText>{item.time}</TText>
                <TText>Booked: {item.service}</TText>
            </TouchableOpacity>
        )
    }

    const renderEmpty = () => {
        return(
            <View style={{height: 30, flex: 1}}>
                <TText>Open</TText>
            </View>
        )
    }

    {/* <Agenda
        items={{
            '2022-10-22': [{name: 'Time already booked', time: '09:00 AM', height: 140}],
            '2022-10-23': [{name: 'Deep Cleaning', time: '09:00 AM', height: 80}],
            '2022-10-24': [{name: 'Going back to the corner, where I first saw you', time: '09:00 AM', height: 140}],
            '2022-10-25': [{name: 'worker unavailable', time: '09:00 AM', height: 80}, {name: 'any js object', time: '10:00 AM', height: 140}]
        }}
        minDate={dateToday}
        pastScrollRange={0}
        futureScrollRange={12}
        showClosingKnob={true}
        onDayPress={day => {
            console.log(day)
            return(
                <View>
                    <TText>Hello</TText>
                </View>
            )
        }}
        renderEmptyDate={() => {
            return(
                <View style={{flex: 1}}>
                    <TText>No Data Available</TText>
                </View>
            )
        }}
        renderItem={item => {
            // console.log(item.length > 0)
            return(
                item.length > 0 ? 
                    (
                        item.map(function(agenda, index){
                            <View key={index} style={{marginTop: 10, marginBottom: 5, marginRight: 20, padding: 15, borderRadius: 10, backgroundColor: 'white', elevation: 3, height: agenda.height}}>
                                <TText>{agenda.time}</TText>
                                <TText>{agenda.name}</TText>
                            </View>
                        })
                    )
                    : 
                    <View style={{marginTop: 20, marginRight: 20, marginBottom: 5, padding: 15, borderRadius: 10, backgroundColor: 'white', elevation: 3, height: item.height}}>
                        <TText>{item.time}</TText>
                        <TText>{item.name}</TText>
                    </View>
            )
        }}
        theme={{
            selectedDayBackgroundColor: ThemeDefaults.themeOrange,
            indicatorColor: ThemeDefaults.themeOrange,
            todayTextColor: ThemeDefaults.themeOrange,
            dotColor: ThemeDefaults.themeOrange,
            textDayFontFamily: 'LexendDeca',
            textMonthFontFamily: 'LexendDeca_Medium',
            textMonthFontSize: 18,
            agendaKnobColor: ThemeDefaults.themeDarkBlue,
            backgroundColor: 'pink',
            timelineContainer: {
                backgroundColor: 'pink',

            },
            customStyles: {
                container: {
                    backgroundColor: 'pink'
                }
            }

            // textDayHeaderFontFamily: 'monospace',
        }}
        style={{flexGrow: 1, marginBottom: 8}}
    /> */}

  return (
    <View style={{flexGrow: 1, marginTop: StatusBar.currentHeight, backgroundColor: 'white'}}>
        <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

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
                return(
                    <View style={{backgroundColor: 'rgba(255,255,255,0.6)', height: 500, width: '100%'}}>

                    </View>
                )
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
                <TText style={styles.legendTxt}>{global.userData.role === "recruiter" ? "Date Selected" : "Date with Appointments"}</TText>
            </View>
            <View style={styles.legendItem}>
                <View style={{backgroundColor: ThemeDefaults.themeLighterBlue, width: 25, height: 25, borderRadius: 8}} />
                <TText style={styles.legendTxt}>Date Unavailable</TText>
            </View>
        </View>

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
})