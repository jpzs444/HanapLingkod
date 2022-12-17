import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, StatusBar, Modal } from 'react-native'
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import Appbar from '../Components/Appbar';
import ThemeDefaults from '../Components/ThemeDefaults';
import { TextInput } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from 'dayjs';
import { ModalPicker } from '../Components/ModalPicker';
import { IPAddress } from '../global/global';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const PostRequestForm = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const [categoryModal, setCategoryModal] = useState(false)
    const [requestCategory, setRequestCategory] = useState({})

    const [specificRequestText, setSpecificRequestText] = useState("")
    const [minPriceText, setMinPriceText] = useState(null)
    const [maxPriceText, setMaxPriceText] = useState(null)

    const [address, setAddress] = useState(`${global.userData.street}, ${global.userData.purok}, ${global.userData.barangay}, ${global.userData.city}, ${global.userData.province}`)
    const [otherAddress, setOtherAddress] = useState("")

    const [datePickerVisible, setDatePickerVisibility] = useState(false)
    const [timePickerVisible, setTimePickerVisibility] = useState(false)

    const [formatedDate, setFormatedDate] = useState(new Date())
    const [displayDate, setDisplayDate] = useState(new Date())
    const [dateSelected, setDateSelected] = useState(false)
    
    const [formatedTime, setFormatedTime] = useState(new Date())
    const [displayTime, setDisplayTime] = useState(new Date())
    const [timeSelected, setTimeSelected] = useState(false)

    const [postBtnModal, setPostBtnModal] = useState(false)
    const [confirmPost, setConfirmPost] = useState(false)

    const [minPressed, setMinPressed] = useState(false)
    const [maxPressed, setMaxPressed] = useState(false)
    const minPriceInput = useRef()
    const maxPriceInput = useRef()
    const otherAddressRef = useRef()

    let disabledBtn = !(requestCategory && specificRequestText && minPriceText && maxPriceText && dateSelected && timeSelected)

    useEffect(() => {
        setRequestCategory(null)
        setSpecificRequestText("")
        setMinPriceText("")
        setMaxPriceText("")
        setFormatedDate(new Date())
        setDisplayDate(new Date())
        setFormatedTime(new Date())
        setDisplayTime(new Date())
        setMinPressed(false)
        setMaxPressed(false)
        setDateSelected(false)
        setTimeSelected(false)
    }, [isFocused])

    const handlePostRequest = () => {
        // console.log("handlePost")
        fetch(`https://hanaplingkod.onrender.com/request-post`, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.accessToken
            },
            body: JSON.stringify({
                startTime: formatedTime,
                recruiterId: global.userData._id,
                ServiceID: requestCategory._id,
                postDescription: specificRequestText,
                serviceDate: formatedDate,
                minPrice: minPriceText,
                maxPrice: maxPriceText,
                address: otherAddress ? otherAddress : address,
                long: 80,
                lat: 25,
            })
        }).then((res) => {
            res.json()
        }).then(data => {
            // console.log("res: ",)
            // console.log("Success: Added a request to your posts")
            navigation.goBack()
        })
        .catch((err) => console.log("error post request: ", err.message))
    }

    const handleDateConfirm = (date) => {
        let dateString = dayjs(date).format("YYYY-MM-DD")

        let dd_js = dayjs(date)
        setFormatedDate(dd_js);

        setDisplayDate(dayjs(date).format("MMM D, YYYY").toString());
        setDatePickerVisibility(false);
        setDateSelected(true)

        // console.log(dateString)
    }

    const handleTimeConfirm = (time) => {
        let timeString = dayjs(time).format("hh:mm A")
        setDisplayTime(timeString.toString())

        let dd = new Date(formatedDate)
        let tt = new Date(time)
        
        // combine
        let dd_date = dayjs(dd).format("YYYY-MM-DD")
        let tt_time = dayjs(tt).format("HH:mm")
        
        let combined = dayjs(dd_date.toString() + "" + tt_time.toString())
        // console.log("combined pr: ", combined)

        setFormatedTime(combined)
        setTimePickerVisibility(false)
        setTimeSelected(true)


    }

    const changeModalVisibility = (bool) => {
        //getAllWorkers()
        setCategoryModal(bool)
    
      }

  return (
    <ScrollView style={{flexGrow: 1, paddingTop: StatusBar.currentHeight, backgroundColor: ThemeDefaults.themeWhite}}>
      <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

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

      <View style={styles.formContainer}>
        {/* Name and Address */}
        <View style={styles.nameAddressContainer}>
            <Image source={global.userData.profilePic === "pic" ? require("../assets/images/default-profile.png") : {uri: global.userData.profilePic}} style={styles.image} />
            <View style={styles.userInfoCont}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userInfoName}>{global.userData.firstname}{global.userData.middlename !== 'undefined' ? ` ${global.userData.middlename.charAt(0).toUpperCase()}` : ""} {global.userData.lastname}</Text>
                <View style={styles.addressCont}>
                    <Icon name='map' size={20} color={"#434343"} />
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressText}>{global.userData.street}, {global.userData.purok}, {global.userData.barangay}, {global.userData.city}, {global.userData.province}</Text>
                </View>
            </View>
        </View>

        {/* Category Picker */}
        <View style={styles.categoryContainer}>
            <TouchableOpacity style={styles.categoryBtn}
                onPress={() => {
                    setCategoryModal(true)
                }}
            >
                <Icon name='shape' size={20} color={"#888"} />
                <View style={styles.rowGrpTxt}>
                    <TText style={styles.categoryText}>{requestCategory ? requestCategory === "unlisted" ? "Unlisted" : requestCategory.Category : 'Select Category'}</TText>
                    <TText style={styles.requirement}>{requestCategory ? "" : "*"}</TText>
                </View>
                <Icon name='chevron-down' size={20} color={"#434343"} />
            </TouchableOpacity>

            <Modal
                transparent={true}
                animationType='fade'
                visible={categoryModal}
                onRequestClose={() => setCategoryModal(false)}
            >
                <ModalPicker 
                    changeModalVisibility={changeModalVisibility}
                    setData={(filter) => {
                        // console.log(filter)
                        setRequestCategory({...filter})
                        }}
                    category={true}
                />
            </Modal>
        </View>

        {/* Post TextInput */}
        <View style={styles.textInputContainer}>
            {/* <Icon name="pencil" size={24} /> */}
            <TextInput 
                style={styles.textInput}
                multiline
                autoCorrect={false}
                spellCheck={false}
                numberOfLines={10}
                placeholder="🖋️ Specify the service you're looking for"
                onChangeText={(text) => setSpecificRequestText(text)}
            />
        </View>

        {/* Additional request information */}
        <View style={styles.additionalInfoCont}>
            {/* Min Max Pricing */}
            <View style={styles.rowContainer}>
                <TouchableOpacity style={styles.priceBtn} 
                    onPress={() => {
                        // setMaxPressed(false)
                        setMinPressed(true)
                        minPriceInput.current.focus()
                    }}
                >
                    <Icon name='arrow-down-box' size={22} style={{marginRight: minPressed ? 12 : 0}} color={"#666"} />
                   
                    <TextInput 
                        placeholder='Min. Labor Price'
                        keyboardType='decimal-pad'
                        ref={minPriceInput}
                        val={minPriceText ? minPriceText : ""}
                        onChangeText={text => setMinPriceText(text)}
                        style={[styles.textInputMinMax, {opacity: minPressed ? 1 : 0}]}
                    />
                    {
                        !minPressed && 
                        <View style={[styles.rowGrpTxt, {zIndex: 5, position: 'absolute', left: 30}]}>
                            <TText style={styles.priceText}>Min. Labor Price</TText>
                            <TText style={styles.requirement}>*</TText>
                        </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={styles.priceBtn}
                    onPress={() => {
                        // setMinPressed(false)
                        setMaxPressed(true)
                        maxPriceInput.current.focus()
                    }}
                >
                    <Icon name='arrow-up-box' size={22} style={{marginRight: maxPressed ? 12 : 0}} color={"#666"} />
                    <TextInput 
                        placeholder='Min. Labor Price'
                        keyboardType='decimal-pad'
                        ref={maxPriceInput}
                        val={maxPriceText ? maxPriceText : ""}
                        onChangeText={text => setMaxPriceText(text)}
                        style={[styles.textInputMinMax, {opacity: maxPressed ? 1 : 0}]}
                    />
                    {
                        !maxPressed && 
                        <View style={[styles.rowGrpTxt, {zIndex: 5, position: 'absolute', left: 30}]}>
                            <TText style={styles.priceText}>Max. Labor Price</TText>
                            <TText style={styles.requirement}>*</TText>
                        </View>
                    }
                </TouchableOpacity>
            </View>
            {/* Date Time Picker */}
            <View style={styles.rowContainer}>
                <TouchableOpacity style={styles.priceBtn} onPress={() => setDatePickerVisibility(true)}>
                    <Icon name='calendar-month' size={22} color={"#666"} />
                    {
                        dateSelected ? 
                        <View style={[styles.rowGrpTxt, {flexGrow: 1}]}>
                            <TText style={styles.priceText}>{displayDate}</TText>
                        </View>
                        : 
                        <View style={[styles.rowGrpTxt, {flexGrow: 1}]}>
                            <TText style={styles.priceText}>Date</TText>
                            <TText style={styles.requirement}>*</TText>
                        </View>
                    }
                    <Icon name='chevron-down' size={20} color={"#666"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.priceBtn} onPress={() => setTimePickerVisibility(true)}>
                    <Icon name='clock-outline' size={22} color={"#666"} />
                    {
                        timeSelected ? 
                        <View style={[styles.rowGrpTxt, {flexGrow: 1}]}>
                            <TText style={styles.priceText}>{displayTime}</TText>
                        </View>
                        : 
                        <View style={[styles.rowGrpTxt, {flexGrow: 1}]}>
                            <TText style={styles.priceText}>Time</TText>
                            <TText style={styles.requirement}>*</TText>
                        </View>
                    }
                    <Icon name='chevron-down' size={20} color={"#666"} />
                </TouchableOpacity>
            </View>
            {/* Address Picker | Location Picker */}
            <View style={styles.rowContainer}>
                <TouchableOpacity style={[styles.priceBtn, {flex: 1, paddingVertical: 10, paddingHorizontal: 14}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='map' size={22} color={"#666"} />
                        <TextInput 
                            placeholder='Use a different address (Optional)'
                            onChangeText={val => setOtherAddress(val)}
                            style={{fontFamily: "LexendDeca", fontSize: 15, marginLeft: 8, width: '92%'}}
                        />
                    </View>
                    
                    {/* <Icon name='map-marker' size={20} style={{marginLeft: 'auto'}} /> */}
                </TouchableOpacity>
            </View>
        </View>

        {/* Post Button */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.postBtn, {backgroundColor: disabledBtn ? 'gray' : ThemeDefaults.themeOrange}]}
                // disabled={!disabledBtn}
                onPress={() => {
                    setPostBtnModal(true)
                }}
            >
                <TText style={styles.postBtnTxt}>Post Request</TText>
            </TouchableOpacity>
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
                            <TText style={styles.dialogueMessageText}>By clicking confirm, your post with your name and address will be visible to all the workers of HanapLingkod.</TText>
                        </View>
                        {/* Modal Buttons */}
                        <View style={styles.modalDialogueBtnCont}>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeOrange}]}
                                onPress={() => {
                                    setPostBtnModal(false)
                                }}
                            >
                                <TText style={styles.dialogueCancel}>Cancel</TText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => {
                                    setConfirmPost(true)
                                    setPostBtnModal(false)
                                    handlePostRequest()
                                }}
                            >
                                <TText style={styles.dialogueConfirm}>Confirm</TText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>

      </View>
    </ScrollView>
  )
}

