import React, { useEffect, useState } from 'react'
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
  // const {user, role} = route.params;
  const [category, setCategory] = useState([])

  
  useEffect(() => {
    // send pushtoken to backend
    const formData = new FormData();
    formData.append("pushtoken", global.deviceExpoPushToken)

    // console.log("userData: ", global.userData._id)
    // console.log("pushToken: ", global.deviceExpoPushToken)

    fetch("http://" + IPAddress + ":3000/setToken/" + global.userData._id, {
      method: 'PUT',
      body: JSON.stringify({
        pushtoken: global.deviceExpoPushToken,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).then((req) => console.log('success'))
    .catch((err) => console.log("err : ", err.message))
  }, [])


  useEffect(() => {
    try {
      fetch("http://" + IPAddress + ":3000/notification/" + global.deviceExpoPushToken, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        }).then((res) => res.json())
        .then((data) => {
          global.notificationCount = data.length
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
    } catch {
      console.log(error)
    }
  }, [])

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
      console.log("category: ", data)
    })
  }, [])

  

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: StatusBar.currentHeight, backgroundColor: '#fff'}}>
        {/* <ScrollView style={{flex: 1, width: '100%',}} showsHorizontalScrollIndicator={false}> */}
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

              {/* Service Category List */}
              <View style={styles.category_container}>

                  <FlashList 
                    data={category}
                    keyExtractor={item => item._id}
                    estimatedItemSize={50}
                    ListFooterComponent={() => (<View style={{height: 180}}></View>)}
                    ListHeaderComponent={() => (
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
                  <TouchableOpacity style={styles.services_searchbar}>
                    <Icon name="magnify" size={25} color="#8A8B97" />
                    <TextInput style={styles.services_searchbarTextInput} 
                      placeholder={"Search for a Service or Worker"}
                      placeholderTextColor="#8A8B97"
                      keyboardType="default"
                    />
                  </TouchableOpacity>
                </View>

              </View>
                      </View>
                    )}
                    renderItem={({item}) => (
                      item.Category !== 'unlisted' ? 
                          <TouchableOpacity style={styles.categoryBtn}
                            onPress={() => {
                              navigation.navigate("SubCategoryScreen", {categoryID: item._id, categoryNAME: item.Category})
                            }}
                          >
                            <ImageBackground source={require("../assets/images/stock.jpg")} style={styles.category_imageBG}>
                              <TText style={styles.categoryTxt}>{item.Category}</TText>
                            </ImageBackground>
                          </TouchableOpacity>
                          : null 
                    )}
                  />

                </View>

            </View>
        {/* </ScrollView> */}
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
    fontSize: 24,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 18,
    backgroundColor: '#F8F3F3',

  },
  services_searchbarTextInput: {
    fontSize: 16,
    marginLeft: 10
  },
  category_container: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
    // paddingBottom: 180
  },
  categoryBtn: {
    marginTop: 20,
    marginHorizontal: 30,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4
  },
  category_imageBG: {
    height: 180,
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  categoryTxt: {
    fontFamily: 'LexendDeca_SemiBold',
    fontSize: 22,
    color: '#fff',
    position: 'absolute',
    bottom: 15,
    left: 25
  },
})