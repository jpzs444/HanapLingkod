import { StyleSheet, Text, View, StatusBar, ScrollView, Image, TextInput, Modal, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import Appbar from '../Components/Appbar';
import ThemeDefaults from '../Components/ThemeDefaults';
import { useNavigation } from '@react-navigation/native';
import SwitchWithIcons from "react-native-switch-with-icons";
import { BlurView } from 'expo-blur';

const PostRequests = () => {
  const navigation = useNavigation()

  const [postVisible, setPostVisible] = useState(true)
  const [postHidden, setPostHidden] = useState(false)

  useEffect(() => {
    if(!postVisible){
      setPostHidden(true)
    }
  }, [postVisible])

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

  return (
    <View style={styles.container}>
      <Appbar menuBtn={true} showLogo={true} hasPicture={true} />

      {/* Modals */}
      <Modal
          transparent={true}
          animationType='fade'
          visible={postHidden}
          onRequestClose={() => setPostHidden(false)}
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
                              setPostHidden(false)
                              setPostVisible(true)
                          }}
                      >
                          <TText style={styles.dialogueCancel}>No</TText>
                      </TouchableOpacity>
                      <TouchableOpacity 
                          style={styles.dialogueBtn}
                          onPress={() => {
                              // setConfirmPost(true)
                              setPostHidden(false)
                          }}
                      >
                          <TText style={styles.dialogueConfirm}>Yes</TText>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>

      <View style={styles.header}>
        <TText style={styles.headerTitle}>Posted Requests</TText>
      </View>

      <View style={styles.posts}>

        <View style={styles.postCard}>
          {
            !postVisible && <View style={styles.grayOverlay} />
          }
          <View style={styles.postCardNameRow}>
            <Image source={global.userData.profilePic === 'pic'? require("../assets/images/default-profile.png") : {uri: global.userData.profilePic}} style={styles.profileImage} />
            <View style={styles.postUserName}>
              <View style={styles.nameRow}>
                <Text style={styles.postUserNameText}>{global.userData.firstname}{global.userData.middlename !== 'undefined' ? ` ${global.userData.middlename.charAt(0).toUpperCase()}` : ""} {global.userData.lastname}</Text>
                <View style={styles.switchContainer}>
                  <TText style={styles.swtichText}>{postVisible ? "Open" : "Closed"}</TText>
                  <SwitchWithIcons
                    value={postVisible}
                    onValueChange={setPostVisible}
                    trackColor={{true: ThemeDefaults.themeDarkerOrange, false: "rgb(187, 194, 204)"}}
                    thumbColor={{true: ThemeDefaults.themeOrange, false: "rgb(255, 255, 255)"}}
                    style={{zIndex: 8}}
                  />
                </View>
              </View>
              <View style={styles.timePosted}>
                <TText style={styles.timePostedText}>16hrs</TText>
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <View style={styles.contentCategory}>
              <View style={styles.contentCat}>
                <TText style={styles.contentCategoryText}>Category</TText>
              </View>
            </View>

            {/* Request information */}
            <View style={styles.contentRequest}>
              <Text style={styles.contentRequestText}>Manicure/Pedicure</Text>
            </View>


            {/* Price */}
            <View style={styles.contentRow}>
            <Icon name='tag' size={20} style={{transform: [
            {
                scaleX: -1,
            },
        ]}} />
              <TText style={styles.contentText}>P 100 - P 500</TText>
            </View>
            {/* Date & Time */}
            <View style={styles.contentRow}>
              <View style={styles.contentRowContent}>
                <Icon name='calendar-month' size={20} />
                <TText style={styles.contentText} >Date</TText>
              </View>
              <View style={styles.contentRowContent}>
                <Icon name="clock-outline" size={20} />
                <TText style={styles.contentText}>Time</TText>
              </View>
            </View>
            {/* Address of request */}
            <View style={styles.contentRow}>
              <Icon name="map" size={20} />
              <TText style={styles.contentText}>Bibirao, Daet, Camarines Norte</TText>
            </View>
          </View>

          {/* Comments */}
          <View style={styles.postCommentContainer}>
            <TouchableOpacity style={styles.postShowCommentsBtn}>
              <Icon name="comment-text" size={22} color={ThemeDefaults.themeLighterBlue} />
              <TText style={styles.showCommentText}>Show Comments</TText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.postCard}>
          {
            !postVisible && <View style={styles.grayOverlay} />
          }
          <View style={styles.postCardNameRow}>
            <Image source={global.userData.profilePic === 'pic'? require("../assets/images/default-profile.png") : {uri: global.userData.profilePic}} style={styles.profileImage} />
            <View style={styles.postUserName}>
              <View style={styles.nameRow}>
                <Text style={styles.postUserNameText}>{global.userData.firstname}{global.userData.middlename !== 'undefined' ? ` ${global.userData.middlename.charAt(0).toUpperCase()}` : ""} {global.userData.lastname}</Text>
                <View style={styles.switchContainer}>
                  <TText style={styles.swtichText}>{postVisible ? "Open" : "Closed"}</TText>
                  <SwitchWithIcons
                    value={postVisible}
                    onValueChange={setPostVisible}
                    trackColor={{true: ThemeDefaults.themeDarkerOrange, false: "rgb(187, 194, 204)"}}
                    thumbColor={{true: ThemeDefaults.themeOrange, false: "rgb(255, 255, 255)"}}
                    style={{zIndex: 8}}
                  />
                </View>
              </View>
              <View style={styles.timePosted}>
                <TText style={styles.timePostedText}>16hrs</TText>
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <View style={styles.contentCategory}>
              <View style={styles.contentCat}>
                <TText style={styles.contentCategoryText}>Category</TText>
              </View>
            </View>

            {/* Request information */}
            <View style={styles.contentRequest}>
              <Text style={styles.contentRequestText}>Manicure/Pedicure</Text>
            </View>


            {/* Price */}
            <View style={styles.contentRow}>
            <Icon name='tag' size={20} style={{transform: [
            {
                scaleX: -1,
            },
        ]}} />
              <TText style={styles.contentText}>P 100 - P 500</TText>
            </View>
            {/* Date & Time */}
            <View style={styles.contentRow}>
              <View style={styles.contentRowContent}>
                <Icon name='calendar-month' size={20} />
                <TText style={styles.contentText} >Date</TText>
              </View>
              <View style={styles.contentRowContent}>
                <Icon name="clock-outline" size={20} />
                <TText style={styles.contentText}>Time</TText>
              </View>
            </View>
            {/* Address of request */}
            <View style={styles.contentRow}>
              <Icon name="map" size={20} />
              <TText style={styles.contentText}>Bibirao, Daet, Camarines Norte</TText>
            </View>
          </View>

          {/* Comments */}
          <View style={styles.postCommentContainer}>
            <TouchableOpacity style={styles.postShowCommentsBtn}>
              <Icon name="comment-text" size={22} color={ThemeDefaults.themeLighterBlue} />
              <TText style={styles.showCommentText}>Show Comments</TText>
            </TouchableOpacity>
          </View>
        </View>

        

      </View>
      

      {/* floating add button */}
      <View style={{position: 'absolute', bottom: 120, right: 30}}>
        <TouchableOpacity style={{}}
          onPress={() => {
            navigation.navigate("PostRequestFormDrawer")
          }}
        >
          <Icon name="plus-circle" size={60} color={ThemeDefaults.themeOrange} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PostRequests

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        backgroundColor: ThemeDefaults.themeWhite
    },
    header: {
      alignItems: 'center'
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
      marginBottom: 15
    },
    postCard: {
      backgroundColor: ThemeDefaults.themeWhite,
      elevation: 4,
      borderRadius: 15,
      padding: 15,
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
      fontSize: 18
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 3,
      paddingLeft: 8,
      paddingRight: 5,
      backgroundColor: '#f3f3f3',
      zIndex: 7
    },
    swtichText: {
      marginRight: 10,
      fontSize: 12,
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
      paddingVertical: 5,
      borderWidth: 1.3,
      borderColor: '#999',
      borderRadius: 10

    },
    contentCategoryText: {
      color: '#999'
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