export default PostRequestForm

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 25,
        marginTop: 30
    },
    nameAddressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 15
    },
    userInfoCont: {
        flex: 0.95,
        marginLeft: 15,
    },
    userInfoName: {
        fontSize: 18,
        fontFamily: 'LexendDeca_Medium',
        marginBottom: 5
    },
    addressCont: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    addressText: {
        marginLeft: 8,
        fontFamily: 'LexendDeca',
        fontSize: 14
    },
    categoryContainer: {
        alignItems: 'flex-start',
        marginTop: 18
    },
    categoryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#bbb",
    },
    categoryText: {
        fontSize: 14
    },
    textInputContainer: {
        marginTop: 20,
    },
    textInput: {
        fontFamily: 'LexendDeca',
        fontSize: 16,
        textAlignVertical: 'top',
        lineHeight: 30
    },
    additionalInfoCont: {
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 16,
    },
    priceBtn: {
        flex: 0.48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderWidth: 1.5,
        borderColor: "#bbb",
        borderRadius: 10,
    },
    rowGrpTxt: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    },
    textInputMinMax: {
        fontFamily: 'LexendDeca',
        fontSize: 14,
        flex: 1,
    },
    priceText: {
        fontSize: 14
    },
    requirement: {
        color: ThemeDefaults.appIcon,
        marginLeft: 3,
        marginRight: 5,
        fontSize: 20,
    },
    buttonContainer: {
        paddingHorizontal: 40,
        marginTop: 80
    },
    postBtn: {
        paddingVertical: 15,
        borderRadius: 15,
        backgroundColor: ThemeDefaults.themeOrange,
        alignItems: 'center',
        elevation: 4,
        marginBottom: 10
    },
    postBtnTxt: {
        fontFamily: "LexendDeca_SemiBold",
        fontSize: 18,
        color: ThemeDefaults.themeWhite,
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
        borderColor: ThemeDefaults.themeDarkerOrange,
        borderRadius: 15,
        overflow: 'hidden',
    },
    dialogueMessage: {
        paddingVertical: 40,
        paddingHorizontal: 40,
        backgroundColor: ThemeDefaults.themeDarkerOrange,
    },
    dialogueMessageText: {
        color: ThemeDefaults.themeWhite,
        textAlign: 'center',
        fontFamily: 'LexendDeca_Medium'
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