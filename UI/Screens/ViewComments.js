import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, StatusBar, Dimensions, TextInput } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import ThemeDefaults from '../Components/ThemeDefaults'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import Appbar from '../Components/Appbar';
import dayjs from 'dayjs'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { IPAddress, Localhost } from '../global/global';

import { FlashList } from '@shopify/flash-list'


const ViewComments = ({route}) => {

    const navigation = useNavigation()

    const {item, postID} = route.params
    let kk = item._id
    console.log("post id: ", item._id)

    const [commentText, setCommentText] = useState("")
    const [commentList, setCommentList] = useState([])
    const [postInformation, setPostInformation] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const commentInput = useRef(null)
       

    useFocusEffect(
        React.useCallback(() => {
            fetchCommentsFromPost()

            let fetchCommnetsInterval = setInterval(fetchCommentsFromPost, 5000)
    
            return () => {
                setCommentList([])
                clearInterval(fetchCommnetsInterval)
            }
        }, [route])
      );

    const fetchCommentsFromPost = async () => {
        try {
            await fetch(`http://${IPAddress}:3000/request-post/${postID}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                }
            }).then((res) => res.json())
            .then(data => {
                console.log('posts: ', data.post[0].maxPrice)
                setCommentList(prev => [...data.comment])
                setPostInformation([...data.post])
                
                setIsLoading(false)
            }).catch((err) => console.log("error fetch post comments", err.msg))

        } catch (error) {
            console.log("log HI")
        }
    }

    const handleSubmitComment = () => {
        fetch(`http://${IPAddress}:3000/request-post-comment/${postID}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                workerId: global.userData._id,
                message: commentText
            })
        }).then(res => {
            console.log("Submitted the comment")
            setCommentText(null)
            fetchCommentsFromPost()
            setCommentText(null)
        }).catch((err) => console.log("error submittion:"))

        // commentInput.current.value = ""
    }

    const handleCreatedAge = (createdAt) => {

        console.log("createdAt: ", createdAt)
        let notifDate = new Date(createdAt)
        let dateNow = new Date()
        let dateDiff = Math.abs(dateNow.getTime() - notifDate.getTime())
    
        // convert milliseconds to seconds
        dateDiff = dateDiff / 1000
        // console.log("seconds: ", dateDiff)
    
        let day = Math.floor(dateDiff / 60 / 60 / 24)
        if(day === 0) {  
          let hours = Math.floor(dateDiff / 60 / 60 )
          if ( hours === 0 ) {
            let minutes = Math.floor(dateDiff / 60 % 60)
            
            if ( minutes === 0 ) {
              let seconds = Math.floor(dateDiff % 60)
              return `${seconds}s`
            }
            
            return minutes > 1 ? `${minutes}m` : `${minutes}m`
          }
            return hours > 1 ? `${hours}hr` : `${hours}hr`
        }
        return day > 1 ? `${day}d` : `${day}d`
    }

    const ScreenHeaderComponent = () => {
        return(
            <>
                <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} popp={true} />

                <View style={{paddingHorizontal: 20, marginTop: 20}}>
                    <View style={styles.postCardNameRow}>
                        <Image source={item.recruiterId.profilePic === 'pic'? require("../assets/images/default-profile.png") : {uri: item.recruiterId.profilePic}} style={styles.profileImage} />
                        <View style={styles.postUserName}>
                        <View style={styles.nameRow}>
                            <Text style={styles.postUserNameText}>{item.recruiterId.firstname}{item.recruiterId.middlename !== 'undefined' ? ` ${item.recruiterId.middlename.charAt(0).toUpperCase()}` : ""} {item.recruiterId.lastname}</Text>
                            <View style={styles.switchContainer}>
                            {/* something here */}
                            </View>
                        </View>
                        <View style={styles.timePosted}>
                            <TText style={styles.timePostedText}>{dayjs(item.created_at).toNow(true)} ago</TText>
                        </View>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.contentContainer}>
                        <View style={styles.contentCategory}>
                        <View style={styles.contentCat}>
                            <TText style={styles.contentCategoryText}>{item.ServiceID.Category}</TText>
                        </View>
                        </View>

                        {/* Request information */}
                        <View style={styles.contentRequest}>
                        <Text style={styles.contentRequestText}>{item.postDescription}</Text>
                        </View>


                        {/* Price */}
                        <View style={styles.contentRow}>
                        <Icon name='tag' size={20} style={{transform: [
                        {
                            scaleX: -1,
                        },
                        ]}} />
                        <TText style={styles.contentText}>₱{item.minPrice} - ₱{item.maxPrice}</TText>
                        </View>
                        {/* Date & Time */}
                        <View style={styles.contentRow}>
                        <View style={styles.contentRowContent}>
                            <Icon name='calendar-month' size={20} />
                            <TText style={styles.contentText} >{dayjs(item.serviceDate).format("MMM DD")}</TText>
                        </View>
                        <View style={styles.contentRowContent}>
                            <Icon name="clock-outline" size={20} />
                            <TText style={styles.contentText}>{dayjs(item.startTime).format("hh:mm A")}</TText>
                        </View>
                        </View>
                        {/* Address of request */}
                        <View style={styles.contentRow}>
                        <Icon name="map" size={20} />
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.contentText}>{`${item.recruiterId.street}, ${item.recruiterId.purok}, ${item.recruiterId.barangay}, ${item.recruiterId.city}, ${item.recruiterId.province}`}</Text>
                        </View>
                    </View>

                </View>

                {/* Comments */}
                <View style={styles.postCommentContainer}>
                    <TText style={styles.showCommentText}>Comments</TText>
                </View>
            </>
        )
    }

  return (
    <View style={styles.mainContainer}>
        
        {/* Comment List */}
        <View style={styles.commentListContainer}>
            
                <FlashList 
                data={commentList}
                keyExtractor={item => item._id}
                estimatedItemSize={80}
                maxToRenderPerBatch
                ListEmptyComponent={() => (<ActivityIndicator size={'large'} style={{flex: 1, paddingTop: 50}} />)}
                ListFooterComponent={() => (<View style={{height: 150}}></View>)}
                ListHeaderComponent={() => (
                    <ScreenHeaderComponent />
                )}
                renderItem={({item}) => (
                    <>
                        {
                        isLoading ?
                        null
                        :
                        <View style={styles.commentItem}>
                        <View style={{flex: 1, flexDirection: 'row', width:'100%'}}>
                            <Image source={{uri: item.workerId.profilePic}} style={styles.commentUserImage} />
                            <View style={{paddingLeft: 15, alignSelf: 'stretch', flexGrow: 1,}}>
                                <View style={styles.nameSection}>
                                    {/* name */}
                                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                                        <TText style={styles.commentNameUserText}>{item.workerId.firstname} {item.workerId.lastname}</TText>
                                        <Icon name="circle-medium" size={14} color={"#c5c5c5"} style={{marginHorizontal: 2}} />
                                        <TText style={styles.commentTime}>{handleCreatedAge(item.created_at)}</TText>
                                    </View>

                                    {
                                        global.userData.role === "recruiter" ?
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <TouchableOpacity style={styles.requestBtn}
                                                activeOpacity={0.4}
                                                onPress={()=> {
                                                    console.log("postInformation: ", postInformation.maxPrice)
                                                    navigation.navigate("RequestFormDrawer", {
                                                        'workerID': item.workerId._id, 
                                                        'workID': item._id, 
                                                        'workerInformation': item.workerId, 
                                                        'selectedJob': postInformation[0].postDescription, 
                                                        'minPrice': postInformation[0].minPrice, 
                                                        'maxPrice': postInformation[0].maxPrice, 
                                                        'dateService': postInformation[0].serviceDate, 
                                                        'timeService': postInformation[0].startTime, 
                                                        'showMultiWorks': false,
                                                        'fromPostReq': true
                                                    })
                                                }}
                                            >
                                                <TText style={styles.requestText}>Send Request</TText>
                                            </TouchableOpacity>
                                        </View>
                                        : global.userData.role === "worker" && item.workerId._id === global.userData._id ?
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <TouchableOpacity style={styles.deleteCommentBtn}>
                                                <Icon name="trash-can" size={20} color={ThemeDefaults.themeWhite} />
                                            </TouchableOpacity>
                                        </View> : null
                                    }
                                </View>
                                <View style={styles.ratingSection}>
                                    <Icon name="star" size={18} color={"gold"} />
                                    <TText style={styles.ratingText}>4.7</TText>
                                </View>
                            </View>
                        </View>
                        <View style={styles.commentSection}>
                            <TText style={styles.commentText}>{item.message}</TText>
                        </View>
                    </View>
                    }
                    </>
                )}
            />

        </View>


        {/* Commentbox | Text input */}
        {
            global.userData.role === "worker" &&
                <View style={styles.bottomContainer}>

                    {/* Message box input */}
                    <View style={styles.messagingContainer}>
                        <View style={styles.messagingTextInputContainer}>
                            <TextInput 
                                val={commentText ? commentText : null}
                                numberOfLines={1}
                                placeholder='Write a comment'
                                autoCorrect={false}
                                cursorColor={ThemeDefaults.themeDarkBlue}
                                style={styles.messagingTextInput}
                                onChangeText={val => setCommentText(val)}
                                ref={commentInput}
                            />
                        </View>
                        <TouchableOpacity style={styles.sendBtnContainer}
                            activeOpacity={0.4}
                            onPress={() => {
                                handleSubmitComment()
                            }}
                        >
                            <Icon name="send" size={22} color={ThemeDefaults.themeOrange} style={styles.sendIcon} />
                            <TText style={styles.sendBtnTxt}>Send</TText>
                        </TouchableOpacity>
                    </View>
                </View>
        }


    </View>
  )
}

