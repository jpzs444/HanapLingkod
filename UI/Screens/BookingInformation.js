import { StyleSheet, Text, View, ScrollView, Image, StatusBar, TouchableOpacity, Modal, TextInput, ActivityIndicator, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { IPAddress } from '../global/global'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import dayjs from 'dayjs'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import { useNavigation } from '@react-navigation/native'
import RatingForm from '../Components/RatingForm'
import RatingFeedbackCard from '../Components/RatingFeedbackCard'
import CreateConversation from '../Components/CreateConversation'

// let dayOfYear = require('dayjs/plugin/dayOfYear')
// dayjs.extend(dayOfYear)

const BookingInformation = ({route}) => {

    const navigation = useNavigation()
    const {bookingID, bookingItem, fromCB} = route.params

    const [bookingInformation, setBookingInformation] = useState({})
    const [bookingRatings, setBookingRatings] = useState([])
    const [isLoading, setisLoading] = useState(false)
    const [ratingLoading, setRatingLoading] = useState(false)

    const [viewCancelModal, setViewCancelModal] = useState(false)
    const [bookingCanceled, setBookingCanceled] = useState(false)

    const [messageInputVisibility, setMessageInputVisibility] = useState(true)

    const [canceledMessage, setCanceledMessage] = useState("")
    const [hasSentCancelMessage, setHasSentCancelMessage] = useState(false)

    const [twoBookingStatus, setTwoBookingStatus] = useState(false)
    const [btnStatus, setBtnStatus] = useState("On My Way!")
    const [isToday, setIsToday] = useState(false)
    const [isTimeNow, setIsTimeNow] = useState(false)

    const [viewOTPModal, setViewOTPModal] = useState(false)
    const [viewRatingForm, setViewRatingForm] = useState(false)

    const [viewBookingInfo, setViewBookingInfo] = useState(false)

    const [viewWrongScheduleModal, setViewWrongScheduleModal] = useState(false)

    const [conversation, setConversation] = useState({})

    useEffect(() => {
        setRatingLoading(true)
        setisLoading(true)
        setBookingRatings([])
        handleFetchBookingInformation()
        // handleFetchRatingsOfBooking()
        console.log("BookingItem: ", bookingItem)

        global.userData.role === 'recruiter' ?
                bookingInformation.statusRecruiter == '3' ? setViewBookingInfo(false) : setViewBookingInfo(true)
            :
                bookingInformation.statusWorker == '3' ? setViewBookingInfo(false) : setViewBookingInfo(true)
        
        if(bookingInformation.statusRecruiter == '3' || bookingInformation.statusWorker == '3'){
            // handleFetchRatingsOfBooking()
        }

        let interval = setInterval(() => {handleFetchBookingInformation()}, 10000)

        setBtnStatus("On My Way!")
        setIsToday(dayjs(new Date()).format("YYYY-MM-DD") === dayjs(bookingItem.serviceDate).format("YYYY-MM-DD"))
        setIsTimeNow(dayjs(new Date()).format("HH:mm") === dayjs(bookingItem.serviceDate).format("HH:mm"))
        setBookingCanceled(false)
        setViewRatingForm(false)
        setHasSentCancelMessage(false)
        setMessageInputVisibility(false)
        setTwoBookingStatus(false)

        
        return () => {
            clearInterval(interval)
            setViewRatingForm(false)
            setBookingCanceled(false)
        }
    }, [route]);


    // useEffect(() => {
    //     // fetch booking comment when statusWorker/Recruiter has changed
    //     try {
    //         // fetch
    //         console.log("fetching booking comment/s")
    //     } catch (error) {
    //         console.log("try fetch booking comment -- ", error)
    //     }
    //     return () => {
    //     };
    // }, [bookingInformation]);

// 
    
    const handleFetchBookingInformation = async () => {
        // setisLoading(true)
        await fetch(`http://${IPAddress}:3000/booking/${global.userData._id}/${bookingID}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.accessToken
            }
        }).then(res => res.json())
        .then(data => {
            // console.log("updated booking information - ", data)
            let list = {...data[0]}
            // console.log("data[0] : ", list)
            setBookingInformation({...list})
            console.log("fetched : ")
            console.log("fetched : ", list)

            global.userData.role === 'recruiter' ?
                data.statusRecruiter == '3' ? setViewBookingInfo(false) : setViewBookingInfo(true)
            :
                data.statusWorker == '3' ? setViewBookingInfo(false) : setViewBookingInfo(true)

            // (data.statusRecruitet == '3' || data.statusWorker == '3') && handleFetchRatingsOfBooking()
            handleFetchRatingsOfBooking()
            
        }).catch(err => console.log("error fetching booking info: ", err.msg))
        // setisLoading(false)
    }

    const handleFetchRatingsOfBooking = async () => {
        console.log("handleFetchRatings... ", bookingID)
        try {
            fetch(`http://${IPAddress}:3000/reviews/${bookingID}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                }
            }).then(res => res.json())
            .then(data => {

                let list = []
                if(data.recruiter.length > 0) list.push(data.recruiter[0])
                if(data.worker.length > 0) list.push(data.worker[0])
                // list = [{...data.recruiter[0]}, {...data.worker[0]}]
                // console.log("Data from review: ", data)
                
                console.log("head: ", data)
                console.log("head emthy: ", list)
                
                setBookingRatings([...list])
            })
        } catch (error) {
            console.log("error fetching of booking ratings: ", error)
            
        }

        let ti = setTimeout(setRatingLoading(false), 2000)
        clearTimeout(ti)
        setisLoading(false)
        // setRatingLoading(false)
    }

    const handleUpdateBookingStatus = async (status) => {
        setTwoBookingStatus(true)
        setViewWrongScheduleModal(false)
        console.log("status: ", status)
        
        try {
            let cur_user = global.userData.role === 'recruiter' ? {statusRecruiter: status} : {statusWorker: status}
            await fetch(`http://${IPAddress}:3000/booking/${global.userData._id}/${bookingID}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
                body: JSON.stringify({
                    ...cur_user
                })
            })

            if(status == '4'){
                setBookingCanceled(true)
                setMessageInputVisibility(true)
            } else {
                setBookingCanceled(false)
                setMessageInputVisibility(false)
            }

            status === '5' ? setBtnStatus("Leave a Review & Mark Service as Done") : null
            status === '2' ? setBtnStatus("Show OTP") : null

            console.log("Success: Updated Booking - status == ", status)

        } catch (error) {
            console.log("Error: Cancel Booking - ", error.msg)
        }
        // setViewCancelModal(false)
    }


    const handleSendCancelMessage = async () => {
        try {
            await fetch(`http://${IPAddress}:3000/booking-comment/${bookingInformation._id}`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
                body: JSON.stringify({
                    comment: canceledMessage
                })
            }).then(res => console.log("Success: Sent reason for Cancelation of Booking - "))

            setHasSentCancelMessage(true)
            setMessageInputVisibility(true)
            handleFetchBookingInformation()
        } catch (error) {
            console.log("Error: Sending reason of cancellation failed - ", error.msg)
        }
    }

    const handleCreateConversation = async () => {
        // create a conversation

        try {
            await fetch(`http://${IPAddress}:3000/conversations`, {
                method: "POST",
                headers: {
                  'content-type': 'application/json',
                  "Authorization": global.accessToken
                },
                body: JSON.stringify({
                    senderId: global.userData._id,
                    receiverId: global.userData.role === 'recruiter' ? bookingInformation.workerId._id : bookingInformation.recruiterId._id
                })
            }).then(res => res.json())
            .then(data => {
                console.log("conversation data: ", data[0])
                setConversation({...data[0]})
                handleGoToConversation()
            })
        } catch (error) {
            console.log("Error creating new convo: ", error)
        }
    }

    const handleGoToConversation = () => {
        // navigation.navigate("ConversationThreadDrawer", {"otherUser": otherUser, "conversation": conversation})
        // console.log("otgerUser: ", typeof requestItem.workerId)
        console.log("convo: ", typeof conversation)
        navigation.navigate("ConversationThreadDrawer", {
            "otherUser": global.userData.role === 'recruiter' ? bookingInformation.workerId : bookingInformation.recruiterId, 
            "conversation": conversation
        })
    }


    return (
        <ScrollView contentContainerStyle={styles.mainContainer}>
            <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} fromCB={fromCB} />
            <TText style={styles.mainHeader}>Booking Information</TText>

            {/* {
                (bookingInformation.bookingStatus == '2' || bookingInformation.bookingStatus == '4' || bookingInformation.bookingStatus == '5') &&
                <View style={{position: 'absolute', bottom: 40, left: 0, right: 0, }}>
                    <TouchableOpacity style={{padding: 10}}
                        onPress={() => {
                            {
                                global.userData.role ==="recruiter" ?
                                navigation.navigate("ReportUserDrawer", {userReportedID: bookingItem.workerId._id, userFullName: `${bookingItem.workerId.firstname} ${bookingItem.workerId.lastname}`, userRole: "Worker", userProfilePicture: bookingItem.workerId.profilePic})
                                :
                                navigation.navigate("ReportUserDrawer", {userReportedID: bookingItem.recruiterId._id, userFullName: `${bookingItem.recruiterId.firstname} ${bookingItem.recruiterId.lastname}`, userRole: "Recruiter", userProfilePicture: bookingItem.recruiterId.profilePic})
                            }
                        }}
                    >
                        <TText style={{textAlign: 'center', color: ThemeDefaults.themeRed}}>Report this {global.userData.role === "recruiter"? "worker": "recruiter"}</TText>
                    </TouchableOpacity>
                </View>
            } */}

            {/* 
            
                booking status == 1 - booking active
                               == 2 - worker on the way
                               == 5 - service/work has started/recruiter confirmed OTP
                               == 3 - booking completed
                               == 4 - booking canceled
            
             */}

            {
                isLoading ? 
                <View style={{width: '100%', height: 50, alignItems: 'center', marginTop: 30}}>
                    <ActivityIndicator size={'large'} style={{width: '100%'}} />
                </View>
                :
                <>
                <View style={styles.workInformation}>
                {
                    bookingInformation.bookingStatus == '2' && !bookingCanceled ?
                    <View style={styles.headsUpContainer}>
                        <TText style={styles.headsUpMessage}>
                            {
                                global.userData.role === 'recruiter' ? "Worker is on their way..." : "On the way to Recruiter's address..."
                            }
                        </TText>
                    </View>
                    :
                    global.userData.role === 'recruiter' ? 
                        bookingInformation.statusRecruiter == '3' && bookingInformation.bookingStatus != 2 ? 
                            <View style={[styles.headsUpContainer, {backgroundColor: ThemeDefaults.themeGreen}]}>
                                <TText style={styles.headsUpMessage}>Service is Finished</TText>
                            </View>
                            :
                            bookingInformation.bookingStatus == '4' ?
                            <View style={[styles.headsUpContainer, {backgroundColor: ThemeDefaults.themeRed}]}>
                                <TText style={styles.headsUpMessage}>Canceled</TText>
                            </View>
                            :
                            bookingInformation.bookingStatus == '1' ?
                                null
                                :
                                <View style={[styles.headsUpContainer, {backgroundColor: ThemeDefaults.themeLighterBlue}]}>
                                    <TText style={styles.headsUpMessage}>Service ongoing...</TText>
                                </View>
                        :
                        bookingInformation.statusWorker == '3' && bookingInformation.bookingStatus != 2 ?
                            <View style={[styles.headsUpContainer, {backgroundColor: ThemeDefaults.themeGreen}]}>
                                <TText style={styles.headsUpMessage}>Service is Finished</TText>
                            </View>
                            :
                            bookingInformation.statusRecruiter == '3' ?
                            <View style={[styles.headsUpContainer, {backgroundColor: ThemeDefaults.themeGreen}]}>
                                <TText style={styles.headsUpMessage}>The Recruiter set the service as finished</TText>
                            </View>
                            :
                            bookingInformation.bookingStatus == '4' ?
                            <View style={[styles.headsUpContainer, {backgroundColor: ThemeDefaults.themeRed}]}>
                                <TText style={styles.headsUpMessage}>Canceled</TText>
                            </View>
                            :
                            bookingInformation.bookingStatus == '1' ?
                                null
                                :
                                <View style={[styles.headsUpContainer, {backgroundColor: ThemeDefaults.themeLighterBlue}]}>
                                    <TText style={styles.headsUpMessage}>Service ongoing...</TText>
                                </View>
                }

                    {/* chat button */}
                    <TouchableOpacity style={{backgroundColor: ThemeDefaults.themeOrange, borderRadius: 20, padding: 8, elevation: 4, position: 'absolute', right: 15, top: bookingInformation.bookingStatus != '1' ? 50 : 15, zIndex: 5}}
                        activeOpacity={0.5}
                        onPress={() => {
                            console.log("HI")
                            // go to convo
                            handleCreateConversation()
                        }}
                    >
                        <Image source={require('../assets/icons/chat-bubble.png')} style={{width: 25, height: 25,}} />
                    </TouchableOpacity>
                    

                <TText style={styles.bookingSubCat}>{bookingItem.subCategory}</TText>
                <TText style={styles.bookingSchedule}>
                    
                    {dayjs(bookingItem.serviceDate).format("MMMM DD")},  {dayjs(bookingItem.startTime).format("hh:mm A")}
                    
                    {
                        isToday && " (Today)"
                    }

                </TText>

                <View style={styles.workerCard}>
                    {
                        global.userData.role === 'recruiter'  ?
                        <Image style={styles.workerPic} source={bookingItem.workerId.profilePic === 'pic' ? require("../assets/images/default-profile.png") : { uri:bookingItem.workerId.profilePic }} />
                        : 
                        <Image style={styles.workerPic} source={bookingItem.recruiterId.profilePic === 'pic' ? require("../assets/images/default-profile.png") : { uri:bookingItem.recruiterId.profilePic }} />
                    }

                    {
                        global.userData.role === 'recruiter' ?
                        <View style={styles.workerInformation}>
                            <TText style={styles.workerName}>{bookingItem.workerId.firstname} {bookingItem.workerId.lastname}  {bookingItem.workerId.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null} </TText>
                            <View style={styles.workerRating}>
                                <Icon name='star' size={18} color={"gold"} />
                                <TText style={styles.workerRatingText}>{bookingItem.workerId.rating ? bookingItem.workerId.rating : "no rating"}</TText>
                            </View>
                        </View>
                        :
                        <View style={styles.workerInformation}>
                            <TText style={styles.workerName}>{bookingItem.recruiterId.firstname} {bookingItem.recruiterId.lastname}  {bookingItem.recruiterId.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null} </TText>
                            <View style={styles.workerRating}>
                                <Icon name='star' size={18} color={"gold"} />
                                <TText style={styles.workerRatingText}>{bookingItem.recruiterId.rating ? bookingItem.recruiterId.rating : "no rating"}</TText>
                            </View>
                        </View>
                    }

                    <TouchableOpacity 
                        style={styles.gotoProfileBtn}
                        activeOpacity={0.5}
                        onPress={() => {
                            global.userData.role === 'recruiter' ? 
                            // console.log("Worker Profile")
                            navigation.navigate("WorkerProfileDrawer", {workerID: bookingInformation.workerId._id, userRole: false})
                            : 
                            // console.log("Recruiter Profile")
                            navigation.navigate("WorkerProfileDrawer", {workerID: bookingInformation.recruiterId._id, userRole: true})
                        }}
                    >
                        <TText style={styles.profileBtnText}>Profile</TText>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Button for Recruiter */}
            {
                global.userData.role === 'recruiter' && bookingInformation.bookingStatus != '1' && !(bookingInformation.bookingStatus == '4') && bookingInformation.statusRecruiter != '3' && !viewRatingForm && !bookingCanceled  ?
                    <TouchableOpacity style={[styles.statusUpdaterBtn, {backgroundColor: bookingInformation.bookingStatus == '5' ? ThemeDefaults.themeOrange : ThemeDefaults.themeLighterBlue}]}
                        activeOpacity={0.6}
                        onPress={()=> {
                            if(bookingInformation.bookingStatus == '5'){
                                setViewRatingForm(true)
                                return
                            }
                            if(bookingInformation.bookingStatus == '2'){
                                setViewOTPModal(true)
                            }
                        }}
                    >
                        {
                            bookingInformation.bookingStatus == '2' ?
                            <TText style={[styles.statusUpdaterText,]}>Show OTP</TText>
                            :
                            <TText style={[styles.statusUpdaterText, {fontSize: 16}]}>Leave a Review & Mark Service as Done</TText>
                        }
                    
                    </TouchableOpacity> 
                    : null
            }

            {/* Button for worker */}
            {
                global.userData.role === 'worker' && !(bookingInformation.bookingStatus == '4') && bookingInformation.statusWorker != '3' && !viewRatingForm && !bookingCanceled  ?
                    <TouchableOpacity style={[styles.statusUpdaterBtn, {backgroundColor: bookingInformation.bookingStatus == '5' ? ThemeDefaults.themeOrange : ThemeDefaults.themeLighterBlue}]}
                        activeOpacity={0.6}
                        onPress={()=> {

                            if(bookingInformation.bookingStatus == '5'){
                                setViewRatingForm(true)
                                return
                            }
                            
                            if(isToday && isTimeNow && bookingInformation.bookingStatus != '2'){
                                handleUpdateBookingStatus(2)
                            }

                            if((!isToday || !isTimeNow) && bookingInformation.bookingStatus != '2') {
                                // setTwoBookingStatus(true)
                                setViewWrongScheduleModal(true)
                            } else if(bookingInformation.bookingStatus == '2'){
                                setViewOTPModal(true)
                            }

                        }}
                    >
                        
                        {
                            bookingInformation.bookingStatus == '2' ?
                            <TText style={[styles.statusUpdaterText,]}>Show OTP</TText>
                            :
                            bookingInformation.bookingStatus == '5' ?
                                <TText style={[styles.statusUpdaterText, {fontSize: 16}]}>Leave a Review & Mark Service as Done</TText>
                                :
                                <TText style={[styles.statusUpdaterText,]}>On My Way!</TText>
                        }

                    </TouchableOpacity> 
                    : null
            }

            {/* Booking Information */}
            {
                ((global.userData.role === 'recruiter' && bookingInformation.statusRecruiter != '3') || (global.userData.role === "worker" && bookingInformation.statusWorker != '3')) && bookingInformation.bookingStatus != '4' && !viewRatingForm && !bookingCanceled ?
                <>
                    <View style={styles.bookingDescription}>
                        <TText style={styles.bookingDescriptionHeader}>Additional description</TText>
                        <TText style={styles.bookingDescriptionText}>{bookingItem.description ? bookingItem.description : " --"}</TText>
                    </View>

                    <View style={styles.recruiterCard}>
                        <View style={styles.recruiterInformation}>
                            {/* <Icon name={'map-outline'} size={18} color={ThemeDefaults.themeLighterBlue} /> */}
                            <TText style={styles.recruiterName}>Address</TText>
                        </View>
                        <View style={styles.addressInformation}>
                            <TText style={styles.addressText}><Icon name={'map-outline'} size={18} color={ThemeDefaults.themeLighterBlue} />  {bookingItem.address}</TText>
                        </View>
                    </View>
                    
                    <View style={styles.whenInformation}>
                        <TText style={styles.whenHeader}>Date and Time</TText>
                        <View style={styles.dateTimeInformation}>
                            <View style={styles.whenItem}>
                                <Icon name="calendar-month" size={18} color={ThemeDefaults.themeLighterBlue} />
                                <TText style={styles.whenText}>{dayjs(bookingItem.serviceDate).format("MMMM D")}</TText>
                            </View>
                            <View style={styles.whenItem}>
                                <Icon name="clock-outline" size={18} color={ThemeDefaults.themeLighterBlue} />
                                <TText style={styles.whenText}>{dayjs(bookingItem.startTime).format("hh:mm A")}</TText>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.paymentInformation}>
                        <TText style={styles.paymentHeader}>{global.userData.role === 'recruiter' ? "Please prepare your payment for the service" : `Service fee for ${bookingItem.subCategory}`}</TText>
                        <TText style={styles.paymentText}>{`₱ ${bookingItem.minPrice}  -  ₱ ${bookingItem.maxPrice}`}</TText>
                    </View>

                </>
                : null
            }

            {
                bookingInformation.bookingStatus == '1' && !bookingCanceled &&
                <>
                    <View style={styles.waitCancel}>
                        {
                            global.userData.role === "recruiter" ?
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <TText style={styles.waitCancelText}>Please wait for the worker or </TText>
                                    <TouchableOpacity style={[styles.cancelBtn,]}
                                        activeOpacity={0.5}
                                        onPress={() => {
                                            console.log("Cancel booking")
                                            // setViewCancelModal(true)
                                            setBookingCanceled(true)
                                        }}
                                    >
                                        <TText style={styles.cancelText}>cancel booking</TText>
                                    </TouchableOpacity>

                            </View>
                            :
                            <TText style={[styles.waitCancelText,]}>Please wait for the scheduled date and time or 
                                <TouchableOpacity style={styles.cancelBtn}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        console.log("Cancel booking")
                                        // setViewCancelModal(true)
                                        setBookingCanceled(true)
                                    }}
                                >
                                    <TText style={styles.cancelText}>cancel booking</TText>
                                </TouchableOpacity>
                            </TText>
                        }
                        {/* <TouchableOpacity style={styles.cancelBtn}
                            activeOpacity={0.5}
                            onPress={() => {
                                console.log("Cancel booking")
                                setViewCancelModal(true)
                            }}
                        >
                            <TText style={styles.cancelText}>cancel booking</TText>
                        </TouchableOpacity> */}
                    </View>
                </>
            }

            {
                (bookingInformation.bookingStatus == '2' || bookingInformation.bookingStatus == '4' || bookingInformation.bookingStatus == '5') &&
                <View style={{marginTop: 20}}>
                    <TouchableOpacity style={{padding: 10}}
                        onPress={() => {
                            {
                                global.userData.role ==="recruiter" ?
                                navigation.navigate("ReportUserDrawer", {userReportedID: bookingItem.workerId._id, userFullName: `${bookingItem.workerId.firstname} ${bookingItem.workerId.lastname}`, userRole: "Worker", userProfilePicture: bookingItem.workerId.profilePic})
                                :
                                navigation.navigate("ReportUserDrawer", {userReportedID: bookingItem.recruiterId._id, userFullName: `${bookingItem.recruiterId.firstname} ${bookingItem.recruiterId.lastname}`, userRole: "Recruiter", userProfilePicture: bookingItem.recruiterId.profilePic})
                            }
                        }}
                    >
                        <TText style={{textAlign: 'center',}}>If you want to report this {global.userData.role === "recruiter"? "worker": "recruiter"}, <TText style={{color: ThemeDefaults.themeRed}}>click here</TText></TText>
                    </TouchableOpacity>
                </View>
            }


            {/* If booking is cancelled */}

            {
                (hasSentCancelMessage || bookingInformation.comment) &&
                <View style={styles.messageToOtherCancellationContainer}>
                    <TText style={styles.messageCancelHeader}>Message to {global.userData.role === 'recruiter' ? "Worker:" : "Recruiter:"}</TText>
                    <View style={styles.messageContainer}>
                        <Image style={styles.messageUserPic} source={global.userData.profilePic === "pic" ? require("../assets/images/default-profile.png") : { uri: global.userData.profilePic }} />
                        <View style={styles.messageBoxContainer}>
                            <TText style={styles.messageText}>{bookingInformation.comment}</TText>
                        </View>
                    </View>
                </View>
            }

            {
                bookingCanceled ? 
                <>

                    <TText style={{fontFamily: "LexendDeca_SemiBold", fontSize: 18, marginLeft: 30, marginBottom: 15, marginTop: 40}}>Confirm Cancelation</TText>
                    <View style={styles.messagingContainer}>
                        <TText style={styles.messageHeader}>State the reason of cancellation</TText>
                        <View style={styles.inputContainer}>
                            <View style={styles.messagingTextInputContainer}>
                                <TextInput
                                    numberOfLines={1}
                                    placeholder='Write a message'
                                    autoCorrect={false}
                                    cursorColor={ThemeDefaults.themeDarkBlue}
                                    style={styles.messagingTextInput}
                                    onChangeText={(val) =>  setCanceledMessage(val)}
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.confirmCancelationBtn}
                        activeOpacity={0.5}
                        onPress={() => {
                            setViewCancelModal(true)
                        }}
                    >
                        <TText style={styles.confirmCancelationText}>Confirm Cancelation</TText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.continueBookingBtn}
                        activeOpacity={0.5}
                        onPress={() => {
                            setBookingCanceled(false)
                        }}
                    >
                        <TText style={styles.continueBookingText}>Continue Booking</TText>
                    </TouchableOpacity>
                </>
                : null
            }
                {/* Rating item */}
                {
                    ratingLoading ?
                    <View style={{width: '100%', alignItems: 'center', height: 40}}>
                        <ActivityIndicator size={'large'} />
                    </View>
                    :
                    (global.userData.role === 'recruiter' && bookingInformation.statusRecruiter == '3') ||
                    (global.userData.role === 'worker' && bookingInformation.statusWorker == '3') ?
                    <>
                        <TText style={{marginLeft: 30, marginBottom: 15, marginTop: 40}}>Ratings and Reviews</TText>
                        <RatingFeedbackCard item={bookingRatings} bookingId={bookingID} />
                    </>
                    : null
                }
            
            
                {/* Rating Form */}
                {
                    global.userData.role === 'recruiter' ? 
                        bookingInformation.statusRecruiter != '3' && viewRatingForm ? 
                            <RatingForm item={bookingItem} handleUpdate={handleFetchBookingInformation} />
                            :
                            null
                    :
                        bookingInformation.statusWorker != '3' && viewRatingForm ?
                            <RatingForm item={bookingItem} handleUpdate={handleFetchBookingInformation} />
                            :
                            null
                }


                </>

            
            }





            {/* Modals */}




            {/* Modal for Cancellation */}
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
                            <TText style={[styles.dialogueMessageText,]}>Are you sure you want to <TText style={{color: ThemeDefaults.themeOrange}}>cancel</TText> the booking?</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    handleUpdateBookingStatus(4)
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

            
            {/* Modal for today is not the schedule */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={viewWrongScheduleModal}
                onRequestClose={() => setViewWrongScheduleModal(false)}
            >
                {/* Modal View */}
                <View style={[styles.modalDialogue, {}]}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        <View style={styles.dialogueMessage}>
                            <TText style={[styles.dialogueMessageText, {marginBottom: 8,paddingTop: 10}]}>{ isToday && !isTimeNow ? "You are ahead of the scheduled time." : "Today is not the scheduled date."}</TText>
                            <TText style={[styles.dialogueMessageText, {paddingBottom: 10}]}>Do you want to continue?</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => {
                                    // if user said continue
                                    handleUpdateBookingStatus(2)
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Continue</TText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setViewWrongScheduleModal(false)
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for OTP | Recruiter */}
            <Modal
                transparent={true}
                animationType='fade'
                visible={viewOTPModal}
                onRequestClose={() => setViewOTPModal(false)}
            >
                {/* Modal View */}
                <View style={styles.modalDialogue}>
                    {/* Modal Container */}
                    <View style={styles.dialogueContainer}>
                        {/* Modal Message/Notice */}
                        {
                            global.userData.role === 'recruiter' ?
                            <>

                                <View style={styles.dialogueMessage}>
                                    <TText style={[styles.dialogueMessageText, {fontSize: 18, marginBottom: 8}]}>Compare OTP to Worker</TText>
                                    <TText style={[styles.dialogueMessageText, {fontSize: 14, marginBottom: 30, color: '#f0f0f0'}]}>The recruiter should confirm the OTP to start the service</TText>
                                    <TText style={[styles.dialogueMessageText,{fontSize: 28, fontFamily: "LexendDeca_Bold"}]}>{bookingItem.otp}</TText>
                                </View>
                                {/* Modal Buttons */}
                                <View style={styles.modalDialogueBtnCont}>
                                    <TouchableOpacity
                                        style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                        onPress={() => {
                                            console.log("Status 5")
                                            handleUpdateBookingStatus(5)
                                            setViewOTPModal(false)

                                            // update booking status to 2 (on going)
                                        }}
                                    >
                                        <TText style={styles.dialogueCancel}>Confirm OTP</TText>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.dialogueBtn}
                                        onPress={() => {
                                            setViewOTPModal(false)
                                        }}
                                    >
                                        <TText style={[styles.dialogueConfirm, {fontFamily: "LexendDeca_Medium"}]}>Hide OTP</TText>
                                    </TouchableOpacity>
                                </View>
                            </>
                            :
                            <>
                                <View style={styles.dialogueMessage}>
                                    <TText style={[styles.dialogueMessageText, {fontSize: 18, marginBottom: 8}]}>Compare OTP to Recruiter</TText>
                                    <TText style={[styles.dialogueMessageText, {fontSize: 14, marginBottom: 30, color: '#f0f0f0'}]}>The Recruiter should confirm the OTP and the service should automatically start</TText>
                                    <TText style={[styles.dialogueMessageText,{fontSize: 28, fontFamily: "LexendDeca_Bold"}]}>{bookingItem.otp}</TText>
                                </View>
                                {/* Modal Buttons */}
                                <View style={styles.modalDialogueBtnCont}>
                                    <TouchableOpacity
                                        style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                        onPress={() => {
                                            setViewOTPModal(false)
                                        }}
                                    >
                                        <TText style={[styles.dialogueCancel, {fontFamily: 'LexendDeca_Medium'}]}>Hide OTP</TText>
                                    </TouchableOpacity>
                                </View>
                            </>
                        }
                    </View>
                </View>
            </Modal>

        </ScrollView>
    )
}

