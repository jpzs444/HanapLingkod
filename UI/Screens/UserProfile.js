import { StyleSheet, Image, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Modal, StatusBar, RefreshControl } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeDefaults from '../Components/ThemeDefaults';
import { IPAddress } from '../global/global';
import ViewImage from '../Components/ViewImage';
import { useNavigation } from '@react-navigation/native';

import ImageView from "react-native-image-viewing";
import Swiper from 'react-native-swiper'
import { FlashList } from '@shopify/flash-list';
import RatingFeedbackCard from '../Components/RatingFeedbackCard';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const UserProfile = ({route}) => {

    // const {profile_id} = route.params;
    // console.log(pp.global.userData.profilePic)
    // console.log(global.userData._id)

    const navigation = useNavigation()
    const isFocused = navigation.isFocused();

    const [workList, setWorkList] = useState([])
    const [userRatings, setUserRatings] = useState([])
    const [ratingFilter, setRatingFilter] = useState("All")
    const [page, setPage] = useState(1)

    const [activeTab, setActiveTab] = useState('works')
    const [rerender, setRerender] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [imageView, setImageView] = useState(false)
    const [initialIndex, setInitialIndex] = useState(0)
    let imageList = []


    let workerID = global.userData._id

    useEffect(() => {
        let userType = global.userData.role === 'recruiter'? "RecruiterComment":"WorkerComment"
        handleFetchUserRatings(userType)
        navigation.addListener("focus", () => {
            getUpdatedUserData()
            refreshFunc()
        })
    }, [])
    
    // fetch data if role of user is worker
    useEffect(() => {
        getUpdatedWorkList()
    }, [])

    const getUpdatedUserData = () => {
        let userRoute = global.userData.role === "recruiter" ? "Recruiter/" : "Worker/"

        fetch("http://" + IPAddress + ":3000/" + userRoute + global.userData._id, {
            method: "GET",
            header: {
                "conten-type": "application/json"
            },
        }).then((res) => res.json())
        .then((user) => {
            // console.log("user new load: ", route)
            global.userData = user

            // let imageList = []
            for(let i = 0; i < user.prevWorks.length; i++){
                imageList.push("http://" + IPAddress + ":3000/images/" + user.prevWorks[i])
            }
            // console.log("imagelist: ", imageList)
        })
        .catch((error) => console.log(error.message))
    }

    const getUpdatedWorkList = () => {
        setWorkList([])
        fetch("http://" + IPAddress + ":3000/WorkList/" + global.userData._id, {
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

    const handleFetchUserRatings = async (user) => {
        try {
            await fetch(`http://${IPAddress}:3000/${user}/${global.userData._id}?page=${page}`,{
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                }
            }).then(res => res.json())
            .then(data => {
                console.log("user rating: ", data)
                setUserRatings([...data.comments])
            })
        } catch (error) {
            console.log("Error fetch user(self) rating: ", error)
        }
    }

    const RatingFilterButton = ({label}) => {
        return(
            <TouchableOpacity style={[styles.ratingBtn, label === ratingFilter && {borderColor: 'red', borderWidth: 1.3}]}
                onPress={() => {
                    setRatingFilter(label)
                }}
            >
                <Icon name="star" size={20} color={"gold"} />
                <TText style={styles.ratingText}>{label}</TText>
            </TouchableOpacity>
        )
    }

    const RatingFilter = () => {
        return(
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RatingFilterButton label={"All"} />
                <RatingFilterButton label={"5"} />
                <RatingFilterButton label={"4"} />
                <RatingFilterButton label={"3"} />
                <RatingFilterButton label={"2"} />
                <RatingFilterButton label={"1"} />
            </View>
        )
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

        {
            global.userData.role === 'worker' ? 
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
                    (global.userData).hasOwnProperty('prevWorks') && global.userData.prevWorks.map(function(image, index){
                        return(
                            <View key={index} style={{flex:1, alignItems: 'center', justifyContent: 'center', width: WIDTH, }}>
                                <Image source={{uri: `http://${IPAddress}:3000/images/${image}`}} style={{width: WIDTH - 50, height: HEIGHT / 2}} />
                            </View>
                        )
                    })
                }
            </Swiper>
        </Modal> : null
        }
        
      <ScrollView 
        refreshing 
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshFunc} />}
      >

        {/* Top container */}
        <View style={{elevation: 5, paddingTop: 0, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: '#fff'}}>
            <Appbar settingsBtn={true} hasPicture={false} userProfile={true} showLogo={true} />

            <View>
                {/* Profile Picture */}
                <View style={{alignItems: 'center', width: '100%', marginTop: 20}}>
               
                    <Image source={global.userData.profilePic !== 'pic' ? {uri: global.userData.profilePic} : require("../assets/images/default-profile.png")} style={styles.profilePicture} />
                        
                    {/* <Image source={ global.userData.profilePic ? {uri: `http://${IPAddress}:3000/images/${global.userData.profilePic}`} : require("../assets/images/bg-welcome.png")} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'black'}} /> */}
                    {/* Name and role of User */}
                    <View style={{marginTop: 18, marginBottom: 26, alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TText style={{fontSize: 18, fontFamily: 'LexendDeca_SemiBold', marginBottom: 6}}>{global.userData.firstname} {global.userData.lastname}</TText>
                            {
                                global.userData.verification ? <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} /> : null
                            }
                        </View>
                        <TText>
                            {
                                global.userData.role === 'recruiter' ? "Recruiter": "Worker"
                            }
                        </TText>
                    </View>
                    {/* Address of User */}
                    <View style={{marginHorizontal: 24, padding: 6, borderWidth: 0.5, borderColor: '#A1A1A1', borderRadius: 10, backgroundColor: '#F3F3F3', flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name={"map-marker"} size={18} />
                        <Text numberOfLines={1} style={{fontFamily: 'LexendDeca'}}>{global.userData.street}, {global.userData.purok}, {global.userData.barangay}, {global.userData.city}, {global.userData.province} </Text>
                    </View>

                </View>
            </View>
        </View>

        {/* body */}
        <View style={{marginVertical: 25, alignItems: 'center'}}>
            
            {
                !global.userData.verification ? 
                    <View style={{marginHorizontal: 30, padding: 10, elevation: 3, borderColor: '#fff', borderRadius: 10, backgroundColor: ThemeDefaults.themeBlue, alignItems: 'center', marginBottom: 25}}>
                        <TText style={{textAlign: 'center', color: '#fff'}}>This account will be verified by HanapLingkod for 1-3 business days </TText>
                    </View>
                : null
            }

            {/* Works and Reviews Tab */}
            {
                global.userData.role === "worker" ?
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
                global.userData.role === 'worker' && activeTab === 'works' ?
                    <View style={{width: '100%', paddingHorizontal: 30}}>
                        <View style={{ marginTop: 25, marginBottom: global.userData.role === 'worker' ? 0 : 50, padding: 18, backgroundColor: '#fff', borderRadius: 10, elevation: 2, marginHorizontal: 8,}}>
                            <TText style={{fontFamily: "LexendDeca_Medium", fontSize: 18, marginBottom: 8}}>{global.userData.firstname}'s bio</TText>
                            <TText style={{fontSize:14}}>{global.userData.workDescription}</TText>
                        </View>
                    </View>
                    : null
            }
            
                    {/* works offered by the worker */}
                    <View style={{marginBottom: 15, marginHorizontal: 40, width: '100%', alignItems: 'center', }}>
                        {
                            activeTab === "works" && global.userData.role === 'worker' ?
                            <>
                                {
                                    workList.map(function (workItem, index) {
                                        return (
                                            <View key={index} style={{width: '100%', paddingHorizontal: 40,}}>
                                                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, padding: 18, backgroundColor: '#fff', borderRadius: 10, borderWidth: .8, borderColor: ThemeDefaults.appIcon, elevation: 2}}>
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
                                                        global.userData.role === 'recruiter' ?
                                                            <TouchableOpacity style={{paddingVertical: 5, paddingHorizontal: 10, backgroundColor: ThemeDefaults.themeDarkBlue, borderRadius: 10, elevation: 4}}>
                                                                <TText style={{fontSize: 12, color: '#fff'}}>Request</TText>
                                                            </TouchableOpacity>
                                                            : null
                                                    }
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                <View style={styles.viewScheduleContainer}>
                                    <TouchableOpacity style={styles.viewScheduleBtn}
                                        onPress={() => navigation.navigate("CalendarViewUserStack")}
                                    >
                                        <TText style={styles.viewScheduleText}>View Schedule</TText>
                                    </TouchableOpacity>
                                </View>
                            </>
                            :
                            <View style={{marginTop: global.userData.role === 'recruiter' ? 0 : 20, width:'88%', paddingHorizontal: 10,}}>
                                {/* <RatingFilter /> */}
                                    {
                                        global.userData.role === 'worker' && <RatingFilter />
                                    }

                                {/* List of ratings */}
                                <View style={{ width: '100%', flexGrow: 1, backgroundColor: '#f1f1f1', marginTop: 30, padding: 10, paddingBottom: 20, borderRadius: 10, elevation: 3}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
                                        <TText>Reviews</TText>
                                        <View style={{width: 25, height: 25, borderRadius: 15, backgroundColor: '#d7d7d7', alignItems: 'center', marginHorizontal: 15}}>
                                            <TText style={{fontSize: 15}}>{userRatings.length.toString()}</TText>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Icon name="star" size={20} color={'gold'} />
                                            <TText style={{marginLeft: 5}}>{global.userData.rating}</TText>
                                        </View>
                                    </View>

                                    {/* Rating Filter */}
                                        {
                                            global.userData.role === 'recruiter' &&
                                            <View style={{marginVertical: 10}}>
                                                <RatingFilter />
                                            </View>
                                        }
                                    <RatingFeedbackCard item={userRatings} fromProfile={true} />
                                </View>
                            </View>
                        }
                    </View>
            

            {/* Photo Gallery of past appointments */}
            {
                global.userData.role === "worker" && activeTab === 'works' &&
                    <View style={{width:'100%',}}>
                        <View style={{marginHorizontal: 30, width: '100%', marginTop: 15, marginBottom: 22,}}>
                            <TText style={{fontSize: 18}}>Gallery from previous appointments</TText>
                        </View>

                        {
                            global.userData.hasOwnProperty("prevWorks") && 
                            <View style={{alignItems: 'center'}}>
                                <TText style={{color: '#ccc'}}>Pictures of previous works are not available</TText>
                            </View>
                        }

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 30, paddingLeft: 30,}}>
                            {
                                global.userData.role !== "recruiter" && global.userData.hasOwnProperty("prevWorks") && global.userData.prevWorks.map(function(item, index, {length}){
                                    return(
                                        <TouchableOpacity key={index} style={{ width: 220, height: 220, elevation: 4, marginRight: 20, marginRight: index + 1 === length ? 70 : 20}}
                                            onPress={() => {
                                                setImageView(true)
                                                setInitialIndex(index)
                                            }}
                                        >
                                            <Image source={{uri: item}} style={{width: '100%', height: '100%'}} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
            }

        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default UserProfile

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
        marginTop: 25,
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
        backgroundColor: '#999'
    },
    viewScheduleContainer: {
        marginTop: 15,
        width: '100%',
        paddingHorizontal: 40
    },
    viewScheduleBtn: {
        backgroundColor: ThemeDefaults.themeDarkBlue,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        elevation: 4
    },
    viewScheduleText: {
        fontSize: 18,
        color: ThemeDefaults.themeWhite
    },
})