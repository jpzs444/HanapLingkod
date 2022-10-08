import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, StatusBar, Dimensions } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import Appbar from '../Components/Appbar'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from '../Components/TText';
import React, {useState, useEffect} from 'react'
import ThemeDefaults from '../Components/ThemeDefaults';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Requests = () => {

    const ScreenHeaderComponent = () => {
        return(
            <View style={styles.headerContainer}>
                <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />

                <View style={styles.headerTitleBar}>
                    <TText style={styles.headerTitle}>Requests</TText>
                    <View style={styles.headerTitleCount}>
                        <TText style={styles.headerCount}>5</TText>
                    </View>
                </View>
            </View>
        )
    }

  return (
    <SafeAreaView style={styles.mainContainer}>
        <ScreenHeaderComponent />

        <View style={styles.requestCard}>
            {/* View when card is clicked/opened */}
            <Modal 
                transparent={true}
                animationType='fade'
                visible={isRemoveUploadedModal}
                onRequestClose={()=> setRemoveUploadedModal(false)}
            >
                
            </Modal>

            {/* card */}
            <View style={styles.cardUserImage}>
                <Image source={global.userData.profilePic ? {uri: global.userData.profilePic} : require("../assets/images/default-profile.png")} style={styles.cardimageStyle} />
            </View>
            <View style={styles.requestInformationContainer}>
                <View style={styles.cardTop}>
                    <Text style={styles.cardRequestCategoryTxt}>Deep Cleaning</Text>
                    <View style={styles.cardUserrating}>
                        <Icon name='star' size={20} color="gold" />
                        <TText style={styles.cardUserRatingTxt}>4.7</TText>
                    </View>
                </View>
                <View style={styles.cardUserName}>
                    <Text style={styles.carUserNameTxt}>Leah P. Olivar</Text>
                </View>
                <View style={styles.cardBottom}>
                    <View style={styles.requestDate}>
                        <Icon name='calendar-multiselect' size={22} />
                        <TText style={styles.requestDateTxt}>July 11</TText>
                    </View>
                    <View style={styles.requestDate}>
                        <Icon name='clock-time-five-outline' size={22} />
                        <TText style={styles.requestDateTxt}>09:30 AM</TText>
                    </View>
                    <View style={styles.cardViewRequest}>
                        <TouchableOpacity style={styles.cardViewRequestBtn}>
                            <TText style={styles.cardViewRequestTxt}>View</TText>
                            <Icon name='arrow-right' size={22} />
                        </TouchableOpacity>
                    </View>
                </View>
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
        fontFamily: 'LexendDeca_Medium',
        fontSize: 16,
    },
    cardUserrating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardUserRatingTxt: {

    },
    cardUserName: {
        paddingVertical: 2
    },
    carUserNameTxt: {
        fontFamily: 'LexendDeca_SemiBold',
        fontSize: 20,
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
        fontSize: 18
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
        paddingHorizontal: 15,
        backgroundColor: ThemeDefaults.themeWhite,
        elevation: 3,
    },
    cardViewRequestTxt: {
        fontSize: 14,
        marginRight: 8
    },
})