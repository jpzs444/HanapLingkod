import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, StatusBar, Dimensions, TextInput } from 'react-native'
import React, {useState} from 'react'
import ThemeDefaults from '../Components/ThemeDefaults'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import Appbar from '../Components/Appbar';
import dayjs from 'dayjs'
import { useNavigation } from '@react-navigation/native';
import { IPAddress, Localhost } from '../global/global';

const ViewComments = ({route}) => {

    const navigation = useNavigation()

    const {item} = route.params

    const [commentText, setCommentText] = useState("")

    const handleSubmitComment = () => {
        try{
            fetch(`http://${IPAddress}:3000/request-post-comment/${item._id}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    workerId: global.userData._id,
                    comment: commentText
                })
            }).then(res => {
                console.log("Submitted the comment")
            })
            setCommentText("")
        } catch{
            console.log('Error submitting comment')
        }
    }

  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
        <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

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

        {/* Comment List */}
        <View style={styles.commentListContainer}>

            <View style={styles.commentItem}>
                <View style={{flex: 1, flexDirection: 'row', width:'100%'}}>
                    <Image source={{uri: global.userData.profilePic}} style={styles.commentUserImage} />
                    <View style={{paddingLeft: 15, alignSelf: 'stretch', flexGrow: 1,}}>
                        <View style={styles.nameSection}>
                            {/* name */}
                            <View style={{alignItems: 'center', flexDirection: 'row'}}>
                                <TText style={styles.commentNameUserText}>Narda D. Custodio</TText>
                                <Icon name="circle-medium" size={14} color={"#c5c5c5"} style={{marginHorizontal: 2}} />
                                <TText style={styles.commentTime}>2d</TText>
                            </View>

                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <TouchableOpacity style={styles.requestBtn}
                                    activeOpacity={0.4}
                                    onPress={()=> {
                                        // navigation.navigate("RequestFormDrawer",
                                        // {workerID: item.workerId._id, workID: item._id, workerInformation: item.workerId, selectedJob: chosenCategory, minPrice: item.minPrice, maxPrice: item.maxPrice, showMultiWorks: false}
                                        // )
                                    }}
                                >
                                    <TText style={styles.requestText}>Send Request</TText>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.ratingSection}>
                            <Icon name="star" size={18} color={"gold"} />
                            <TText style={styles.ratingText}>4.7</TText>
                        </View>
                    </View>
                </View>
                <View style={styles.commentSection}>
                    <TText style={styles.commentText}>I'm willing to do the specified service</TText>
                </View>
            </View>


            <View style={styles.commentItem}>
                <View style={{flex: 1, flexDirection: 'row', width:'100%'}}>
                    <Image source={{uri: global.userData.profilePic}} style={styles.commentUserImage} />
                    <View style={{paddingLeft: 15, alignSelf: 'stretch', flexGrow: 1,}}>
                        <View style={styles.nameSection}>
                            {/* name */}
                            <View style={{alignItems: 'center', flexDirection: 'row'}}>
                                <TText style={styles.commentNameUserText}>Narda D. Custodio</TText>
                                <Icon name="circle-medium" size={14} color={"#c5c5c5"} style={{marginHorizontal: 2}} />
                                <TText style={styles.commentTime}>2d</TText>
                            </View>

                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <TouchableOpacity style={styles.requestBtn}>
                                    <TText style={styles.requestText}>Send Request</TText>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.ratingSection}>
                            <Icon name="star" size={18} color={"gold"} />
                            <TText style={styles.ratingText}>4.7</TText>
                        </View>
                    </View>
                </View>
                <View style={styles.commentSection}>
                    <TText style={styles.commentText}>I'm willing to do the specified service</TText>
                </View>
            </View>

        </View>


        {/* Commentbox | Text input */}
        {
                global.userData.role === "worker" ?
                    <View style={styles.bottomContainer}>

                        {/* Message box input */}
                        <View style={styles.messagingContainer}>
                            <View style={styles.messagingTextInputContainer}>
                                <TextInput 
                                    val={commentText.length > 0 ? commentText : null}
                                    numberOfLines={1}
                                    placeholder='Write a comment'
                                    autoCorrect={false}
                                    cursorColor={ThemeDefaults.themeDarkBlue}
                                    style={styles.messagingTextInput}
                                    onChangeText={val => setCommentText(val)}
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
                : null
            }


    </ScrollView>
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
        backgroundColor: '#f0f0f0',
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
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    commentItem: {
        // flexDirection: 'row',
        // alignItems: 'flex-start',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#fafafa',
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
        marginTop: 5
    },
    commentText: {
        fontSize: 15,
    },
})