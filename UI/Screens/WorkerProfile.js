import { StyleSheet, Image, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Modal, StatusBar, RefreshControl } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeDefaults from '../Components/ThemeDefaults';
import { IPAddress } from '../global/global';
import ViewImage from '../Components/ViewImage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import ImageView from "react-native-image-viewing";
import Swiper from 'react-native-swiper'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const WorkerProfile = ({route}) => {

    const screenFocused = useIsFocused()

    useEffect(() => {
        getUpdatedUserData()
        getUpdatedWorkList()

        return () => {
            setworkerInformation({})
            setWorkList([])
        }
        
    }, [screenFocused])

    const {workerID} = route.params;

    const navigation = useNavigation()
    const isFocused = navigation.isFocused();

    const [workList, setWorkList] = useState([])
    const [activeTab, setActiveTab] = useState('works')
    const [rerender, setRerender] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [imageView, setImageView] = useState(false)
    const [initialIndex, setInitialIndex] = useState(0)
    let imageList = []

    const [workerInformation, setworkerInformation] = useState({})

    const getUpdatedUserData = () => {

        fetch("http://" + IPAddress + ":3000/Worker/" + workerID, {
            method: "GET",
            header: {
                "conten-type": "application/json"
            },
        }).then((res) => res.json())
        .then((user) => {
            console.log("worker new load: ", user)
            setworkerInformation({...user})
            workk = user

            // let imageList = []
            for(let i = 0; i < user.prevWorks.length; i++){
                imageList.push("http://" + IPAddress + ":3000/images/" + user.prevWorks[i])
            }
            // console.log("imagelist: ", imageList)
        })
        .catch((error) => console.log(error.message))

        // console.log("workerInformation: ", workerInformation)
    }

    const getUpdatedWorkList = () => {
        setWorkList([])
        fetch("http://" + IPAddress + ":3000/WorkList/" + workerID, {
            method: 'GET',
            headers: {
                "content-type": "application/json",
            },
        }).then((res) => res.json())
        .then((data) => {
            setWorkList([...data])
            // console.log("new work list: ", data)
        }).catch((error) => console.log("workList fetch: ", error.message))
    }


    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const refreshFunc = React.useCallback(() => {
        setIsRefreshing(true)
        getUpdatedUserData()
        getUpdatedWorkList()
        wait(500).then(() => setIsRefreshing(false));
    }, [])

    const renderPagination = (index, total, context) => {
        return (
          <View style={{position: 'absolute', top: 30, right: 40}}>
            <Text style={{ color: 'white' , fontSize: 16}}>
              <Text style={{fontSize: 18, color: 'white'}}> {index + 1}</Text> of {total}
            </Text>
          </View>
        )
      }

  return (
    <SafeAreaView style={styles.container}>
        
        {/* Image Swiper | Swiper View for images when clicked/opened */}
        {
            workerInformation.prevWorks &&
            <Modal 
                transparent={true}
                animationType='fade'
                visible={imageView}
                onRequestClose={()=> setImageView(false)}
            >
                <View style={{width: '100%', position:'absolute', top: 0, left: 0, zIndex: 10, alignItems: 'flex-start', paddingTop: 30}}>
                    <TouchableOpacity style={{alignItems: 'flex-end', backgroundColor:'lightgray', marginLeft: 30, borderRadius: 15, padding:0}}
                        onPress={()=> setImageView(false)}
                    >
                        <Icon name='close-circle' size={25} />
                    </TouchableOpacity>
                </View>

                <Swiper index={initialIndex} 
                    showsPagination
                    paginationStyle={{backgroundColor: 'pink'}}
                    renderPagination={renderPagination}
                    activeDot={<View style={{backgroundColor: ThemeDefaults.appIcon, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                    nextButton={<TText style={{color:ThemeDefaults.themeOrange, fontSize: 50, fontFamily: 'LexendDeca_SemiBold', marginRight: 5}}>›</TText>}
                    prevButton={<TText style={{color:ThemeDefaults.themeOrange, fontSize: 50, fontFamily: 'LexendDeca_SemiBold', marginRight: 5}}>‹</TText>}
                    style={{backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center',}}
                >
                    
                        {
                            workerInformation.prevWorks.map(function(image, index){
                                return(
                                    <View key={index} style={{flex:1, alignItems: 'center', justifyContent: 'center', width: WIDTH, }}>
                                        <Image source={{uri: `http://${IPAddress}:3000/images/${image}`}} style={{width: WIDTH - 50, height: HEIGHT / 2}} />
                                    </View>
                                )
                            })
                        }
                </Swiper>
            </Modal>
        }
        
        {/* Body View */}
      <ScrollView 
        refreshing 
        refreshControl={
            <RefreshControl 
                refreshing={isRefreshing}
                onRefresh={refreshFunc}
            />
        }
      >

        {/* Top container */}
        <View style={{elevation: 5, paddingTop: 0, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: '#fff'}}>
            <Appbar settingsBtn={false} onlyBackBtn={true} showLogo={true} />

            <View>
                {/* Profile Picture */}
                <View style={{alignItems: 'center', width: '100%', marginTop: 20}}>
               
                    <Image source={workerInformation.profilePic !== 'pic' ? {uri: workerInformation.profilePic} : require("../assets/images/default-profile.png")} style={styles.profilePicture} />
                        
                    {/* <Image source={ workerInformation.profilePic ? {uri: `http://${IPAddress}:3000/images/${workerInformation.profilePic}`} : require("../assets/images/bg-welcome.png")} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'black'}} /> */}
                    {/* Name and role of User */}
                    <View style={{marginTop: 18, marginBottom: 26, alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TText style={{fontSize: 18, fontFamily: 'LexendDeca_SemiBold', marginBottom: 6}}>{workerInformation.firstname} {workerInformation.lastname}</TText>
                            {
                                workerInformation.verification && <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} />
                            }
                        </View>
                        <TText>Worker</TText>
                    </View>
                    {/* Address of User */}
                    <View style={{marginHorizontal: 24, padding: 6, borderWidth: 0.5, borderColor: '#A1A1A1', borderRadius: 10, backgroundColor: '#F3F3F3', flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name={"map-marker"} size={18} />
                        <Text numberOfLines={1} style={{fontFamily: 'LexendDeca'}}>{workerInformation.street}, {workerInformation.purok}, {workerInformation.barangay}, {workerInformation.city}, {workerInformation.province} </Text>
                    </View>

                </View>
            </View>
        </View>

        {/* body */}
        <View style={{marginVertical: 25, alignItems: 'center'}}>
            
            {/* Works and Reviews Tab */}
            {
                workerInformation.role === "worker" ?
                    <View style={styles.workerViewToggleContainer}>
                        <TouchableOpacity style={[styles.workerViewToggleBtn,]}
                            onPress={() => {
                                setActiveTab('works')
                            }}
                        >
                            <TText style={[styles.toggleBtnText, {backgroundColor: activeTab === 'works' ? ThemeDefaults.themeOrange : null, color: activeTab === "works" ? '#fff' : '#000'}]}>Works</TText>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.workerViewToggleBtn,]}
                            onPress={() => {
                                setActiveTab('reviews')
                            }}
                        >
                            <TText style={[styles.toggleBtnText, {backgroundColor: activeTab === "reviews" ? ThemeDefaults.themeOrange : null, color: activeTab === "reviews" ? '#fff' : '#000'}]}>Reviews</TText>
                        </TouchableOpacity>
                    </View>
                    : null
            }

            {/* bio */}
            {
                workerInformation.role === 'worker' && activeTab === 'works' ?
                    <View style={{width: '100%', paddingHorizontal: 30}}>
                    <View style={{ marginTop: 25, marginBottom: workerInformation.role === 'worker' ? 0 : 50, padding: 18, backgroundColor: '#fff', borderRadius: 10, elevation: 2, marginHorizontal: 8,}}>
                        <TText style={{fontFamily: "LexendDeca_Medium", fontSize: 18, marginBottom: 8}}>{workerInformation.firstname}'s bio</TText>
                        <TText style={{fontSize:14}}>{workerInformation.workDescription}</TText>
                    </View>
                    </View>
                    : null
            }
            
                    {/* works offered by the worker */}
                    <View style={{marginBottom: 15, marginHorizontal: 30, width: '100%', alignItems: 'center'}}>
                        {
                            activeTab === "works" ?
                            <>
                                {
                                    workList.map(function (workItem, index) {
                                return (
                                <View key={index} style={{width: '96%', paddingHorizontal: 30,}}>
                                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, padding: 18, backgroundColor: '#fff', borderRadius: 10, borderWidth: .8, borderColor: ThemeDefaults.appIcon, elevation: 2}}>
                                        {/* <View style={{width: 50, height: 50, borderRadius: 40, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', marginRight: 18}}>
                                        </View> */}
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Icon name="briefcase" size={28} color="#0f0f0f" />
                                            <View style={{marginLeft: 10}}>
                                                <TText style={{fontFamily: "LexendDeca_Medium", fontSize: 16, }}>{workItem.ServiceSubId.ServiceSubCategory}</TText>
                                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                    <TText style={{fontSize: 12, marginRight: 20}}>Service Range: ₱{workItem.minPrice} to ₱{workItem.maxPrice}</TText>
                                                </View>
                                            </View>
                                        </View>
                                                
                                        {
                                            global.userData.role === 'recruiter' &&
                                            <View style={{}}>
                                                <TouchableOpacity style={{paddingVertical: 5, paddingHorizontal: 10, backgroundColor: ThemeDefaults.themeDarkBlue, borderRadius: 10, elevation: 4}}>
                                                    <TText style={{fontSize: 12, color: '#fff'}}>Request</TText>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                               
                                        
                                    </View>
                                </View>
                                )
                            })
                                }
                            </>
                            :
                            <View style={{marginTop: 20}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <TouchableOpacity style={styles.ratingBtn}
                                        onPress={() => {

                                        }}
                                    >
                                        <Icon name="star" size={20} color={"gold"} />
                                        <TText style={styles.ratingText}>5</TText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.ratingBtn}
                                        onPress={() => {
                                            
                                        }}
                                    >
                                        <Icon name="star" size={20} color={"gold"} />
                                        <TText style={styles.ratingText}>4</TText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.ratingBtn}
                                        onPress={() => {
                                            
                                        }}
                                    >
                                        <Icon name="star" size={20} color={"gold"} />
                                        <TText style={styles.ratingText}>3</TText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.ratingBtn}
                                        onPress={() => {
                                            
                                        }}
                                    >
                                        <Icon name="star" size={20} color={"gold"} />
                                        <TText style={styles.ratingText}>2</TText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.ratingBtn}
                                        onPress={() => {
                                            
                                        }}
                                    >
                                        <Icon name="star" size={20} color={"gold"} />
                                        <TText style={styles.ratingText}>1</TText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.ratingBtn}
                                        onPress={() => {
                                            
                                        }}
                                    >
                                        <Icon name="star" size={20} color={"gold"} />
                                        <TText style={styles.ratingText}>All</TText>
                                    </TouchableOpacity>
                                    
                                </View>
                                <TText style={{marginTop: 40, textAlign: 'center', color: 'lightgray'}}>Ratings and reviews is not yet available</TText>
                            </View>
                        }
                    </View>
            

            {/* Photo Gallery of past appointments */}
            {
                workerInformation.role === "worker" && activeTab === 'works' ?
                    <View style={{width:'100%', marginBottom: 150}}>
                        <View style={{marginHorizontal: 30, width: '100%', marginTop: 15, marginBottom: 22,}}>
                            <TText style={{fontSize: 18}}>Gallery from previous appointments</TText>
                        </View>

                        {
                            workerInformation.prevWorks.length > 0 ?
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 30, paddingLeft: 30,}}>
                                {
                                    workerInformation.role !== "recruiter" && workerInformation.prevWorks.map(function(item, index, {length}){
                                        return(
                                            <TouchableOpacity key={index} style={{ width: 220, height: 220, elevation: 4, marginRight: 20, marginRight: index + 1 === length ? 70 : 20}}
                                                onPress={() => {
                                                    setImageView(true)
                                                    setInitialIndex(index)
                                                }}
                                            >
                                                <Image source={{uri: `http://${IPAddress}:3000/images/${item}`}} style={{width: '100%', height: '100%'}} />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                            : 
                            <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
                                <TText style={{color: 'gray'}}>No available images at the moment</TText>
                            </View>
                        }
                    </View>
                    : null
            }
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default WorkerProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        paddingTop: StatusBar.currentHeight,
        // marginTop: StatusBar.currentHeight
        // justifyContent: 'center',
        // alignItems: 'center',
        zIndex: 5,
    },
    workerViewToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '85%',
        // marginTop: !workerInformation.verification ? 0 : 25,
        marginHorizontal: 30,
        // paddingVertical: 12,
        backgroundColor: '#fff',
        elevation: 3,
        borderRadius: 10,
    },
    workerViewToggleBtn: {
        padding: 10,
        // paddingHorizontal: 30
    },
    toggleBtnText: {
        paddingHorizontal: 20,
        paddingVertical: 3,
        borderRadius: 10,
        color: '#fff',
    },
    ratingBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fefefe',
        padding: 5,
        paddingHorizontal: 10,
        marginRight: 5,
        borderRadius: 15,
        minWidth: 50,
        elevation: 3
    },
    ratingText: {
        marginLeft: 3
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: "#000",
        backgroundColor: 'gray'
    }
})