import { StyleSheet, Image, View, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import TText from './TText'
import { useNavigation } from '@react-navigation/native'
import { IPAddress } from '../global/global'

const Conversation = ({tab, conversation}) => {

    const navigation = useNavigation()
    const [otherUser, setOtherUser] = useState({})
    const [otherUserIndex, setOtherUserIndex] = useState(0)

    useEffect(() => {
        getOtherUser()
    }, [conversation]);

    // useEffect(() => {
    //     console.log(conversation)
    //     console.log(otherUser)
    //     let index = conversation.members.indexOf(otherUser)
    //     setOtherUserIndex(index)
    //     console.log("index inside member: ", index)
    // }, [otherUser]);


    const getOtherUser = async () => {
        const otherUseri = conversation.members.find(m => m !== global.userData._id)
        // console.log(otherUser)

        let userType = global.userData.role === 'recruiter' ? "Worker" : "Recruiter"
        console.log("other userType: ", userType)
        try {
            await fetch(`https://hanaplingkod.onrender.com/${userType}/${otherUseri}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                }
            })
            .then(res => res.json())
            .then(foundUser => {
                // console.log("other user data: ", foundUser)
                setOtherUser({...foundUser})
                // console.log("index inside member: ", index)
            })
        } catch (error) {
            console.log("get OtherUser: ", error)
        }
    }


  return (
    <TouchableOpacity style={[styles.container, styles.flexRow]}
        activeOpacity={0.5}
        onPress={() => {
            // console.log("conversation contains: ", conversation)
            navigation.navigate("ConversationThreadDrawer", {otherUser: otherUser, conversation: conversation})
        }}
    >
      <Image style={styles.image} 
        source={otherUser.profilePic == 'pic' ? require("../assets/images/default-profile.png") : {uri: otherUser.profilePic}}
      />
      <View style={[styles.convoInfo]}>
        {
            otherUser && 
            <>
                <View style={[styles.flexRow, {alignItems: 'center'}]}>
                    <TText style={[styles.name, {fontFamily: conversation.members.indexOf(global.userData._id) === 0 ? conversation.senderSeen ? "LexendDeca" : "LexendDeca_SemiBold" : conversation.receiverSeen ? "LexendDeca" : "LexendDeca_SemiBold"}]}>{`${otherUser?.firstname} ${otherUser?.lastname}`}</TText>
                    <TText style={styles.date}>  &#x2022;  Nov 11</TText>
                </View>
                <TText style={[styles.message, {fontFamily: conversation.members.indexOf(global.userData._id) === 0 ? conversation.senderSeen ? "LexendDeca" : "LexendDeca_SemiBold" : conversation.receiverSeen ? "LexendDeca" : "LexendDeca_SemiBold"}]}>{conversation?.latestMessage}</TText>
            </>
        }
      </View>
    </TouchableOpacity>
  )
}

export default Conversation

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1.3,
        borderTopColor: '#ddd',
        paddingVertical: 12
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 15,
    },
    convoInfo: {
        padding: 10
    },
    name: {
        color: '#0f0f0f',
        fontFamily: "LexendDeca",
        fontSize: 17
    },
    date: {
        color: '#bbb',
        fontSize: 12
    },
    message: {
        marginTop: 5,
        color: '#555555',
        fontSize: 13,
    },
    unreadMessage: {
        color: '#000',
        fontFamily: "LexendDeca_Medium" ,
        fontSize: 15
    },
})