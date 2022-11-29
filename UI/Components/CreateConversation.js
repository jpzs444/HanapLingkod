import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import ThemeDefaults from './ThemeDefaults'

const CreatConversation = ({status, requestItem}) => {

  const [conversation, setConversation] = useState({})


  const handleCreateConversation = async () => {
    // create a conversation
    try {
        await fetch(`http://${IPAddress}:3000/conversations`, {
            method: "POST",
            headers: {
              'content-type': 'application/json'  
            },
            body: JSON.stringify({
                senderId: global.userData._id,
                receiverId: global.userData.role === 'recruiter' ? requestItem.workerId._id : requestItem.recruiterId._id
            })
        }).then(res => res.json())
        .then(data => {
            console.log("conversation data: ", data[0])
            setConversation({...data[0]})
            handleGoToConversation()
        })
    } catch (error) {
        console.log("Error creating new convo: ", error)
    }
}

const handleGoToConversation = () => {
    // navigation.navigate("ConversationThreadDrawer", {"otherUser": otherUser, "conversation": conversation})
    console.log("otgerUser: ", typeof requestItem.workerId)
    console.log("convo: ", typeof conversation)
    navigation.navigate("ConversationThreadDrawer", {
        "otherUser": global.userData.role === 'recruiter' ? requestItem.workerId : requestItem.recruiterId, 
        "conversation": conversation
    })
}

  return (
    <TouchableOpacity 
        style={{
            backgroundColor: ThemeDefaults.themeOrange, 
            borderRadius: 20, 
            padding: 8, 
            elevation: 4, 
            position: 'absolute', 
            right: 15, 
            top: status !== '1' ? 50 : 15, 
            zIndex: 5
        }}
        activeOpacity={0.5}
        onPress={() => {
            console.log("HI create convo component")
            handleCreateConversation()
        }}
    >
        <Image source={require('../assets/icons/chat-bubble.png')} style={{width: 25, height: 25,}} />
    </TouchableOpacity>
  )
}

export default CreatConversation

const styles = StyleSheet.create({})