export default BookingInformation

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        // flex: 1,
        // height: '100%',
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#fefefe',
        paddingBottom: 100
    },
    mainHeader: {
        marginVertical: 30,
        textAlign: 'center',
        fontSize: 18
    },
    workInformation: {
        marginHorizontal: 30,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#d7d7d7',
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    headsUpContainer: {
        backgroundColor: ThemeDefaults.themeOrange,
        paddingVertical: 10,
        alignItems: 'center',
        elevation: 3
    },
    headsUpMessage: {
        fontFamily: 'LexendDeca_Medium',
        color: ThemeDefaults.themeWhite
    },
    bookingSubCat: {
        paddingTop: 40,
        marginBottom: 5,
        textAlign: 'center',
        // paddingVertical: 50,
        fontSize: 20,
        fontFamily: 'LexendDeca_SemiBold'
    },
    bookingSchedule: {
        paddingBottom: 40,
        textAlign: 'center',
        fontSize: 15,
        fontFamily: 'LexendDeca_Medium',
        color: 'gray'
    },
    workerCard: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1.5,
        borderTopColor:  "#d7d7d7",
    },
    workerPic: {
        width: 70,
        height: 70,
    },
    workerInformation: {
        paddingLeft: 15,
    },
    workerName: {
        fontFamily: 'LexendDeca_Medium',
        alignItems: 'center',
        maxWidth: 220,
    },
    workerRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    workerRatingText: {
        fontSize: 14,
        marginLeft: 5
    },
    gotoProfileBtn: {
        marginLeft: 'auto',
        marginRight: 15,
        paddingVertical:  5,
        paddingHorizontal: 18,
        backgroundColor: ThemeDefaults.themeLighterBlue,
        borderRadius: 10,
        elevation: 3
    },
    profileBtnText: {
        color: ThemeDefaults.themeWhite,
        fontSize: 12
    },
    bookingDescription: {
        marginTop: 15,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#d7d7d7',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 30,
    },
    bookingDescriptionHeader: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 8
    },
    bookingDescriptionText: {

    },
    recruiterCard: {
        marginTop: 15,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#d7d7d7',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 30,
    },
    recruiterInformation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    recruiterName: {
        // marginLeft: 10,
        fontSize: 12,
        color: 'gray'
    },
    addressInformation: {
    },
    addressText: {
        fontFamily: 'LexendDeca_Medium',
        fontSize: 17,
    },
    whenInformation: {
        marginTop: 15,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#d7d7d7',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 30,
    },
    whenHeader: {
        marginBottom: 8,
        fontSize: 12,
        color: 'gray'
    },
    dateTimeInformation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    whenItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 50,
    },
    whenText: {
        fontSize: 17,
        marginLeft: 8
    },
    paymentInformation: {
        marginTop: 15,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#d7d7d7',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    paymentHeader: {
        width: '45%',
        fontFamily: "LexendDeca_Medium",
    },
    paymentText: {
        width: '55%',
        textAlign: 'center',
        fontFamily: 'LexendDeca_Medium',
        fontSize: 18,
        paddingLeft: 20
    },
    waitCancel: {
        marginTop: 30,
        marginHorizontal: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    waitCancelText: {
        textAlign: 'center',
        // width: '100%'
    },
    cancelBtn: {
        
    },
    cancelText: {
        textDecorationLine: 'underline',
        color: ThemeDefaults.themeOrange,
    },
    messagingContainer: {
        padding: 15,
        marginHorizontal: 30,
        marginTop: 0,
        borderWidth: 1.5,
        borderColor: '#d7d7d7',
        borderRadius: 10,
    },
    messageHeader: {
        marginBottom: 10,
        fontSize: 14
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    messagingTextInputContainer: {
        width: '100%',
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
    confirmCancelationBtn: {
        marginHorizontal: 30,
        marginTop: 15,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: ThemeDefaults.themeOrange,
    },
    confirmCancelationText: {
        color: ThemeDefaults.themeWhite,
        fontFamily: 'LexendDeca_Medium'
    },
    continueBookingBtn: {
        marginHorizontal: 30,
        marginTop: 15,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#d7d7d7",
        backgroundColor: ThemeDefaults.themeWhite,
    },
    continueBookingText: {
        color: '#9D9D9D',
        fontFamily: 'LexendDeca_Medium'
    },
    messageToOtherCancellationContainer: {
        marginTop: 50,
        marginHorizontal: 30,
    },
    messageCancelHeader: {
        marginBottom: 15,
        fontSize: 14
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20
    },
    messageUserPic: {
        width: 50,
        height: 50,
        borderRadius: 15,
    },
    messageBoxContainer: {
        flexShrink: 1,
        marginLeft: 15,
        padding: 12,
        paddingHorizontal: 20,
        backgroundColor: '#eee',
        borderRadius: 10,
        elevation: 2,
    },
    messageText: {
        fontSize: 14,
    },
    statusUpdaterBtn: {
        marginHorizontal: 30,
        marginTop: 25,
        marginBottom: 10,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: ThemeDefaults.themeOrange,
        borderRadius: 15,
        elevation: 3
    },
    statusUpdaterText: {
        color: ThemeDefaults.themeWhite,
        fontFamily: 'LexendDeca_SemiBold',
        fontSize: 18,
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