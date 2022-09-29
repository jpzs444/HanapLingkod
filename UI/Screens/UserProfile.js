import { StyleSheet, Image, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Modal, StatusBar } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemeDefaults from '../Components/ThemeDefaults';
import { IPAddress } from '../global/global';
import ViewImage from '../Components/ViewImage';
import { useNavigation } from '@react-navigation/native';

// import * as pp from '../../Server/Public/Uploads'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const UserProfile = ({route}) => {

    // const {profile_id} = route.params;
    // console.log(pp.global.userData.profilePic)
    console.log(global.userData._id)

    const navigation = useNavigation()

    const [workList, setWorkList] = useState([])
    const [activeTab, setActiveTab] = useState('works')
    const [rerender, setRerender] = useState(false)

    let workerID = global.userData._id
    // console.log(global.userData.profilePic)
    // let iii = "../../Server/Public/Uploads/"
    // let uu = iii.concat('', global.userData.profilePic)
    // let sourceImage = require(''.concat(iii, global.userData.profilePic))
    // let profilePicSource = require(sourceImage)
    // console.log(global.userData._id)


    useEffect(() => {
        let workerRoute = "http://" + IPAddress + ":3000/Worker/" + global.userData._id
        let route = global.userData.role === "worker" ? "http://" + IPAddress + ":3000/Worker/" + global.userData._id : "http://" + IPAddress + ":3000/Recruiter/" + global.userData._id
        fetch("http://" + IPAddress + ":3000/Worker/" + global.userData._id, {
            method: "GET",
            header: {
                "conten-type": "application/json"
            },
        }).then((res) => res.json())
        .then((user) => {
            // console.log("user new load: ", user)
            global.userData = user
        })
        .catch((error) => console.log(error.message))
        setRerender(!rerender)
    }, [])

    // fetch data if role of user is worker
    useEffect(() => {
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

    }, [])

    const viewImage = () => {
        return(
            <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9', zIndex: 10, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                <View>
                    <Image source={require("../assets/images/bg-welcome.png")} style={{width: '100%', height: '100%'}} resizeMode="contain" />
                </View>
            </View>
        )
    }
    
    const imagestock = "happy-easter-concept-preparation-holiday-600w-2140482091.jpg"

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Top container */}
        <View style={{elevation: 5, paddingTop: 0, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: '#fff'}}>
            <Appbar settingsBtn={true} userProfile={true} showLogo={true} />

            <View>
                {/* Profile Picture */}
                <View style={{alignItems: 'center', width: '100%', marginTop: 20}}>
                    <Image source={ global.userData.profilePic ?  {uri: "https://scontent.fceb2-2.fna.fbcdn.net/v/t39.30808-6/298825458_7726452997429494_7928239349716663798_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=hP4U0j9HpdoAX-Lp4OI&_nc_ht=scontent.fceb2-2.fna&oh=00_AT-t6cv81R8U8CRapXx98dz77XF0QqL7UszBi_UYcvjljg&oe=6335DFC0" } : require("../assets/images/bg-welcome.png")} style={{width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'black'}} />
                    {/* Name and role of User */}
                    <View style={{marginTop: 18, marginBottom: 26, alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TText style={{fontSize: 18, fontFamily: 'LexendDeca_SemiBold', marginBottom: 6}}>{global.userData.firstname} {global.userData.lastname}</TText>
                            {
                                global.userData.verification && <Icon name="check-decagram" color={ThemeDefaults.appIcon} size={20} style={{marginLeft: 5}} />
                            }
                        </View>
                        <TText>{global.userData.role.charAt(0).toUpperCase() + global.userData.role.slice(1)}</TText>
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

                                {/* <View key={index}>
                                    <View style={{marginTop: 15, padding: 18, backgroundColor: '#fff', borderRadius: 10, borderWidth: .8, borderColor: ThemeDefaults.appIcon, elevation: 2}}>
                                        <TText style={{fontFamily: "LexendDeca_Medium", fontSize: 18, marginBottom: 8}}>{workItem.ServiceSubId.ServiceSubCategory}</TText>
                                        <TText style={{fontSize:14}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</TText>
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8}}>
                                            <TText>Minimum Price: {workItem.minPrice}</TText>
                                            <TText>Max Price: {workItem.maxPrice}</TText>
                                        </View>
                                    </View>
                                </View> */}
            

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

            
                {/* global.userData.role === 'worker' ? 
                    <View style={{width: '96%', marginBottom: 50, marginHorizontal: 30,}}>
                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 15, padding: 18, backgroundColor: ThemeDefaults.themeOrange, borderRadius: 10, borderWidth: .8, borderColor: ThemeDefaults.appIcon, elevation: 2}}>
                            <View style={{width: 50, height: 50, borderRadius: 40, backgroundColor: ThemeDefaults.themeDarkBlue, alignItems: 'center', justifyContent: 'center', marginRight: 18}}>
                                <Icon name="image" size={30} color="#fff" />
                            </View>
                            <View>
                                <TText style={{fontFamily: "LexendDeca_Medium", textAlign: 'center', color: '#fff'}}>Add Photos from previous appointments</TText>
                            </View>

                        </View>
                    </View>
                    : null */}
            

                    {/* Photo Gallery of past appointments */}
            {
                global.userData.role === "worker" && activeTab === 'works' ?
                    <View style={{width:'100%',}}>
                        <View style={{marginHorizontal: 30, width: '100%', marginTop: 15, marginBottom: 22,}}>
                            <TText style={{fontSize: 18}}>Gallery from previous appointments</TText>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 30, paddingLeft: 30, }}>
                            <TouchableOpacity onPress={() => (
                                navigation.navigate("ViewImageScreen", {imageUrl: require("../assets/images/bg-welcome.png")})
                                
                            )} style={{ width: 200, height: 200, padding: 4, elevation: 4, backgroundColor: '#929292', marginRight: 20, borderWidth: 0.8, borderColor: '#000'}}>
                                <Image source={require("../assets/images/bg-welcome.png")} style={{width: '100%', height: '100%',}} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => viewImage} style={{ width: 200, height: 200, padding: 4, elevation: 4, backgroundColor: '#929292', marginRight: 20, borderWidth: 0.8, borderColor: '#000'}}>
                                <Image source={require("../assets/images/bg-welcome.png")} style={{width: '100%', height: '100%',}} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => viewImage()} style={{ width: 200, height: 200, padding: 4, elevation: 4, backgroundColor: '#929292', marginRight: 20, borderWidth: 0.8, borderColor: '#000', marginRight: 70}}>
                                <Image source={require("../assets/images/bg-welcome.png")} style={{width: '100%', height: '100%',}} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    : null
            }


            {/* Ratings and Reviews/Feedbacks */}
            {
                global.userData.role === 'recruiter' ?
                    <TText style={{color:'lightgray'}}>Ratings and Reviews will be available soon</TText>
                    : null
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
        marginTop: !global.userData.verification ? 0 : 25,
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
})