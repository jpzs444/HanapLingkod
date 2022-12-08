import { StyleSheet, View, SafeAreaView, ActivityIndicator, Dimensions, Image, StatusBar, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import { IPAddress } from '../global/global'
import ThemeDefaults from '../Components/ThemeDefaults'

import { useNavigation } from '@react-navigation/native'
import { FlashList } from "@shopify/flash-list";

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const SubCategory = ({route}) => {
    
    const {categoryID, categoryNAME} = route.params

    const navigation = useNavigation()

    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        setIsLoading(true)
        fetch("https://hanaplingkod.onrender.com/service-sub-category", {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": global.accessToken
            },
        }).then((res) => res.json())
        .then((data) => {
            // setIsLoading(true)
            setSubCategories([...data])
            // console.log("sub-category: ", data)
        }).catch((err) => console.log("error: ", err.message))
        setIsLoading(false)
    }, [categoryID])
    
    if(isLoading){
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size={'large'}  />
                {/* {setIsLoading(false)} */}
                
            </View>
        )
    }

  return (
    <SafeAreaView style={styles.container}>
        <View style={{elevation: 4}}>
            <Appbar hasPicture={true} backBtn={true} accTypeSelect={true} showLogo={true} />
        </View>

        <View style={styles.buttonContainer}>
            <FlashList 
                data={subCategories}
                keyExtractor={item => item._id}
                estimatedItemSize={50}
                ListHeaderComponent={() => (
                    <View style={styles.headerContainer}>
                        <TText style={styles.headerTitle}>{categoryNAME} Services</TText>
                        <TText style={styles.headerSubTitle}>Please choose a specific <TText style={{color: ThemeDefaults.themeOrange}}>{categoryNAME} service</TText></TText>
                    </View>
                )}
                ListFooterComponent={() => (
                    <View style={{height: 150}}></View>
                )}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (

                    item.ServiceID._id === categoryID ?
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            console.log("chosen cat:", item.ServiceSubCategory)
                            navigation.navigate("ListSpecificWorkerScreen", {chosenCategory: item.ServiceSubCategory,})
                        }}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={require("../assets/images/stock.jpg")} style={styles.imageStyle} />
                        </View>
                        <View style={styles.subCategoryDescriptionBox}>
                            <View style={styles.subCategoryRow}>
                                <TText style={styles.subCategoryText}>{item.ServiceSubCategory}</TText>
                                {/* <TText style={styles.priceRangePrice}>Price Range</TText> */}
                                <TText style={styles.categoryText}>{item.ServiceID.Category}</TText>
                            </View>
                            <View style={[styles.subCategoryRow, {marginBottom: 0}]}>
                                {/* <TText style={styles.priceRangeText}>Price Range</TText> */}
                            </View>
                        </View>
                    </TouchableOpacity>
                    : null
                   
                )}
            />
        </View>

      {/* </ScrollView> */}
    </SafeAreaView>
  )
}

export default SubCategory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#fff'
    },
    headerContainer: {
        marginTop: 10,
        marginBottom: 30,
        // marginLeft: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'LexendDeca_SemiBold',
        marginBottom: 10
    },
    headerSubTitle: {
        marginBottom: 15
    },
    buttonContainer: {
        flex: 1,
        height: HEIGHT,
        width: '100%'
    },
    button: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 20,
        elevation: 4,
    },
    imageContainer: {

    },
    imageStyle: {
        width: '100%',
        height: 160,
    },
    subCategoryDescriptionBox: {
        padding: 20
    },
    subCategoryRow: {
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    subCategoryText: {
        fontSize: 18,
        fontFamily: 'LexendDeca_Bold',
        color: ThemeDefaults.appIcon,
        textShadowColor: '#cbcbcb',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 15
    },
    priceRangePrice: {
    },
    categoryText: {
        color: '#cbcbcb',
    },
    priceRangeText: {
        color: 'rgba(27,35,58,.5)'

    },
})