import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView, RefreshControl, Text, View, Image, StatusBar, 
  Dimensions, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Modal, Linking } from 'react-native';
import TText from '../Components/TText'
import { useNavigation } from '@react-navigation/native';
import Appbar from '../Components/Appbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {IPAddress} from '../global/global'
import ThemeDefaults from '../Components/ThemeDefaults';
import { FlashList } from '@shopify/flash-list';
// import { io } from 'socket.io-client'

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import DialogueModal from '../Components/DialogueModal';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default function Home() {

  const navigation = useNavigation();
  const [category, setCategory] = useState([])
  const [searchBtnPressed, setSearchBtnPressed] = useState(false)

  let searchW;
  const [searchWord, setSearchWord] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [userHasSearched, setuserHasSearched] = useState(false)
  
  const [isRefreshing, setIsRefreshing] = useState(false)

  const searchInput = useRef();
  const socket = useRef()

  const notificationListener = useRef();
  const responseListener = useRef();

  const [isBanned, setIsBanned] = useState(false)
  const [viewModalBanned, setViewModalBanned] = useState(false)

  // useEffect(() => {
  //   socket.current = io(`ws://${IPAddress}:8900`)
  // }, []);

  // useEffect(() => {
  //   socket.current.emit("addUser", global.userData._id)
  //   // socket.current.on("getUsers", users => {
  //   //     console.log("online users: ", users)
  //   //     setOnlineUsers([...users])
  //   // })
  // }, []);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // setNotification(notification);
        
      });

      responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("notification listener response: ", response.notification.request.content.data);
        console.log("notification listener response: ", response.notification);

        let notif = response.notification.request.content.data

        // turn notification.read to true 
        fetch(`https://hanaplingkod.onrender.com/notification/${global.deviceExpoPushToken}`, {
          method: "PUT",
          headers: {
            'content-type': 'application/json',
            "Authorization": global.accessToken
          },
        }).then(() => console.log("all notification read"))
        .catch((error) => console.log("notification app js error: ", error.message))

        // go to convo
        // navigation.navigate("CompletedBookingsDrawer")
        if(notif.type === "New Message"){
          navigation.navigate("MessagingTab");
        }

        switch (notif.Type) {
          case "New Message":
            navigation.navigate("MessagingTab");
            break;
          
          case "New Service Request":
            navigation.navigate("ViewServiceRequestDrawer", {serviceRequestID: notif.id, requestItem: {}});
            break;

          case "Updated Booking Status":
            navigation.navigate("BookingInformationDrawer", {bookingID: notif.id, bookingItem: {}});
            break;

          case "Updated Booking Status":
            navigation.navigate("BookingInformationDrawer", {bookingID: notif.id, bookingItem: {}});
            break;

          case "updated Service Request":
            navigation.navigate("ViewServiceRequestDrawer", {serviceRequestID: notif.id, requestItem: {}});
            break;
          
        
          default:
            navigation.navigate("Home_Drawer");
        }

        // go to request/booking page


        // fetch(/request/id || /booking/id)
      });


    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  
  useEffect(() => {
    // send pushtoken to backend
    fetch(`https://hanaplingkod.onrender.com/setToken/${global.userData._id}`, {
      method: 'PUT',
      headers: {
        "content-type": "application/json",
        "Authorization": global.accessToken
      },
      body: JSON.stringify({
        pushtoken: global.deviceExpoPushToken,
      })
    }).then((res) => console.log("Successfully placed notification token/userID"))
    .catch((err) => console.log("err : ", err.message))

  }, [])


  useEffect(() => {
    fetchNotificationList()
  },[])


  // fetch service category
  useEffect(() => {
    // getAllCategory()
    
    navigation.addListener("focus", () => {
      onRefresh()
      console.log("home screen: ", global.accessToken)
      // getAllCategory()
    })
  }, [])


  const getAllCategory = async () => {
    try {
      await fetch(`https://hanaplingkod.onrender.com/service-category`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "Authorization": global.accessToken
        },
      }).then((res) => res.json())
      .then((data) => {
        console.log("home accesstoken: ", data)
        if(data === "Forbidden: User is Banned"){
          setIsBanned(true)
          setViewModalBanned(true)
          setCategory([])
        } else {
          setCategory([...data])
          console.log("cat:", data)
        }
      })
    } catch (error) {
      // console.log("")
      setIsBanned(true)

      console.log("error service cat: ", error)
    }
  }

  const fetchNotificationList = () => {
    fetch(`https://hanaplingkod.onrender.com/notification/${global.userData._id}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        "Authorization": global.accessToken
      },
    }).then((res) => res.json())
    .then((data) => {
      console.log("res length: ", data.length)

      let notifCount = 0
      for(let i = 0; i < data.length; i++){
        if(data[i].read){
          notifCount = notifCount + 1
        }
      }
      global.notificationCount = notifCount

    }).catch((err) => {
      console.log("error notification: ", err.message)
    })
    // setTimeout(fetchNotificationList, 5000)
  }

  const lookforResults = () => {
    console.log("seach q: ", searchW)

    setuserHasSearched(true)
    setSearchBtnPressed(false)
    fetch(`https://hanaplingkod.onrender.com/search?keyword=${searchW}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": global.accessToken
      },
    }).then((res) => res.json())
    .then((data) => {

      let wor = [...data.worker]
      let cat = [...data.category]
      let subcat = [...data.subCategory]
      let mergeResults = [...cat, ...subcat, ...wor]

      setCategory([])
      setCategory([...mergeResults])
      setSearchResults(mergeResults)
      setSearchWord(searchW)
      
      // console.log("category search in 1: ", searchResults)
    })

  }


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

  const onRefresh = () => {
      setIsRefreshing(true)
      searchW = ""
      setSearchWord("")
      setuserHasSearched(false)
      getAllCategory()
      wait(500).then(() => setIsRefreshing(false));
  }

  const handleSearchWord = event => {
    // setSearchWord(event.nativeEvent.text);
    searchW = event.nativeEvent.text

    console.log('value is:', event.nativeEvent.text);
  };

  const ScreenHeaderComponent = () => {
    return(
      <View>
        <Appbar hasPicture={true} menuBtn={true} showLogo={true} />

        {/* Modals */}
        <DialogueModal 
          firstMessage="You are banned!"
          secondMessage={"You will not have access to view anything"}
          visible={viewModalBanned}
          numBtn={1}
          warning={true}
          onDecline={setViewModalBanned}
        />
        
        
        {/* Greeting header */}
        <View style={styles.greetingContainer}>
          <TText style={styles.greetingText}>Welcome, {global.userData.role.charAt(0).toUpperCase() + global.userData.role.slice(1)} {global.userData.firstname}! 👋🏻</TText>
        </View>

        {/* Action bar Button */}
        <View style={styles.actionbar_container}>
          <TouchableOpacity style={styles.actionbar_btn}
            onPress={() => navigation.navigate("RequestsScreenHOME")}
          >
            <View style={styles.actionbar_iconContainer}>
              <Icon name="clipboard-text-multiple" size={50} color="#275A53" />
            </View>
            <View style={styles.actionbar_textContainer}>
              <TText style={styles.actionbar_text}>Requests</TText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionbar_btn}
            onPress={() => {
              // use Linking to dial phone number
              // Linking.openURL(`tel:number`)
              navigation.navigate("BookingsScreen")
            }}
          >
            <View style={styles.actionbar_iconContainer}>
              <Icon name="bookmark-box-multiple" size={50} color={ThemeDefaults.themeOrange} />
            </View>
            <View style={styles.actionbar_textContainer}>
              <TText style={styles.actionbar_text}>Bookings</TText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionbar_btn}
            onPress={() => {
              navigation.navigate("CompletedBookingsDrawer")
            }}
          >
            <View style={styles.actionbar_iconContainer}>
              <Icon name="clipboard-check-multiple" size={50} color={ThemeDefaults.appIcon} />
            </View>
            <View style={styles.actionbar_textContainer}>
              <TText style={styles.actionbar_text}>Completed</TText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Services Offered */}
        <View style={styles.services_body}>
          {/* Header title */}

          {/* Search bar */}
          {
            !isBanned &&
            <>
              <View style={styles.services_header}>
                <TText style={styles.services_title}>Services Offered</TText>
              </View>

              <View style={styles.services_searchBarContainer}>
                <TouchableOpacity style={[styles.services_searchbar, {justifyContent: searchBtnPressed ? 'flex-start' : null, paddingLeft: searchBtnPressed ? 10 : null,}]}
                  onPress={() => {
                    setSearchBtnPressed(true)
                    searchW = ''
                    setSearchWord("")
                    searchInput.current.focus()
                  }}
                >
                  <Icon name="magnify" size={25} color="#8A8B97" style={{marginLeft: 10}} />
                  <TextInput style={[styles.services_searchbarTextInput]} 
                    placeholder={"Search for a Service or Worker"}
                    placeholderTextColor="#8A8B97"
                    keyboardType="default"
                    returnKeyType='search'
                    // value={searchW ? searchW : searchWord}
                    enablesReturnKeyAutomatically={true}
                    // onChangeText={(val) => {
                    //   setSearchWord(val)
                    //   console.log(val)
                    // }}
                    onChange={handleSearchWord}
                    onSubmitEditing={lookforResults}
                    ref={searchInput}
                  />
                  {
                    userHasSearched ? 
                      <TouchableOpacity
                        onPress={() => {
                          searchW = ""
                          setSearchWord("")
                          setuserHasSearched(false)
                          getAllCategory()
                        }}
                        style={{paddingRight: 5}}
                      >
                        <Icon name='close-circle' size={22} />
                      </TouchableOpacity>
                    : null
                  }
                </TouchableOpacity>
              </View>
            </>
          }

          {
            userHasSearched ? 
              <View style={styles.searchClearResultsContainer}>
                <TText style={{textAlign: 'center', fontSize: 18, color: 'gray'}}>Search results for '{searchWord}'</TText>
              </View>
              : null
          }
          

        </View>
      </View>    
    )
  }
  

  // const Mainhomelist = () => {
  //   return(
  //     <FlashList 
  //       refreshing={isRefreshing} 
  //       onRefresh={onRefresh}
  //       data={category}
  //       keyExtractor={item => item._id}
  //       estimatedItemSize={50}
  //       // keyboardDismissMode='none'
  //       // keyboardShouldPersistTaps={'always'}
  //       showsVerticalScrollIndicator={false}
  //       ListFooterComponent={() => (<View style={{height: 120}}></View>)}
  //       ListHeaderComponent={() => (
  //         <ScreenHeaderComponent />
  //       )}
  //       renderItem={({item}) => (
  //         searchResults ? 
  //         <View>
  //             {
  //               item.Category && item.Category !== 'unlisted' ? 
  //                 <TouchableOpacity style={styles.categoryBtn}
  //                   onPress={() => {
  //                     navigation.navigate("SubCategoryScreen", {categoryID: item._id, categoryNAME: item.Category})
  //                   }}
  //                 >
  //                   <ImageBackground source={{uri: item.image}} style={styles.category_imageBG}>
  //                     <View style={styles.textWrapper}>
  //                       <TText style={styles.categoryTxt}>{item.Category}</TText>
  //                     </View>
  //                   </ImageBackground>
  //                 </TouchableOpacity>
  //                 :
  //                 item.ServiceSubCategory ? 
  //                 <TouchableOpacity style={styles.buttonSubCat}
  //                     onPress={() => {
  //                         navigation.navigate("ListSpecificWorkerScreen", {chosenCategory: item.ServiceSubCategory})
  //                     }}
  //                 >
  //                     <View style={styles.imageContainerSubCat}>
  //                         <Image source={require("../assets/images/stock.jpg")} style={styles.imageStyleSubCat} />
  //                     </View>
  //                     <View style={styles.subCategoryDescriptionBox}>
  //                         <View style={styles.subCategoryRow}>
  //                             <TText style={styles.subCategoryText}>{item.ServiceSubCategory}</TText>
  //                             <TText style={styles.priceRangePrice}>Price Range</TText>
  //                         </View>
  //                         <View style={[styles.subCategoryRow, {marginBottom: 0}]}>
  //                             <TText style={styles.categoryText}>{item.ServiceID.Category}</TText>
  //                             <TText style={styles.priceRangeText}>Price Range</TText>
  //                         </View>
  //                     </View>
  //                 </TouchableOpacity>
  //                 :
  //                 item.firstname ? 
  //                   <View style={{width: '100%', paddingHorizontal: 30, height: 130}}>
  //                     <TouchableOpacity style={styles.buttonWorker}
  //                       onPress={() => {
  //                         navigation.navigate("RequestFormDrawer", {workerID: item._id, workerInformation: item, selectedJob: '', showMultiWorks: true})
  //                       }}
  //                     >
  //                         <View style={styles.buttonWorkerView}>
  //                             {/* Profile Picture */}
  //                             <View style={styles.imageContainer}>
  //                                 <Image source={item.profilePic === 'pic' ? require('../assets/images/default-profile.png') : {uri: item.profilePic}} style={styles.image} />
  //                             </View>
  //                             {/* Worker Information */}
  //                             <View style={styles.descriptionBox}>
  //                                 <View style={styles.descriptionTop}>
  //                                     <View style={[styles.row, styles.workerInfo]}>
  //                                         <View style={styles.workerNameHolder}>
  //                                             <TText style={styles.workerNameText}>{item.firstname}{item.middlename === "undefined" ? "" : item.middlename} {item.lastname}</TText>
  //                                             { item.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null }
  //                                         </View>
  //                                         <View style={styles.workerRatingsHolder}>
  //                                             <Icon name="star" color={"gold"} size={18} />
  //                                             <TText style={styles.workerRatings}>4.5</TText>
  //                                         </View>                                     
  //                                     </View>
  //                                     <View style={styles.workerAddressBox}>
  //                                         <Icon name='map-marker' size={16} />
  //                                         <Text numberOfLines={1} ellipsizeMode='tail' style={styles.workerAddressText}>{item.street}, {item.purok}, {item.barangay}</Text>
  //                                     </View>
  //                                 </View>
  //                                 <View style={styles.descriptionBottom}>
  //                                     {
  //                                       item.works &&
  //                                       <Text numberOfLines={1} ellipsizeMode='tail' >
  //                                         {
  //                                           item.works.map(function(item){
  //                                             return item + ", "
  //                                           })
  //                                         }
  //                                       </Text>
                                        
  //                                     }
  //                                 </View>
  //                             </View>
  //                         </View>
  //                     </TouchableOpacity>
  //                   </View>
  //                 : null
  //               }
  //           </View>
  //           :
  //           item.Category !== 'unlisted' ?
  //           <TouchableOpacity style={styles.categoryBtn}
  //               onPress={() => {
  //                 navigation.navigate("SubCategoryScreen", {categoryID: item._id, categoryNAME: item.Category})
  //               }}
  //             >
  //               <ImageBackground source={require("../assets/images/painting.jpg")} style={styles.category_imageBG}>
  //                 <View style={styles.textWrapper}>
  //                   <TText style={styles.categoryTxt}>{item.Category}</TText>
  //                 </View>
  //               </ImageBackground>
  //             </TouchableOpacity> 
  //             : null
  //       )}
  //     />
  //   )
  // }

  // const ListSearchResults = () => {
  //   return(
  //     <>
  //       <FlashList 
  //         data={searchResults}
  //         keyExtractor={item => item._id}
  //         estimatedItemSize={70}
  //         showsVerticalScrollIndicator={false}
  //         ListFooterComponent={() => (<View style={{height: 180}}></View>)}
  //         ListHeaderComponent={() => (
  //           <ScreenHeaderComponent />     
  //         )}
  //         renderItem={({item}) => (
  //           <View>
  //             {
  //               item.Category && item.Category !== 'unlisted' ? 
  //                 <TouchableOpacity style={styles.categoryBtn}
  //                   onPress={() => {
  //                     navigation.navigate("SubCategoryScreen", {categoryID: item._id, categoryNAME: item.Category})
  //                   }}
  //                 >
  //                   <ImageBackground source={require("../assets/images/stock.jpg")} style={styles.category_imageBG}>
  //                     <View style={styles.textWrapper}>
  //                       <TText style={styles.categoryTxt}>{item.Category}</TText>
  //                     </View>
  //                   </ImageBackground>
  //                 </TouchableOpacity>
  //                 :
  //                 item.ServiceSubCategory ? 
  //                 <TouchableOpacity style={styles.buttonSubCat}
  //                     onPress={() => {
  //                         navigation.navigate("ListSpecificWorkerScreen", {chosenCategory: item.ServiceSubCategory})
  //                     }}
  //                 >
  //                     <View style={styles.imageContainerSubCat}>
  //                         <Image source={require("../assets/images/stock.jpg")} style={styles.imageStyleSubCat} />
  //                     </View>
  //                     <View style={styles.subCategoryDescriptionBox}>
  //                         <View style={styles.subCategoryRow}>
  //                             <TText style={styles.subCategoryText}>{item.ServiceSubCategory}</TText>
  //                             <TText style={styles.priceRangePrice}>Price Range</TText>
  //                         </View>
  //                         <View style={[styles.subCategoryRow, {marginBottom: 0}]}>
  //                             <TText style={styles.categoryText}>{item.ServiceID.Category}</TText>
  //                             <TText style={styles.priceRangeText}>Price Range</TText>
  //                         </View>
  //                     </View>
  //                 </TouchableOpacity>
  //                 :
  //                 item.firstname ? 
  //                   <View style={{width: '100%', paddingHorizontal: 30, height: 130}}>
  //                     <TouchableOpacity style={styles.buttonWorker}>
  //                         <View style={styles.buttonWorkerView}>
  //                             {/* Profile Picture */}
  //                             <View style={styles.imageContainer}>
  //                                 <Image source={item.profilePic === 'pic' ? require('../assets/images/default-profile.png') : {uri: `http://${IPAddress}:3000/images/${item.profilePic}`}} style={styles.image} />
  //                             </View>
  //                             {/* Worker Information */}
  //                             <View style={styles.descriptionBox}>
  //                                 <View style={styles.descriptionTop}>
  //                                     <View style={[styles.row, styles.workerInfo]}>
  //                                         <View style={styles.workerNameHolder}>
  //                                             <TText style={styles.workerNameText}>{item.firstname}{item.middlename === "undefined" ? "" : item.middlename} {item.lastname}</TText>
  //                                             { item.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null }
  //                                         </View>
  //                                         <View style={styles.workerRatingsHolder}>
  //                                             <Icon name="star" color={"gold"} size={18} />
  //                                             <TText style={styles.workerRatings}>4.5</TText>
  //                                         </View>                                     
  //                                     </View>
  //                                     <View style={styles.workerAddressBox}>
  //                                         <Icon name='map-marker' size={16} />
  //                                         <Text numberOfLines={1} ellipsizeMode='tail' style={styles.workerAddressText}>{item.street}, {item.purok}, {item.barangay}</Text>
  //                                     </View>
  //                                 </View>
  //                                 <View style={styles.descriptionBottom}>
  //                                     {
  //                                       item.works &&
  //                                       <Text numberOfLines={1} ellipsizeMode='tail' >
  //                                         {
  //                                           item.works.map(function(item){
  //                                             return item + ", "
  //                                           })
  //                                         }
  //                                       </Text>
                                        
  //                                     }
  //                                 </View>
  //                             </View>
  //                         </View>
  //                     </TouchableOpacity>
  //                   </View>
  //                 : null
  //               }
  //           </View>
  //         )}
  //       />
  //     </>
  //   )
  // }

  return (
    <SafeAreaView style={styles.mainContainer}>
          <View style={styles.category_container}>
          <ScreenHeaderComponent />
          {
            isBanned ?
            <View style={{alignItems: 'center', backgroundColor: ThemeDefaults.themeRed, padding:20}}>
                <TText style={{color: "#fff", textAlign: 'center', fontFamily: "LexendDeca_Medium"}}>You are currently banned. Despite being banned, you must tend your scheduled bookings</TText>
            </View>
            :
            <FlashList 
              data={category}
              refreshing={isRefreshing} 
              onRefresh={onRefresh}
              keyExtractor={item => item?._id}
              estimatedItemSize={50}
              // keyboardDismissMode='none'
              // keyboardShouldPersistTaps={'always'}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => (<View style={{height: 120}}></View>)}
              // ListHeaderComponent={() => (
              // )}
              renderItem={({item}) => (
                searchResults ? 
                <View>
                    {
                      item.Category && item.Category !== 'unlisted' ? 
                        <TouchableOpacity style={styles.categoryBtn}
                          onPress={() => {
                            navigation.navigate("SubCategoryScreen", {categoryID: item._id, categoryNAME: item.Category})
                          }}
                        >
                          <ImageBackground source={item.image ? {uri: item?.image} : require("../assets/images/stock.jpg")} style={styles.category_imageBG}>
                            <View style={styles.textWrapper}>
                              <TText style={styles.categoryTxt}>{item.Category}</TText>
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                        :
                        item.ServiceSubCategory ? 
                        <TouchableOpacity style={styles.buttonSubCat}
                            onPress={() => {
                                navigation.navigate("ListSpecificWorkerScreen", {chosenCategory: item.ServiceSubCategory})
                            }}
                        >
                            <View style={styles.imageContainerSubCat}>
                                <Image source={require("../assets/images/stock.jpg")} style={styles.imageStyleSubCat} />
                            </View>
                            <View style={styles.subCategoryDescriptionBox}>
                                <View style={styles.subCategoryRow}>
                                    <TText style={styles.subCategoryText}>{item.ServiceSubCategory}</TText>
                                    {/* <TText style={styles.priceRangePrice}>Price Range</TText> */}
                                    <TText style={styles.categoryText}>{item.ServiceID.Category}</TText>
                                </View>
                                <View style={[styles.subCategoryRow, {marginBottom: 0}]}>
                                    {/* <TText style={styles.priceRangeText}>Price Range</TText> */}
                                </View>
                            </View>
                        </TouchableOpacity>
                        :
                        item.firstname ? 
                          <View style={{width: '100%', paddingHorizontal: 20, height: 130}}>
                            <TouchableOpacity style={styles.buttonWorker}
                              onPress={() => {
                                navigation.navigate("RequestFormDrawer", {workerID: item._id, workerInformation: item, selectedJob: '', showMultiWorks: true})
                              }}
                            >
                                <View style={styles.buttonWorkerView}>
                                    {/* Profile Picture */}
                                    <View style={styles.imageContainer}>
                                        <Image source={item.profilePic === 'pic' ? require('../assets/images/default-profile.png') : {uri: item.profilePic}} style={styles.image} />
                                    </View>
                                    {/* Worker Information */}
                                    <View style={styles.descriptionBox}>
                                        <View style={styles.descriptionTop}>
                                            <View style={[styles.row, styles.workerInfo]}>
                                                <View style={styles.workerNameHolder}>
                                                    <TText style={styles.workerNameText}>{item.firstname}{item.middlename === "undefined" ? "" : item.middlename} {item.lastname}</TText>
                                                    { item.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null }
                                                </View>
                                                <View style={styles.workerRatingsHolder}>
                                                    <Icon name="star" color={"gold"} size={18} />
                                                    <TText style={styles.workerRatings}>{item.rating ? item.rating : "0"}</TText>
                                                </View>                                     
                                            </View>
                                            <View style={styles.workerAddressBox}>
                                                <Icon name='map-marker' size={16} />
                                                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.workerAddressText}>{item.street}, {item.purok}, {item.barangay}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.descriptionBottom}>
                                            {
                                              item.works &&
                                              <Text numberOfLines={1} ellipsizeMode='tail' >
                                                {
                                                  item.works.map(function(item){
                                                    return item + ", "
                                                  })
                                                }
                                              </Text>
                                              
                                            }
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                          </View>
                        : null
                      }
                  </View>
                  :
                  item.Category !== 'unlisted' ?
                  <TouchableOpacity style={styles.categoryBtn}
                      onPress={() => {
                        navigation.navigate("SubCategoryScreen", {categoryID: item._id, categoryNAME: item.Category})
                      }}
                    >
                      <ImageBackground source={require("../assets/images/painting.jpg")} style={styles.category_imageBG}>
                        <View style={styles.textWrapper}>
                          <TText style={styles.categoryTxt}>{item.Category}</TText>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity> 
                  : null
              )}
            /> 
          }
          </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    height: HEIGHT, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: StatusBar.currentHeight, 
    backgroundColor: '#fff',
  },
  greetingContainer: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 20,
    fontFamily: 'LexendDeca_SemiBold',
    color: ThemeDefaults.themeDarkBlue
  },
  actionbar_container: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly' 
  },
  actionbar_btn: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    // elevation: 4,
  },
  actionbar_iconContainer: {
    backgroundColor: '#F8F3F3',
    padding: 18,
    borderRadius: 15,
    marginBottom: 8,
    // elevation: 4,
  },
  actionbar_textContainer: {

  },
  actionbar_text: {
    fontSize: 15,
    color: 'darkgray'
  },
  services_body: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  services_header: {
  },
  services_title: {
    fontFamily: 'LexendDeca_Medium',
    fontSize: 18
  },
  services_searchBarContainer: {
    width: '100%',
    elevation: 4,
  },
  services_searchbar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 15,
    borderRadius: 18,
    backgroundColor: '#F8F3F3',

  },
  services_searchbarTextInput: {
    // flex: 1,
    fontSize: 16,
    marginLeft: 10,
    width: '80%'
  },
  category_container: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
  },
  categoryBtn: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4
  },
  category_imageBG: {
    height: 190,
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  categoryTxt: {
    fontFamily: 'LexendDeca_SemiBold',
    fontSize: 20,
    color: ThemeDefaults.themeLighterBlue,
  },
  textWrapper: {
    position: 'absolute',
    bottom: 15,
    left: 18,
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.7)'
  },
  buttonSubCat: {
    flex: 1,
    // width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 4,
  },
  imageContainerSubCat: {
    flex: 1, 
    width: '100%'
  },
  imageStyleSubCat: {
      width: '100%',
      height: 180,
  },
  subCategoryDescriptionBox: {
      padding: 20
  },
  subCategoryRow: {
      marginBottom: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
  },
  subCategoryText: {
      fontSize: 18,
      fontFamily: 'LexendDeca_Bold',
      color: ThemeDefaults.appIcon
  },
  priceRangePrice: {
  },
  categoryText: {
      color: "#cbcbcb"
  },
  priceRangeText: {
      color: 'rgba(27,35,58,.5)'

  },
  searchClearResultsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  clearSearchContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  clearSearchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 4,
    borderWidth: 0.8,
    borderColor: ThemeDefaults.themeDarkBlue,
  },
  clearSearchText: {
    marginLeft: 10
  },
  buttonWorkerView: {
    // marginHorizontal: 30,
    width: '100%',
    flexDirection: 'row',
  },
  buttonWorker: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 4,
    marginTop: 20,
    // marginHorizontal: 30,
    overflow: 'hidden',
  },
  imageContainer: {
      flex: 1,
      maxWidth: 110,
      maxHeight: 115,
  },
  image: {
      width: '100%',
      height: '100%'
  },
  descriptionBox: {
      flex: 1.9,
      padding: 12,
      width: '100%',
      justifyContent: 'space-between',
  },
  descriptionTop: {
      width: '100%',
      justifyContent: 'space-between',
  },
  row: {

  },
  workerInfo: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  workerNameHolder: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  workerNameText: {
      fontSize: 18,
      marginBottom: 3,
  },
  workerRatingsHolder: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
  },
  workerRatings: {
      marginLeft: 3
  },
  workerAddressBox: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
  },
  workerAddressText: {
      fontFamily: 'LexendDeca',
      fontSize: 14,
      marginLeft: 3,
      width: '100%',
  },
  descriptionBottom: {
      width: '100%',
      flexDirection: 'row',
  },
  serviceFeeText: {
      flex: 1,
      width:'100%',
      // height: 22,
      marginRight: 5,
      flexDirection: 'row',
      alignItems: 'baseline',
  },
  serviceFeePrice: {
      fontFamily: 'LexendDeca_Medium'
  },
  modalDialogue: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  dialogueContainer: {
      borderWidth: 1.5,
      borderColor: ThemeDefaults.themeLighterBlue,
      borderRadius: 15,
      overflow: 'hidden',
  },
  dialogueMessage: {
      paddingVertical: 40,
      paddingHorizontal: 50,
      backgroundColor: ThemeDefaults.themeLighterBlue,
  },
  dialogueMessageText: {
      color: ThemeDefaults.themeWhite,
      textAlign: 'center',
      fontFamily: 'LexendDeca_Medium',
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