import { StyleSheet, Dimensions, View, Text, SafeAreaView, ActivityIndicator, Image, StatusBar, TouchableOpacity } from 'react-native'
import React, {useEffect, useState, useLayoutEffect} from 'react'
import Appbar from '../Components/Appbar'
import { IPAddress } from '../global/global'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'

import { FlashList } from '@shopify/flash-list'
import { FlatList } from 'react-native-gesture-handler'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const ListSpecificWorkers = ({route, navigation}) => {

    const {chosenCategory} = route.params
    // const navigation = useNavigation()

    const [worker, setWorkers] = useState([])

    useEffect(() => {
        // console.log("list spec:", chosenCategory)
        loadWorkers()
    }, [])


    const loadWorkers = () => {
        fetch(`http://${IPAddress}:3000/Work/${chosenCategory}`, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": global.accessToken
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setWorkers([...data])
            console.log("Workrs list", data)
        }).catch((err) => console.log("error: ", err.message))
    }


  return (
    <SafeAreaView style={styles.container}>
    <Appbar hasPicture={true} backBtn={true} accTypeSelect={true} showLogo={true} />

    <View style={styles.workersContainer}>
        <FlashList 
            data={worker}
            extraData={worker}
            keyExtractor={item => item._id}
            estimatedItemSize={50}
            ListHeaderComponent={() => (
                <View style={styles.headerContainer}>
                    <TText style={styles.headerTitle}>Available Workers</TText>
                    <TText style={styles.headerSubTitle}>Please choose an available worker for <TText style={{color: ThemeDefaults.themeOrange}}>{chosenCategory}</TText></TText>
                </View>
            )}
            ListFooterComponent={() => (
                <View style={{height: 150}}></View>
            )}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
                <View style={{width: '100%', paddingHorizontal: 20, height: 130}}>
                    {/* <TText>{item.workerId.age}</TText> */}
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            console.log("item: ", item)
                            console.log("workerId._id: ", item.workerId._id)
                            console.log("workId: ", item.ServiceSubId._id)

                            global.userData.role === "recruiter" ? 
                                navigation.navigate("RequestFormDrawer", {workerID: item.workerId._id, workID: item.ServiceSubId._id, workerInformation: item.workerId, selectedJob: item.ServiceSubId.ServiceSubCategory, minPrice: item.minPrice, maxPrice: item.maxPrice, showMultiWorks: false, fromListSpecific: true})
                                : navigation.navigate("WorkerProfileDrawer", {workerID: item.workerId._id})
                            
                                // navigation.navigate("RequestFormDrawer", {
                                //     workerID: workerID,
                                //     workID: workItem.ServiceSubId._id,
                                //     workerInformation: workerInformation,
                                //     selectedJob: workItem.ServiceSubId.ServiceSubCategory,
                                //     minPrice: workItem.minPrice,
                                //     maxPrice: workItem.maxPrice,
                                //     showMultiWorks: false
                                // })
                        }}
                    >
                        <View style={styles.buttonView}>
                            {/* Profile Picture */}
                            <View style={styles.imageContainer}>
                                <Image source={item.workerId.profilePic === "pic" ? require("../assets/images/default-profile.png") : {uri: item.workerId.profilePic}} style={styles.image} />
                            </View>
                            {/* Worker Information */}
                            <View style={styles.descriptionBox}>
                                <View style={styles.descriptionTop}>
                                    <View style={[styles.row, styles.workerInfo]}>
                                        <View style={styles.workerNameHolder}>
                                            <TText style={styles.workerNameText}>{item.workerId.firstname}{item.workerId.middlename === "undefined" ? "" : item.workerId.middlename} {item.workerId.lastname}</TText>
                                            { item.workerId.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null }
                                        </View>
                                        <View style={styles.workerRatingsHolder}>
                                            <Icon name="star" color={"gold"} size={18} />
                                            <TText style={styles.workerRatings}>4.5</TText>
                                        </View>                                     
                                    </View>
                                    <View style={styles.workerAddressBox}>
                                        <Icon name='map-marker' size={16} />
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.workerAddressText}>{item.workerId.street}, {item.workerId.purok}, {item.workerId.barangay}</Text>
                                    </View>
                                </View>
                                <View style={styles.descriptionBottom}>
                                    <TText style={styles.serviceFeeText}>Service Fee:</TText>
                                    <TText style={styles.serviceFeePrice}>₱{item.minPrice} to ₱{item.maxPrice}</TText>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        />
    </View>
</SafeAreaView>
  )
}

export default ListSpecificWorkers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: ThemeDefaults.themeWhite
    },
    headerContainer: {
        marginTop: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'LexendDeca_SemiBold',
        marginBottom: 25
    },
    headerSubTitle: {
        fontSize: 18,
        width: '70%',
        textAlign: 'center'
    },
    workersContainer: {
        flex: 1,
        width: WIDTH,
        height: HEIGHT,
        // marginHorizontal: 30,
    },
    buttonView: {
        // marginHorizontal: 30,
        width: '100%',
        flexDirection: 'row',
    },
    button: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 4,
        marginBottom: 20,
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
        height: '100%',
        // elevation: 3
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
        flexDirection: 'row'
    },
    serviceFeeText: {
        marginRight: 5
    },
    serviceFeePrice: {
        fontFamily: 'LexendDeca_Medium'
    },
})