export default ViewComments

const styles = StyleSheet.create({
    mainContainer: {
        flexGrow: 1,
        backgroundColor: ThemeDefaults.themeWhite,
        marginTop: StatusBar.currentHeight,
    },
    postCardNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 10
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingLeft: 15,
    },
    postUserName: {
        flex: 1,
        // flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'space-between',
    paddingLeft: 15,
    },
    postUserNameText: {
        fontFamily: 'LexendDeca_Medium',
        fontSize: 18
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        // paddingVertical: 3,
        paddingLeft: 8,
        // paddingRight: 5,
        backgroundColor: ThemeDefaults.themeOrange,
        zIndex: 7
    },
    swtichText: {
        fontSize: 12,
        color: ThemeDefaults.themeWhite
    },
    timePosted: {
    
    },
    timePostedText: {
        fontSize: 14

    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10
    },
    contentContainer: {

    },
    contentCategory: {
        marginTop: 15,
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    contentCat: {
        paddingHorizontal: 15,
        paddingVertical: 3,
        borderWidth: 1.3,
        borderColor: '#999',
        borderRadius: 20

    },
    contentCategoryText: {
        color: '#999',
        fontSize: 14,
    },
    contentRequest: {
        marginBottom: 30,
    },
    contentRequestText: {
        fontFamily: 'LexendDeca',
        fontSize: 16,
    },
    contentText: {
        marginLeft: 12,
        fontSize: 16,
        fontFamily: "LexendDeca"
    },
    contentRowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 40,
    },
    postCommentContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        marginTop: 15,
        paddingTop: 15
    },
    postShowCommentsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingTop: 15
    },
    showCommentText: {
        fontSize: 18,
        marginLeft: 25,
        color: ThemeDefaults.themeLighterBlue
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10
    },
    messagingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 75,
        paddingLeft: 20,
        paddingRight: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderTopColor: 'rgba(0,0,0,0.1)',
        borderTopWidth: 1.5,
        
    },
    messagingTextInputContainer: {
        width: '85%',
        backgroundColor: '#f3f3f3',
        paddingVertical: 8,
        paddingRight: 10,
        borderRadius: 10,
    },
    messagingTextInput: {
        paddingLeft: 10,
        // paddingHorizontal: 0,
        fontFamily: 'LexendDeca',
        fontSize: 16
    },
    sendBtnContainer: {
        marginLeft: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendIcon: {
        transform: [{ rotate: '-45deg'}]
    },
    sendBtnTxt: {
        fontSize: 12,
    },
    commentListContainer: {
        width: '100%',
        flexGrow: 1,
        // backgroundColor: 'pink'
    },
    commentItem: {
        // flexDirection: 'row',
        // alignItems: 'flex-start',
        padding: 15,
        marginHorizontal: 30,
        marginTop: 15,
        borderRadius: 10,
        backgroundColor: '#f3f3f3',
        elevation: 3,
    },
    commentUserImage: {
        width: 45,
        height: 45,
        borderRadius: 15
    },
    commentInformation: {
        // width: '100%',
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        // paddingLeft: 15,
        marginBottom: 7,
        // flexBasis: 'auto',
        flexGrow: 1,
        flexWrap: 'wrap'
    },
    nameSection: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    commentNameUserText: {
        fontSize: 14
    },
    commentTime: {
        fontSize: 14,
        color: '#c5c5c5',
        marginRight: 'auto'
    },
    requestBtn: {
        backgroundColor: ThemeDefaults.themeLighterBlue,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 4,
        elevation: 3,
        zIndex: 6,

        position: 'absolute',
        top: -10,
        right: 0
    },
    deleteCommentBtn: {
        backgroundColor: '#dfdfdf',
        borderRadius: 5,
        paddingHorizontal: 4,
        paddingVertical: 4,
        // elevation: 3,
        zIndex: 6,

        position: 'absolute',
        top: -10,
        right: 0
    },
    requestText: {
        color: ThemeDefaults.themeWhite,
        fontSize: 12,
    },
    ratingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 13
    },
    commentSection: {
        marginTop: 10
    },
    commentText: {
        fontSize: 16,
    },
})