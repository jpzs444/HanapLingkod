import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import TText from './TText'
import dayjs from 'dayjs'

const WorkInformationCard = ({bookingInformation, bookingItem}) => {
    return (
        <View style={styles.workInformation}>
            {
                bookingInformation.bookingStatus == '2' && !bookingCanceled &&
                <View style={styles.headsUpContainer}>
                    <TText style={styles.headsUpMessage}>
                        {
                            global.userData.role === 'recruiter' ? "Worker is on their way..." : "On the way to Recruiter's address..."
                        }
                    </TText>
                </View>
            }

            <TText style={styles.bookingSubCat}>{bookingItem.subCategory}</TText>
            <TText style={styles.bookingSchedule}>
                
                {dayjs(bookingItem.serviceDate).format("MMMM DD")},  {dayjs(bookingItem.startTime).format("hh:mm A")}
                
                {
                    isToday && " (Today)"
                }

                {/* {
                    bookingItem.bookingStatus == '2' ? global.userData.role === 'recruiter' ? "Worker is on the way..." : "On the way to Recruiter's address" : null
                } */}

                {/* {
                    twoBookingStatus ? global.userData.role === 'recruiter' ? "Worker is on the way..." : "On the way to Recruiter's address..." : null
                } */}
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
                            <TText style={styles.workerRatingText}>4.7</TText>
                        </View>
                    </View>
                    :
                    <View style={styles.workerInformation}>
                        <TText style={styles.workerName}>{bookingItem.recruiterId.firstname} {bookingItem.recruiterId.lastname}  {bookingItem.recruiterId.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null} </TText>
                        <View style={styles.workerRating}>
                            <Icon name='star' size={18} color={"gold"} />
                            <TText style={styles.workerRatingText}>4.7</TText>
                        </View>
                    </View>
                }

                <TouchableOpacity 
                    style={styles.gotoProfileBtn}
                    activeOpacity={0.5}
                    onPress={() => {
                        global.userData.role === 'recruiter' ? 
                        console.log("Worker Profile") 
                        : 
                        console.log("Recruiter Profile")
                    }}
                >
                    <TText style={styles.profileBtnText}>Profile</TText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default WorkInformationCard

const styles = StyleSheet.create({
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
        alignItems: 'center'
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
})