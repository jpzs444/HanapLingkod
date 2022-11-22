import { StyleSheet, Image, View, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import TText from './TText'
import { useNavigation } from '@react-navigation/native'
import { IPAddress } from '../global/global'

const Conversation = ({tab, conversation}) => {

    const navigation = useNavigation()
    const [otherUser, setOtherUser] = useState({})

    useEffect(() => {
        getOtherUser()
    }, [conversation]);

    const getOtherUser = async () => {
        const otherUser = conversation.members.find(m => m !== global.userData._id)
        console.log(otherUser)

        let userType = global.userData.role === 'recruiter' ? "Worker" : "Recruiter"
        console.log(userType)
        try {
            await fetch(`http://${IPAddress}:3000/${userType}/${otherUser}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(foundUser => {
                // console.log("other user data: ", foundUser)
                setOtherUser({...foundUser})
            })
        } catch (error) {
            console.log("get OtherUser: ", error)
        }
    }


  return (
    <TouchableOpacity style={[styles.container, styles.flexRow]}
        activeOpacity={0.5}
        onPress={() => {
            console.log("hehe")
            navigation.navigate("ConversationThreadDrawer", {"otherUser": otherUser, "conversation": conversation})
        }}
    >
      <Image style={styles.image} 
        source={otherUser.profilePic == 'pic' ? require("../assets/images/default-profile.png") : {uri: otherUser.profilePic}}
      />
      <View style={[styles.convoInfo]}>
        <View style={[styles.flexRow, {alignItems: 'center'}]}>
            <TText style={styles.name}>{`${otherUser.firstname} ${otherUser.lastname}`}</TText>
            <TText style={styles.date}> &#x2022; Nov 11</TText>
        </View>
        <TText style={[styles.message, tab === "Unread" && styles.unreadMessage]}>The quick brown fox</TText>
      </View>
    </TouchableOpacity>
  )
}

export default Conversation

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1.3,
        borderBottomColor: '#ddd',
        paddingVertical: 15
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 15,
    },
    convoInfo: {
        padding: 10
    },
    name: {
        color: '#0f0f0f',
        fontFamily: "LexendDeca_Medium",
        fontSize: 15
    },
    date: {
        color: '#bbb',
        fontSize: 13
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