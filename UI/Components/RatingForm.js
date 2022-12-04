import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import TText from './TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import { IPAddress } from '../global/global'

import StarRating from 'react-native-star-rating-widget';
import DialogueModal from './DialogueModal'

const RatingForm = ({item, handleUpdate}) => {

    const [rating, setRating] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState("")
    const [viewRatingModal, setViewRatingModal] = useState(false)
    const [viewSubmitReviewModal, setSubmitReviewModal] = useState(false)

    const handleOnSubmitRatingFeedback = () => {
        // submit review

        let submitBy = global.userData.role === 'recruiter' ? 
            {statusRecruiter: 3, rating: rating, message: feedbackMessage ? feedbackMessage : ""} 
            : {statusWorker: 3, rating: rating, message: feedbackMessage ? feedbackMessage : ""}

        fetch(`http://${IPAddress}:3000/booking/${global.userData._id}/${item._id}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.userData.accessToken
            },
            body: JSON.stringify({
                ...submitBy
            })
        })
    }

    function handleOnSubmit () {
        handleOnSubmitRatingFeedback()
        handleUpdate()
        setSubmitReviewModal(false)
    }


    return (
        <View>
            <View style={styles.requestFormContainer}>
                {/* <View style={[styles.flexRow, styles.clientCard]}>
                    <Image style={styles.profilePic} source={{uri: global.userData.role === 'recruiter' ? item.workerId.profilePic : item.recruiterId.profilePic}} />
                    <View style={styles.requestInfo}>
                        <TText style={styles.requestInfoNameText}>{global.userData.role === 'recruiter' ? `${item.workerId.firstname} ${item.workerId.lastname}` : `${item.recruiterId.firstname} ${item.recruiterId.lastname}`}</TText>
                        <TText style={styles.requestInfoSubCatText}>{item.subCategory}</TText>
                        <TText style={styles.requestInfoAddressText}>{item.address}</TText>
                    </View>
                </View> */}

                <View style={[styles.feedbackHeader]}>
                    <Icon name="comment-quote" size={18} color={ThemeDefaults.themeDarkBlue} style={{paddingTop: 3}} />
                    <View>
                        <TText style={styles.headerText}>Feedback</TText>
                        <TText style={styles.headerSubText}>Please give a rating and a feedback</TText>
                    </View>
                </View>


                {/* Rating */}
                <View style={styles.ratingContainer}>
                    <StarRating
                        rating={rating}
                        onChange={setRating}
                        enableHalfStar={false}
                        animationConfig={{scale: 1.05, delay: 400}}
                        style={{alignSelf: 'center'}}
                    />
                </View>
                
                <View style={styles.textInputContainer}>
                    <TextInput 
                        multiline
                        numberOfLines={5}
                        placeholder='Write a review (Optional)'
                        placeholderTextColor={'rgba(0,0,0,0.35)'}
                        onChangeText={(val) => setFeedbackMessage(val)}
                        style={styles.textInputStyles}
                    />
                </View>

            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitBtn}
                    activeOpacity={0.5}
                    onPress={() => {
                        console.log("hi review")
                        if(rating > 0) {
                            setSubmitReviewModal(true)
                        } else {
                            setViewRatingModal(true)
                        }
                    }}
                >
                    <TText style={styles.submitBtnText}>Submit Review (Service is Finished)</TText>
                </TouchableOpacity>
            </View>

            <DialogueModal 
                firstMessage={"Invalid rating value. Please input a rating either from 1 to 5"}
                secondMessage={false}
                visible={viewRatingModal}
                warning={true}
                numBtn={1}
                // onAccept={handleOnSubmit}
                onDecline={setViewRatingModal}
            />

            <DialogueModal 
                firstMessage={"Are you sure you want to submit your review?"}
                secondMessage={"By clicking 'Yes', your review will be submitted and you agree that the service is already finished."}
                thirdMessage={"This process is irrevocable."}
                visible={viewSubmitReviewModal}
                numBtn={2}
                onAccept={handleOnSubmit}
                onDecline={setSubmitReviewModal}
            />

        </View>
    )
}

export default RatingForm

const styles = StyleSheet.create({
    requestFormContainer: {
        marginHorizontal: 30,
        marginTop: 10,
        padding: 15,
        backgroundColor: ThemeDefaults.themeWhite
    },
    profilePic: {
        width: 60,
        height: 60,
        borderRadius: 15
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    clientCard: {
        alignItems: 'flex-start'
    },
    requestInfo: {
        paddingLeft: 15,
        flex: 1,
    },
    requestInfoNameText: {
        fontSize: 12,
    },
    requestInfoSubCatText: {
        fontSize: 18,
        fontFamily: 'LexendDeca_Medium'
    },
    requestInfoAddressText: {
        fontSize: 12,
    },
    feedbackHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 20,
        marginBottom: 30,
        padding: 0
    },
    headerText: {
        marginLeft: 10,
        fontSize: 18
    },
    headerSubText: {
        fontSize: 14,
        marginLeft: 10,
        color: "rgba(0,0,0,0.56)"
    },
    textInputContainer: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 12,
        paddingTop: 15,
        justifyContent: 'flex-start'
    },
    textInputStyles: {
        fontFamily: 'LexendDeca',
        fontSize: 16,
        textAlignVertical: 'top',
        flexGrow: 1,
    },
    buttonContainer: {
        marginTop: 25,
        marginBottom: 10
    },
    submitBtn: {
        alignItems: 'center',
        marginHorizontal: 50,
        paddingVertical: 12,
        backgroundColor: ThemeDefaults.themeOrange,
        borderRadius: 15,
        elevation: 2
    },
    submitBtnText: {
        fontFamily: "LexendDeca_SemiBold",
        fontSize: 16,
        color: ThemeDefaults.themeWhite
    },
    ratingContainer: {
        marginBottom: 20
    },
})