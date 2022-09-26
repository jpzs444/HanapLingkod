import { StyleSheet, Dimensions, View, SafeAreaView, ActivityIndicator, Image, StatusBar, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import Appbar from '../Components/Appbar'
import { IPAddress } from '../global/global'

import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'

import { FlashList } from '@shopify/flash-list'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const ListSpecificWorkers = ({route}) => {

    const {chosenCategory} = route.params

    const [worker, setWorkers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetch("http://" + IPAddress + ":3000/Work/" + chosenCategory, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
            },
        }).then((res) => res.json())
        .then((data) => {
            setWorkers([...data])
        }).catch((err) => console.log("error: ", err.message))
    }, [])

    
    useEffect(() => {
        setIsLoading(false)
    }, [worker])


  return (
    !isLoading ? <SafeAreaView style={styles.container}>
    <Appbar hasPicture={true} backBtn={true} accTypeSelect={true} showLogo={true} />

    <View style={styles.workersContainer}>
        <FlashList 
            data={worker}
            keyExtractor={item => item._id}
            estimatedItemSize={50}
            ListHeaderComponent={() => (
                <View style={styles.headerContainer}>
                    <TText style={styles.headerTitle}>Available Workers</TText>
                    <TText style={styles.headerSubTitle}>Please choose an available worker for {chosenCategory}</TText>
                </View>
            )}
            ListFooterComponent={() => (
                <View style={{height: 150}}></View>
            )}
            // showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
                <View style={{width: WIDTH, paddingHorizontal: 30}}>
                    <TouchableOpacity style={styles.button}>
                        <View style={styles.buttonView}>
                            {/* Profile Picture */}
                            <View style={styles.imageContainer}>
                                <Image source={require("../assets/images/plumbing.jpg")} style={styles.image} />
                            </View>
                            {/* Worker Information */}
                            <View style={styles.descriptionBox}>
                                <View style={styles.descriptionTop}>
                                    <View style={[styles.row, styles.workerInfo]}>
                                        <View style={styles.workerNameHolder}>
                                            <TText style={styles.workerNameText}>{item.workerId.firstname}{item.workerId.middlename === "undefined" ? "" : item.workerId.middlename} {item.workerId.lastname}</TText>
                                            { !item.workerId.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null }
                                        </View>
                                        <View style={styles.workerRatingsHolder}>
                                            <Icon name="star" color={"gold"} size={18} />
                                            <TText style={styles.workerRatings}>4.5</TText>
                                        </View>                                     
                                    </View>
                                    <View style={styles.workerAddressBox}>
                                        <Icon name='map-marker' size={16} />
                                        <TText style={styles.workerAddressText}>{item.workerId.street}, {item.workerId.purok}, {item.workerId.barangay}</TText>
                                    </View>
                                </View>
                                <View style={styles.descriptionBottom}>
                                    <TText style={styles.serviceFeeText}>Service Fee: </TText>
                                    <TText style={styles.serviceFeePrice}>₱{item.minPrice}  to  ₱{item.maxPrice}</TText>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        />
    </View>
</SafeAreaView>
: <ActivityIndicator size={"large"} />
  )
}

export default ListSpecificWorkers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight
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
        width: 115,
        height: 115,
    },
    image: {
        width: '100%',
        height: '100%'
    },
    descriptionBox: {
        padding: 12,
        width: '100%',
        justifyContent: 'space-between'
    },
    descriptionTop: {
        width: '75%',
    },
    row: {

    },
    workerInfo: {
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    workerNameHolder: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    workerNameText: {
        fontSize: 20,
        marginBottom: 3
    },
    workerRatingsHolder: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    workerRatings: {
        marginLeft: 3
    },
    workerAddressBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    workerAddressText: {
        fontSize: 14,
        marginLeft: 3
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