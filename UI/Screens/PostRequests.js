import { StyleSheet, Text, View, StatusBar, ScrollView, Image, TextInput, Modal, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import Appbar from '../Components/Appbar';
import ThemeDefaults from '../Components/ThemeDefaults';
import { useNavigation } from '@react-navigation/native';
import SwitchWithIcons from "react-native-switch-with-icons";
import { BlurView } from 'expo-blur';
import dayjs from 'dayjs';
import { FlashList } from '@shopify/flash-list'
import { IPAddress, Localhost } from '../global/global';
import { color } from 'react-native-reanimated';


const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)


const PostRequests = () => {
  const navigation = useNavigation()

  const [postVisible, setPostVisible] = useState(false)
  const [postHidden, setPostHidden] = useState("")
  const [toggleSwitch, setToggleSwitch] = useState(false)

  const [postRequestList, setPostRequestList] = useState([])

  useEffect(() => {
    fetchRequestPosts()

  },[])

  const fetchRequestPosts = () => {
    fetch(`http://${IPAddress}:3000/request-post/`, {
      method: "GET",
      headers: {
        'content-type': 'application/json',
        "Authorization": global.userData.accessToken
      }
    }).then((res) => res.json())
    .then((data) => {
      console.log("request post1: ", data)

      let list = [...data]
      list = list.reverse()
      if(global.userData.role === 'worker'){
        list = list.filter(e => e.postToggle)
      }
      setPostRequestList([...list])
    }).catch((err) => console.log('error post request list: ', err.message))
  }

  const handleVisisbleModal = () => {
    console.log("handle visible")
    setPostHidden(!postHidden)
  }


  const handlePostToggle = async (postID, postToggle) => {

    try {
        await fetch(
          `http://${IPAddress}:3000/request-post/${postID}`, {
            method: "PUT",
            headers: {
              'content-type': 'application/json',
              "Authorization": global.userData.accessToken
            },
            body: JSON.stringify({
              postToggle: postToggle
            })
          }
        )

        fetchRequestPosts()
    } catch {
      console.log("error toggle")
    }

  }


  const renderIfEmpty = () => {
    return(
      <>
        <View style={styles.header}>
          <TText style={styles.headerTitle}>Posted Requests</TText>
          <TText style={styles.headerSubTitle}>Do you want a service that is not listed on HanapLingkod?</TText>
        </View>
        <View style={styles.postInstruction}>
          <TText style={styles.postInstructionText}>Tap the add button <Icon name="plus-circle" size={20} color={ThemeDefaults.themeOrange} /> below to post a service request. Several workers might help you! </TText>
        </View>
      </>
    )
  }

  const ScreenHeaderComponent = () => {
    return(
      <>
        <Appbar menuBtn={true} showLogo={true} hasPicture={true} />

        <View style={styles.header}>
          <TText style={styles.headerTitle}>Posted Requests</TText>
        </View>
      </>
    )
  }

  const MainComponent = ({item}) => {
    return(
      <View style={styles.postCard}>
              {
                !item.postToggle && <View style={styles.grayOverlay} />
              }

              
              <View style={styles.postCardNameRow}>
                <Image source={item.recruiterId.profilePic === 'pic'? require("../assets/images/default-profile.png") : {uri: item.recruiterId.profilePic}} style={styles.profileImage} />
                <View style={styles.postUserName}>
                  <View style={styles.nameRow}>
                    <Text style={styles.postUserNameText}>{item.recruiterId.firstname}{item.recruiterId.middlename !== 'undefined' ? ` ${item.recruiterId.middlename.charAt(0).toUpperCase()}` : ""} {item.recruiterId.lastname}</Text>
                    
                      {
                        global.userData.role === "recruiter" &&
                          <View style={[styles.switchContainer, {backgroundColor: item.postToggle ? ThemeDefaults.themeOrange : "rgb(187, 194, 204)",}]}>
                            <TText style={styles.swtichText}>{item.postToggle ? "Open" : "Closed"}</TText>
                            <SwitchWithIcons
                              value={item.postToggle}
                              onValueChange={(bool) => {
                                if(!item.postToggle){
                                  handlePostToggle(item._id, !item.postToggle)
                                } else {
                                  setToggleSwitch(!item.postToggle)
                                  setPostHidden(item._id)
                                  setPostVisible(true)
                                }
                              }}
                              trackColor={{true: ThemeDefaults.themeDarkerOrange, false: "rgb(187, 194, 204)"}}
                              thumbColor={{true: ThemeDefaults.themeOrange, false: "rgb(255, 255, 255)"}}
                              style={{zIndex: 8, marginLeft: 10}}
                            />
                                
                          </View>
                      }
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
                  {
                    global.userData.role === 'recruiter' ? 
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.contentText}>{`${item.recruiterId.street}, ${item.recruiterId.purok}, ${item.recruiterId.barangay}, ${item.recruiterId.city}`}</Text>
                    :
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.contentText}>{`${item.recruiterId.barangay}, ${item.recruiterId.city}`}</Text>
                  }
                </View>
              </View>

              {/* Comments */}
              <View style={styles.postCommentContainer}>
                <TouchableOpacity style={styles.postShowCommentsBtn}
                  onPress={() => {
                    //navigate
                    navigation.navigate("ViewCommentsDrawer", {'item' : item, 'postID': item._id})
                  }}
                >
                  <Icon name="comment-text" size={22} color={ThemeDefaults.themeLighterBlue} />
                  <TText style={styles.showCommentText}>{global.userData.role ==="recruiter" ? "Show Comments" : "Comments"}</TText>
                  {/* <View><TText>1</TText></View> */}
                </TouchableOpacity>
              </View>
            </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Modals */}
      <Modal
          transparent={true}
          animationType='fade'
          visible={postVisible}
          onRequestClose={() => setPostVisible(false)}
      >

          {/* Modal View */}
          <View style={styles.modalDialogue}>
              {/* Modal Container */}
              <View style={styles.dialogueContainer}>
                  {/* Modal Message/Notice */}
                  <View style={styles.dialogueMessage}>
                      <TText style={styles.dialogueMessageText}>Closing this post means you will not receive comments from workers anymore. Are you sure you want to close this post?</TText>
                  </View>
                  {/* Modal Buttons */}
                  <View style={styles.modalDialogueBtnCont}>
                      <TouchableOpacity
                          style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeOrange}]}
                          onPress={() => {
                              setPostVisible(false)
                              fetchRequestPosts()
                          }}
                      >
                          <TText style={styles.dialogueCancel}>No</TText>
                      </TouchableOpacity>
                      <TouchableOpacity 
                          style={styles.dialogueBtn}
                          onPress={() => {
                              // setConfirmPost(true)
                              handlePostToggle(postHidden, toggleSwitch)
                              setPostVisible(false)
                          }}
                      >
                          <TText style={styles.dialogueConfirm}>Yes</TText>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>
    
    
      <View style={{flexGrow: 1,}}>
        <FlashList 
          data={postRequestList}
          keyExtractor={item => item._id}
          estimatedItemSize={60}
          // ListEmptyComponent={() => (<renderIfEmpty />)}
          ListHeaderComponent={() => (
            <ScreenHeaderComponent />
          )}
          ListFooterComponent={() => (
            <View style={{height: 150}}></View>
          )}
          renderItem={({item}) => (
            <>
              {
                item.recruiterId._id === global.userData._id || global.userData.role === 'worker' ?
                <MainComponent item={item} /> : null
              }
            </>   
          )}
        />
      </View>

      
      {/* floating add button */}
      {
        global.userData.role === "recruiter" &&
          <View style={{position: 'absolute', bottom: 120, right: 40}}>
            <TouchableOpacity style={{width: 60, height: 60, borderRadius: 30, backgroundColor: ThemeDefaults.themeOrange, alignItems: 'center', justifyContent: 'center', elevation: 3}}
              onPress={() => {
                navigation.navigate("PostRequestFormDrawer")
              }}
            >
              <Icon name="plus" size={40} color={ThemeDefaults.themeWhite} />
            </TouchableOpacity>
          </View>
      }
    </View>
  )
}

