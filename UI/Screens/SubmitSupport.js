import { StyleSheet, Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import DialogueModal from '../Components/DialogueModal'
import { useIsFocused, useNavigation } from '@react-navigation/native'

const SubmitSupport = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    const [invalidEmail, setInvalidEmail] = useState(false)
    const [viewInvalidEmailModal, setViewInvalidEmailModal] = useState(false)

    const [viewSubmitModal, setViewSubmitModal] = useState(false)

    useEffect(() => {
        setEmail("")
        global.userData?.emailAddress && setEmail(global.userData.emailAddress)
        setSubject("")
        setMessage("")
        setInvalidEmail(false)
        setViewInvalidEmailModal(false)
        setViewSubmitModal(false)
    }, [isFocused]);

    const handleSubmitSupportMail = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/customerSupport`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
                body: JSON.stringify({
                    email: email,
                    subject: subject,
                    text: message
                })
            })
            .then(() => {
                console.log("handleSubmitSupport")
                handleCloseModal()
                handleGoToHome()
            })
        } catch (error) {
            console.log("submit support email: ", error)
        }
    }
    
    const handleCloseModal = () => {
        setViewSubmitModal(false)
    }
    
    const handleGoToHome = () => {
        navigation.navigate("Home_Drawer")
    }

    const handleVerifyEmail = (val) => {
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)){
            // return true
            setInvalidEmail(true)
        }
        return false
    }

    return (
        <ScrollView style={styles.container}>
            <Appbar menuBtn={true} showLogo={true} hasPicture={true} />

            <View style={styles.headerContainer}>
                <TText style={styles.headerTitle}>Ask for Support</TText>
                <TText style={styles.headerSubTitle}>Submit a question or issues about the HanapLinkod Application</TText>
            </View>

            <View style={styles.body}>

                <View style={styles.input_section}>
                    <TText style={styles.inputTitle}>From: <TText style={{color: ThemeDefaults.themeRed}}>*</TText></TText>
                    <View style={styles.container_input}>
                        <TextInput 
                            placeholder='Enter your email here'
                            onChangeText={val => {
                                setEmail(val)
                            }}
                            keyboardType={"email-address"}
                            value={global.userData?.emailAddress ? global.userData?.emailAddress : email}
                            style={styles.input_email}
                        />
                    </View>
                </View>

                <View style={styles.input_section}>
                    <TText style={styles.inputTitle}>Subject: <TText style={{color: ThemeDefaults.themeRed}}>*</TText></TText>
                    <View style={styles.container_input}>
                        <TextInput 
                            placeholder='Enter subject here'
                            onChangeText={val => setSubject(val)}
                            value={subject ? subject : ""}
                            style={styles.input_email}
                        />
                    </View>
                </View>

                <View style={styles.input_section}>
                    <TText style={styles.inputTitle}>Message: <TText style={{color: ThemeDefaults.themeRed}}>*</TText></TText>
                    <View style={styles.container_input}>
                        <TextInput 
                            placeholder='Enter description here'
                            multiline
                            numberOfLines={6}
                            textAlignVertical={"top"}
                            onChangeText={val => setMessage(val)}
                            value={message ? message : ""}
                            style={[styles.input_email, {paddingTop: 5}]}
                        />
                    </View>
                </View>

                <View style={styles.container_submitButton}>
                    <TouchableOpacity
                        style={[styles.button_submit, {backgroundColor: !email || !subject || !message ? "#ccc" : ThemeDefaults.themeOrange, elevation: !email || !subject || !message ? 0 : 3}]}
                        activeOpacity={0.5}
                        disabled={
                            !email || !subject || !message
                        }
                        onPress={() => {
                            console.log("submit email")
                            if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
                                setViewSubmitModal(true)
                            } else {
                                setInvalidEmail(true)
                                setViewInvalidEmailModal(true)
                            }
                        }}
                    >
                        <TText style={styles.button_textSubmit}>Submit</TText>
                    </TouchableOpacity>
                </View>

                <DialogueModal 
                    firstMessage={"Are you sure you want to send this report?"}
                    secondMessage={"By clicking yes, your email will be sent to hanaplingkod@gmail.com and will be viewed by the admin."}
                    numBtn={2}
                    visible={viewSubmitModal}
                    onAccept={handleSubmitSupportMail}
                    onDecline={setViewSubmitModal}
                    confirmButtonText={"Yes"}
                />

                <DialogueModal 
                    firstMessage={"Invalid Email!"}
                    secondMessage={"The email to be submitted should be in the form of 'email@example.com'"}
                    numBtn={1}
                    warning
                    visible={viewInvalidEmailModal}
                    onDecline={setViewInvalidEmailModal}
                />

            </View>


        </ScrollView>
    )
}

export default SubmitSupport

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight
    },
    headerContainer: {
        marginVertical: 20,
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "LexendDeca_Medium",
        marginBottom: 12
    },
    headerSubTitle: {
        fontSize: 14,
        maxWidth: 340,
        textAlign: 'center'
    },
    body: {
        marginHorizontal: 40
    },
    input_section: {
        marginTop: 15,
        marginBottom: 15
    },
    inputTitle: {
        marginBottom: 8
    },
    container_input: {
        borderWidth: 1.3,
        borderColor: "#cbcbcb",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 15
    },
    input_email: {
        fontFamily: "LexendDeca",
        fontSize: 16
    },
    container_submitButton: {
        marginTop: 80
    },
    button_submit: {
        paddingVertical: 15,
        backgroundColor: ThemeDefaults.themeOrange,
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 20,
        elevation: 3
    },
    button_textSubmit: {
        fontFamily: 'LexendDeca_Medium',
        fontSize: 18,
        color: ThemeDefaults.themeWhite
    },
})