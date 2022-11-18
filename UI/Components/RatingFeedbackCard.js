import { StyleSheet, Text, View, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import TText from './TText'

import StarRating from 'react-native-star-rating-widget';
import { IPAddress } from '../global/global';

const RatingFeedbackCard = ({user, reviewee, item, bookingId}) => {

    const [rating, setRating] = useState(0)
    const [reviewData, setReviewData] = useState({})

    useEffect(() => {
        setRating(4)
        handleFetchWorkerComment()
        return () => {
            //
        };
    }, []);

    const handleFetchWorkerComment = async () => {
        try {
            await fetch(`http://${IPAddress}:3000/reviews/${bookingId}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                },
            }).then(res => res.json())
            .then(data => {
                console.log("review data: ", data)
                // setReviewData({...data})
            })
        } catch (error) {
            console.log("fetch workercomment", error)
            
        }
    }

  return (
    <View style={styles.container}>
      <View style={styles.reviewerInfo}>
        <Image style={styles.reviewerPic} />
        <View style={styles.reviewer}>
            <TText style={styles.reviewerName}>{item.recruiterId._id}</TText>
            <TText style={styles.reviewerDate}>Date</TText>
        </View>
        <View style={styles.rating}>
            <StarRating
                rating={rating}
                onChange={setRating}
                enableHalfStar={false}
                animationConfig={{scale: 1.05, delay: 400}}
                style={{alignSelf: 'center'}}
            />
        </View>
      </View>
    </View>
  )
}

export default RatingFeedbackCard

const styles = StyleSheet.create({})