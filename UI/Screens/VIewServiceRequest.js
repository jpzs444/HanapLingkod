import { StyleSheet, Text, View, ScrollView, SafeAreaView, Image, ActivityIndicator, TouchableOpacity, Dimensions, StatusBar, Modal, TextInput } from 'react-native'
import Appbar from '../Components/Appbar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import React, {useState, useEffect} from 'react'
import ThemeDefaults from '../Components/ThemeDefaults';
import { IPAddress } from '../global/global';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import RadioButtonRN from 'radio-buttons-react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import SameDateBookings from '../Components/SameDateBookings';
import CreateConversation from '../Components/CreateConversation';

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Asia/Manila")

const declinedMessageSuggestions = ["I'm unavailable", "I've already accepted another service just now, sorry", "Sorry, it doesn't fit my schedule", "I have to attend something urgent, sorry"]

const VIewServiceRequest = ({route}) => {

    const navigation = useNavigation()

    const radioOptions1 = [
        {label: 'Yes'},
        {label: 'No'},
    ]
    const radioOptions2 = [
        {label: 'No'},
    ]

    const {requestItem, serviceRequestID} = route.params

    const [radioBtn, setRadioBtn] = useState(null)

    const [viewCancelModal, setViewCancelModal] = useState(false)
    const [viewReplaceRequestModal, setReplaceRequestModal] = useState(false)
    const [viewDeclineRequestModal, setDeclineRequestModal] = useState(false)
    const [viewAcceptRequestModal, setAcceptRequestModal] = useState(false)
    const [hasCancelledRequest, setHasCancelledRequest] = useState(false)
    const [hasDeclinedRequest, setHasDeclinedRequest] = useState(false)
    const [hasAcceptedRequest, setHasAcceptedRequest] = useState(false)
    const [viewDeclineInput, setViewDeclineInput] = useState(false)
    const [hasSentMessage, setHasSentMessage] = useState(false)
    const [didCancelRequest, setDidCancelRequest] = useState(false)
    const [viewScheduleErrorModal, setViewScheduleErrorModal] = useState(false)

    const [declinationMessage, setDeclinationMessage] = useState("")
    const [datePickerVisible, setDatePickerVisibility] = useState(false)
    const [scheduleConflicting, setScheduleConflicting] = useState(false)
    const [formatedDate, setFormatedDate] = useState(new Date())
    const [displayDate, setDisplayDate] = useState("")
    const [dateSelected, setDateSelected] = useState(false)

    const [sameDateBookings, setSameDateBooking] = useState([])

    const [pastOneHour, setPastOneHour] = useState(false)
    const [similarWorks, setSimilarWorks] = useState([])
    const [messageFromWorker, setMessageFromWorker] = useState('')

    const [loading, setLoading] = useState(false)

    const [conversation, setConversation] = useState({})

    // resets all inputs on load
    useEffect(() => {
        setLoading(true)
        if(global.userData.role === "worker"){
            getSameDateBookings()
        } else {
            console.log(requestItem)
            let postcreated = dayjs(requestItem.created_at)
            let dateNow = dayjs(new Date())
            let pastAnHour = dateNow.diff(postcreated, 'hour') > 1
            console.log(pastAnHour)

            if(pastAnHour){
                getServiceRequest()
                getSimilarWorks()
                setPastOneHour(pastAnHour)
            }

            setDateSelected(false)
            setDisplayDate("")
            setFormatedDate(new Date())

            setRadioBtn(null)
        }
        
        setLoading(false)

        return () => {
            setPastOneHour(false)
            setDateSelected(false)
            setSimilarWorks([])
            setDisplayDate("")
            setFormatedDate(new Date())
            setDidCancelRequest(false)
            setHasCancelledRequest(false)
            setHasDeclinedRequest(false)
            setHasSentMessage(true)

            setRadioBtn(-1)
        }
    }, [route])




    const getSimilarWorks = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/Work/${requestItem.subCategory}`,{
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                }
            }).then((res) => res.json())
            .then((data) => {
                
                let list = [...data]
                list = list.filter(e => e.workerId._id !== requestItem.workerId._id && !e.deleteflag)
                
                setSimilarWorks([...list])
                console.log("similar works: ", list)
            })

        } catch (error) {
            
        }
    }

    const getServiceRequest = () => {
        fetch(`https://hanaplingkod.onrender.com/service-request/${global.userData._id}`, {
            method: "GET",
            headers: {
                "content-type": 'application/json',
                "Authorization": global.accessToken
            }
        }).then(res => res.json())
        .then(data => {
            console.log("fetching request service: ", data)
            let item = data.recruiter.find(e => e._id === requestItem._id)
            console.log("returned item: ", item)
        }).catch(err => console.log("error fetch sr: ",err.msg))
    }



    const getSameDateBookings = () => {
        fetch(`https://hanaplingkod.onrender.com/service-request/${global.userData._id}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.accessToken
            },
        }).then((res) => res.json())
        .then((data) => {
            let list = data.worker.filter(e => e.serviceDate === requestItem.serviceDate && e.requestStatus == '2')
            setSameDateBooking([...list])

            console.log("list same date accepted bookings", list)
        }).catch((err) => console.log("get same dates error", err.message))
    }

    const cancelRequest = (requestID) => {
        fetch(`https://hanaplingkod.onrender.com/service-request/${global.userData._id}/${requestID}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.accessToken
            },
            body: JSON.stringify({
                requestStatus: 4
            })
        }).then((res) => {
            console.log("Success - Cancelled Request Complete")
            setViewCancelModal(false)
            setHasCancelledRequest(true)

            // navigation.navigate("RequestsScreen")
        })
        .catch((err) => console.log("Error cancelling request: ", err))
    }

    const handleDeclineRequest = (requestID) => {
        console.log("Decline function")
        fetch(`https://hanaplingkod.onrender.com/service-request/${global.userData._id}/${requestID}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.accessToken
            },
            body: JSON.stringify({
                requestStatus: 3,
                acceptMore: radioBtn.toString()
            })
        }).then((res) => {
            console.log("Success - Cancelled Request Complete: ")
            setHasDeclinedRequest(true)
            setDeclineRequestModal(false)

            // setHasAcceptedRequest(true)

        }).catch((err) => console.log("Error cancelling request: ", err))
    }

    const handleAcceptRequest = (requestID) => {
        fetch(`https://hanaplingkod.onrender.com/service-request/${global.userData._id}/${requestID}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.accessToken
            },
            body: JSON.stringify({
                requestStatus: 2,
                endDate: formatedDate,
                endTime: formatedDate,
                acceptMore: radioBtn.toString()
            })
        }).then(res => res.json())
        .then((res) => {
            console.log("res obj: ")

            if(res.success){
                console.log("Success - Accepted Request Complete")
                setAcceptRequestModal(false)
                setScheduleConflicting(true)
    
                global.userData.role === "worker" ?
                setHasAcceptedRequest(true)
                :
                null
            } else {
                // display warning alert for schedule conflict
                setViewScheduleErrorModal(true)
            }
        }).catch((err) => console.log("Error cancelling request: ", err))
    }

    const handleDateConfirm = (date) => {
        let dd_js = dayjs(date)
        console.log("accept date: ", dd_js)
        setFormatedDate(dd_js);

        setDisplayDate(dayjs(dd_js).format("MMM D, hh:mm A").toString());
        setDatePickerVisibility(false);
        setDateSelected(true)
    }

    const handleSendReasonDeclination = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/service-request-comment/${serviceRequestID}`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
                body: JSON.stringify({
                    comment: declinationMessage
                })
            })
            console.log("Sucess sending message to recruiter | decline reason")
        } catch (error) {
            console.log("Error sending decline message: ", error.message)
        }
    }

    const handleScheduleChecker = () => {
        fetch(`https://hanaplingkod.onrender.com/service-request/${global.userData._id}/`)
    }

    const ViewActivityIndicator = () => {
        return(
            <ActivityIndicator 
                size={40}
                style={{width: '100%', height: 150}}
            />
        )
    }

    const handleCreateConversation = async () => {
        // create a conversation

        try {
            await fetch(`https://hanaplingkod.onrender.com/conversations`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
                body: JSON.stringify({
                    senderId: global.userData._id,
                    receiverId: global.userData.role === 'recruiter' ? requestItem.workerId._id : requestItem.recruiterId._id
                })
            }).then(res => res.json())
            .then(data => {
                console.log("conversation data: ", data[0])
                navigation.navigate("ConversationThreadDrawer", {
                    "otherUser": global.userData.role === 'recruiter' ? requestItem.workerId : requestItem.recruiterId, 
                    "conversation": data[0]
                })
                setConversation({...data[0]})
            })
        } catch (error) {
            console.log("Error creating new convo: ", error)
        }
    }


  return (
    <SafeAreaView style={styles.outermostContainer}>
    {/* <TText>HI</TText> */}
        <ScrollView contentContainerStyle={styles.mainScrollContainer}>
            <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

            <DateTimePickerModal
                isVisible={datePickerVisible}
                mode="datetime"
                date={new Date(requestItem.serviceDate)}
                minimumDate={new Date()}
                onConfirm={handleDateConfirm}
                onCancel={() => setDatePickerVisibility(false)}
            />

            {/* Modal for cancelling the current request */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={viewCancelModal}
                onRequestClose={() => setViewCancelModal(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText]}>Are you sure you want to cancel the service request? </TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    cancelRequest(requestItem._id)
                                    setViewCancelModal(false)
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Yes</TText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setViewCancelModal(false)
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for replacing a service request */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={viewReplaceRequestModal}
                onRequestClose={() => setReplaceRequestModal(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText, {marginBottom: 20}]}>Are you sure you want to send a new service request?</TText>
                            <TText style={[styles.dialogueMessageText]}>This will cancel your current pending request.</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    setReplaceRequestModal(false)
                                    navigation.navigate("RequestFormDrawer", {workerID: requestItem.workerId._id, workID: requestItem.serviceRequestID, workerInformation: requestItem.workerId, selectedJob: requestItem.subCategory, minPrice: requestItem.minPrice, maxPrice: requestItem.maxPrice, showMultiWorks: false})
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Yes</TText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setReplaceRequestModal(false)
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Confirm Decline request | Worker */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={viewDeclineRequestModal}
                onRequestClose={() => setDeclineRequestModal(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText]}>Are you sure you want to <TText style={{color: ThemeDefaults.themeOrange}}>decline</TText> this service request?</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    handleDeclineRequest(requestItem._id)
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Yes</TText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setDeclineRequestModal(false)
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Confirm Accept request | Worker */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={viewAcceptRequestModal}
                onRequestClose={() => setAcceptRequestModal(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText]}>Are you sure you want to <TText style={{color: ThemeDefaults.themeOrange}}>accept</TText> this service request?</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    setAcceptRequestModal(false)
                                    // handleScheduleChecker()
                                    handleAcceptRequest(requestItem._id)
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Yes</TText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setAcceptRequestModal(false)
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for successfull cancelation of request */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={hasCancelledRequest}
                onRequestClose={() => setHasCancelledRequest(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText, {marginBottom: 20}]}>We have Successfully cancelled your request</TText>
                            <TText style={[styles.dialogueMessageText]}>We hope to find the service you need!</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    setHasCancelledRequest(false)
                                    setDidCancelRequest(true)
                                    // navigation.navigate("RequestsScreen")
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Okay</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for accepting a service request */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={hasAcceptedRequest}
                onRequestClose={() => setHasAcceptedRequest(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText, {marginBottom: 20}]}>You have successfully accepted a service request and made a new booking.</TText>
                            <TText style={[styles.dialogueMessageText]}>You make check it by tapping the Bookings icon on the homepage.</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    setHasCancelledRequest(false)
                                    navigation.navigate("RequestsScreen")
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Okay</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for successfull declination of request | Worker */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={hasDeclinedRequest}
                onRequestClose={() => setHasDeclinedRequest(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText,]}>You have successfully declined the service request</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    setHasDeclinedRequest(false)
                                    setViewDeclineInput(true)
                                    // navigation.navigate("RequestsScreen")
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Okay</TText>
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
                            <TText style={[styles.dialogueMessageText, {marginBottom: 15}]}>The time you picked conflicts with othered scheduled requests. Check the schedule of your booked services and try again.</TText>
                            <TText style={[styles.dialogueMessageText]}>You may Decline the request and leave a message to the Recruiter of why you declined their request</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    // fetch post request
                                    // navigation.navigate("HomeScreen")

                                    setViewScheduleErrorModal(false)
                                    // setDatePickerVisibility(true)
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

            <View style={styles.headerContainer}>
                <TText style={styles.headerTitle}>Request Information</TText>
            </View>

            {/* Card | Request Information */}
            <View style={styles.requestCard}>
                <View style={styles.cardTopRow}>
                    {
                        global.userData.role === 'recruiter' ? 
                            <Image source={requestItem.workerId.profilePic === 'pic' ? require('../assets/images/default-profile.png') : {uri: requestItem.workerId.profilePic }} style={styles.cardimageStyle} />
                            :
                            <Image source={requestItem.recruiterId.profilePic === 'pic' ? require('../assets/images/default-profile.png') : {uri: requestItem.recruiterId.profilePic }} style={styles.cardimageStyle} />

                    }
                    <View style={styles.rightSection}>
                        <View style={styles.nameRatingContainer}>
                            <View style={styles.workerNameContainer}>
                                {
                                    global.userData.role === 'recruiter' ?
                                        <>
                                            <Text style={styles.carUserNameTxt}>{requestItem.workerId.firstname} {requestItem.workerId.lastname}</Text>
                                            <View style={styles.ratingContainer}>
                                                <Icon name='star' size={18} color={"gold"} />
                                                <TText style={styles.ratingText}>{requestItem.workerId.rating}</TText>
                                            </View>
                                        </>
                                        :
                                        <>
                                            <Text style={styles.carUserNameTxt}>{requestItem.recruiterId.firstname} {requestItem.recruiterId.lastname}</Text>
                                            <View style={styles.ratingContainer}>
                                                <Icon name='star' size={18} color={"gold"} />
                                                <TText style={styles.ratingText}>{requestItem.recruiterId.rating}</TText>
                                                
                                            </View>
                                        </>
                                }
                            </View>
                        </View>
                        <View style={styles.subCatContainer}>
                            <TText style={styles.subCatText}>{requestItem.subCategory}</TText>
                        </View>


                    {/* Chat / Message user button */}
                    </View>

                </View>
                
                <TouchableOpacity 
                    style={{
                        backgroundColor: ThemeDefaults.themeOrange, 
                        borderRadius: 20, 
                        padding: 8, 
                        elevation: 4, 
                        position: 'absolute', 
                        top: 38, 
                        right: 25, 
                        zIndex: 10,
                        elevation: 4
                    }}
                    activeOpacity={0.5}
                    onPress={() => {
                        console.log("HI")

                        //create a conversation
                        handleCreateConversation()
                    }}
                >
                    <Image source={require('../assets/icons/chat-bubble.png')} style={{width: 25, height: 25,}} />
                </TouchableOpacity>

                {
                    requestItem.description !== "" ?
                    <View style={styles.requestDescriptionCont}>
                        <TText style={styles.requestDescriptionText}>{requestItem.description}</TText>
                    </View>
                    : null
                }

                <View style={styles.cardBottom}>
                    <View style={styles.addressCont}>
                        <View style={styles.rowTitle}>
                            <TText style={styles.addressTitleText}>Service Address</TText>
                        </View>
                        <View style={styles.addressValueCont}>
                            <Icon name="map-marker" size={18} color={ThemeDefaults.themeLighterBlue} />
                            <Text numberOfLines={2} style={styles.addressValueText}>{requestItem.address}</Text>
                        </View>
                    </View>
                    <View style={styles.dateTimeStatusContainer}>
                        <View style={styles.dateTimeTitle}>
                            <TText style={styles.dateTimeTitleText}>Date and Time</TText>
                        </View>
                        <View style={styles.dtsContainer}>
                            <View style={styles.dateTextContainer}>
                                <Icon name="calendar-month" size={18} color={ThemeDefaults.themeLighterBlue} />
                                <TText style={styles.dateText}>{dayjs(requestItem.serviceDate).format("MMM DD")}</TText>
                            </View>
                            <View style={styles.timeTextContainer}>
                                <Icon name="clock-outline" size={18} color={ThemeDefaults.themeLighterBlue} />
                                <TText style={styles.timeText}>{dayjs(requestItem.startTime).format("hh:mm A")}</TText>
                            </View>
                                    <View style={ didCancelRequest ? styles.cancelledCont : requestItem.requestStatus == '1' ? styles.pendingCont : requestItem.requestStatus == '3' || (requestItem.requestStatus == '1' && hasDeclinedRequest) ? styles.declinedServiceCont : styles.cancelledCont}>
                                        <TText style={{color: requestItem.requestStatus == '4' || requestItem.requestStatus == '3' || hasDeclinedRequest || didCancelRequest ? ThemeDefaults.themeWhite : 'black'}}>{didCancelRequest ? "Cancelled" : requestItem.requestStatus == '1' ? "Pending" : requestItem.requestStatus == '3' || hasDeclinedRequest ? "Declined" : "Cancelled"}</TText>
                                    </View>
                            
                        </View>
                    </View>
                    
                    {
                        global.userData.role === "worker" && requestItem.requestStatus == '1' && !hasDeclinedRequest  ?
                        <View style={styles.estimatedTimeContainer}>
                            <TouchableOpacity style={styles.estimatedTimeBtn}
                                activeOpacity={0.5}
                                onPress={() => {
                                    setDatePickerVisibility(true)
                                }}
                            >
                                <View style={{flexDirection: 'row', alignItems: 'center', flexGrow: 1}}>
                                    <Icon name="clock-outline" size={20} />
                                    {
                                        dateSelected ? 
                                            <View style={{flexDirection: 'column',}}>
                                                <TText style={styles.estimatedTimeText}>{dayjs(displayDate).format("MMM DD, hh: mm A")}</TText>
                                                <TText style={{color: ThemeDefaults.themeOrange, fontSize: 14, marginLeft: 8}}>Estimated Time to Finish</TText>
                                            </View>
                                            :
                                            <TText style={styles.estimatedTimeText}>Estimated Time to Finish <TText style={{fontSize: 20, color: ThemeDefaults.appIcon}}> *</TText></TText>

                                    }
                                </View>
                                <Icon name="chevron-down" size={20} />
                            </TouchableOpacity>
                            <TText style={{fontSize: 14, width: '95%', marginTop: 3, color: '#999'}}>(Leave this portion blank if request is to be declined *)</TText>
                        </View>
                    : null
                    }
                </View>
            </View>

            {/* <View style={styles.cancelBtnCont}> */}
                {
                    global.userData.role === "recruiter" && requestItem.requestStatus == '1' && !didCancelRequest ?
                    <TouchableOpacity style={styles.cancelBtn}
                        onPress={() => {
                            setViewCancelModal(true)
                        }}
                    >
                        <TText style={styles.cancelBtnText}>Cancel Request</TText>
                    </TouchableOpacity>
                    : null
                }

                {/* Display sent message by worker */}
                {
                    hasSentMessage || (requestItem.requestStatus == '3' && requestItem.comment) ? 
                    <View style={{marginHorizontal: 28, marginTop: 40,}}>
                        <TText style={{fontSize: 14}}>{global.userData.role === "recruiter" ? "Message from Worker" : "Message to Recruiter"}</TText>
                        <View style={{flexDirection: 'row', alignItems: "center", marginTop: 15, maxWidth: '90%'}}>
                        <Image source={requestItem.workerId.profilePic === 'pic' ? require('../assets/images/default-profile.png') : {uri: requestItem.workerId.profilePic }} style={{width: 40, height: 40, borderRadius: 20, elevation: 3}} />
                            <View style={{backgroundColor: '#eee', justifyContent: 'flex-start', marginLeft: 15, alignItems: 'center', paddingHorizontal: 30,paddingVertical: 7, borderRadius: 8}}>
                                <TText>{requestItem.comment ? requestItem.comment : declinationMessage}</TText>
                            </View>
                        </View>
                    </View>
                    : null
                }

                {/* {
                    requestItem.requestStatus == '3' && requestItem.comment ? 
                    <View style={{paddingHorizontal: 28, marginTop: 40,}}>
                        <TText style={{fontSize: 14}}>{global.userData.role === "recruiter" ? "Message from Worker" : "Message to Recruiter"}</TText>
                        <View style={{flexDirection: 'row', alignItems: "center", marginTop: 15}}>
                            <Image source={{uri: global.userData.profilePic}} style={{width: 40, height: 40, borderRadius: 20, elevation: 3}} />
                            <View style={{backgroundColor: '#eee', justifyContent: 'flex-start', marginLeft: 15, alignItems: 'center', paddingHorizontal: 30,paddingVertical: 7, borderRadius: 8}}>
                                <TText>{requestItem.comment ? requestItem.comment : declinationMessage}</TText>
                            </View>
                        </View>
                    </View>
                    : null
                } */}

                {
                    didCancelRequest || pastOneHour && global.userData.role === 'recruiter' && 
                    <View style={{paddingHorizontal: 30, marginTop: 40, marginBottom: 150}}>
                        <TText style={{fontFamily: 'LexendDeca_Medium'}}>Suggested Workers</TText>

                        {
                            similarWorks.length === 0 ?
                            <View style={{ marginTop: 20, paddingHorizontal: 30}}>
                                {
                                    loading && <ViewActivityIndicator />
                                }
                                <View style={{paddingHorizontal: 30}}>
                                    <TText style={{textAlign: 'center', marginBottom: 20, color: '#c2c2c2', fontSize: 15}}>There are now other available workers for {requestItem.subCategory}</TText>
                                    <TText style={{textAlign: 'center', color: '#c2c2c2', fontSize: 15}}>You may post a request for this service by clicking the button below</TText>
                                </View>

                                <View style={{marginTop: 40}}>
                                    <TouchableOpacity style={{backgroundColor: ThemeDefaults.themeOrange, borderRadius: 15, elevation: 4, paddingVertical: 12, alignItems: 'center'}}
                                        activeOpacity={0.5}
                                        onPress={() => {
                                            console.log("Post a request")
                                            navigation.navigate("PostRequestFormDrawer")
                                        }}
                                    >
                                        <TText style={{color: ThemeDefaults.themeWhite, fontFamily: 'LexendDeca_Medium'}}>Post a Request</TText>
                                    </TouchableOpacity>
                                </View>
                                {
                                    (requestItem.requestStatus == '3' || requestItem.requestStatus == '4') &&
                                    <View style={{marginTop: 20 }}>
                                        <TouchableOpacity style={{padding: 10}}
                                            onPress={() => {
                                                {
                                                    global.userData.role ==="recruiter" ?
                                                    navigation.navigate("ReportUserDrawer", {userReportedID: requestItem.workerId._id, userFullName: `${requestItem.workerId.firstname} ${requestItem.workerId.lastname}`, userRole: "Worker", userProfilePicture: requestItem.workerId.profilePic})
                                                    :
                                                    navigation.navigate("ReportUserDrawer", {userReportedID: requestItem.recruiterId._id, userFullName: `${requestItem.recruiterId.firstname} ${requestItem.recruiterId.lastname}`, userRole: "Recruiter", userProfilePicture: requestItem.recruiterId.profilePic})
                                                }
                                            }}
                                        >
                                            <TText style={{textAlign: 'center',}}>If you want to report this {global.userData.role === "recruiter"? "worker": "recruiter"}, <TText style={{color: ThemeDefaults.themeRed}}>click here</TText></TText>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                            :
                            <View style={{marginTop: 15}}>
                                {
                                    similarWorks.map((e, index) => (
                                        <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#fff', padding: 12, borderRadius: 10, elevation: 4}}>
                                            {
                                                loading && <ViewActivityIndicator />
                                            }
                                            <Image source={e.workerId.profilePic === 'pic' ? require('../assets/images/default-profile.png') : {uri: e.workerId.profilePic}} style={{width: 60, height: 60, borderRadius: 15}} />
                                            <View style={{paddingLeft: 12}}>
                                                <TText style={{fontSize: 16}}>{e.workerId.firstname} {e.workerId.lastname}</TText>
                                                <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                                    <Icon name="star" size={18} color={"gold"} />
                                                    <TText style={{marginLeft: 5, fontSize: 14}}>4.7</TText>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={{position: 'absolute', right: 12,top: 26, width: 120, backgroundColor: ThemeDefaults.themeLighterBlue, borderRadius: 10, elevation: 3, alignItems: 'center', justifyContent: 'center', paddingVertical: 8}}
                                                activeOpacity={0.5}
                                                onPress={() => {
                                                    console.log("Suggested Worker")
                                                    setReplaceRequestModal(true)
                                                }}
                                            >
                                                <TText style={{color: ThemeDefaults.themeWhite,fontSize: 12}}>Send Request</TText>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                }
                            </View>
                        }

                    </View>
                }

            {/* </View> */}

            {
                global.userData.role === "worker" && requestItem.requestStatus == '1' && !viewDeclineInput ?
                    <>
                        <View style={styles.workerAvailabilityPropmt}>
                            <View style={styles.prompTextCont}>
                                <TText style={styles.promptText}>Available for more requests on <TText style={{fontFamily: "LexendDeca_SemiBold"}}>{dayjs(requestItem.serviceDate).format("MMM DD")}</TText>?<TText style={{fontSize: 20, color: ThemeDefaults.appIcon}}> *</TText></TText>
                            </View>
                            <View style={{width: '50%', paddingBottom: 5}}>
                                <RadioButtonRN
                                    data={radioOptions1}
                                    box={false}
                                    circleSize={14}
                                    duration={200}
                                    initial={-1}
                                    activeColor={ThemeDefaults.themeOrange}
                                    selectedBtn={(e) => {
                                        console.log(e.label)
                                        if(e.label === "Yes"){
                                            setRadioBtn(true)
                                            
                                        } else if(e.label === 'No') {
                                            setRadioBtn(false)
                                        } else {
                                            setRadioBtn(null)
                                        }
                                        // console.log(radioBtn)
                                    }}
                                    textStyle={{marginLeft: 10}}
                                    style={{marginLeft: 0, paddingLeft: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}
                                />
                            </View>
                        </View>

                        <View style={styles.acceptDeclineBtns}>
                            <TouchableOpacity style={[styles.acceptBtn, {backgroundColor: !dateSelected || radioBtn === null ? '#c2c2c2' : ThemeDefaults.themeOrange}]}
                                activeOpacity={0.5}
                                disabled={!dateSelected || radioBtn === null}
                                onPress={() => {
                                    setAcceptRequestModal(true)
                                }}
                            >
                                <TText style={styles.acceptBtnTxt}>Accept Request</TText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.declineBtn}
                                activeOpacity={0.5}
                                disabled={radioBtn === null}
                                onPress={() => {
                                    setDeclineRequestModal(true)
                                }}
                            >
                                <TText style={styles.declineBtnTxt}>Decline Request</TText>
                            </TouchableOpacity>
                        </View>

                        {/* Bookings Scheduled on the same date */}
                        <View>
                            <View style={styles.lineBreaker}>
                                <View style={{flex: 0.6, height: 1.5, backgroundColor: '#c2c2c2'}} />
                                <TText style={styles.horizontalText}>Bookings scheduled on {dayjs(requestItem.serviceDate).format("MMM DD")}</TText>
                                <View style={{flex: 0.6, height: 1.5, backgroundColor: '#c2c2c2'}} />
                            </View>

                            {
                                sameDateBookings.length > 0 ?
                                (sameDateBookings.map(function(item, index){
                                    return(
                                        <View key={index} style={styles.bookingItem}>
                                            <Image source={item.profilePic === "pic" ? require("../assets/images/default-profile.png") : {uri: item.recruiterId.profilePic}} style={styles.bookingItemImage} />
                                            <View style={styles.bookingInformation}>
                                                <TText style={styles.bookingSubCategoryText}>{item.subCategory}</TText>
                                                <View style={styles.bookingDateTimeContainer}>
                                                    <View style={styles.bookingDateTime}>
                                                        <Icon name="calendar-month" size={18} color={ThemeDefaults.themeLighterBlue} />
                                                        <TText style={styles.bookingDateTimeText}>{dayjs(item.serviceDate).format("MMM DD")}</TText>
                                                    </View>
                                                    <View style={styles.bookingDateTime}>
                                                        <Icon name="clock-outline" size={18} color={ThemeDefaults.themeLighterBlue} />
                                                        <TText style={[styles.bookingDateTimeText, {color: item.startTime === requestItem.startTime ? ThemeDefaults.themeOrange : 'black'}]}>{dayjs(item.startTime).format("hh:mm A")}</TText>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }))
                                : 
                                (
                                    <View style={{marginTop: 30, alignItems: 'center'}}>
                                        <TText style={{fontSize: 14, color: '#999'}}>There are no bookings scheduled on {dayjs(requestItem.serviceDate).format("MMMM DD")}</TText>
                                    </View>
                                )
                            }
                        </View>
                    </>
                : null
            }

            {/* Chat / Message textInput */}
            {
                global.userData.role === "worker" && viewDeclineInput && !hasSentMessage ?
                    <View style={styles.bottomContainer}>
                        <View style={{alignItems: 'center', marginBottom: 40, paddingHorizontal: 30,}}>
                            <TText style={{marginBottom: 20, textAlign: 'center', color: '#c2c2c2'}}>Please provide your reason(s) for declining the request</TText>
                            <TText style={{textAlign: 'center', color: '#c2c2c2'}}>You may select a message from the suggestions below and/or write your own message</TText>
                        </View>

                        {/* Message suggestions */}
                        <ScrollView contentContainerStyle={styles.suggestedMsgsCont}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {
                                declinedMessageSuggestions.map(function(item, index){
                                    return(
                                        <TouchableOpacity key={index} style={styles.msgTextContainer}
                                            activeOpacity={0.4}
                                            onPress={() => {
                                                console.log(item)
                                                setDeclinationMessage(item)
                                            }}
                                        >
                                            <TText style={styles.msgText}>{item}</TText>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>

                        {/* Message box input */}
                        <View style={styles.messagingContainer}>
                            <View style={styles.messagingTextInputContainer}>
                                <TextInput 
                                    value={declinationMessage ? declinationMessage : ""}
                                    numberOfLines={1}
                                    placeholder='Write a message'
                                    autoCorrect={false}
                                    cursorColor={ThemeDefaults.themeDarkBlue}
                                    style={styles.messagingTextInput}
                                    onChangeText={(val) => {setDeclinationMessage(val)}}
                                />
                            </View>
                            <TouchableOpacity style={styles.sendBtnContainer}
                                activeOpacity={0.4}
                                onPress={() => {
                                    // setViewDeclineInput(false)
                                    setHasSentMessage(true)
                                    handleSendReasonDeclination()
                                }}
                            >
                                <Icon name="send" size={22} color={ThemeDefaults.themeOrange} style={styles.sendIcon} />
                                <TText style={styles.sendBtnTxt}>Send</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                : null
            }
        </ScrollView>
    </SafeAreaView>
  )
}

export default VIewServiceRequest

const styles = StyleSheet.create({
    outermostContainer: {
        flex: 1,
    },
    mainScrollContainer: {
        flexGrow: 1,
        marginTop: StatusBar.currentHeight,
        backgroundColor: ThemeDefaults.themeWhiteBG
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    headerTitle: {
        fontFamily: "LexendDeca_Medium",
        fontSize: 18,
    },
    requestCard: {
        marginHorizontal: 25,
        padding: 20,
        backgroundColor: ThemeDefaults.themeWhite,
        borderRadius: 15,
        elevation: 4
    },
    cardimageStyle: {
        width: 70,
        height: 70,
        borderRadius: 20,
    },
    cardTopRow: {
        flexDirection: 'row',
    },
    rightSection: {
        flexGrow: 1,
        paddingLeft: 18,
        justifyContent: 'center'
    },
    nameRatingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    workerNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    carUserNameTxt: {
        fontFamily: 'LexendDeca'
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8
    },
    ratingText: {
        fontSize: 14,
        marginLeft: 5
    },
    subCatContainer: {

    },
    subCatText: {
        fontFamily: "LexendDeca_SemiBold",
        fontSize: 20,
    },
    cardBottom: {
        marginTop: 15
    },
    addressCont: {
        marginBottom: 15
    },
    rowTitle: {
        marginBottom: 5
    },
    addressTitleText: {
        fontSize: 14,
        color: '#999'
    },
    addressValueCont: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    addressValueText: {
        marginLeft: 5,
        fontFamily: "LexendDeca",
        fontSize: 16,
        width: '94%'
    },
    dateTimeStatusContainer: {

    },
    dateTimeTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateTimeTitleText: {
        fontSize: 14,
        color: '#999'
    },
    dtsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between'
    },
    dateTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 25,
    },
    dateText: {
        marginLeft: 8,
        fontSize: HEIGHT * 0.017
    },
    timeTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 'auto',
    },
    timeText: {
        marginLeft: 8,
        fontSize: HEIGHT * 0.017
    },
    cancelledCont: {
        paddingHorizontal: 25,
        paddingVertical: 4,
        backgroundColor: '#999',
        borderRadius: 12,
    },
    pendingCont: {
        paddingHorizontal: 25,
        paddingVertical: 3,
        borderWidth: 1.2,
        borderColor: ThemeDefaults.themeDarkBlue,
        borderRadius: 12,
    },
    cancelledText: {
        color: ThemeDefaults.themeWhite,
        fontSize: HEIGHT * 0.014
    },
    pendingText: {
        fontSize: HEIGHT * 0.015
    },
    cancelBtnCont: {
    },
    cancelBtn: {
        marginTop: 25,
        marginHorizontal: 60,
        backgroundColor: ThemeDefaults.themeRed,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        elevation: 4
    },
    cancelBtnText: {
        color: ThemeDefaults.themeWhite,
        fontFamily: "LexendDeca_Medium"
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
    requestDescriptionCont: {
        marginVertical: 20,
        backgroundColor: '#f2f2f2',
        padding: 12,
        paddingBottom: 30,
        borderRadius: 10
    },
    requestDescriptionText: {

    },
    estimatedTimeContainer: {
        marginTop: 30,
    },
    estimatedTimeBtn: {
        borderWidth: 1.3,
        borderColor: '#999',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12
    },
    estimatedTimeText: {
        // flexGrow: 1,
        marginLeft: 8
    },
    workerAvailabilityPropmt: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 30,
        marginTop: 20,
        borderWidth: 1.3, 
        borderColor: ThemeDefaults.dateDisabled,
        borderRadius: 10,
        paddingHorizontal: 20, 
        paddingVertical: 12,
        backgroundColor: ThemeDefaults.themeWhite,
    },
    prompTextCont: {
        width: '55%'
    },
    promptText: {

    },
    acceptDeclineBtns: {
        marginTop: 25,
        marginHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    acceptBtn: {
        flex: 0.48,
        backgroundColor: ThemeDefaults.themeOrange,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
        elevation: 3
    },
    declineBtn: {
        flex: 0.48,
        backgroundColor: '#f3f3f3',
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1.2,
        borderColor: '#d7d7d7',
        borderRadius: 10,
        elevation: 2
    },
    acceptBtnTxt: {
        color: ThemeDefaults.themeWhite,
        fontFamily: 'LexendDeca_Medium'
    },
    declineBtnTxt: {
        fontFamily: 'LexendDeca_Medium' 
    },
    lineBreaker: {
        marginTop: 30,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 30
    },
    horizontalLine: {
        borderBottomColor: '#999',
        borderBottomWidth: 1.2
    },
    horizontalText: {
        paddingHorizontal: 10,
        color: '#c2c2c2'
    },
    declinedCont: {

    },
    declinedServiceCont: {
        paddingHorizontal: 25,
        paddingVertical: 3,
        backgroundColor: ThemeDefaults.themeRed,
        borderRadius: 12,
    },
    declinedServiceTxt: {
        color: ThemeDefaults.themeWhite
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

    },
    messagingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 75,
        paddingLeft: 20,
        paddingRight: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderTopColor: 'rgba(0,0,0,0.1)',
        borderTopWidth: 1.5,
        
    },
    messagingTextInputContainer: {
        width: '85%',
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingRight: 10,
        borderRadius: 10,
    },
    messagingTextInput: {
        paddingLeft: 10,
        // paddingHorizontal: 0,
        fontFamily: 'LexendDeca'
    },
    sendBtnContainer: {
        marginLeft: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendIcon: {
        transform: [{ rotate: '-45deg'}]
    },
    sendBtnTxt: {
        fontSize: 12,
    },
    suggestedMsgsCont: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 50,
    },
    msgTextContainer: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginLeft: 10,
        backgroundColor: '#eee',
        borderRadius: 10,
        elevation: 2
    },
    msgText: {

    },
    bookingItem: {
        backgroundColor: '#fefefe',
        borderRadius: 10,
        elevation: 4,

        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginHorizontal: 30,
        padding: 15,

    },
    bookingItemImage: {
        width: 60,
        height: 60,
        borderRadius: 15,
    },
    bookingInformation: {
        paddingLeft: 15
    },
    bookingSubCategoryText: {
        fontSize: 18,
        fontFamily: 'LexendDeca_SemiBold',
        marginBottom: 5,
    },
    bookingDateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookingDateTime: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 30
    },
    bookingDateTimeText: {
        marginLeft: 8,
        // color: ThemeDefaults.themeOrange
    },
})