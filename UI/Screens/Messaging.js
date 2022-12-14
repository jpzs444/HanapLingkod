import { StyleSheet, Image, View, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar';
import TText from '../Components/TText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults';
import { FlashList } from '@shopify/flash-list';
import Conversation from '../Components/Conversation';
import { IPAddress } from '../global/global';
import { useIsFocused, useNavigation } from '@react-navigation/native';


const Messaging = () => {

  const navigation = useNavigation()
  const isFocused = useIsFocused()

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
  },[page, isFocused])

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


  const ScreenHeader = () => (
    <>
      <View style={styles.header}>
        <TText style={styles.headerTitle}>Messages</TText>

        {/* <View style={[styles.searchInputContainer, styles.flexRow]}>
          <Icon name="magnify" size={25} color={'#bbb'} />
          <TextInput 
            placeholder='Search'
            cursorColor={ThemeDefaults.themeOrange}
            style={styles.textInput}
          />
        </View> */}
      </View>

      {/* Read | Unread */}
      {/* <View style={[styles.convoSelector, styles.flexRow]}>
        <Selector label={"All"} />
        <View style={styles.verticalLine}></View>
        <Selector label={"Unread"} />
      </View> */}
    </>
  )

  return (
    <View style={styles.container}>
      <Appbar menuBtn={true} showLogo={true} hasPicture={true} />

      <View style={styles.body}>
        <ScreenHeader />

        <FlashList 
            data={conversations}
            keyExtractor={key => key._id}
            estimatedItemSize={80}
            ListEmptyComponent={() => (
              <View style={{alignItems: 'center', marginTop: 50}}>
                <TText style={{color: '#bbb'}}>No conversations at the moment</TText>
              </View>
            )}
            renderItem={({item}) => (
              <Conversation key={item._id} conversation={item} />
            )}
        />
      </View>
    </View>
  )
}

export default Messaging

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight,
      backgroundColor: "#fefefe"
    },
    body: {
      marginHorizontal: 30,
      flexGrow: 1,
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
      marginBottom: 15,
      textAlign: 'center'
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