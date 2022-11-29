import { StyleSheet, TextInput, View, TouchableOpacity, Image, StatusBar, FlatList, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import TText from '../Components/TText'
import { useNavigation } from '@react-navigation/native'
import { IPAddress } from '../global/global'
import { FlashList } from '@shopify/flash-list'
import { io } from 'socket.io-client'

// import { socketContext } from '../Components/DrawerNavigation'



const ConversationThread = ({route}) => {

    const { otherUser, conversation } = route.params
    // const socketContextRef = useContext(socketContext)

    const navigation = useNavigation()

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [incomingMessage, setIncomingMessage] = useState(null)

    const [onlineUsers, setOnlineUsers] = useState([])
    
    const socket = useRef()

    const scrollRef = useRef()
    const [canScroll, setCanScroll] = useState(false)

    useEffect(() => {
        if(canScroll){
            scrollRef.current?.scrollToEnd({animation: "smooth"})
            setCanScroll(false)
        }
    }, [messages, incomingMessage,]);

    useEffect(() => {
        socket.current = io(`ws://${IPAddress}:8900`)
        // console.log("type of socketCOntextref: " , typeof )
        socket.current.on("getMessage", data => {
            setIncomingMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })
    }, [messages, incomingMessage]);

    useEffect(() => {
        incomingMessage && conversation?.members.includes(incomingMessage.sender) &&
        setMessages(prev => [...prev, incomingMessage])
    }, [incomingMessage, conversation]);

    useEffect(() => {
        socket.current.emit("addUser", global.userData._id)
        socket.current.on("getUsers", users => {
            console.log("online users(convo thread): ", users)
            setOnlineUsers([...users])
        })
    }, [route]);


    useEffect(() => {
        navigation.addListener("focus", () => {getMessages()})
    }, [route]);


    const getMessages = () => {
        try {
            fetch(`http://${IPAddress}:3000/messages/${conversation._id}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                }
            }).then(res => res.json())
            .then(data => {
                // console.log("convo from messages: ", data)
                setMessages([...data])
                setCanScroll(true)
            })
        } catch (error) {
            console.log("get messages of convo: ", error)
        }
        
        // scrollRef.current?.scrollToEnd({animation: "smooth"})

    }

    const handleSendMessage = async () => {

        const receiver_id = conversation.members?.find(member => member !== global.userData._id)
        
        const isOnline = onlineUsers.find(user => user.userId === receiver_id)
        
        console.log("isONline: ", isOnline)
        if(isOnline){
            socket.current.emit("sendMessage", {
                senderId: global.userData._id, 
                receiverId: isOnline.userId,
                text: message,
            });
            
        } else {
            console.log("no ones there")
        }
        

        try {
            await fetch(`http://${IPAddress}:3000/messages`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    conversationId: conversation._id,
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

            })

            console.log("success new sending message")

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
                <Image style={styles.image} source={require("../assets/images/default-profile.png")} />
                <View style={styles.receiverInformation}>
                    <TText style={styles.receiverName}>{`${otherUser.firstname} ${otherUser.lastname}`}</TText>
                    <View style={styles.flexRow}>
                        <TText style={{color: ThemeDefaults.themeWhite}}>&#x2022; </TText>
                        <TText style={styles.receiverOnline}>Online</TText>
                    </View>
                </View>
            </View>
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
        <ScrollView style={styles.thread} contentContainerStyle={{paddingVertical: 60,}} ref={scrollRef} onContentSizeChange={() => scrollRef.current.scrollToEnd({animation: 'smooth'})} >
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
        </ScrollView>

      {/* <TextInputContainer /> */}


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
                    onChangeText={text => setMessage(text)}
                    onFocus={() => {
                        scrollRef.current.scrollToEnd({animation: "smooth"})
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
        backgroundColor: '#fefefe'
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
        fontFamily: "LexendDeca_Medium"
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
        width: '100%',
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
        flexGrow: 1,
        padding: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#eee'
    },
    input: {
        fontFamily: "LexendDeca",
        fontSize: 16
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