export default PostRequests

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        // height: '100%',
        // width: '100%',
        marginTop: StatusBar.currentHeight,
        backgroundColor: ThemeDefaults.themeWhite
    },
    header: {
      alignItems: 'center',
      marginVertical: 10
    },
    headerTitle: {
      fontFamily: 'LexendDeca_Medium',
      fontSize: 18,
      marginBottom: 10
    },
    headerSubTitle: {
      paddingHorizontal: 50,
      textAlign: 'center'
    },
    postInstruction: {
      alignItems: 'center',
      marginTop: 150,
      paddingHorizontal: 30,
    },
    postInstructionText: {
      textAlign: 'center',
      lineHeight: 28,
      color: 'gray'
    },
    posts: {
      paddingHorizontal: 20,
      marginBottom: 15,
      width: '100%',
    },
    postCard: {
      backgroundColor: ThemeDefaults.themeWhite,
      elevation: 4,
      borderRadius: 15,
      padding: 15,
      marginHorizontal: 25,
      paddingBottom: 8,
      marginTop: 15,
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
      fontSize: 16,
      color: "#3e3e3e"
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 3,
      paddingLeft: 8,
      paddingRight: 5,
      // backgroundColor: ThemeDefaults.themeOrange,
      zIndex: 7,
      elevation: 4,
    },
    swtichText: {
      fontSize: 12,
      color: ThemeDefaults.themeWhite
    },
    timePosted: {
    
    },
    timePostedText: {
      fontSize: 12,
      color: '#b2b2b2'
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
      fontSize: 18,
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
      alignItems: 'center',
      borderTopWidth: 1.2,
      borderTopColor: '#f6f6f6',
      marginTop: 15
    },
    postShowCommentsBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingTop: 15
    },
    showCommentText: {
      marginLeft: 15,
      color: ThemeDefaults.themeLighterBlue
    },
    grayOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(255,255,255,0.8)',
      zIndex: 5,
      borderRadius: 15
    },
    modalDialogue: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    dialogueContainer: {
        borderWidth: 1.5,
        borderColor: ThemeDefaults.themeDarkerOrange,
        borderRadius: 15,
        overflow: 'hidden',
    },
    dialogueMessage: {
        paddingVertical: 40,
        paddingHorizontal: 50,
        backgroundColor: ThemeDefaults.themeDarkerOrange,
    },
    dialogueMessageText: {
        color: ThemeDefaults.themeWhite,
        textAlign: 'center',
        fontFamily: 'LexendDeca_Medium'
    },
    modalDialogueBtnCont: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: ThemeDefaults.themeWhite,
    },
    dialogueBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    dialogueCancel: {

    },
    dialogueConfirm: {
        color: ThemeDefaults.themeDarkerOrange,
        fontFamily: 'LexendDeca_Medium',
    },
})