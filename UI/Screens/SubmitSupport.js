import { StyleSheet, Text, View, StatusBar, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import DialogueModal from '../Components/DialogueModal'

const SubmitSupport = () => {

    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    const [viewSubmitModal, setViewSubmitModal] = useState(false)

    const handleSubmitSupportMail = () => {
        try {
            // await fetch()
            console.log("handleSubmitSupport")
            setViewSubmitModal(false)
        } catch (error) {
            console.log("submit support email: ", error)
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

            <View style={styles.headerContainer}>
                <TText style={styles.headerTitle}>Ask for Support</TText>
                <TText style={styles.headerSubTitle}>Submit a question or issues about the HanapLinkod Application</TText>
            </View>

            <View style={styles.body}>

                <View style={styles.input_section}>
                    <TText style={styles.inputTitle}>From:</TText>
                    <View style={styles.container_input}>
                        <TextInput 
                            placeholder='Enter your email here'
                            style={styles.input_email}
                        />
                    </View>
                </View>

                <View style={styles.input_section}>
                    <TText style={styles.inputTitle}>Subject:</TText>
                    <View style={styles.container_input}>
                        <TextInput 
                            placeholder='Enter subject here'
                            style={styles.input_email}
                        />
                    </View>
                </View>

                <View style={styles.input_section}>
                    <TText style={styles.inputTitle}>Message:</TText>
                    <View style={styles.container_input}>
                        <TextInput 
                            placeholder='Enter description here'
                            multiline
                            numberOfLines={6}
                            textAlignVertical={"top"}
                            style={[styles.input_email, {paddingTop: 5}]}
                        />
                    </View>
                </View>

                <View style={styles.container_submitButton}>
                    <TouchableOpacity
                        style={styles.button_submit}
                        activeOpacity={0.5}
                        onPress={() => {
                            console.log("submit email")
                            setViewSubmitModal(true)
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
        marginTop: 100
    },
    button_submit: {
        paddingVertical: 15,
        backgroundColor: ThemeDefaults.themeOrange,
        alignItems: 'center',
        borderRadius: 15
    },
    button_textSubmit: {
        fontFamily: 'LexendDeca_Medium',
        fontSize: 18,
        color: ThemeDefaults.themeWhite
    },
})