import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { IPAddress } from "../global/global";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ThemeDefaults from "../Components/ThemeDefaults";
import dayjs from "dayjs";
import Appbar from "../Components/Appbar";
import TText from "../Components/TText";
import { useNavigation } from "@react-navigation/native";
import RatingForm from "../Components/RatingForm";

// let dayOfYear = require('dayjs/plugin/dayOfYear')
// dayjs.extend(dayOfYear)
let dayOfYear = require("dayjs/plugin/dayOfYear");
dayjs.extend(dayOfYear);

const BookingInformation = ({ route }) => {
  const navigation = useNavigation();
  const { bookingID, bookingItem } = route.params;

  const [bookingInformation, setBookingInformation] = useState({});
  const [isLoading, setisLoading] = useState(false);

  const [viewCancelModal, setViewCancelModal] = useState(false);
  const [bookingCanceled, setBookingCanceled] = useState(false);

  const [messageInputVisibility, setMessageInputVisibility] = useState(true);

  const [canceledMessage, setCanceledMessage] = useState("");
  const [hasSentCancelMessage, setHasSentCancelMessage] = useState(false);

  const [twoBookingStatus, setTwoBookingStatus] = useState(false);
  const [btnStatus, setBtnStatus] = useState("On My Way!");
  const [isToday, setIsToday] = useState(false);

  const [viewOTPModal, setViewOTPModal] = useState(false);

  const [viewWrongScheduleModal, setViewWrongScheduleModal] = useState(false);

  useEffect(() => {
    setisLoading(true);
    handleFetchBookingInformation();
    console.log("BookingItem: ", bookingItem);

    let interval = setInterval(() => {
      handleFetchBookingInformation();
    }, 10000);

    setBtnStatus("On My Way!");
    setIsToday(
      dayjs(new Date()).format("YYYY-MM-DD") ===
        dayjs(bookingItem.serviceDate).format("YYYY-MM-DD")
    );
    setBookingCanceled(false);
    setHasSentCancelMessage(false);
    setMessageInputVisibility(true);
    setTwoBookingStatus(false);

    setisLoading(false);

    return () => {
      clearInterval(interval);
    };
  }, [route]);

  const handleFetchBookingInformation = async () => {
    await fetch(
      `http://${IPAddress}:3000/booking/${global.userData._id}/${bookingID}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log("updated booking information - ", data)
        let list = { ...data[0] };
        // console.log("data[0] : ", list)
        setBookingInformation({ ...list });
        console.log("fetched : ");
        console.log("fetched : ", list);
      })
      .catch((err) => console.log("error fetching booking info: ", err.msg));
  };

  const handleUpdateBookingStatus = async (status) => {
    setTwoBookingStatus(true);
    setViewWrongScheduleModal(false);
    console.log("status: ", status);
    try {
      await fetch(
        `http://${IPAddress}:3000/booking/${global.userData._id}/${bookingID}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            bookingStatus: status,
          }),
        }
      );

      // setBookingCanceled(false)
      handleFetchBookingInformation();

      console.log("Success: Updated Booking - status ", status);
    } catch (error) {
      console.log("Error: Cancel Booking - ", error.msg);
    }
    setViewCancelModal(false);
  };

  const handleSendCancelMessage = async () => {
    try {
      // await fetch(`http://${IPAddress}:3000/${global.userData._id}/${bookingID}`, {
      //     method: "PUT",
      //     headers: {
      //         'content-type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //         bookingStatus: 4
      //     })
      // })
      // console.log("Success: Sent reason for Cancelation of Booking")

      setHasSentCancelMessage(true);
      setMessageInputVisibility(false);
      set;
    } catch (error) {
      console.log("Error: Sending reason of cancellation failed - ", error.msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />
      <TText style={styles.mainHeader}>Booking Information</TText>

      <View style={styles.workInformation}>
        {bookingInformation.bookingStatus == "2" && !bookingCanceled && (
          <View style={styles.headsUpContainer}>
            <TText style={styles.headsUpMessage}>
              {global.userData.role === "recruiter"
                ? "Worker is on their way..."
                : "On the way to Recruiter's address..."}
            </TText>
          </View>
        )}

        <TText style={styles.bookingSubCat}>{bookingItem.subCategory}</TText>
        <TText style={styles.bookingSchedule}>
          {dayjs(bookingItem.serviceDate).format("MMMM DD")},{" "}
          {dayjs(bookingItem.startTime).format("hh:mm A")}
          {isToday && " (Today)"}
          {/* {
                        bookingItem.bookingStatus == '2' ? global.userData.role === 'recruiter' ? "Worker is on the way..." : "On the way to Recruiter's address" : null
                    } */}
          {/* {
                        twoBookingStatus ? global.userData.role === 'recruiter' ? "Worker is on the way..." : "On the way to Recruiter's address..." : null
                    } */}
        </TText>

        <View style={styles.workerCard}>
          {global.userData.role === "recruiter" ? (
            <Image
              style={styles.workerPic}
              source={
                bookingItem.workerId.profilePic === "pic"
                  ? require("../assets/images/default-profile.png")
                  : { uri: bookingItem.workerId.profilePic }
              }
            />
          ) : (
            <Image
              style={styles.workerPic}
              source={
                bookingItem.recruiterId.profilePic === "pic"
                  ? require("../assets/images/default-profile.png")
                  : { uri: bookingItem.recruiterId.profilePic }
              }
            />
          )}

          {global.userData.role === "recruiter" ? (
            <View style={styles.workerInformation}>
              <TText style={styles.workerName}>
                {bookingItem.workerId.firstname} {bookingItem.workerId.lastname}{" "}
                {bookingItem.workerId.verification ? (
                  <Icon
                    name="check-decagram"
                    color={ThemeDefaults.appIcon}
                    size={20}
                    style={{ marginLeft: 5 }}
                  />
                ) : null}{" "}
              </TText>
              <View style={styles.workerRating}>
                <Icon name="star" size={18} color={"gold"} />
                <TText style={styles.workerRatingText}>4.7</TText>
              </View>
            </View>
          ) : (
            <View style={styles.workerInformation}>
              <TText style={styles.workerName}>
                {bookingItem.recruiterId.firstname}{" "}
                {bookingItem.recruiterId.lastname}{" "}
                {bookingItem.recruiterId.verification ? (
                  <Icon
                    name="check-decagram"
                    color={ThemeDefaults.appIcon}
                    size={20}
                    style={{ marginLeft: 5 }}
                  />
                ) : null}{" "}
              </TText>
              <View style={styles.workerRating}>
                <Icon name="star" size={18} color={"gold"} />
                <TText style={styles.workerRatingText}>4.7</TText>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.gotoProfileBtn}
            activeOpacity={0.5}
            onPress={() => {
              global.userData.role === "recruiter"
                ? console.log("Worker Profile")
                : console.log("Recruiter Profile");
            }}
          >
            <TText style={styles.profileBtnText}>Profile</TText>
          </TouchableOpacity>
        </View>
      </View>

      {bookingInformation.bookingStatus == "2" ||
      (global.userData.role === "worker" && !bookingCanceled) ? (
        <TouchableOpacity
          style={[
            styles.statusUpdaterBtn,
            {
              backgroundColor:
                twoBookingStatus || bookingInformation.bookingStatus == "2"
                  ? ThemeDefaults.themeLighterBlue
                  : ThemeDefaults.themeOrange,
            },
          ]}
          activeOpacity={0.6}
          onPress={() => {
            console.log("On my way!");
            if (isToday) {
              handleUpdateBookingStatus(2);
            } else {
              setTwoBookingStatus(true);
              setViewWrongScheduleModal(true);
            }

            if (btnStatus === "Show OTP") {
              setViewOTPModal(true);
            }
          }}
        >
          <TText style={[styles.statusUpdaterText]}>
            {bookingInformation.bookingStatus == "2"
              ? "Show OTP"
              : global.userData.role === "recruiter"
              ? null
              : "On My Way!"}
          </TText>
        </TouchableOpacity>
      ) : null}

      {bookingItem.description && !bookingCanceled ? (
        <>
          <View style={styles.bookingDescription}>
            <TText style={styles.bookingDescriptionHeader}>
              Additional description
            </TText>
            <TText style={styles.bookingDescriptionText}>
              {bookingItem.description}
            </TText>
          </View>

          <View style={styles.recruiterCard}>
            <View style={styles.recruiterInformation}>
              {/* <Icon name={'map-outline'} size={18} color={ThemeDefaults.themeLighterBlue} /> */}
              <TText style={styles.recruiterName}>Address</TText>
            </View>
            <View style={styles.addressInformation}>
              <TText style={styles.addressText}>
                <Icon
                  name={"map-outline"}
                  size={18}
                  color={ThemeDefaults.themeLighterBlue}
                />{" "}
                {bookingItem.address}
              </TText>
            </View>
          </View>
        </>
      ) : null}

      <View style={styles.whenInformation}>
        <TText style={styles.whenHeader}>Date and Time</TText>
        <View style={styles.dateTimeInformation}>
          <View style={styles.whenItem}>
            <Icon
              name="calendar-month"
              size={18}
              color={ThemeDefaults.themeLighterBlue}
            />
            <TText style={styles.whenText}>
              {dayjs(bookingItem.serviceDate).format("MMMM D")}
            </TText>
          </View>
          <View style={styles.whenItem}>
            <Icon
              name="clock-outline"
              size={18}
              color={ThemeDefaults.themeLighterBlue}
            />
            <TText style={styles.whenText}>
              {dayjs(bookingItem.startTime).format("hh:mm A")}
            </TText>
          </View>
        </View>
      </View>

      {!bookingCanceled && (
        <>
          <View style={styles.paymentInformation}>
            <TText style={styles.paymentHeader}>
              {global.userData.role === "recruiter"
                ? "Please prepare your payment for the service"
                : `Service fee for ${bookingItem.subCategory}`}
            </TText>
            <TText
              style={styles.paymentText}
            >{`₱ ${bookingItem.minPrice}  -  ₱ ${bookingItem.maxPrice}`}</TText>
          </View>

          {!twoBookingStatus && (
            <View style={styles.waitCancel}>
              {global.userData.role === "recruiter" ? (
                <TText style={styles.waitCancelText}>
                  Please wait for the worker or{" "}
                </TText>
              ) : (
                <TText style={styles.waitCancelText}>
                  Wait for the scheduled time or{" "}
                </TText>
              )}
              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.5}
                onPress={() => {
                  console.log("Cancel booking");
                  setViewCancelModal(true);
                }}
              >
                <TText style={styles.cancelText}>cancel booking</TText>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {/* If booking is cancelled */}

      {hasSentCancelMessage && (
        <View style={styles.messageToOtherCancellationContainer}>
          <TText style={styles.messageCancelHeader}>Message to Recruiter</TText>
          <View style={styles.messageContainer}>
            <Image
              style={styles.messageUserPic}
              source={
                global.userData.profilePic === "pic"
                  ? require("../assets/images/default-profile.png")
                  : { uri: global.userData.profilePic }
              }
            />
            <View style={styles.messageBoxContainer}>
              <TText style={styles.messageText}>
                Sorry, kailangan ko pumunta ng hospital
              </TText>
            </View>
          </View>
        </View>
      )}

      {bookingCanceled && messageInputVisibility ? (
        <View style={styles.messagingContainer}>
          <TText style={styles.messageHeader}>
            State the reason of cancellation
          </TText>
          <View style={styles.inputContainer}>
            <View style={styles.messagingTextInputContainer}>
              <TextInput
                numberOfLines={1}
                placeholder="Write a message"
                autoCorrect={false}
                cursorColor={ThemeDefaults.themeDarkBlue}
                style={styles.messagingTextInput}
                onChangeText={(val) => {
                  console.log(val);
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.sendBtnContainer}
              activeOpacity={0.4}
              onPress={() => {
                console.log("HI");
                handleSendCancelMessage();
              }}
            >
              <Icon
                name="send"
                size={22}
                color={ThemeDefaults.themeOrange}
                style={styles.sendIcon}
              />
              <TText style={styles.sendBtnTxt}>Send</TText>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* Modals */}

      {/* Modal for Cancellation */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={viewCancelModal}
        onRequestClose={() => setViewCancelModal(false)}
      >
        {/* Modal View */}
        <View style={styles.modalDialogue}>
          {/* Modal Container */}
          <View style={styles.dialogueContainer}>
            {/* Modal Message/Notice */}
            <View style={styles.dialogueMessage}>
              <TText style={[styles.dialogueMessageText]}>
                Are you sure you want to{" "}
                <TText style={{ color: ThemeDefaults.themeOrange }}>
                  cancel
                </TText>{" "}
                the booking?
              </TText>
            </View>
            {/* Modal Buttons */}
            <View style={styles.modalDialogueBtnCont}>
              <TouchableOpacity
                style={[
                  styles.dialogueBtn,
                  {
                    borderRightWidth: 1.2,
                    borderColor: ThemeDefaults.themeLighterBlue,
                  },
                ]}
                onPress={() => {
                  handleUpdateBookingStatus(4);
                }}
              >
                <TText style={styles.dialogueCancel}>Yes</TText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogueBtn}
                onPress={() => {
                  setViewCancelModal(false);
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
        animationType="fade"
        visible={viewWrongScheduleModal}
        onRequestClose={() => setViewWrongScheduleModal(false)}
      >
        {/* Modal View */}
        <View style={styles.modalDialogue}>
          {/* Modal Container */}
          <View style={styles.dialogueContainer}>
            {/* Modal Message/Notice */}
            <View style={styles.dialogueMessage}>
              <TText style={[styles.dialogueMessageText, { marginBottom: 15 }]}>
                Today is not the scheduled date.
              </TText>
              <TText style={[styles.dialogueMessageText]}>
                Do you still want to continue?
              </TText>
            </View>
            {/* Modal Buttons */}
            <View style={styles.modalDialogueBtnCont}>
              <TouchableOpacity
                style={[
                  styles.dialogueBtn,
                  {
                    borderRightWidth: 1.2,
                    borderColor: ThemeDefaults.themeLighterBlue,
                  },
                ]}
                onPress={() => {
                  // if user said continue
                  handleUpdateBookingStatus(2);
                }}
              >
                <TText style={styles.dialogueCancel}>Continue</TText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogueBtn}
                onPress={() => {
                  setViewWrongScheduleModal(false);
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
        animationType="fade"
        visible={viewOTPModal}
        onRequestClose={() => setViewOTPModal(false)}
      >
        {/* Modal View */}
        <View style={styles.modalDialogue}>
          {/* Modal Container */}
          <View style={styles.dialogueContainer}>
            {/* Modal Message/Notice */}
            {global.userData.role === "recruiter" ? (
              <>
                <View style={styles.dialogueMessage}>
                  <TText
                    style={[
                      styles.dialogueMessageText,
                      { fontSize: 18, marginBottom: 5 },
                    ]}
                  >
                    Compare OTP to Worker
                  </TText>
                  <TText
                    style={[
                      styles.dialogueMessageText,
                      { fontSize: 14, marginBottom: 20, color: "#f0f0f0" },
                    ]}
                  >
                    The recruiter should confirm the OTP to start the service
                  </TText>
                  <TText style={[styles.dialogueMessageText, { fontSize: 25 }]}>
                    {bookingItem.otp}
                  </TText>
                </View>
                {/* Modal Buttons */}
                <View style={styles.modalDialogueBtnCont}>
                  <TouchableOpacity
                    style={[
                      styles.dialogueBtn,
                      {
                        borderRightWidth: 1.2,
                        borderColor: ThemeDefaults.themeLighterBlue,
                      },
                    ]}
                    onPress={() => {
                      setViewOTPModal(false);

                      // update booking status to 2 (on going)
                    }}
                  >
                    <TText style={styles.dialogueCancel}>Confirm OTP</TText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dialogueBtn}
                    onPress={() => {
                      setViewOTPModal(false);
                    }}
                  >
                    <TText style={styles.dialogueConfirm}>Hide OTP</TText>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.dialogueMessage}>
                  <TText
                    style={[
                      styles.dialogueMessageText,
                      { fontSize: 18, marginBottom: 5 },
                    ]}
                  >
                    Compare OTP to Recruiter
                  </TText>
                  <TText
                    style={[
                      styles.dialogueMessageText,
                      { fontSize: 14, marginBottom: 20, color: "#f0f0f0" },
                    ]}
                  >
                    The Recruiter should confirm the OTP and the service should
                    automatically start
                  </TText>
                  <TText style={[styles.dialogueMessageText, { fontSize: 25 }]}>
                    {bookingItem.otp}
                  </TText>
                </View>
                {/* Modal Buttons */}
                <View style={styles.modalDialogueBtnCont}>
                  <TouchableOpacity
                    style={[
                      styles.dialogueBtn,
                      {
                        borderRightWidth: 1.2,
                        borderColor: ThemeDefaults.themeLighterBlue,
                      },
                    ]}
                    onPress={() => {
                      setViewOTPModal(false);
                    }}
                  >
                    <TText style={styles.dialogueCancel}>Hide OTP</TText>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Rating Form */}
      {bookingItem.bookingStatus == "5" && <RatingForm item={bookingItem} />}
      {/* <RatingForm item={bookingItem} /> */}
    </ScrollView>
  );
};

export default BookingInformation;

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    // flex: 1,
    // height: '100%',
    marginTop: StatusBar.currentHeight,
    backgroundColor: "#fefefe",
    paddingBottom: 100,
  },
  mainHeader: {
    marginVertical: 30,
    textAlign: "center",
    fontSize: 18,
  },
  workInformation: {
    marginHorizontal: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#d7d7d7",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  headsUpContainer: {
    backgroundColor: ThemeDefaults.themeOrange,
    paddingVertical: 10,
    alignItems: "center",
  },
  headsUpMessage: {
    fontFamily: "LexendDeca_Medium",
    color: ThemeDefaults.themeWhite,
  },
  bookingSubCat: {
    paddingTop: 40,
    marginBottom: 5,
    textAlign: "center",
    // paddingVertical: 50,
    fontSize: 20,
    fontFamily: "LexendDeca_SemiBold",
  },
  bookingSchedule: {
    paddingBottom: 40,
    textAlign: "center",
    fontSize: 15,
    fontFamily: "LexendDeca_Medium",
    color: "gray",
  },
  workerCard: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1.5,
    borderTopColor: "#d7d7d7",
  },
  workerPic: {
    width: 70,
    height: 70,
  },
  workerInformation: {
    paddingLeft: 15,
  },
  workerName: {
    fontFamily: "LexendDeca_Medium",
    alignItems: "center",
    maxWidth: 220,
  },
  workerRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  workerRatingText: {
    fontSize: 14,
    marginLeft: 5,
  },
  gotoProfileBtn: {
    marginLeft: "auto",
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 18,
    backgroundColor: ThemeDefaults.themeLighterBlue,
    borderRadius: 10,
    elevation: 3,
  },
  profileBtnText: {
    color: ThemeDefaults.themeWhite,
    fontSize: 12,
  },
  bookingDescription: {
    marginTop: 15,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#d7d7d7",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 30,
  },
  bookingDescriptionHeader: {
    fontSize: 12,
    color: "gray",
    marginBottom: 8,
  },
  bookingDescriptionText: {},
  recruiterCard: {
    marginTop: 15,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#d7d7d7",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 30,
  },
  recruiterInformation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  recruiterName: {
    // marginLeft: 10,
    fontSize: 12,
    color: "gray",
  },
  addressInformation: {},
  addressText: {
    fontFamily: "LexendDeca_Medium",
    fontSize: 17,
  },
  whenInformation: {
    marginTop: 15,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#d7d7d7",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 30,
  },
  whenHeader: {
    marginBottom: 8,
    fontSize: 12,
    color: "gray",
  },
  dateTimeInformation: {
    flexDirection: "row",
    alignItems: "center",
  },
  whenItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 50,
  },
  whenText: {
    fontSize: 17,
    marginLeft: 8,
  },
  paymentInformation: {
    marginTop: 15,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#d7d7d7",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  paymentHeader: {
    width: "45%",
  },
  paymentText: {
    width: "55%",
    textAlign: "center",
    fontFamily: "LexendDeca_Medium",
    fontSize: 18,
    paddingLeft: 20,
  },
  waitCancel: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  waitCancelText: {},
  cancelBtn: {},
  cancelText: {
    textDecorationLine: "underline",
    color: ThemeDefaults.themeOrange,
  },
  messagingContainer: {
    justifyContent: "center",

    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,

    height: 120,
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderTopColor: "rgba(0,0,0,0.1)",
    borderTopWidth: 1.5,
  },
  messageHeader: {
    marginBottom: 5,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  messagingTextInputContainer: {
    width: "85%",
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingRight: 10,
    borderRadius: 10,
  },
  messagingTextInput: {
    paddingLeft: 10,
    // paddingHorizontal: 0,
    fontFamily: "LexendDeca",
  },
  sendBtnContainer: {
    marginLeft: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: {
    transform: [{ rotate: "-45deg" }],
  },
  sendBtnTxt: {
    fontSize: 12,
  },
  messageToOtherCancellationContainer: {
    marginTop: 50,
    marginHorizontal: 30,
  },
  messageCancelHeader: {
    marginBottom: 15,
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
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
    backgroundColor: "#eee",
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
    alignItems: "center",
    backgroundColor: ThemeDefaults.themeOrange,
    borderRadius: 15,
    elevation: 3,
  },
  statusUpdaterText: {
    color: ThemeDefaults.themeWhite,
    fontFamily: "LexendDeca_SemiBold",
    fontSize: 18,
  },

  modalDialogue: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  dialogueContainer: {
    borderWidth: 1.5,
    borderColor: ThemeDefaults.themeLighterBlue,
    borderRadius: 15,
    overflow: "hidden",
  },
  dialogueMessage: {
    paddingVertical: 40,
    paddingHorizontal: 50,
    backgroundColor: ThemeDefaults.themeLighterBlue,
  },
  dialogueMessageText: {
    color: ThemeDefaults.themeWhite,
    textAlign: "center",
    fontFamily: "LexendDeca_Medium",
  },
  modalDialogueBtnCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: ThemeDefaults.themeWhite,
  },
  dialogueBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  dialogueCancel: {},
  dialogueConfirm: {
    color: ThemeDefaults.themeDarkerOrange,
    fontFamily: "LexendDeca_Medium",
  },
});
