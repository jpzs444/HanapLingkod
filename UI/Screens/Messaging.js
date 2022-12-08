import { StyleSheet, Image, View, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar';
import TText from '../Components/TText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults';
import { FlashList } from '@shopify/flash-list';
import Conversation from '../Components/Conversation';
import { IPAddress } from '../global/global';
import { useNavigation } from '@react-navigation/native';


const Messaging = () => {

  const navigation = useNavigation()

  const [activeBtn, setActiveBtn] = useState("All")
  const [conversations, setConversations] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    console.log("hi messaging")

    navigation.addListener("focus", () => {
      setPage(1)
      getConversations()
    })
  }, [])

  useEffect(() => {
    getConversations()
  },[page])

  const getConversations = async () => {
    try {
      await fetch(`https://hanaplingkod.onrender.com/conversations/${global.userData._id}`, {
        method: "GET",
        headers: {
          'content-type': 'application/json'
        }
      }).then(res => res.json())
      .then(data => {
        setConversations([...data])
        console.log("conversations: ", data)
      })

    } catch (error) {
      console.log("fetch convo: ", error)
    }
  }

  const Selector = ({label}) => (
    <TouchableOpacity style={styles.selectorBtn}
      activeOpacity={0.5}
      onPress={() => {
        console.log("selector btn: ", label)
        setActiveBtn(label)
      }}
    >
      <TText style={[styles.selectorText, label === activeBtn && {color: ThemeDefaults.themeOrange}]}>{label}</TText>
    </TouchableOpacity>
  )

  const addConversation = () => {
    fetch(`https://hanaplingkod.onrender.com/conversations`, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        "Authorization": global.accessToken
      },
      body: JSON.stringify({
        senderId: '636c9025f624714429165b1a',
        receiverId: "636a5adf02c0228c61750733",
      })
    }).catch(err => console.log('error add convo: ', err))
  }

  const ScreenHeader = () => (
    <>
      <View style={styles.header}>
        <TText style={styles.headerTitle}>Messages</TText>

        <View style={[styles.searchInputContainer, styles.flexRow]}>
          <Icon name="magnify" size={25} color={'#bbb'} />
          <TextInput 
            placeholder='Search'
            cursorColor={ThemeDefaults.themeOrange}
            style={styles.textInput}
          />
        </View>
      </View>

      {/* Read | Unread */}
      <View style={[styles.convoSelector, styles.flexRow]}>
        <Selector label={"All"} />
        <View style={styles.verticalLine}></View>
        <Selector label={"Unread"} />
      </View>
    </>
  )

  return (
    <View style={styles.container}>
      <Appbar menuBtn={true} showLogo={true} hasPicture={true} />

      <View style={styles.body}>
        <ScreenHeader />

        {
          conversations.length > 0 ?
          conversations.map(conversationItem => {
            console.log("convo id: ", conversationItem._id)
            return (
            <Conversation key={conversationItem._id} tab={activeBtn} conversation={conversationItem} />
          )})
          :
          <View style={{alignItems: 'center', marginTop: 50}}>
            <TText style={{color: '#bbb'}}>No conversations at the moment</TText>
          </View>
        }

        {/* <Conversation tab={activeBtn} conversation={} />
        <Conversation tab={activeBtn} />
        <Conversation tab={activeBtn} />
        <Conversation tab={activeBtn} /> */}
        {/* <TouchableOpacity
          onPress={() => {
            addConversation()
          }}
        >
          <TText>Add convo</TText>
        </TouchableOpacity> */}

        {/* <FlashList 
              data={conversations}
              keyExtractor={key => key._id}
              estimatedItemSize={80}
              renderItem={({item}) => (
                <Conversation tab={activeBtn} conversation={item} />
              )}
        /> */}
      </View>
    </View>
  )
}

export default Messaging

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight
    },
    body: {
      marginHorizontal: 30,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    header: {
      marginTop: 20,
      marginBottom: 20
    },
    headerTitle: {
      fontFamily: 'LexendDeca_SemiBold',
      fontSize: 20,
      marginBottom: 15
    },
    searchInputContainer: {
      backgroundColor: '#e5e5e5',
      paddingVertical: 6,
      paddingHorizontal: 15,
      borderRadius: 20
    },
    textInput: {
      flexGrow: 1,
      height: 35,
      paddingLeft: 10,
      fontFamily: "LexendDeca_Medium",
      fontSize: 16,
    },
    convoSelector: {
      padding: 8,
      paddingHorizontal: 15,
      justifyContent: 'center',
    },
    selectorBtn: {
      paddingVertical: 5,
      width: 180,
      alignItems: 'center',
    },
    selectorText: {
      fontFamily: 'LexendDeca_Medium'
    },
    verticalLine: {
      height: '80%', 
      width: 1, 
      backgroundColor: '#909090', 
      marginHorizontal: 0
    }
})