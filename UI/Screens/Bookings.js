import { StyleSheet, Text, View, SafeAreaView, StatusBar, Dimension, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Appbar from '../Components/Appbar'
import { FlashList } from '@shopify/flash-list'
import TText from '../Components/TText'
import { IPAddress } from '../global/global'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import dayjs from 'dayjs'
import { useNavigation } from '@react-navigation/native'

const Bookings = ({navigation}) => {

    // const navigation = useNavigation()

    // STATES
    const [bookings, setBookings] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        fetchBookings()

        // navigation.addListener("focus", () => {fetchBookings()})

        let fetchInterval = setInterval(() => {fetchBookings()}, 10000)


        return () => {
            clearInterval(fetchInterval)
        };
    }, [currentPage]);

    const fetchBookings = () => {
            fetch(`http://${IPAddress}:3000/booking/${global.userData._id}?page=${currentPage}`, {
                method: "GET",
                headers: {
                    'content-type': "application/json"
                }
            }).then(res => res.json())
            .then(data => {
                console.log("Bookings data: ")
                console.log("Bookings data: ", data)
                // console.log("Bookings data: ", data.worker.workerId)
                // console.log("fetched")

                // grab bookings which have the status of active(1) and ongoing(2)
                global.userData.role === "recruiter" ? setBookings([...data.recruiter]) : setBookings([...data.worker])
    
            })
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


    const BookingItem = ({ item }) => (
        <TouchableOpacity style={[styles.bookingItem, {borderWidth: item.bookingStatus == '2' ? 1.5 : 0, borderColor: item.bookingStatus == '2' ? ThemeDefaults.themeLighterBlue : 'none' }]}
            onPress={() => {
                console.log("Item ID: ", item._id)
                navigation.navigate("BookingInformationDrawer", {bookingID: item._id, bookingItem: item})
            }}
        >
            {/* {
                global.userData.role === "recruiter" ? 
                <Image style={styles.image} source={ bookings.workerId.profilePic === "pic" ? require("../assets/images/default-profile.png") : { uri: bookings.workerId.profilePic }} />
                :
                <Image style={styles.image} source={ bookings.recruiterId.profilePic === "pic" ? require("../assets/images/default-profile.png") : { uri: bookings.recruiterId.profilePic }} />
            } */}

            <Image style={styles.image} source={ global.userData.profilePic === "pic" ? require("../assets/images/default-profile.png") : { uri: global.userData.profilePic }} />

            <View style={styles.requestInformation}>
                <TText style={styles.name}>Leah Olivar</TText>
                <TText style={styles.subCategory}>{item.subCategory}</TText>
                <View style={styles.dateTime}>
                    <View style={styles.dateTimeItem}>
                        <Icon name="calendar-month" size={20} color={ThemeDefaults.themeOrange} />
                        <TText style={styles.dateTimeInfo}>{dayjs(item.serviceDate).format("MMM DD")}</TText>
                    </View>
                    <View style={styles.dateTimeItem}>
                        <Icon name="clock-outline" size={20} color={ThemeDefaults.themeOrange} />
                        <TText style={styles.dateTimeInfo}>{dayjs(item.startTime).format("hh:mm A")}</TText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

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
                    ListEmptyComponent={() => ( <View style={{paddingVertical: 25, alignItems: 'center'}}><TText style={{color: 'lightgray'}}>Find and request a service for it to appear here</TText></View> )}
                    ListHeaderComponent={() => (<TText style={styles.headerText}>Bookings</TText>)}
                    renderItem={({item}) => ( <BookingItem item={item} /> )}
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
        flexDirection: 'row',
        alignItems: 'center',
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
        marginRight: 30
    },
    dateTimeInfo: {
        fontSize: 17,
        fontFamily: 'LexendDeca_Medium',
        marginLeft: 5,
    },
})