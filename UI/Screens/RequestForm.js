import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, TextInput, StatusBar, Image, Modal, ScrollView, Dimensions  } from 'react-native'
import React, {useState, useEffect} from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import Appbar from '../Components/Appbar';
import ThemeDefaults from '../Components/ThemeDefaults';

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { IPAddress } from '../global/global';
import { ModalPicker } from '../Components/ModalPicker';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';

const HEIGTH = Dimensions.get('window').height

const RequestForm = ({route, navigation}) => {

    const screenFocused = useIsFocused()

    const {workerID, workerInformation, selectedJob, minPrice, maxPrice, showMultiWorks} = route.params;
    console.log(workerInformation)

    const [loadedWorkerInfo, setLoadedWorkerInfo] = useState({})
    const [hasLoadedWorkerInfo, setHasLoadedWorkerInfo] = useState(showMultiWorks)
    const [workListModalOpened, setWorkListModalOpened] = useState(false)

    const [workSelected, setWorkSelected] = useState("")
    
    const [datePickerVisible, setDatePickerVisibility] = useState(false)
    const [timePickerVisible, setTimePickerVisibility] = useState(false)

    const [formatedDate, setFormatedDate] = useState(new Date())
    const [displayDate, setDisplayDate] = useState(new Date())

    const [dateSelected, setDateSelected] = useState(false)
    const [formatedTime, setFormatedTime] = useState(new Date())

    const [displayTime, setDisplayTime] = useState(new Date())
    const [timeSelected, setTimeSelected] = useState(false)

    const [serviceSelected, setServiceSelected] = useState(false)

    const [requestDescription, setRequestDescription] = useState("")

    useEffect(() => {
        setLoadedWorkerInfo({...workerInformation})
        
        setDateSelected(false)
        setTimeSelected(false)
        setServiceSelected(false)
        
        setFormatedDate(new Date())
        setFormatedTime(new Date())
        setDisplayDate(new Date())
        setDisplayTime(new Date())
        
        if(selectedJob){
            setServiceSelected(true)
        }

        return () => {
            setLoadedWorkerInfo({...workerInformation})
            if(workSelected) setWorkSelected("")
            
        }
    }, [screenFocused])
    
    useEffect(() => {
        setLoadedWorkerInfo({...workerInformation})
        // if(workSelected) setWorkSelected({})

        console.log("workerInformation: ", workerInformation)
    }, [showMultiWorks])

    const handleDateConfirm = (date) => {
        let dateString = dayjs(date).format("YYYY-MM-DD").toString()
        setFormatedDate(...dateString);

        setDisplayDate(dayjs(date).format("MMM D, YYYY"));
        setDatePickerVisibility(false);
        setDateSelected(true)

        // setUser((prev) => ({...prev, birthday: dateString}))

        // haveBlanks()
        console.log(dateString)
    }

    const handleTimeConfirm = (time) => {
        let timeString = dayjs(time).format("hh:mm A")
        setDisplayTime(timeString.toString())

        setFormatedTime(timeString)
        setTimePickerVisibility(false)
        setTimeSelected(true)

        console.log(displayTime)

    }

    const changeWorkListModalVisibility = (bool) => {
        setWorkListModalOpened(bool)
    }

  return (
        <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: ThemeDefaults.themeWhite, paddingTop: StatusBar.currentHeight, paddingBottom: 50}}>
            <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

            {/* Date Picker */}
            {/* May use a different screen instead to control the selection of dates based from the workers availability */}
            <DateTimePickerModal
                isVisible={datePickerVisible}
                mode="date"
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
                    <View style={styles.formAddressBar}>
                        <View style={styles.formAddTxtContainer}>
                            <Icon name='map' size={22} color={ThemeDefaults.themeLighterBlue} />
                            <View style={styles.formAddTxt}>
                                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.addressInfo}>{global.userData.street}, Purok {global.userData.purok}, {global.userData.barangay}, {global.userData.city}, {global.userData.province}</Text>
                                <TText style={styles.addressSubTitle}>Default Home Address</TText>
                            </View>
                        </View>
                        <Icon name='map-marker' size={22} />
                    </View>

                    {/* Select Date */}
                    <TouchableOpacity style={styles.formAddressBar}
                        onPress={() => setDatePickerVisibility(true)}
                    >
                        <View style={styles.formAddTxtContainer}>
                            <Icon name='calendar-month' size={22} />
                            <View style={styles.formAddTxt}>
                                <TText style={styles.addressInfo}>{dateSelected ? displayDate : "Date"}</TText>
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
                                    <TText style={styles.timeTxt}>{ timeSelected ? displayTime : "Time"}</TText>
                                </View>
                            </View>
                            <Icon name='chevron-down' size={22} />
                        </TouchableOpacity>
                        {/* <View style={styles.checkScheduleContainer}>
                            <TouchableOpacity style={styles.checkScheduleBtn}>
                                <TText style={styles.checkSchedTxt}>Check Schedule</TText>
                            </TouchableOpacity>
                        </View> */}
                    </View>

                    {/* Selected Service */}
                    <TouchableOpacity disabled={!showMultiWorks} style={styles.formAddressBar}
                        onPress={() => setWorkListModalOpened(true)}
                    >
                        <View style={styles.formAddTxtContainer}>
                            <Icon name='briefcase' size={22} />
                            <View style={styles.formAddTxt}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.workSubCategory}>{workSelected ? workSelected.ServiceSubId.ServiceSubCategory : selectedJob ? selectedJob : "Select the service you need.."}</Text>
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
                                    setData={(wl) => setWorkSelected({...wl})}
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
                        style={styles.requestDescriptionTextInput}
                        placeholder='Additional service request description'
                        value={requestDescription && requestDescription}
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
                            <Image source={ loadedWorkerInfo.profilePic === 'pic' ? require("../assets/images/default-profile.png") : {uri: `http://${IPAddress}:3000/images/${loadedWorkerInfo.profilePic}`}} style={styles.imageStyle} />
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
                    style={[styles.submitBtn, {backgroundColor: !dateSelected || !timeSelected || !serviceSelected ? ThemeDefaults.themeOrange : 'gray'}]}
                    disabled={!dateSelected || !timeSelected || !serviceSelected}
                >
                    <TText style={styles.submitBtnTxt}>Submit Request</TText>
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

        borderWidth: 1.8,
        borderColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,

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
        fontFamily: 'LexendDeca_Medium',
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
        position: 'absolute',
        bottom: 50,
        left: 40,
        right: 40,

        // paddingHorizontal: 40,
        // marginTop: 50,
        // marginBottom: 40
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
        alignItems: 'center',

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
})