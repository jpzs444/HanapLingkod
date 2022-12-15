import { StyleSheet, Text, View, Image, SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import dayjs from 'dayjs'
import { IPAddress } from '../global/global'
import { FlashList } from '@shopify/flash-list'
import Appbar from '../Components/Appbar'
import { useNavigation } from '@react-navigation/native'



const CompletedRequests = ({route}) => {

  const navigation = useNavigation()

  const [completedBookings, setCompletedBookings] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    handleFetchCompletedBookings()
  }, [route])

  useEffect(() => {
    // setLoading(true)

    handleFetchCompletedBookings()
  }, [currentPage])


  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = () => {
      setIsRefreshing(true)

      setCurrentPage(1)
      handleFetchCompletedBookings() 

      wait(500).then(() => setIsRefreshing(false));
  }

  const handleFetchCompletedBookings = async () => {
    try {
      await fetch(`https://hanaplingkod.onrender.com/completed-bookings/${global.userData._id}?page=${currentPage}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "Authorization": global.accessToken
        }
      })
      .then(res => res.json())
      .then(data => {
        // console.log("completed bookings data: ", data.worker)

        setLoading(false)
        global.userData.role === 'recruiter' ? setCompletedBookings([...data.recruiter]) : setCompletedBookings([...data.worker])
      })

    } catch (error) {
        console.log("error completed bookings: ", error)
      
    }
  }

  const BookingItem = ({ item }) => {
    return (
        <>
            {/* { */}
                
                <TouchableOpacity style={[styles.bookingItem]}
                    onPress={() => {
                        // console.log("Item ID: ", item._id)
                        navigation.navigate("BookingInformationDrawer", {bookingID: item._id, bookingItem: item, fromCB: true})
                    }}
                >
                    <View style={{flexDirection: 'row',}}>
                        {
                            global.userData.role === "recruiter" ? 
                            <Image style={styles.image} source={ item.workerId.profilePic === "pic" ? require("../assets/images/default-profile.png") : { uri: item.workerId.profilePic }} />
                            :
                            <Image style={styles.image} source={ item.recruiterId.profilePic === "pic" ? require("../assets/images/default-profile.png") : { uri: item.recruiterId.profilePic }} />
                        }

                        <View style={styles.requestInformation}>
                            <TText style={[styles.name,]}>
                                {
                                    global.userData.role === 'recruiter' ?
                                    `${item.workerId.firstname} ${item.workerId.lastname}` : `${item.recruiterId.firstname} ${item.recruiterId.lastname}`
                                }
                            </TText>
                            <TText style={[styles.subCategory,]}>{item.subCategory}</TText>
                            <View style={[styles.dateTime,]}>
                                <View style={styles.dateTimeItem}>
                                    <Icon name="calendar-month" size={20} color={ "black"} />
                                    <TText style={[styles.dateTimeInfo,]}>{dayjs(item.serviceDate).format("MMM DD")}</TText>
                                </View>
                                <View style={styles.dateTimeItem}>
                                    <Icon name="clock-outline" size={20} color={'black'} />
                                    <TText style={[styles.dateTimeInfo,]}>{dayjs(item.startTime).format("hh:mm A")}</TText>
                                </View>
                                    <TouchableOpacity style={[styles.viewItemBtn, ]}
                                        activeOpacity={0.5}
                                        onPress={() => {
                                            navigation.navigate("BookingInformationDrawer", {bookingID: item._id, bookingItem: item, fromCB: true})
                                        }}
                                    >
                                        <TText style={[styles.viewBtnText,]}>View</TText>
                                        <Icon name="arrow-right" color={"black"} size={18} />
                                    </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            {/* } */}
        </>
    )
}

  return (
    <SafeAreaView style={styles.mainContainer}>
        <Appbar menuBtn={true} showLogo={true} hasPicture={true} />

        <View style={styles.listContainer}>
            <FlashList 
                data={completedBookings}
                keyExtractor={item => item._id}
                onRefresh={onRefresh}
                refreshing={isRefreshing}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.5}
                estimatedItemSize={100}
                onEndReached={() => setCurrentPage(page => page + 1)}
                ListEmptyComponent={() => ( 
                  <View style={{paddingVertical: 25, alignItems: 'center'}}>
                    {
                      loading ? 
                      <View style={{alignItems: 'center', width: '100%'}}>
                        <ActivityIndicator size={'large'} />
                      </View>
                      :
                      <TText style={{color: 'lightgray'}}>There are no Completed Requests as of the moment</TText>
                    }
                  </View> )}
                ListHeaderComponent={() => (<TText style={styles.headerText}>Completed Bookings</TText>)}
                renderItem={({item}) => (<BookingItem item={item} />)}
                ListFooterComponent={() => (<View style={{height: 150}}></View>)}
            />
        </View>
    </SafeAreaView>
  )
}

export default CompletedRequests

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#fafafa',
  },
  headerText: {
    fontFamily: 'LexendDeca_Medium',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
},
  listContainer: {
    width: '100%',
    flexGrow: 1,
  },
  bookingItem: {
    // flexDirection: 'row',
    // alignItems: 'center',
    padding: 15,
    marginHorizontal: 30,
    marginBottom: 15,
    backgroundColor: ThemeDefaults.themeWhite,
    borderRadius: 10,
    elevation: 3
  },
  image: {
      width: 70,
      height: 70, 
      borderRadius: 15,
      elevation: 2
  },
  requestInformation: {
      paddingLeft: 15,
      flexGrow: 1,
  },
  name: {
      fontSize: 14,
      color: '#888'
  },
  subCategory: {
      fontSize: 18,
      fontFamily: 'LexendDeca_SemiBold'
  },
  dateTime: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 2,
  },
  dateTimeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 15
  },
  dateTimeInfo: {
      fontSize: 17,
      fontFamily: 'LexendDeca_Medium',
      marginLeft: 5,
  },
  viewItemBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: ThemeDefaults.themeWhite,
      borderRadius: 15,
      paddingHorizontal: 15, 
      paddingVertical: 5,
      marginLeft: 5,
      elevation: 3
  },
  viewBtnText: {
      marginRight: 5,
      fontSize: 14
  },
})