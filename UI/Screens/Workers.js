import { StyleSheet, Dimensions, View, Text, SafeAreaView, Modal, ActivityIndicator, Image, StatusBar, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, {useEffect, useState, useRef, useLayoutEffect} from 'react'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import Appbar from '../Components/Appbar'

import { FlashList } from '@shopify/flash-list'
import { IPAddress } from '../global/global'
import { ModalPicker } from '../Components/ModalPicker'

import { useNavigation } from '@react-navigation/native'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Workers = () => {

    const navigation = useNavigation();

  const [listOfWorkers, setListOfWorkers] = useState([])

  const [workerByCategory, setWorkerByCategory] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [verifiedFilter, setVerifiedFilter] = useState("")
  const [barangayFilter, setBarangayFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")

  const [filteredResults, setFilteredResults] = useState([])
  const [barangayFilters, setBarangayFilters] = useState([])
  const [categoryFilters, setCategoryFilters] = useState([])
  const [filteredSubCatResults, setFilteredSubCatResults] = useState([])
  const [prevListWorker, setPrevListWorker] = useState([])
  const [hasResults, setHasResults] = useState(true)

  const [barangayViewModal, setBarangayViewModal] = useState(false)
  const [verifiedViewModal, setVerifiedViewModal] = useState(false)
  const [categoryViewModal, setCategoryViewModal] = useState(false)
  const [ratingViewModal, setRatingViewModal] = useState(false)
  const [hasFilter, setHasFilter] = useState(barangayFilter || verifiedFilter || categoryFilter || ratingFilter)

  const changeModalVisibility = (bool) => {
    //getAllWorkers()
    setBarangayViewModal(bool)
    setVerifiedViewModal(bool)
    setCategoryViewModal(bool)
    setRatingViewModal(bool)

  }

  const firstUpdate = useRef(true)

    useEffect(() => {
        getAllWorkers()
        setPrevListWorker([...listOfWorkers])
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
            setPrevListWorker([...data])
            console.log("list of workers: ")
        })
    }

    useEffect(() => {
        setHasFilter(barangayFilter || verifiedFilter || categoryFilter || ratingFilter)
    },[barangayFilter, verifiedFilter, categoryFilter, ratingFilter])

    useEffect(() => {
        getAllWorkers()
    }, [])

    
    const filterCategoryList = (fil) => {

        let list = [...listOfWorkers]
        let catResult = []

        catResult = list.filter(worker => worker.works.includes(fil))

        if(barangayFilter){
            catResult = catResult.filter(worker => worker.barangay === barangayFilter)
            setPrevListWorker([...catResult])
        } 

        if(verifiedFilter){
            catResult = catResult.filter(worker => worker.verification === verifiedFilter)
        }
        
        setPrevListWorker([...catResult])
    }

    const filterBarangayList = (fil) => {


        let list = [...listOfWorkers]
        let brgyResult = []

        brgyResult = list.filter(worker => worker.barangay === fil)

        if(categoryFilter){
            brgyResult = brgyResult.filter(worker => worker.works.includes(categoryFilter))
            setPrevListWorker([...brgyResult])
        } 

        if(verifiedFilter){
            brgyResult = brgyResult.filter(worker => worker.verification === verifiedFilter)
        }
        
        setPrevListWorker([...brgyResult])
    }

    const filterVerifiedList = (fil) => {

        let list = [...listOfWorkers]
        let workerStatus = []

        workerStatus = list.filter(worker => worker.verification === fil)
        console.log("workerStatus: ", workerStatus)
        
        if(categoryFilter){
            console.log("verification has category filter")
            workerStatus = workerStatus.filter(worker => worker.works.includes(categoryFilter))
            setPrevListWorker([...workerStatus])
        }

        if(barangayFilter){
            console.log("verification has barangay filter")
            workerStatus = workerStatus.filter(worker => worker.barangay === barangayFilter)
        }
        
        setPrevListWorker([...workerStatus])
    }

    const handleResetFilter = () => {
        setBarangayFilter("")
        setVerifiedFilter("")
        setCategoryFilter("")
        setRatingFilter("")
        getAllWorkers()
        setHasResults(true)
        setPrevListWorker([...listOfWorkers])
      }

    const ListHeaderComponent = () => {
        return(
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
                            <TText style={[styles.filterText, {paddingLeft: 5}]}>All</TText>
                            <Icon name="chevron-down" size={20} color={'white'} />

                            <Modal
                                transparent={true}
                                animationType='fade'
                                visible={verifiedViewModal}
                                onRequestClose={() => setVerifiedViewModal(false)}
                            >
                                <ModalPicker 
                                    changeModalVisibility={changeModalVisibility}
                                    setData={(filter) => {
                                        setVerifiedFilter(filter === "Verified" ? true : false )
                                        filter === "All" ? handleResetFilter() : filter === 'Verified' ? filterVerifiedList(true) : filterVerifiedList(false)
                                    }}
                                    verifiedFilter={true}
                                />
                            </Modal>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterBtn}
                            onPress={() => {
                                setBarangayViewModal(true)
                            }}
                        >
                            <TText style={styles.filterText}>Barangay</TText>
                            <Icon name="chevron-down" size={20} color={'white'} />

                            <Modal
                                transparent={true}
                                animationType='fade'
                                visible={barangayViewModal}
                                onRequestClose={() => setBarangayViewModal(false)}
                            >
                                <ModalPicker 
                                    changeModalVisibility={changeModalVisibility}
                                    setData={(filter) => {
                                        // setBarangayFilter("")
                                        setBarangayFilter(filter)
                                        filterBarangayList(filter)
                                    }}
                                    barangay={true}
                                />
                            </Modal>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterBtn}
                            onPress={() => setCategoryViewModal(true)}
                        >
                            <TText style={styles.filterText}>Category</TText>
                            <Icon name="chevron-down" size={20} color={'white'} />

                            <Modal
                                transparent={true}
                                animationType='fade'
                                visible={categoryViewModal}
                                onRequestClose={() => setCategoryViewModal(false)}
                            >
                                <ModalPicker 
                                    changeModalVisibility={changeModalVisibility}
                                    setData={(filter) => {
                                        setCategoryFilter(filter.ServiceSubCategory)
                                        filterCategoryList(filter.ServiceSubCategory)
                                    }}
                                    categoryFilter={true}
                                />
                            </Modal>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterBtn}
                            onPress={() => setRatingViewModal(true)}
                        >
                            <TText style={styles.filterText}>Rating</TText>
                            <Icon name="chevron-down" size={20} color={'white'} />

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
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 50}} style={{paddingLeft: 30}}>
                                {
                                    verifiedFilter && verifiedFilter !== 'All' &&
                                    <View style={styles.filters}>
                                        <TText style={styles.filtersText}>{verifiedFilter ? "Verified" : "Unverified"}</TText>
                                    </View>
                                }
                                {
                                    barangayFilter &&
                                    <View style={styles.filters}>
                                        <TText style={styles.filtersText}>{barangayFilter}</TText>
                                    </View>
                                }
                                {
                                    categoryFilter &&
                                    <View style={styles.filters}>
                                        <TText style={styles.filtersText}>{categoryFilter}</TText>
                                    </View>
                                }
                                {
                                    ratingFilter &&
                                    <View style={styles.filters}>
                                        <TText style={styles.filtersText}>{ratingFilter === '5' ? ratingFilter : `${ratingFilter} and up`}</TText>
                                    </View>
                                }
                            </ScrollView>
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
        )
    }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

  const onRefresh = () => {
    setIsRefreshing(true)
    handleResetFilter()
    setHasResults(true)
    wait(500).then(() => setIsRefreshing(false));
  }

  return (
    <SafeAreaView style={styles.container}>

        <View style={styles.box}>
        
            {/* <View style={styles.listContainer}> */}
        
                {/* List of workers */}
                                {/* item.verification === verifiedFilter || item.barangay === barangayFilter || item || !hasFilter ? */}
                <View style={{width: WIDTH, height: HEIGHT, paddingTop: 0,}}>
                    <FlashList 
                        data={prevListWorker}
                        extraData={prevListWorker}
                        keyExtractor={item => item._id}
                        estimatedItemSize={100}
                        onRefresh={onRefresh}
                        refreshing={isRefreshing}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <View style={{alignItems: 'center', marginTop: 10}}>
                                <TText style={{fontSize: 18, color: 'gray'}}>No results found. Try again</TText>
                            </View>
                        )}
                        ListHeaderComponent={() => (
                            <ListHeaderComponent />
                        )}
                        ListFooterComponent={() => (
                            <View style={{height: 200}}></View>
                        )}
                        renderItem={({item}) => (
                            <> 
                            {
                                hasResults ?
                                                 
                            <TouchableOpacity style={{width: '100%', paddingHorizontal: 30, height: 130, zIndex:10}}
                                onPress={() => {
                                    console.log("workers clicked")
                                    navigation.navigate("RequestFormDrawer", {workerID: item._id, workerInformation: item, selectedJob: '', showMultiWorks: true})
                                }}
                            >
                                <View style={styles.button}
                                >
                                    <View style={styles.buttonView}>
                                        {/* Profile Picture */}
                                        <View style={styles.imageContainer}>
                                            <Image source={item.profilePic === "pic" ? require("../assets/images/default-profile.png") : {uri: `http://${IPAddress}:3000/images/${item.profilePic}`}} style={styles.image} />
                                        </View>
                                        {/* Worker Information */}
                                        <View style={styles.descriptionBox}>
                                            <View style={styles.descriptionTop}>
                                                <View style={[styles.row, styles.workerInfo]}>
                                                    <View style={styles.workerNameHolder}>
                                                        <TText style={styles.workerNameText}>{item.firstname}{item.middlename === "undefined" ? "" : item.middlename} {item.lastname}</TText>
                                                        { item.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null }
                                                    </View>
                                                    <View style={styles.workerRatingsHolder}>
                                                        <Icon name="star" color={"gold"} size={18} />
                                                        <TText style={styles.workerRatings}>4.5</TText>
                                                    </View>                                     
                                                </View>
                                                <View style={styles.workerAddressBox}>
                                                    <Icon name='map-marker' size={16} />
                                                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.workerAddressText}>{item.street}, Purok {item.purok}, {item.barangay}</Text>
                                                </View>
                                            </View>
                                            
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
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            : null
                            }
                            </>
                        )}
                    />
                    
                </View>
            {/* </View> */}
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
        marginBottom: 30,
    },
    filterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        backgroundColor: ThemeDefaults.themeOrange,
        borderRadius: 10,
        width: '90%',
        elevation: 4,
    },
    filterBtn: {
        // flex: 1,
        // width: '25%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    filterText: {
        marginRight: 2,
        color: '#fff'
    },
    resetFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        borderRadius: 10,
        backgroundColor: '#FFF',
        zIndex: 5,
        elevation: 5
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
        width: '98%',
        height: 20,
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
    filters: {
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginRight: 5,
        marginVertical: 3,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#F1F1F1',
        elevation: 1,
    },
    filtersText: {
        fontSize: 14, 
        color: 'gray'
    },
})