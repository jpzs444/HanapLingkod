import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Modal, StatusBar, BackHandler, Dimensions, ActivityIndicator } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import Appbar from '../Components/Appbar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import React, {useState, useEffect, useCallback} from 'react'
import ThemeDefaults from '../Components/ThemeDefaults';
import { IPAddress } from '../global/global';
import dayjs from 'dayjs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

// SHOULD FETCH AND REFRESH EVERY 5 SECONDS

const Requests = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const [requestList, setRequestList] = useState([])

    const [declinedRequests, setDeclinedRequests] = useState([])
    const [page, setPage] = useState(1)

    const [loading, setLoading] = useState(false)
    const [isBanned, setIsBanned] = useState(false)

    // useEffect(() => {
        // BackHandler.addEventListener("hardwareBackPress", () => {
        //     navigation.navigate("HomeScreen")
        //     return true
        // })

        // componentDismount
        // return () => {
        //     BackHandler.removeEventListener("hardwareBackPress", () => {
        //         return false
        //     })
        // };
    // }, []);

    useEffect(() => {
        setPage(1)        
    }, [])

    useEffect(() => {
        let reqReq = setInterval(fetchRequestList, 15000)
        return () => {
            clearInterval(reqReq)
        };
    }, []);
    
    useFocusEffect(
        useCallback(() => {
            fetchRequestList()
        }, [])
    )

    useEffect(() => {
        fetchRequestList()
    }, [page]);

    const fetchRequestList = async () => {
 
        setLoading(true)
        try {
            await fetch(`https://hanaplingkod.onrender.com/service-request/${global.userData._id}?page=${page}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "Authorization": global.accessToken
                },
                cache: "reload"
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("isbanned: ", data)
                console.log("request list data: ", data.recruiter)
                if(data === "Forbidden: User is Banned"){
                    setRequestList([])
                    setDeclinedRequests([])
                    setIsBanned(true)
                } else {
                    // place to state all rejected/declined requests
                    let list = []
                    let decList = []
                    if (global.userData.role === 'recruiter') {
                        list = [...data.recruiter]
                        console.log("relist: ", list)
                        decList = [...data.status3_Recruiter]
                        setRequestList([...list])
                        setDeclinedRequests([...decList])
                        // setLoading(false)                    
                    } else {
                        decList = [...data.status3_Worker]
                        list = [...data.worker]
                        setRequestList([...list])
                        setDeclinedRequests([...decList])
                    }
                }
                setLoading(false)
            })
            console.log("fetchRequestList")
        } catch (error) {
            console.log("error Fetch request list: ", error)
        } 
        console.log("reqlistttt: ", requestList)      

    }


    const ScreenHeaderComponent = () => {
        return(
            <View style={styles.headerContainer}>
                <Appbar menuBtn={true} showLogo={true} hasPicture={true} />

                <View style={styles.headerTitleBar}>
                    <TText style={styles.headerTitle}>Requests</TText>
                </View>
            </View>
        )
    }

    const ScreenFooterComponent = () => {
        return(
            <View style={{minHeight: 150, marginTop: declinedRequests.length === 0 ? 30 : 0}}>
                {
                    declinedRequests.length !== 0 ?
                    <>
                        <View style={styles.lineBreaker}>
                            <View style={{flex: 1, height: 1, backgroundColor: '#c2c2c2'}} />
                            <TText style={styles.horizontalText}>Declined Requests</TText>
                            <View style={{flex: 1, height: 1, backgroundColor: '#c2c2c2'}} />
                        </View>

                        <View>
                            {
                                declinedRequests.map(function(item, index){
                                    return(
                                        <TouchableOpacity key={index} style={[styles.requestCard, styles.requestCanceledCard]}
                                            activeOpacity={0.5}
                                            onPress={() => {
                                                navigation.navigate("ViewServiceRequestDrawer", {serviceRequestID: item._id, requestItem: item})
                                            }}
                                        >
                                            {/* View when card is clicked/opened */}

                                            {/* card */}
                                            <View style={[styles.cardUserImage, ]}>
                                                {
                                                    global.userData.role === 'recruiter' ?
                                                        <Image style={styles.cardimageStyle} source={item.workerId.profilePic == "pic" ? require('../assets/images/default-profile.png') : {uri: item.workerId.profilePic}} />
                                                        :
                                                        <Image style={styles.cardimageStyle} source={item.recruiterId.profilePic == "pic" ? require('../assets/images/default-profile.png') : {uri: item.workerId.profilePic}} />
                                                }
                                            </View>
                                            <View style={styles.requestInformationContainer}>
                                                <View style={styles.cardTop}>
                                                    {
                                                        global.userData.role === 'recruiter' ?
                                                            <Text style={[styles.carUserNameTxt, {color: item.requestStatus != '1' ? ThemeDefaults.themeWhite : 'black'}]}>{item.workerId.firstname} {item.workerId.lastname}</Text>
                                                            :
                                                            <Text style={[styles.carUserNameTxt, {color: item.requestStatus != '1' ? ThemeDefaults.themeWhite : 'black'}]}>{item.recruiterId.firstname} {item.recruiterId.lastname}</Text>
                                                    }
                                                    <View style={styles.cardUserrating}>
                                                        <Icon name='star' size={20} color="gold" />
                                                        <TText style={[styles.cardUserRatingTxt, styles.requestDeclinedText]}>4.7</TText>
                                                    </View>
                                                </View>
                                                <View style={styles.cardUserName}>
                                                    <Text style={[styles.cardRequestCategoryTxt, styles.requestDeclinedText]}>{item.subCategory}</Text>
                                                </View>
                                                <View style={styles.cardBottom}>
                                                    <View style={styles.requestDate}>
                                                        <Icon name='calendar-multiselect' size={18} color={'white'} />
                                                        <TText style={[styles.requestDateTxt, styles.requestDeclinedText]}>{dayjs(item.serviceDate).format("MMM DD")}</TText>
                                                    </View>
                                                    <View style={styles.requestDate}>
                                                        <Icon name='clock-time-five-outline' size={18} color={'white'} />
                                                        <TText style={[styles.requestDateTxt, styles.requestDeclinedText]}>{dayjs(item.startTime).format("hh:mm A")}</TText>
                                                    </View>
                                                    <View style={styles.cardViewRequest}>
                                                        <TouchableOpacity style={[styles.cardViewRequestBtn, styles.cardViewDeclined]}
                                                            activeOpacity={0.5}
                                                            onPress={() => {
                                                                console.log("reuqest id: ", item._id)
                                                                navigation.navigate("ViewServiceRequestDrawer", {serviceRequestID: item._id, requestItem: item})
                                                            }}
                                                        >
                                                            <TText style={styles.cardViewRequestTxt}>View</TText>
                                                            <Icon name='arrow-right' size={18} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                        
                        {/* Deletion Notice */}
                        <View style={styles.deleteNoticeContainer}>
                            <TText style={styles.deleteNoticeText}>All declined requests will disappear after five (5) days.</TText>
                        </View>
                    </>
                    : null
                }
            </View>
        )
    }

  return (
    <SafeAreaView style={styles.mainContainer}>

        <View style={{flex: 1, width: '100%'}}>
            <ScreenHeaderComponent />
            {
                isBanned ?
                <View style={{marginTop: 30, alignItems: 'center', backgroundColor: ThemeDefaults.themeRed, padding:20}}>
                    <TText style={{color: "#fff", textAlign: 'center', fontFamily: "LexendDeca_Medium"}}>While banned, you will not be able to receive requests from recruiters</TText>
                </View>
                :
                <FlashList 
                    data={requestList}
                    keyExtractor={item => item._id}
                    estimatedItemSize={60}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => setPage(p => p + 1)}
                    ListEmptyComponent={() => (
                        <View style={{alignItems: 'center'}}>
                            {
                                loading ?
                                <View style={{width: '100%', height: 60, alignItems: 'center', marginTop: 50}}>
                                    <ActivityIndicator size="large" />
                                </View>
                                :
                                <TText style={{color: '#c2c2c2', marginTop: 50}}>There is no pending request at the moment</TText>
                            }
                        </View>
                    )}
                    // ListHeaderComponent={() => ()}
                    ListFooterComponent={() => (<ScreenFooterComponent />)}
                    renderItem={({item}) => (
                        <>
                            
                            <TouchableOpacity style={[styles.requestCard, {backgroundColor: item.requestStatus == '4' ? "#999" : ThemeDefaults.themeWhite }]}
                                activeOpacity={0.5}
                                onPress={() => {
                                    navigation.navigate("ViewServiceRequestDrawer", {serviceRequestID: item._id, requestItem: item})
                                }}
                            >

                            {/* card */}
                            <View style={[styles.cardUserImage]}>
                                {/* <Image source={global.userData.profilePic ? {uri: global.userData.role === "recruiter" ? item.workerId.profilePic : item.recruiterId.profilePic} : require("../assets/images/default-profile.png")} style={styles.cardimageStyle} /> */}
                                {
                                    global.userData.role === 'recruiter' ?
                                        <Image style={styles.cardimageStyle} source={item.workerId.profilePic == "pic" ? require('../assets/images/default-profile.png') : {uri: item.workerId.profilePic}} />
                                        :
                                        <Image style={styles.cardimageStyle} source={item.recruiterId.profilePic == "pic" ? require('../assets/images/default-profile.png') : {uri: item.workerId.profilePic}} />
                                }
                            </View>
                            <View style={styles.requestInformationContainer}>
                                <View style={styles.cardTop}>
                                    {
                                        global.userData.role === 'recruiter' ?
                                        <Text style={[styles.carUserNameTxt, {color: item.requestStatus == '4' ? ThemeDefaults.themeWhite : 'black'}]}>{item.workerId.firstname} {item.workerId.lastname}</Text>
                                        :
                                        <Text style={[styles.carUserNameTxt, {color: item.requestStatus == '4' ? ThemeDefaults.themeWhite : 'black'}]}>{item.recruiterId.firstname} {item.recruiterId.lastname}</Text>
                                    }
                                    <View style={styles.cardUserrating}>
                                        <Icon name='star' size={20} color="gold" />
                                        <TText style={[styles.cardUserRatingTxt, {color: item.requestStatus == '4' ? ThemeDefaults.themeWhite : 'black'}]}>4.7</TText>
                                    </View>
                                </View>
                                <View style={styles.cardUserName}>
                                    <Text style={[styles.cardRequestCategoryTxt, {color: item.requestStatus == '4' ? ThemeDefaults.themeWhite : 'black'}]}>{item.subCategory}</Text>
                                </View>
                                <View style={styles.cardBottom}>
                                    <View style={styles.requestDate}>
                                        <Icon name='calendar-multiselect' size={18} color={item.requestStatus == '4' ? ThemeDefaults.themeWhite : 'black'} />
                                        <TText style={[styles.requestDateTxt, {color: item.requestStatus == '4' ? ThemeDefaults.themeWhite : 'black'}]}>{dayjs(item.serviceDate).format("MMM DD")}</TText>
                                    </View>
                                    <View style={styles.requestDate}>
                                        <Icon name='clock-time-five-outline' size={18} color={item.requestStatus == '4' ? ThemeDefaults.themeWhite: 'black'} />
                                        <TText style={[styles.requestDateTxt, {color: item.requestStatus == '4' ? ThemeDefaults.themeWhite : 'black'}]}>{dayjs(item.startTime).format("hh:mm A")}</TText>
                                    </View>
                                    <View style={styles.cardViewRequest}>
                                        <TouchableOpacity style={[styles.cardViewRequestBtn, {borderWidth: item.requestStatus != '1' ? 0 : 1.3, paddingVertical: item.requestStatus != '1' ? 4 : 2}]}
                                            activeOpacity={0.5}
                                            onPress={() => {
                                                navigation.navigate("ViewServiceRequestDrawer", {serviceRequestID: item._id, requestItem: item})
                                            }}
                                        >
                                            <TText style={styles.cardViewRequestTxt}>View</TText>
                                            <Icon name='arrow-right' size={18} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </>
                    )}
                />
            }
        </View>

       
    </SafeAreaView>
  )
}

export default Requests

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        backgroundColor: ThemeDefaults.themeWhite,
        height: HEIGHT,
    },
    headerContainer: {
        alignItems: 'center',
    },
    headerTitleBar: {
        flexDirection: 'row',
        marginVertical: 20,
        // alignItems: 'center',
    },
    headerTitle: {
        marginRight: 8,
        fontSize: 18
    },
    headerTitleCount: {
    },
    headerCount: {
        textAlign: 'center',
        paddingTop: 2,
        width: 25,
        height: 25,
        backgroundColor: ThemeDefaults.appIcon,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: ThemeDefaults.themeWhite
    },
    requestCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 15,
        padding: 15,
        backgroundColor: ThemeDefaults.themeWhite,
        borderRadius: 15,
        elevation: 4,
    },
    cardUserImage: {

    },
    cardimageStyle: {
        width: 60,
        height: 60,
        borderRadius: 15,
        zIndex: 5,
        backgroundColor: 'pink'
    },
    requestInformationContainer: {
        // backgroundColor: 'pink',
        flexGrow: 1,
        paddingLeft: 10
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardRequestCategoryTxt: {
        fontFamily: 'LexendDeca_SemiBold',
        fontSize: 18,
    },
    cardUserrating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardUserRatingTxt: {
        marginLeft: 5
    },
    cardUserName: {
        paddingVertical: 0
    },
    carUserNameTxt: {
        fontFamily: 'LexendDeca',
        fontSize: 14,
    },
    cardBottom: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    requestDate: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    requestDateTxt: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 15,
        fontSize: HEIGHT * 0.0157
    },
    cardViewRequest: {
        flexGrow: 1,
        alignItems: 'flex-end'
    },
    cardViewRequestBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.2,
        borderColor: ThemeDefaults.themeLighterBlue,
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 12,
        backgroundColor: ThemeDefaults.themeWhite,
        elevation: 3,
    },
    cardViewRequestTxt: {
        fontSize: 12,
        marginRight: 8
    },
    lineBreaker: {
        marginTop: 50,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 30
    },
    horizontalLine: {
        borderBottomColor: '#999',
        borderBottomWidth: 1.2
    },
    horizontalText: {
        paddingHorizontal: 10,
        color: '#c2c2c2'
    },
    requestCanceledCard: {
        backgroundColor: ThemeDefaults.themeRed,
        marginTop: 5,
        marginBottom: 10
    },
    requestDeclinedText: {
        color: ThemeDefaults.themeWhite
    }, 
    cardViewDeclined: {
        borderWidth: 0,
        paddingVertical: 3
    },
    deleteNoticeContainer: {
        marginVertical: 40,
        marginBottom: 150,
        paddingHorizontal: '20%'
    },
    deleteNoticeText: {
        textAlign: 'center',
        color: '#c2c2c2'
    },
})