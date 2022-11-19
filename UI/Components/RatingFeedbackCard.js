import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react'
import TText from './TText'
import dayjs from 'dayjs'

import StarRating from 'react-native-star-rating-widget';
import { IPAddress } from '../global/global';
import { useNavigation } from '@react-navigation/native';
import ThemeDefaults from './ThemeDefaults';

const RatingFeedbackCard = ({user, reviewee, item, bookingId, route}) => {

    const navigation = useNavigation()
    const [rating, setRating] = useState(0)
    const [reviewData, setReviewData] = useState({})
    const [reviewDataRec, setReviewDataRec] = useState({})
    const [reviewDataW, setReviewDataW] = useState({})

    const [loading, setLoading] = useState(false)

    
    useEffect(() => {
        console.log("itemitem: ",item)
        // setLoading(true)
        // handleFetchWorkerComment()
        navigation.addListener("focus", () => {
        })
        return () => {
            //
        };
    }, [route]);
    
    const handleFetchWorkerComment = async () => {
        console.log("calledcalled: ", item)
        try {
            await fetch(`http://${IPAddress}:3000/reviews/${bookingId}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                },
            }).then(res => res.json())
            .then(data => {
                console.log("review data: ", data)
                setReviewData({...data})
                const list = user ? {...data.recruiter[0]} : {...data.worker[0]}
                // user ? setReviewDataRec({...list}) : setReviewDataW({...list})
                // setReviewData({...data})
                user ? console.log("recruiter review: ", list) : console.log("worker review: ", list)
            })
        } catch (error) {
            console.log("fetch workercomment", error)
        }

        setLoading(false)
    }
    
    return (
    <>
      {
        loading ? 
        <View style={{width: '100%', alignItems: 'center', marginTop: 30}}>
            <ActivityIndicator size={'large'} />
        </View>
        :
        <>
        {
            item.map((rating, index) => {
                return(
                    <View style={styles.container} key={index}>
                        <View style={[styles.reviewerInfo, styles.flexRow]}>
                            <View style={[styles.flexRow]}>
                                <Image style={styles.reviewerPic} source={
                                    rating.reviewer.profilePic == 'pic' ? 
                                        require("../assets/images/default-profile.png")
                                        :
                                        {uri: rating.reviewer.profilePic}
                                } />
                                <View style={[styles.reviewer, styles.flexRow]}>
                                    <View>
                                        <TText style={[styles.reviewerName, global.userData.username === rating.reviewer.username && {color: ThemeDefaults.themeOrange}]}>
                                            {
                                                global.userData.username === rating.reviewer.username ? 
                                                `You`
                                                :
                                                `${rating.reviewer.firstname} ${rating.reviewer.lastname}`
                                            }
                                        </TText>
                                        <TText style={styles.reviewerDate}>{dayjs(rating.created_at).format("MMM DD, hh:mm A")}</TText>
                                    </View>
                                </View>
                            </View>
                            
                            <View style={styles.rating}>
                                <StarRating
                                    rating={rating.rating}
                                    onChange={()=>{}}
                                    starSize={22}
                                    starStyle={{marginRight: -5}}
                                    style={{zIndex:5, paddingRight: 8}}
                                />
                            </View>
                        </View>

                        <View style={styles.messageContainer}> 
                            <TText style={[rating.message ? styles.message : styles.noMessage]}>
                                {
                                    rating.message ? rating.message : "No comment available"
                                }
                            </TText>
                        </View>
                    </View>
                )
            })
        }
        </>
      }
    </>
  )
}

export default RatingFeedbackCard

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 30,
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#f6f6f6",
        elevation: 3
    },
    reviewerInfo: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reviewerPic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        elevation: 3
    },
    reviewer: {
        marginLeft: 15,
        // marginRight: 'auto',
        width: 'auto'
    },
    reviewerName: {
        fontFamily: 'LexendDeca_SemiBold',
        fontSize: 16,
    },
    reviewerDate: {
        fontSize: 12,
        color: '#737373'
    },
    rating: {
        alignItems: 'flex-start',
    },
    messageContainer: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 13
        // backgroundColor: 'pink',
    },
    message: {

    },
    noMessage: {
        color: '#bfbfbf'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})