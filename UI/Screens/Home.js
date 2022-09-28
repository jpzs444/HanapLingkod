import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView, View, Image, StatusBar, Dimensions, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import TText from '../Components/TText'
import { useNavigation } from '@react-navigation/native';
import Appbar from '../Components/Appbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {IPAddress} from '../global/global'
import ThemeDefaults from '../Components/ThemeDefaults';
import { FlashList } from '@shopify/flash-list';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default function Home({route}) {

  const navigation = useNavigation();
  const [category, setCategory] = useState([])
  const [searchBtnPressed, setSearchBtnPressed] = useState(false)

  const [searchWord, setSearchWord] = useState("")
  let searchW;

  const [searchResults, setSearchResults] = useState([])
  const [searchResultCategory, setSearchResultCategory] = useState([])
  const [searchResultSubCategory, setSearchResultSubCategory] = useState([])
  const [searchResultWorker, setSearchResultWorker] = useState([])

  const [userHasSearched, setuserHasSearched] = useState(false)

  const searchInput = useRef();


  useEffect(() => {
    setSearchWord(searchW)
  }, [searchW])
  
  useEffect(() => {
    // send pushtoken to backend
    fetch("http://" + IPAddress + ":3000/setToken/" + global.userData._id, {
      method: 'PUT',
      body: JSON.stringify({
        pushtoken: global.deviceExpoPushToken,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
    .catch((err) => console.log("err : ", err.message))
  }, [])


  useEffect(() => {
    fetchNotificationList()
  },[])

  // fetch service category
  useEffect(() => {
    fetch("http://" + IPAddress + ":3000/service-category", {
      method: 'GET',
      headers: {
          "content-type": "application/json",
      },
    }).then((res) => res.json())
    .then((data) => {
      setCategory([...data])
    })
  }, [])

  const fetchNotificationList = () => {
    fetch("http://" + IPAddress + ":3000/notification/" + global.deviceExpoPushToken, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())
    .then((data) => {
      // console.log("notification list: ", data)
      console.log("res length: ", data.length)

      let notifCount = 0
      for(read of data){
        if(!read.read){
          notifCount = notifCount + 1
        }
      }
      global.notificationCount = notifCount

    }).catch((err) => {
      console.log("error: ", err.message)
    })
    // setTimeout(fetchNotificationList, 5000)
  }

  const lookforResults = () => {
    console.log("seach q: ", searchW)

    setuserHasSearched(true)
    fetch("http://" + IPAddress + ":3000/search?keyword=" + searchW, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json())
    .then((data) => {
      // setSearchResultCategory([...data.category])
      // setSearchResultSubCategory([...data.subCategory])
      // setSearchResultWorker([...data.worker])

      let wor = [...data.worker]
      let cat = [...data.category]
      let subcat = [...data.subCategory]
      let mergeResults = [...cat, ...subcat, ...wor]

      setSearchResults(mergeResults)
      setSearchWord(searchW)
      
      console.log("category search in 1: ", searchResults)
    })

    // console.log("worker: ", searchResultWorker)
    // printOutData()
  }

  // const printOutData = () => {
  //   console.log("worker search: ", searchResultWorker)
  // }

  const handleSearchWord = event => {
    // setSearchWord(event.nativeEvent.text);
    searchW = event.nativeEvent.text

    console.log('value is:', event.nativeEvent.text);
  };

  const ScreenHeaderComponent = () => {
    return(
      <View>
        <Appbar hasPicture={true} menuBtn={true} showLogo={true} />
        
        {/* Greeting header */}
        <View style={styles.greetingContainer}>
          <TText style={styles.greetingText}>Welcome, {global.userData.role.charAt(0).toUpperCase() + global.userData.role.slice(1)} {global.userData.firstname}! 👋🏻</TText>
        </View>

        {/* Action bar Button */}
        <View style={styles.actionbar_container}>
          <TouchableOpacity style={styles.actionbar_btn} onPress={() => navigation.navigate("SubCategoryScreen")}>
            <View style={styles.actionbar_iconContainer}>
              <Icon name="clipboard-text-multiple" size={50} color="#275A53" />
            </View>
            <View style={styles.actionbar_textContainer}>
              <TText style={styles.actionbar_text}>Requests</TText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionbar_btn}>
            <View style={styles.actionbar_iconContainer}>
              <Icon name="bookmark-box-multiple" size={50} color={ThemeDefaults.themeOrange} />
            </View>
            <View style={styles.actionbar_textContainer}>
              <TText style={styles.actionbar_text}>Bookings</TText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionbar_btn}>
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
          <View style={styles.services_header}>
            <TText style={styles.services_title}>Services Offered</TText>
          </View>

          {/* Search bar */}
          <View style={styles.services_searchBarContainer}>
            <TouchableOpacity style={[styles.services_searchbar, {justifyContent: searchBtnPressed ? 'flex-start' : null, paddingLeft: searchBtnPressed ? 10 : null,}]}
              onPress={() => {
                setSearchBtnPressed(true)
                searchInput.current.focus()
              }}
            >
              <Icon name="magnify" size={25} color="#8A8B97" style={{marginLeft: 10}} />
              <TextInput style={[styles.services_searchbarTextInput]} 
                placeholder={"Search for a Service or Worker"}
                placeholderTextColor="#8A8B97"
                keyboardType="default"
                value={searchWord ? searchWord : null}
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
                    }}
                  >
                    <Icon name='close-circle' size={22} />
                  </TouchableOpacity>
                : null
              }
            </TouchableOpacity>
          </View>

          {
            userHasSearched ? 
              <View style={styles.searchClearResultsContainer}>
                {/* <View style={styles.clearSearchContainer}>
                  <TouchableOpacity style={styles.clearSearchBtn} 
                    onPress={() => {
                      searchW = ""
                      setuserHasSearched(false)
                    }}
                  >
                    <Icon name="close-circle" size={20} />
                    <TText style={styles.clearSearchText}>Clear Search Results</TText>
                  </TouchableOpacity>
                </View> */}
                <TText style={{textAlign: 'center', fontSize: 18, color: 'gray'}}>Search results for '{searchWord}'</TText>
              </View>
              : null
          }
          

        </View>
      </View>
    )
  }

  const Mainhomelist = () => {
    return(
      <FlashList 
        data={category}
        keyExtractor={item => item._id}
        estimatedItemSize={100}
        keyboardDismissMode='none'
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (<View style={{height: 180}}></View>)}
        ListHeaderComponent={() => 
          <ScreenHeaderComponent />            
        }
        renderItem={({item}) => (
          item.Category !== 'unlisted' ? 
              <TouchableOpacity style={styles.categoryBtn}
                onPress={() => {
                  navigation.navigate("SubCategoryScreen", {categoryID: item._id, categoryNAME: item.Category})
                }}
              >
                <ImageBackground source={require("../assets/images/stock.jpg")} style={styles.category_imageBG}>
                  <View style={styles.textWrapper}>
                    <TText style={styles.categoryTxt}>{item.Category}</TText>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              : null 
        )}
      />
    )
  }

  const ListSearchResults = () => {
    return(
      <>
        <FlashList 
          data={searchResults}
          keyExtractor={item => item._id}
          estimatedItemSize={50}
          keyboardDismissMode='none'
          keyboardShouldPersistTaps={'always'}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (<View style={{height: 180}}></View>)}
          ListHeaderComponent={() => 
            <ScreenHeaderComponent />            
          }
          renderItem={({item}) => (
            <View>
              {
                item.Category && item.Category !== 'unlisted' ? 
                  <TouchableOpacity style={styles.categoryBtn}
                    onPress={() => {
                      navigation.navigate("SubCategoryScreen", {categoryID: item._id, categoryNAME: item.Category})
                    }}
                  >
                    <ImageBackground source={require("../assets/images/stock.jpg")} style={styles.category_imageBG}>
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
                              <TText style={styles.priceRangePrice}>Price Range</TText>
                          </View>
                          <View style={[styles.subCategoryRow, {marginBottom: 0}]}>
                              <TText style={styles.categoryText}>{item.ServiceID.Category}</TText>
                              <TText style={styles.priceRangeText}>Price Range</TText>
                          </View>
                      </View>
                  </TouchableOpacity>
                  :
                  item.firstname ? 
                    <View style={{width: '100%', paddingHorizontal: 30, height: 130}}>
                      <TouchableOpacity style={styles.buttonWorker}>
                          <View style={styles.buttonWorkerView}>
                              {/* Profile Picture */}
                              <View style={styles.imageContainer}>
                                  <Image source={require("../assets/images/plumbing.jpg")} style={styles.image} />
                              </View>
                              {/* Worker Information */}
                              <View style={styles.descriptionBox}>
                                  <View style={styles.descriptionTop}>
                                      <View style={[styles.row, styles.workerInfo]}>
                                          <View style={styles.workerNameHolder}>
                                              <TText style={styles.workerNameText}>{item.firstname}{item.middlename === "undefined" ? "" : item.middlename} {item.lastname}</TText>
                                              { !item.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null }
                                          </View>
                                          <View style={styles.workerRatingsHolder}>
                                              <Icon name="star" color={"gold"} size={18} />
                                              <TText style={styles.workerRatings}>4.5</TText>
                                          </View>                                     
                                      </View>
                                      <View style={styles.workerAddressBox}>
                                          <Icon name='map-marker' size={16} />
                                          <TText numberOfLines={1} ellipsizeMode='tail' style={styles.workerAddressText}>{item.street}, {item.purok}, {item.barangay}</TText>
                                      </View>
                                  </View>
                                  <View style={styles.descriptionBottom}>
                                      <TText>Worker</TText>
                                  </View>
                              </View>
                          </View>
                      </TouchableOpacity>
                    </View>
                  : null
                }
            </View>
          )}
        />
      </>
    )
  }



  return (
    <SafeAreaView style={{flex: 1, height: HEIGHT, alignItems: 'center', justifyContent: 'center', marginTop: StatusBar.currentHeight, backgroundColor: '#fff'}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

          {/* Service Category List */}
          <View style={styles.category_container}>

              {
                !userHasSearched ? <Mainhomelist /> : null
              }

              {
                userHasSearched && searchResults ? <ListSearchResults /> : null
              }  
          
          </View>

        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  greetingContainer: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 22,
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
    alignItems: 'center'
  },
  actionbar_iconContainer: {
    backgroundColor: '#F8F3F3',
    padding: 18,
    borderRadius: 15,
    marginBottom: 8
  },
  actionbar_textContainer: {

  },
  actionbar_text: {

  },
  services_body: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  services_header: {
  },
  services_title: {
    fontSize: 22
  },
  services_searchBarContainer: {
    width: '100%',
  },
  services_searchbar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 30,
    marginBottom: 20,
    paddingLeft: 15,
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
    marginHorizontal: 30,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4
  },
  category_imageBG: {
    height: 180,
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
    marginHorizontal: 30,
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
      width: '90%',
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
})