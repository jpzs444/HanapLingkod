import { StyleSheet, TextInput, View, TouchableOpacity, Image, StatusBar, FlatList, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import TText from '../Components/TText'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { IPAddress } from '../global/global'
import { FlashList } from '@shopify/flash-list'
import { io } from 'socket.io-client'

// import { socketContext } from '../Components/DrawerNavigation'

const WIDTH = Dimensions.get('window').width

const ConversationThread = ({route}) => {

    const { otherUser, conversation } = route.params
    const isFocused = useIsFocused()
    // const socketContextRef = useContext(socketContext)

    const navigation = useNavigation()

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [incomingMessage, setIncomingMessage] = useState(null)
    const [page, setPage] = useState(1)
    const [conversationObj, setConversationObj] = useState({})

    const [onlineUsers, setOnlineUsers] = useState([])
    const [receiverOnline, setReceiverOnline] = useState(true)

    const [convo, setConvo] = useState({})
    
    const socket = useRef()

    let scrollRef;
    const [canScroll, setCanScroll] = useState(false)


    useEffect(() => {
        console.log("conversation item: ", conversation)
        handleFetchConversation()
        getMessages()

        setMessages([])
        
    }, [isFocused]);

    
    useEffect(() => {
        handleSeenByMe()
        // getMessages()
    }, [isFocused]);

    // useEffect(() => {
    //     handleSeenByMe()
    // }, []);

    useEffect(() => {
        if(canScroll && messages.length > 0){
            // scrollRef.scrollToEnd({animated: true})
            setCanScroll(false)
        }
    }, [messages, incomingMessage]);
    

    useEffect(() => {
        socket.current = io(`https://hanaplingkodchat.onrender.com/`)
        socket.current.emit("addUser", global.userData._id)
        socket.current.on("getMessage", data => {
            // setIncomingMessage({
            //     sender: data.senderId,
            //     text: data.text,
            //     createdAt: Date.now(),
            // })
            getMessages()
        })
    }, [messages, isFocused]);
    
    useEffect(() => {
        socket.current.on("getUsers", users => {
            // console.log("online users(convo thread): ", users)
            setOnlineUsers([...users])
        })
    }, [isFocused]);

    useEffect(() => {
        incomingMessage && conversationObj?.members.includes(incomingMessage.sender) &&
        setMessages(prev => [...prev, incomingMessage])
    }, [incomingMessage, conversationObj]);



    const handleFetchConversation = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/conversations/find/${global.userData._id}/${otherUser._id}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
            }).then(res => res.json())
            .then(data => {
                setConversationObj({...data})
            })
            getMessages()
        } catch (error) {
            console.log("error fetch conversation from two people: ", error)
        }
    }


    const handleSeenByMe = () => {
        try {
            let index = conversationObj?.members.indexOf(global.userData._id)
            let updateWho = index === 0 ? {senderSeen: true} : {receiverSeen: true}

            fetch(`https://hanaplingkod.onrender.com/conversations-Unread/${conversationObj?._id}`, {
                method: "PUT",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
                body: JSON.stringify({...updateWho})
            })
            .then(() => console.log("did seen"))
        } catch (error) {
            console.log("!!!!!!!error update seen(convo): ", error)
        }
    }

    const handleSetReceiverSeen = async () => {
        // index 0 sender
        // index 1 receiver

        try {
            let index = conversationObj?.members.indexOf(global.userData._id)
            let updateWho = index === 0 ? {receiverSeen: false, latestMessage: message} : {senderSeen: false, latestMessage: message}


            console.log("convo id: ", conversationObj._id)

            await fetch(`https://hanaplingkod.onrender.com/conversations-Unread/${conversationObj?._id}`, {
                method: "PUT",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
                body: JSON.stringify({...updateWho})
            }).then(() => {
                console.log("receiver seen updated")
                scrollRef.scrollToEnd({animated: true})
            })
        } catch (error) {
            console.log("!!!!!!!error update seen(convo): ", error)
        }
    }


    const getMessages = () => {
        try {
            fetch(`https://hanaplingkod.onrender.com/messages/${conversationObj?._id}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                }
            }).then(res => res.json())
            .then(data => {
                console.log("convo from messages: ", data)
                setMessages([...data])
                setCanScroll(true)
            })
        } catch (error) {
            console.log("get messages of convo: ", error)
        }
        
        // scrollRef.current?.scrollToEnd({animation: "smooth"})

    }

    const handleSendMessage = () => {

        const receiver_id = conversationObj?.members.find(member => member !== global.userData._id)
        
        const isOnline = onlineUsers.find(user => user.userId === receiver_id)
        
        console.log("isOnline: ", isOnline)
        setReceiverOnline(isOnline)
        if(isOnline){
            setReceiverOnline(true)
            socket.current.emit("sendMessage", {
                senderId: global.userData._id, 
                receiverId: isOnline.userId,
                text: message,
            });
            
        } else {
            console.log("no ones there")
            setReceiverOnline(false)
        }
        

        try {
            fetch(`https://hanaplingkod.onrender.com/messages`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": global.accessToken
                },
                body: JSON.stringify({
                    conversationId: conversationObj?._id,
                    sender: global.userData._id,
                    text: message,
                })
            })
            .then(res => res.json())
            .then(newMessage => {
                setMessage("")
                console.log("new message data: ", newMessage)
                setMessages([...messages, newMessage])
                setCanScroll(true)
                handleSetReceiverSeen()
            })

            console.log("success new sending message")
            // scrollRef.scrollToEnd({animation: "smooth"})

            // scrollRef.current.scrollToEnd({animation: "smooth"})
        } catch (error) {
            console.log("error send message: ", error)
        }

        // scrollRef.current?.scrollToEnd({animation: "smooth"})

    }

    const ThreadHeader = () => (
        <View style={[styles.header, styles.flexRow]}>
            <TouchableOpacity style={styles.backBtn}
                activeOpacity={0.5}
                onPress={() => {
                    navigation.navigate("MessagingTab")
                }}
            >
                <Icon name="arrow-left" size={24} color={"white"} />
            </TouchableOpacity>
            <View style={[styles.receiver, styles.flexRow]}>
                <Image style={styles.image} source={otherUser.profilePic === "pic" ? require("../assets/images/default-profile.png") : {uri: otherUser.profilePic}} />
                <View style={styles.receiverInformation}>
                    <TText style={styles.receiverName}>{`${otherUser.firstname} ${otherUser.lastname}`}</TText>
                    {/* <View style={styles.flexRow}>
                        <TText style={{color: ThemeDefaults.themeWhite}}>&#x2022; </TText>
                        <TText style={styles.receiverOnline}>{receiverOnline ? "Online": "Offline"}</TText>
                    </View> */}
                </View>
            </View>
            {/* report button */}
            <TouchableOpacity
                style={{marginLeft: 'auto', marginRight: 10, elevation: 4}}
                activeOpacity={0.5}
                onPress={() => {
                    console.log("report user")
                    {
                        global.userData.role ==="recruiter" ?
                        navigation.navigate("ReportUserDrawer", {userReportedID: otherUser._id, userFullName: `${otherUser.firstname} ${otherUser.lastname}`, userRole: "Worker", userProfilePicture: otherUser.profilePic})
                        :
                        navigation.navigate("ReportUserDrawer", {userReportedID: otherUser._id, userFullName: `${otherUser.firstname} ${otherUser.lastname}`, userRole: "Recruiter", userProfilePicture: otherUser.profilePic})
                    }
                }}
            >
                <Icon name="alert-circle" color={"#FFF"} size={30} style={{elevation: 4}} />
            </TouchableOpacity>
        </View>
    )

    const TextInputContainer = () => (
        <View style={[styles.inputContainer, styles.flexRow]}>
            <View style={styles.getImage}>
                <TouchableOpacity style={styles.getImageBtn}>
                    <Icon name="image-multiple" color={"#434343"} size={25} />
                </TouchableOpacity>
            </View>
            <View style={styles.inputBox}>
                <TextInput 
                    placeholder='Write a message'
                    value={message ? message : ""}
                    cursorColor={ThemeDefaults.themeOrange}
                    onChangeText={text => {
                        text.preve
                        setMessage(text)
                    }}
                    style={styles.input}
                />
            </View>
            <View style={styles.sendContainer}>
                <TouchableOpacity style={styles.sendBtn}
                    activeOpacity={0.3}
                    onPress={() => handleSendMessage()}
                >
                    <Icon name={"send"} size={24} color={ThemeDefaults.themeOrange} style={{transform: [{ rotate: '-45deg'}]}} />
                </TouchableOpacity>
            </View>
        </View>
    )

    const Messagebox = ({message, fromMe}) => (
        <View style={[styles.messageBox, fromMe ? styles.fromMe : styles.fromOther]}>
            <TText style={[styles.fromMeText, fromMe ? styles.fromMeText : styles.fromOtherText]}>{message}</TText>
        </View>
    )

    // const MessageFromOther = ({message}) => (
    //     <View style={[styles.messageBox, styles.fromOther]}>
    //         <TText style={styles.fromOtherText}>{message}</TText>
    //     </View>
    // )

  return (
    <View style={styles.container}>
      <ThreadHeader />

        {/* body */}
        {/* change to flashlist */}
        {/* <View style={{flexGrow: 1,}}>
        
                <FlatList 
                    data={messages}
                    keyExtractor={item => item._id}
                    // estimatedItemSize={80}
                    // ListEmptyComponent={() => (<View><TText>No messages ATM</TText></View>)}
                    renderItem={({messageItem}) => (
                        <Messagebox message={messageItem?.text} fromMe={messageItem?.sender === global.userData._id} />        
                    )}
                />
        </View> */}
        {/* <ScrollView style={styles.thread} contentContainerStyle={{paddingVertical: 60,}} ref={scrollRef} onContentSizeChange={() => scrollRef.current.scrollToEnd({animation: 'smooth'})} >
            {
                messages ? 
                messages.map((messageItem, index) => {
                    return(
                        <View key={index}>
                            <Messagebox message={messageItem?.text} fromMe={messageItem?.sender === global.userData._id} />
                        </View>
                    )
                })
                :
                <View>
                    <TText>No messages at the moment</TText>
                </View>
            }
        </ScrollView> */}

        <View style={{flexGrow: 1}}>
            {
                messages.length > 0 &&
                <FlashList 
                    data={messages}
                    keyExtractor={(item) => item._id}
                    estimatedItemSize={80}
                    contentContainerStyle={{paddingVertical: 60}}
                    ListEmptyComponent={() => (<View style={{marginTop: 50, alignItems: 'center'}}><TText style={{color: "#c5c5c5", textAlign: 'center'}}>Send a message to start a conversation</TText></View>)}
                    renderItem={({item}) => (
                        <Messagebox message={item?.text} fromMe={item?.sender === global.userData._id} />
                    )}
                    ref={(ref) => {
                        scrollRef = ref
                        // console.log("ref: ",ref)
                    }}
                />
            }
        </View>

        

      {/* <TextInputContainer /> */}


        <View style={[styles.inputContainer, styles.flexRow]}>
            {/* <View style={styles.getImage}>
                <TouchableOpacity style={styles.getImageBtn}>
                    <Icon name="image-multiple" color={"#434343"} size={25} />
                </TouchableOpacity>
            </View> */}
            <View style={styles.inputBox}>
                <TextInput 
                    placeholder='Write a message'
                    value={message ? message : ""}
                    cursorColor={ThemeDefaults.themeOrange}
                    onChangeText={text => setMessage(text)}
                    onFocus={() => {
                        if(messages.length > 0){
                            scrollRef.scrollToEnd({animated: true})
                        }
                    }}
                    style={styles.input}
                />
            </View>
            <View style={styles.sendContainer}>
                <TouchableOpacity style={styles.sendBtn}
                    activeOpacity={0.3}
                    onPress={() => {
                        if(message !== ""){
                            handleSendMessage()
                        }
                    }}
                >
                    <Icon name={"send"} size={24} color={ThemeDefaults.themeOrange} style={{transform: [{ rotate: '-45deg'}]}} />
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

export default ConversationThread

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    header: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        zIndex: 5,
        elevation: 4,

        padding: 20,
        paddingTop: StatusBar.currentHeight + 20,
        backgroundColor: ThemeDefaults.themeOrange,
    },
    backBtn: {
        justifyContent: 'flex-start',
        padding: 7
    },
    receiver: {
        marginLeft: 20
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    receiverInformation: {
        marginLeft: 15
    },
    receiverName: {
        color: ThemeDefaults.themeWhite,
        fontFamily: "LexendDeca_Medium",
        fontSize: 18
    },
    receiverOnline: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14

    },
    inputContainer: {
        // position: 'absolute',
        // bottom: 0,
        // left: 0,
        // right: 0,
        width: WIDTH,
        borderTopColor: '#ddd',
        borderTopWidth: 1.5,
        backgroundColor: '#fefefe',
        zIndex: 5,

        padding: 15,
        paddingBottom: 30
    },
    getImage: {

    },
    getImageBtn: {
        padding: 8,
        marginRight: 10
    },
    inputBox: {
        // flexGrow: 1,
        width: WIDTH*0.83,
        padding: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#eee'
    },
    input: {
        fontFamily: "LexendDeca",
        fontSize: 16,
    },
    sendContainer: {

    },
    sendBtn: {
        padding: 8,
        marginLeft: 10,
    },
    thread: {
        flexGrow: 1,
        // maxHeight: Dimensions.get('window').height - 100,
        marginBottom: 1,
        zIndex: 1,
    },
    messageBox: {
        flexShrink: 1,
        maxWidth: '50%',
        marginHorizontal: 15,
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        elevation: 3,
        zIndex: 1,
    },

    fromMe: {
        alignSelf: 'flex-end',
        backgroundColor: ThemeDefaults.themeLighterBlue,
    },
    fromMeText: {
        color: ThemeDefaults.themeWhite
    },

    fromOther: {
        alignSelf: 'flex-start',
        backgroundColor: '#e4e6eb',
    },
    fromOtherText: {
        color: ThemeDefaults.themeBlack
    },
})