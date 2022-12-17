import React, {useEffect, useState, useRef} from 'react'
import { SafeAreaView, View, Image, Text, StatusBar, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import TText from '../Components/TText'
import { useIsFocused, useNavigation, useScrollToTop } from '@react-navigation/native';
import * as NotificationsL from "expo-notifications";
import { FlashList } from '@shopify/flash-list';

import { IPAddress, role, userID } from '../global/global';
import Appbar from '../Components/Appbar';
import DialogueModal from '../Components/DialogueModal';


export default function Notifications({route}) {
  
    const navigation = useNavigation();
    const isFocused = useIsFocused()
    // const {user, role} = route.params;
    const [notifications, setNotifications] = useState([])
    const [notifOpendata, setNotifOpenData] = useState({})
    const [notificationIDClicked, setNotificationIDClick] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const notificationListener = useRef();
    const scrollToTop = useRef()

    const [openNotif, setOpenNotif] = useState(false)
    // useScrollToTop(scrollToTop)

    let notificationListEndIndex = notifications.length - 1

    let listViewRef;

    // use useEffect for componentDidMount or for when the page loads
    useEffect(() => {
      fetchNotificationList()
    }, [currentPage])


    useEffect(() => {
      let ff
      navigation.addListener("focus", () => {
        ff = setInterval(() => {fetchNotificationList()}, 5000)
      })

      navigation.addListener("blur", () => {
        clearInterval(ff)
      })
    }, [isFocused]);


  function fetchNotificationList () {
    fetch("https://hanaplingkod.onrender.com/notification/" + global.userData._id + "?page=" + currentPage, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        "Authorization": global.accessToken
      },
    }).then((res) => res.json())
    .then((data) => {
      // console.log("notification list: ", data)
      // console.log("res length: ", data.length)
      
      let list = [...data]
      list = list.reverse()
      setNotifications([...list])

      let notifCount = 0
      for(read of data){
        if(!read.read){
          notifCount = notifCount + 1
        }
      }
      global.notificationCount = notifCount

    }).catch((err) => {
      console.log("error notif page: ", err)
    })
  }

  // useEffect(() => {
  //   console.log(notifications.length)
  //   scrollToTop.current.scrollToIndex({
  //     index: (notifications.length - 1),
  //     animated: true,
  //   })
  // }, [notifications])


  const ListHeaderComponent = () => {
    return(
      <View style={styles.header}>
        <Appbar hasPicture={true} showLogo={true} menuBtn={true} />

        <View>
          <TText style={styles.headerTitle}>Notifications</TText>
        </View>
      </View>
    )
  }

  const handleNotificationAge = (createdAt) => {
    let notifDate = new Date(createdAt)
    let dateNow = new Date()
    let dateDiff = Math.abs(dateNow.getTime() - notifDate.getTime())

    // convert milliseconds to seconds
    dateDiff = dateDiff / 1000
    // console.log("seconds: ", dateDiff)

    let day = Math.floor(dateDiff / 60 / 60 / 24)
    if(day === 0) {  
      let hours = Math.floor(dateDiff / 60 / 60 )
      if ( hours === 0 ) {
        let minutes = Math.floor(dateDiff / 60 % 60)
        
        if ( minutes === 0 ) {
          let seconds = Math.floor(dateDiff % 60)
          return `${seconds} seconds ago`
        }
        
        return minutes > 1 ? `${minutes} minutes ago` : `${minutes} minute ago`
      }
        return hours > 1 ? `${hours} hours ago` : `${hours} hour ago`
    }
    return day > 1 ? `${day} days ago` : `${day} day ago`
  }

  const handleOpenNotificationItem = (data) => {
    setOpenNotif(true)
    setNotifOpenData({title: data.title, body: data.body})
  }



  return (
    <SafeAreaView style={styles.container}>
        {/* will change to flatlist instead of scrollview for better performance and better rendering of notifications */}
            
            <DialogueModal 
              firstMessage={notifOpendata.title}
              secondMessage={notifOpendata.body}
              numBtn={1}
              visible={openNotif}
              onDecline={setOpenNotif}
            />

            <View style={styles.header}>
              {/* <Appbar hasPicture={true} menuBtn={true} /> */}

              {/* <TText style={styles.headerTitle}>Notifications</TText> */}
              <View style={styles.btnContainer}>

                  {/* pang render ng notification */}
                  <FlashList 
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    estimatedItemSize={80}
                    showsVerticalScrollIndicator ={true}
                    onEndReachedThreshold={0.2}
                    onEndReached={() => setCurrentPage(prev => prev + 1)}
                    ListHeaderComponent={() => (<ListHeaderComponent />)}
                    renderItem={({item}) => (
                      <View style={styles.btnItemContainer} >
                        <TouchableOpacity style={ item.read ? styles.btnRead : styles.btnUnread}
                        onPress={() => {
                          setNotificationIDClick(item._id)
                          // console.log(item)
                          setOpenNotif(true)

                          handleOpenNotificationItem(item)

                          // turn notification.read to true 
                          fetch("https://hanaplingkod.onrender.com/notification/" + global.userData._id, {
                            method: "PUT",
                            headers: {
                              'content-type': 'application/json',
                              "Authorization": global.accessToken
                            }
                          }).then(() => {
                            // console.log("all notification read")
                            fetchNotificationList()
                          })
                          .catch((error) => console.log("error: ", error.message))

                          // {
                          //   notification.from === 'service_request' ?
                          //     navigation.navigate("Request", {reqID: notification._id})
                          //     :
                          //     navigation.navigate("Booking", {reqID: notification._id})
                          // }
                        }}
                      >
                          <View style={styles.btnContent}>
                              <Image style={styles.btnImage} source={require('../assets/images/bg-welcome-worker.png')}/>
                              <View style={styles.btnTexts}>
                                <Text numberOfLines={3} style={styles.btnDesc}>
                                  <Text style={styles.btnDescTitle}>
                                    {item.title} 
                                  </Text> 
                                  <Text> </Text>
                                   {item.body}
                                </Text>
                                  <Text style={styles.btnTime}>
                                    {handleNotificationAge(item.createdAt)}
                                  </Text>
                              </View>
                          </View>

                          {/* <DialogueModal 
                            firstMessage={item.title}
                            secondMessage={item.body}
                            numBtn={1}
                            visible={openNotif}
                            onDecline={setOpenNotif}
                          /> */}

                      </TouchableOpacity>
                      </View>
                      )
                    }
                    ListFooterComponent={() => (
                      <View style={{height: 200, marginTop: 20, alignItems: 'center'}}>
                        <TText style={styles.footerTitle}>---- End of List ----</TText>
                      </View>
                    )}
                  />
              </View>
            </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'center', 
      // justifyContent: 'center', 
      // marginTop: StatusBar.currentHeight, 
      backgroundColor: '#fff',
    },
    header: {
      width: "100%",
      alignItems: 'center', 
    },
    headerTitle: {
      fontFamily: 'LexendDeca_SemiBold',
      fontSize: 18,
      marginTop: 20,
      marginBottom: 25,
    },
    btnContainer: {
      flexGrow: 1,
      marginTop: 40,
      // paddingHorizontal: 30,
    },
    btnContent: {
      flexDirection: 'row', 
      padding: 15,
    },
    btnItemContainer: {
      width: '100%', 
      paddingHorizontal: 20,
      alignItems: 'center'
    },
    btnUnread: {
      elevation: 4, 
      backgroundColor: '#fff', 
      width: "100%", 
      height: 120, 
      borderWidth: 1, 
      borderColor: 'rgba(217, 103, 43, 0.85)', 
      marginTop: 15, 
      borderRadius: 15, 
    },
    btnRead: {
      elevation: 4, 
      backgroundColor: '#fff', 
      width: "100%", 
      height: 120, 
      borderWidth: 1, 
      borderColor: 'rgba(0,0, 0, 0.05)', 
      marginTop: 15, 
      borderRadius: 15,
    },
    btnImage: {
      width: 80, 
      height: 80, 
      borderRadius: 50, 
      borderWidth: 1, 
      borderColor: 'rgba(0, 0, 0, 0.3)',
    },
    btnTexts: {
      flex: 1, 
      paddingLeft: "4.5%", 
      justifyContent: "space-around",
    },
    btnDesc: {
      fontSize: 14,
    },
    btnDescTitle: {
      fontFamily: 'LexendDeca_SemiBold',
    },
    btnTime: {
      fontSize: 12, 
      color: "rgba(27, 35, 58, 0.75)",
    },
    footerTitle: {
      color: 'lightgray',
      marginTop: 20
    },
  })
