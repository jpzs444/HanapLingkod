import { StyleSheet, Text, View, StatusBar, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import DialogueModal from '../Components/DialogueModal'
import { useNavigation } from '@react-navigation/native'

const ReportUser = ({route}) => {

  const navigation = useNavigation()

  const { userReportedID, userFullName, userRole, userProfilePicture } = route.params

  const [reportTitle, setReportTitle] = useState("")
  const [reportDescription, setReportDescription] = useState("")

  const [viewSubmitModal, setViewSubmitModal] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)

  const handleSubmitReport = async () => {
    try {
      setViewSubmitModal(false)
      await fetch(`https://hanaplingkod.onrender.com/reportAUser`, {
        method: "POST",
        headers: {
          'content-type': 'application/json',
          "Authorization": global.accessToken
        },
        body: JSON.stringify({
          title: reportTitle,
          reportedUser: userReportedID,
          description: reportDescription,
          senderId: global.userData._id,
        })
      }).then(res => res.json())
      .then(data => {
        console.log("Successfully reported user: ", data)
        setReportSubmitted(true)
        navigation.navigate("Home_Drawer")
      })
      console.log("handleSubmiReport button")
    } catch (error) {
      console.log("submit report error: ", error)
    }
  }

  return (
    <ScrollView style={styles.container}>
        <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />
        <TText style={styles.screenHeader}>Report User</TText>

        <View style={styles.body}>
          {/* Report Title input */}
          <View style={styles.reportTitleContainer}>
          <TText style={styles.titleReport}>Report Title</TText>
            <View style={styles.reportinputTitleContainer}>
              <Icon name="pencil" size={20} />
              <TextInput 
                placeholder='Enter your title here *'
                value={reportTitle ? reportTitle : ""}
                onChangeText={val => setReportTitle(val)}
                style={styles.input_reportTitle}
              />
            </View>
            <TText style={styles.reportTitle_instruction}>(Please make the topic as clear and to the point as possible)</TText>
          </View>

          {/* Reported User information */}
          <View style={styles.reportedUserSection}>
            <TText style={styles.headerTitle}>Reported User</TText>

            <View style={styles.reportedUser_information_container}>
              <Image style={styles.userReportedImage} source={ userProfilePicture ? {uri: userProfilePicture} : require("../assets/images/default-profile.png")} />

              <View style={styles.reportedUser_nameRole}>
                <TText style={styles.reportedUser_name}>{userFullName}</TText>
                <TText style={styles.reportedUser_role}>{userRole}</TText>
              </View>
            </View>
          </View>

          {/* Report Description Input */}
          <View style={styles.description_section}>
            <TText style={styles.headerTitle}>Description</TText>

            <View style={styles.inputContainer}>
              <TextInput 
                placeholder='Write here the description of your report'
                multiline
                value={reportDescription ? reportDescription : ""}
                numberOfLines={6}
                textAlignVertical={"top"}
                onChangeText={val => setReportDescription(val)}
                style={styles.input_description}
              />
            </View>
          </View>

          {/* Report submmit button */}
          <View style={styles.submitButton_container}>
            <TouchableOpacity
              style={styles.submittButton}
              activeOpacity={0.5}
              onPress={() => {
                console.log("Submit report button")
                setViewSubmitModal(true)
              }}
            >
              <TText style={styles.submmitButton_text}>Submit Report</TText>
            </TouchableOpacity>
          </View>

        </View>

        <DialogueModal 
          firstMessage={"Are you sure you want to send this report?"}
          secondMessage={"By clicking yes, you agree that whatever you entered is legit and false information might get your account penalized."}
          visible={viewSubmitModal}
          numBtn={2}
          onAccept={handleSubmitReport}
          onDecline={setViewSubmitModal}
        />

        <DialogueModal 
          firstMessage={"User has been reported"}
          secondMessage={"Thank you for sending a report. HanapLingkod will review your submitted report and shall apply necessary actions"}
          visible={reportSubmitted}
          numBtn={1}
          onDecline={setReportSubmitted}
        />

    </ScrollView>
  )
}

export default ReportUser

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    backgroundColor: ThemeDefaults.themeWhite,
    flexGrow: 1,
  },
  screenHeader: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  body: {
    marginHorizontal: 30,
  },
  reportTitleContainer: {
    marginVertical: 20
  },
  titleReport: {
    marginBottom: 12,
    fontFamily: "LexendDeca_Medium"
  },
  reportinputTitleContainer: {
    borderWidth: 1.3,
    borderColor: "#cbcbcb",
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 8,
    paddingHorizontal: 15
  },
  input_reportTitle: {
    fontSize: 16,
    paddingLeft: 10,
    fontFamily: "LexendDeca",
    width: "93%"
  },
  reportTitle_instruction: {
    fontSize: 12,
    marginTop: 5,
    color: 'gray'
  },
  reportedUserSection: {
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 15,
    marginBottom: 12,
    fontFamily: "LexendDeca_Medium"
  },
  reportedUser_information_container: {
    borderWidth: 1.3,
    borderColor: '#cbcbcb',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: "#FBFBFB",
    maxWidth: 350
  },
  userReportedImage: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  reportedUser_nameRole: {
    paddingLeft: 20
  },
  reportedUser_name: {
    fontSize: 18,
    fontFamily: "LexendDeca_Medium"
  },
  reportedUser_role: {
    fontSize: 14,
    color: "#434343"
  },
  description_section: {
    marginTop: 40
  },
  inputContainer: {
    borderWidth: 1.3,
    borderColor: '#cbcbcb',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  input_description: {
    fontSize: 16,
    fontFamily: "LexendDeca"
  },
  submitButton_container: {
    marginTop: 100,
    paddingHorizontal: 40,
  },
  submittButton: {
    backgroundColor: ThemeDefaults.themeOrange,
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 15,
    elevation: 3
  },
  submmitButton_text: {
    color: ThemeDefaults.themeWhite,
    fontSize: 18,
    fontFamily: "LexendDeca_Medium"
  },
})