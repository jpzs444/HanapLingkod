import { StyleSheet, Dimensions, View, SafeAreaView, ActivityIndicator, Image, StatusBar, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import Appbar from '../Components/Appbar'

import { FlashList } from '@shopify/flash-list'
import { IPAddress } from '../global/global'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Workers = () => {

  const [listOfWorkers, setListOfWorkers] = useState([])

  useEffect(() => {
    fetch("http://" + IPAddress + ":3000/Worker/", {
            method: 'GET',
            headers: {
                "content-type": "application/json",
            },
        }).then((res) => res.json())
        .then((data) => {
            console.log("list: ", data)
            setListOfWorkers([...data])
        }).catch((err) => console.log("error: ", err.message))
  }, [])

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.box}>
        <Appbar hasPicture={true} backBtn={true} showLogo={true} />
        
        <View style={styles.listContainer}>
          
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Workers

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight
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
      fontSize: 18,
      color: ThemeDefaults.themeOrange,
      marginRight: 5
    },
    serviceFeePrice: {
      fontFamily: 'LexendDeca_Medium'
    },
})