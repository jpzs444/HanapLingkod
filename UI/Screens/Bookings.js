import { StyleSheet, Text, View, SafeAreaView, StatusBar, Dimension, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import Appbar from '../Components/Appbar'
import { FlashList } from '@shopify/flash-list'
import TText from '../Components/TText'
import { IPAddress } from '../global/global'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import dayjs from 'dayjs'
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native'

// import 'react-native-console-time-polyfill';

const Bookings = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    // STATES
    const [bookings, setBookings] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    

    useEffect(() => {
        setCurrentPage(1)
        setBookings([])
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBookings()
        }, [])
    )

    useEffect(() => {
        let fetchInterval= setInterval(fetchBookings, 15000)
        
        return () => {
            clearInterval(fetchInterval)
        };
    }, [isFocused]);


    useEffect(() => {
        fetchBookings()
    }, [currentPage]);


    const fetchBookings = async () => {
        setLoading(true)

        try {
            console.log("fetchBookings")
            fetch(`https://hanaplingkod.onrender.com/booking/${global.userData._id}?page=${currentPage}`, {
                method: "GET",
                headers: {
                    'content-type': "application/json",
                    "Authorization": global.accessToken
                }
            }).then(res => res.json())
            .then(data => {
                console.log("Bookings data: ", data)

                // grab bookings which have the status of active(1) and ongoing(2)
                if(global.userData.role === "recruiter") {
                    setBookings([...data.Status2_recruiter, ...data.recruiter]) 
                } else {
                    setBookings([...data.Status2_worker, ...data.worker])
                }

                setLoading(false)
            })
            
            console.log("bookings state: ", bookings)
        } catch (error) {
            console.log("error fetch bookings: ", error) 
        }  

            
    }


    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    
    const onRefresh = () => {
        setIsRefreshing(true)

        setCurrentPage(1)
        fetchBookings() 

        wait(500).then(() => setIsRefreshing(false));
    }


    const BookingItem = ({ item }) => {
        return (
            <>
                    <TouchableOpacity style={[styles.bookingItem, item.bookingStatus != '1' && item.bookingStatus != '4' && {borderWidth: 1.5, borderColor: ThemeDefaults.themeLighterBlue }, item.bookingStatus == 4 && {backgroundColor: 'rgba(153,153,153,1)'}, item.bookingStatus == '5' && styles.serviceOngoing]}
                        onPress={() => {
                            console.log("Item ID: ", item._id)
                            navigation.navigate("BookingInformationDrawer", {bookingID: item._id, bookingItem: item})
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
                                <TText style={[styles.name, item.bookingStatus == '4' ? {color: ThemeDefaults.themeWhite} : null]}>
                                    {
                                        global.userData.role === 'recruiter' ?
                                        `${item.workerId.firstname} ${item.workerId.lastname}` : `${item.recruiterId.firstname} ${item.recruiterId.lastname}`
                                    }
                                </TText>
                                <TText style={[styles.subCategory, item.bookingStatus == '4' ? {color: ThemeDefaults.themeWhite}: null]}>{item.subCategory}</TText>
                                <View style={[styles.dateTime,]}>
                                    <View style={styles.dateTimeItem}>
                                        <Icon name="calendar-month" size={20} color={item.bookingStatus == '4' ? ThemeDefaults.themeWhite : "black"} />
                                        <TText style={[styles.dateTimeInfo, item.bookingStatus == '4' ? {color: ThemeDefaults.themeWhite} : null]}>{dayjs(item.serviceDate).format("MMM DD")}</TText>
                                    </View>
                                    <View style={styles.dateTimeItem}>
                                        <Icon name="clock-outline" size={20} color={item.bookingStatus == '4' ? ThemeDefaults.themeWhite : 'black'} />
                                        <TText style={[styles.dateTimeInfo, item.bookingStatus == '4' ? {color: ThemeDefaults.themeWhite}: null]}>{dayjs(item.startTime).format("hh:mm A")}</TText>
                                    </View>
                                    {
                                        (item.statusRecruiter != '3' && item.statusWorker != '3') ?
                                        <TouchableOpacity style={[styles.viewItemBtn, item.bookingStatus != '4' && {borderWidth: 1.3, borderColor: 'black'}]}
                                            activeOpacity={0.5}
                                            onPress={() => {
                                                navigation.navigate("BookingInformationDrawer", {bookingID: item._id, bookingItem: item})
                                            }}
                                        >
                                            <TText style={[styles.viewBtnText,]}>View</TText>
                                            <Icon name="arrow-right" color={"black"} size={18} />
                                        </TouchableOpacity>
                                        :
                                        null
                                    }
                                </View>
                            </View>
                        </View>
                        {
                            item.statusRecruiter == '3' || item.statusWorker == '3' ?
                            <TouchableOpacity style={[styles.viewItemBtn, {borderWidth: 1.3, borderColor: ThemeDefaults.themeOrange, marginTop: 15}]}
                                activeOpacity={0.5}
                                onPress={() => {
                                    navigation.navigate("BookingInformationDrawer", {bookingID: item._id, bookingItem: item})
                                }}
                            >
                                {/* <TText style={[styles.viewBtnText,{marginRight: 'auto', maxWidth: '90%'}]}>{item.statusRecruiter == '3' ? "Recruiter" : "Worker"} set service as finished. Confirm service completion and send a review</TText> */}
                                <TText style={[styles.viewBtnText,{marginRight: 'auto', maxWidth: '90%'}]}>
                                    {
                                        item.statusRecruiter == '3' && global.userData.role === 'recruiter' ? 
                                            "Please wait for the Worker to submit their feedback and rating" 
                                            : 
                                            item.statusWorker == '3' && global.userData.role === 'worker' ?
                                            "Please wait for the Recruiter to submit their feedback and rating"
                                            :
                                            item.statusRecruiter == '3' && global.userData.role === 'worker' ?
                                            "Recruiter set service as finished. Confirm service completion and send a review"
                                            :
                                            "Worker set service as finished. Confirm service completion and send a review"
                                    } 
                                </TText>
                                <Icon name="arrow-right" color={"black"} size={22} />
                            </TouchableOpacity>
                            : null
                        }
                    </TouchableOpacity>
            </>
        )
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Appbar menuBtn={true} showLogo={true} hasPicture={true} />

            <View style={styles.listContainer}>
                <FlashList 
                    data={bookings}
                    keyExtractor={item => item._id}
                    onRefresh={onRefresh}
                    refreshing={isRefreshing}
                    showsVerticalScrollIndicator={false}
                    estimatedItemSize={100}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => setCurrentPage(page => page + 1)}
                    ListEmptyComponent={() => ( 
                        <View style={{alignItems: 'center'}}>
                            {
                                loading ?
                                <View style={{width: '100%', height: 60, alignItems: 'center', marginVertical: 50}}>
                                    <ActivityIndicator size="large" />
                                </View>
                                :
                                <TText style={{color: 'lightgray'}}>Find and request a service for it to appear here</TText>
                            }

                        </View> 
                    )}
                    ListHeaderComponent={() => (<TText style={styles.headerText}>Bookings</TText>)}
                    renderItem={({item}) => (<BookingItem item={item} />)}
                    ListFooterComponent={() => (<View style={{height: 150}}></View>)}
                />
            </View>

        </SafeAreaView>
    )
}

export default Bookings

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
        flex: 1,
        // paddingTop: 20
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
    serviceOngoing: {
        // borderWidth: 2,
        // borderColor: ThemeDefaults.themeGreen,
        backgroundColor: ThemeDefaults.themeWhite
    },
})