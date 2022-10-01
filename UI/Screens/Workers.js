import { StyleSheet, Dimensions, View, Text, SafeAreaView, Modal, ActivityIndicator, Image, StatusBar, TouchableOpacity, FlatList } from 'react-native'
import React, {useEffect, useState, useRef, useLayoutEffect} from 'react'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import Appbar from '../Components/Appbar'

import { FlashList } from '@shopify/flash-list'
import { IPAddress } from '../global/global'
import { ModalPicker } from '../Components/ModalPicker'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Workers = () => {

  const [listOfWorkers, setListOfWorkers] = useState([])
  const [workerByCategory, setWorkerByCategory] = useState([])

  const [barangayFilter, setBarangayFilter] = useState("")
  const [verifiedFilter, setVerifiedFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")

  const [barangayViewModal, setBarangayViewModal] = useState(false)
  const [verifiedViewModal, setVerifiedViewModal] = useState(false)
  const [categoryViewModal, setCategoryViewModal] = useState(false)
  const [ratingViewModal, setRatingViewModal] = useState(false)
  const [hasFilter, setHasFilter] = useState(barangayFilter || verifiedFilter || categoryFilter || ratingFilter)

  const changeModalVisibility = (bool) => {
    setBarangayViewModal(bool)
    setVerifiedViewModal(bool)
    setCategoryViewModal(bool)
    setRatingViewModal(bool)
  }


    const firstUpdate = useRef(true)
    // useEffect(() => {
    //     console.log(categoryFilter.ServiceSubCategory)
    //         fetch("http://" + IPAddress + ":3000/Work/" + categoryFilter.ServiceSubCategory, {
    //         method: "GET",
    //         headers: {
    //             'content-type': 'application/json',
    //         },
    //         })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setListOfWorkers(data)
    //             console.log(data)
    //         }).catch((err) => console.log(err.message))
        
    // }, [categoryFilter])

    useEffect(() => {
        getAllWorkers()
    }, [])

    const getAllWorkers = () => {
        fetch("http://" + IPAddress + ":3000/Worker", {
            method: "GET",
            headers: {
                "content-type": "application/json"
            },
        }).then((response) => response.json())
        .then((data) => {
            setListOfWorkers([...data])
            // console.log("list of workers: ", data)
        })
    }

    // if(categoryFilter){
    //     fetch("http://" + IPAddress + ":3000/Work/" + categoryFilter.ServiceSubCategory, {
    //         method: "GET",
    //         headers: {
    //             'content-type': 'application/json',
    //         },
    //     }).then((res) => res.json())
    //     .then((data) => {
    //         setListOfWorkers([...data])
    //         // setWorkerByCategory([...data])
    //         console.log(data)
    //     })
    //     // setCategoryFilter([])
    //     // return
    // }

    // useEffect(() => {
        
    //     console.log("did")
    //     fetch("http://" + IPAddress + ":3000/Work/" + categoryFilter.ServiceSubCategory, {
    //         method: "GET",
    //         headers: {
    //             'content-type': 'application/json',
    //         },
    //     }).then((res) => res.json())
    //     .then((data) => {
    //         if(data.length === 0) getAllWorkers()
    //         setListOfWorkers([...data])
    //         // setWorkerByCategory([...data])
    //         console.log(data)
    //     })
        
    // }, [categoryFilter])

    useEffect(() => {
        setHasFilter(barangayFilter || verifiedFilter || categoryFilter || ratingFilter)
    },[barangayFilter, verifiedFilter, categoryFilter, ratingFilter])


  const handleResetFilter = () => {
    setBarangayFilter("")
    setVerifiedFilter("")
    setCategoryFilter("")
    setRatingFilter("")
  }

  return (
    <SafeAreaView style={styles.container}>

        <View style={styles.box}>
        
            <View style={styles.listContainer}>
        
                {/* List of workers */}
                <View style={{width: WIDTH, height: HEIGHT, paddingTop: 0,}}>
                    <FlashList 
                        data={listOfWorkers}
                        keyExtractor={item => item._id}
                        estimatedItemSize={100}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={() => (
                            <>
                                <Appbar hasPicture={true} backBtn={true} accTypeSelect={true} showLogo={true} />
                                <View style={styles.header}>
                                    <TText style={styles.headerTitle}>Workers</TText>
                                </View>
                                <View style={styles.filterContainer}>
                                    <View style={styles.filterBox}>
                                        <TouchableOpacity style={styles.filterBtn}
                                            onPress={() => setVerifiedViewModal(true)}
                                        >
                                            <TText style={styles.filterText}>{verifiedFilter ? verifiedFilter :"All"}</TText>
                                            <Icon name="chevron-down" size={20} />

                                            <Modal
                                                transparent={true}
                                                animationType='fade'
                                                visible={verifiedViewModal}
                                                onRequestClose={() => setVerifiedViewModal(false)}
                                            >
                                                <ModalPicker 
                                                    changeModalVisibility={changeModalVisibility}
                                                    setData={(filter) => setVerifiedFilter(filter)}
                                                    verifiedFilter={true}
                                                />
                                            </Modal>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.filterBtn}
                                            onPress={() => {
                                                setBarangayViewModal(true)
                                            }}
                                        >
                                            <TText style={styles.filterText}>{barangayFilter ? barangayFilter : "Barangay"}</TText>
                                            <Icon name="chevron-down" size={20} />

                                            <Modal
                                                transparent={true}
                                                animationType='fade'
                                                visible={barangayViewModal}
                                                onRequestClose={() => setBarangayViewModal(false)}
                                            >
                                                <ModalPicker 
                                                    changeModalVisibility={changeModalVisibility}
                                                    setData={(filter) => setBarangayFilter(filter)}
                                                    barangay={true}
                                                />
                                            </Modal>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.filterBtn}
                                            onPress={() => setCategoryViewModal(true)}
                                        >
                                            <TText style={styles.filterText}>{categoryFilter ? categoryFilter.ServiceSubCategory : "Category"}</TText>
                                            <Icon name="chevron-down" size={20} />

                                            <Modal
                                                transparent={true}
                                                animationType='fade'
                                                visible={categoryViewModal}
                                                onRequestClose={() => setCategoryViewModal(false)}
                                            >
                                                <ModalPicker 
                                                    changeModalVisibility={changeModalVisibility}
                                                    setData={(filter) => setCategoryFilter(filter)}
                                                    categoryFilter={true}
                                                />
                                            </Modal>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.filterBtn}
                                            onPress={() => setRatingViewModal(true)}
                                        >
                                            <TText style={styles.filterText}>{ ratingFilter ? ratingFilter : "Rating"}</TText>
                                            <Icon name="chevron-down" size={20} />

                                            <Modal
                                                transparent={true}
                                                animationType='fade'
                                                visible={ratingViewModal}
                                                onRequestClose={() => setRatingViewModal(false)}
                                            >
                                                <ModalPicker 
                                                    changeModalVisibility={changeModalVisibility}
                                                    setData={(filter) => setRatingFilter(filter)}
                                                    ratingFilter={true}
                                                />
                                            </Modal>
                                        </TouchableOpacity>
                                    </View>

                                    {
                                        hasFilter ? 
                                        <View style={styles.resetFilterContainer}>
                                            <TouchableOpacity style={styles.resetFilterBtn} 
                                                onPress={() => handleResetFilter()}
                                            >
                                                <Icon name='close-circle' size={20} />
                                                <TText style={styles.resetFilterTxt}>Reset Filter</TText>
                                            </TouchableOpacity>
                                        </View>
                                        : null
                                    }
                                </View>
                            </>
                        )}
                        ListFooterComponent={() => (
                            <View style={{height: 200}}></View>
                        )}
                        renderItem={({item}) => (
                            
                            <View style={{width: '100%', paddingHorizontal: 30, height: 130}}>
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
                                                        {
                                                            categoryFilter ? 
                                                            <TText style={styles.workerNameText}>{item.workerId.firstname}{item.workerId.middlename === "undefined" ? "" : item.workerId.middlename} {item.workerId.lastname}</TText>
                                                            :
                                                            <TText style={styles.workerNameText}>{item.firstname}{item.middlename === "undefined" ? "" : item.middlename} {item.lastname}</TText>
                                                        }
                                                        { !item.verification || !item.workerId.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null }
                                                    </View>
                                                    <View style={styles.workerRatingsHolder}>
                                                        <Icon name="star" color={"gold"} size={18} />
                                                        <TText style={styles.workerRatings}>4.5</TText>
                                                    </View>                                     
                                                </View>
                                                <View style={styles.workerAddressBox}>
                                                    <Icon name='map-marker' size={16} />
                                                    {
                                                        categoryFilter ?
                                                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.workerAddressText}>{item.workerId.street}, {item.workerId.purok}, {item.workerId.barangay}</Text>
                                                            :
                                                            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.workerAddressText}>{item.street}, {item.purok}, {item.barangay}</Text>
                                                    }
                                                </View>
                                            </View>
                                            {
                                                !categoryFilter ? 
                                                <View style={styles.descriptionBottom}>
                                                    <View style={[styles.serviceFeeText]}> 
                                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize: 13, width: '100%'}}>Services:
                                                        {
                                                            item.works.map(function(w, index){
                                                                return(
                                                                    w + ", "
                                                                )
                                                            })
                                                        }
                                                        </Text>
                                                    </View>
                                                </View>
                                                : null
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </View>
      </View>
    </SafeAreaView>
  )
}

export default Workers

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: ThemeDefaults.themeWhite,
    },
    listContainer: {
        width: '100%',
        // paddingHorizontal: 30,
        alignItems: 'center',
    },
    header: {  
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20
    },
    filterContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    filterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        width: '90%',
        elevation: 4,
    },
    filterBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 8,
    },
    filterText: {
    },
    resetFilterContainer: {
        alignItems: 'flex-end',
        marginTop: 15,
        width: '100%',
        paddingRight: 30,
    },
    resetFilterBtn: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderWidth: 1.2,
        borderColor: ThemeDefaults.themeDarkBlue,
        borderRadius: 10
    },
    resetFilterTxt: {
        marginLeft: 5
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
        height: '100%'
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
        width: '90%',
        flexDirection: 'row',
    },
    serviceFeeText: {
        flex: 1,
        width:'100%',
        // height: 22,
        marginRight: 5,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    serviceFeePrice: {
        fontFamily: 'LexendDeca_Medium'
    },
})