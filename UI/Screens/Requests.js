import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Modal, StatusBar, Dimensions } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import Appbar from '../Components/Appbar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import React, {useState, useEffect} from 'react'
import ThemeDefaults from '../Components/ThemeDefaults';
import { IPAddress } from '../global/global';
import dayjs from 'dayjs';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

// SHOULD FETCH AND REFRESH EVERY 5 SECONDS

const Requests = () => {

    const [requestList, setRequestList] = useState({})

    const [workerData, setWorkerData] = useState([])
    const [recruiterData, setRecruiterData] = useState([])

    useEffect(() => {
        fetchRequestList()
    }, [])

    const fetchRequestList = () => {
        fetch("http://" + IPAddress + ":3000/service-request/" + global.userData._id, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        })
        .then((res) => {
            return res.json()
            // console.log("res req: ", res)
        })
        .then(data => {
            console.log("request list data: ", data.recruiter)
            setRequestList([...data.recruiter])
        })
        .catch((err) => console.log("Request List Error: ", err))
    }

    const fetchWorkerInfoForRequest = (wID) => {
        fetch(`http://${IPAddress}:3000/Worker/${wID}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/type',
            },
        }).then((res) => res.json())
        .then((data) => {
            console.log("worker data: ", data)
        }).catch((err) => console.log("Error wd: ", err))
    }


    const ScreenHeaderComponent = () => {
        return(
            <View style={styles.headerContainer}>
                <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

                <View style={styles.headerTitleBar}>
                    <TText style={styles.headerTitle}>Requests</TText>
                </View>
            </View>
        )
    }

  return (
    <SafeAreaView style={styles.mainContainer}>
        {/* <ScreenHeaderComponent /> */}
        {/* <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} /> */}


        <FlashList 
            data={requestList}
            keyExtractor={item => item._id}
            estimatedItemSize={60}
            ListHeaderComponent={() => (
                <ScreenHeaderComponent />
            )}
            ListFooterComponent={() => (<View style={{height: 120}}></View>)}
            renderItem={({item}) => (
                <View style={styles.requestCard}>
                    {/* View when card is clicked/opened */}
                    {/* <Modal 
                        transparent={true}
                        animationType='fade'
                        visible={isRemoveUploadedModal}
                        onRequestClose={()=> setRemoveUploadedModal(false)}
                    >
                        
                    </Modal> */}

                    {/* card */}
                    <View style={styles.cardUserImage}>
                        <Image source={global.userData.profilePic ? {uri: global.userData.profilePic} : require("../assets/images/default-profile.png")} style={styles.cardimageStyle} />
                    </View>
                    <View style={styles.requestInformationContainer}>
                        <View style={styles.cardTop}>
                            <Text style={styles.carUserNameTxt}>Worker's Name</Text>
                            <View style={styles.cardUserrating}>
                                <Icon name='star' size={20} color="gold" />
                                <TText style={styles.cardUserRatingTxt}>4.7</TText>
                            </View>
                        </View>
                        <View style={styles.cardUserName}>
                            <Text style={styles.cardRequestCategoryTxt}>{item.subCategory}</Text>
                        </View>
                        <View style={styles.cardBottom}>
                            <View style={styles.requestDate}>
                                <Icon name='calendar-multiselect' size={22} />
                                <TText style={styles.requestDateTxt}>{dayjs(item.serviceDate).format("MMM DD")}</TText>
                            </View>
                            <View style={styles.requestDate}>
                                <Icon name='clock-time-five-outline' size={22} />
                                <TText style={styles.requestDateTxt}>{dayjs(item.startTime).format("hh:mm A")}</TText>
                            </View>
                            <View style={styles.cardViewRequest}>
                                <TouchableOpacity style={styles.cardViewRequestBtn}>
                                    <TText style={styles.cardViewRequestTxt}>View</TText>
                                    <Icon name='arrow-right' size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        />

        {/* Declined Requests */}
        <View>
            {/* <View style={styles.lineBreaker}>
                <View style={{flex: 1, height: 1, backgroundColor: '#c2c2c2'}} />
                <TText style={styles.horizontalText}>Declined Requests</TText>
                <View style={{flex: 1, height: 1, backgroundColor: '#c2c2c2'}} />
            </View> */}

            {/* <View style={[styles.requestCard, styles.requestCanceledCard]}> */}
                {/* View when card is clicked/opened */}
                {/* <Modal 
                    transparent={true}
                    animationType='fade'
                    visible={isRemoveUploadedModal}
                    onRequestClose={()=> setRemoveUploadedModal(false)}
                >
                    
                </Modal> */}

                {/* card */}
                {/* <View style={[styles.cardUserImage, ]}>
                    <Image source={global.userData.profilePic ? {uri: global.userData.profilePic} : require("../assets/images/default-profile.png")} style={styles.cardimageStyle} />
                </View>
                <View style={styles.requestInformationContainer}>
                    <View style={styles.cardTop}>
                        <Text style={[styles.carUserNameTxt, styles.requestDeclinedText]}>Leah P. Olivar</Text>
                        <View style={styles.cardUserrating}>
                            <Icon name='star' size={20} color="gold" />
                            <TText style={[styles.cardUserRatingTxt, styles.requestDeclinedText]}>4.7</TText>
                        </View>
                    </View>
                    <View style={styles.cardUserName}>
                        <Text style={[styles.cardRequestCategoryTxt, styles.requestDeclinedText]}>Deep Cleaning</Text>
                    </View>
                    <View style={styles.cardBottom}>
                        <View style={styles.requestDate}>
                            <Icon name='calendar-multiselect' size={22} color={'white'} />
                            <TText style={[styles.requestDateTxt, styles.requestDeclinedText]}>July 11</TText>
                        </View>
                        <View style={styles.requestDate}>
                            <Icon name='clock-time-five-outline' size={22} color={'white'} />
                            <TText style={[styles.requestDateTxt, styles.requestDeclinedText]}>09:30 AM</TText>
                        </View>
                        <View style={styles.cardViewRequest}>
                            <TouchableOpacity style={[styles.cardViewRequestBtn, styles.cardViewDeclined]}>
                                <TText style={styles.cardViewRequestTxt}>View</TText>
                                <Icon name='arrow-right' size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View> */}

            

            {/* Deletion Notice */}
            <View style={styles.deleteNoticeContainer}>
                <TText style={styles.deleteNoticeText}>All declined requests will disappear after five (5) days.</TText>
            </View>
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
        width: 80,
        height: 80,
        borderRadius: 20,
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
        fontSize: 16
    },
    cardViewRequest: {
        flexGrow: 1,
        alignItems: 'flex-end'
    },
    cardViewRequestBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.2,
        borderColor: ThemeDefaults.themeDarkBlue,
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 12,
        backgroundColor: ThemeDefaults.themeWhite,
        elevation: 3,
    },
    cardViewRequestTxt: {
        fontSize: 14,
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
        marginBottom: 15
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
        paddingHorizontal: 100
    },
    deleteNoticeText: {
        textAlign: 'center',
        color: '#c2c2c2'

    },
})