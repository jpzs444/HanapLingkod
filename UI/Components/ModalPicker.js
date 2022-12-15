import React, { useState, useEffect } from 'react'
import {
    StyleSheet, View, TouchableOpacity, Dimensions, ScrollView
} from 'react-native';
import { IPAddress } from '../global/global';
import ThemeDefaults from './ThemeDefaults';
import TText from './TText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native';


const SEX = ['Male', 'Female']
const BARANGAY =[
    'Alawihao', 'Awitan', 'Bagasbas', 'Barangay I (Hilahod)',
    'Barangay II (Pasig)', 'Barangay III (Iraya)', 'Barangay IV (Mantagbac)',
    'Barangay V (Pandan)', 'Barangay VI (Centro)', 'Barangay VII (Diego Liñan)',
    'Barangay VIII (Salcedo)', 'Bibirao', 'Borabod', 'Calasgasan', 'Camambugan',
    'Cobangbang', 'Dagongan', 'Gahonon', 'Gubat', 'Lag-on', 'Magang', 'Mambalite', 
    'Mancruz', 'Pamorangon', 'San Isidro'
];
const FILTER_VERIFIED = ["All", "Verified", "Unverified"]
const FILTER_RATING = ["5", "4", "3", "2", "1"]
const CONTEXT_MENU = ["View Profile", "Report User"]

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const ModalPicker = (props) => {

    const navigation = useNavigation()
    
    const [serviceList, setServiceList] = useState([]);
    const [categories, setCategories] = useState([])
    const [workList, setWorkList] = useState([])


    // sub-categories
    useEffect(() => {
        fetch("https://hanaplingkod.onrender.com/service-sub-category", {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": global.accessToken
            },
        }).then((response)=> response.json())
        .then((data) => {
            setServiceList([...data])
        }).catch((error) => console.log("error: ", error.message))
    },[])
    
    // categories
    useEffect(() => {
        fetch(`https://hanaplingkod.onrender.com/service-category`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Authorization": global.accessToken
            },
        }).then((res) => res.json())
        .then((data) => {
            console.log("categories picker: ", data)
            setCategories([...data])
        }).catch(error => {          
            console.log("error service cat: ", error)
        }) 
    },[])

    // worklist
    useEffect(() => {
        props.workerID ?
        fetch(`https://hanaplingkod.onrender.com/WorkList/${props.workerID}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                "Authorization": global.accessToken
            },
        }).then((res) => res.json())
        .then((data) => {
            setWorkList([...data])
        })
        : null
    }, [])


    const onPressItem = (selected) => {
        props.changeModalVisibility(false)
        props.setData(selected)
    }

    const onPressItemServices = (selected, index) => {
        props.changeModalVisibility(false)
        props.setData(selected)
        console.log("Selected: ", selected)
    }

    const gotoRoute = (item) => {
        if(item === "View Profile"){
            navigation.navigate("WorkerProfileDrawer", {workerID: props.userReportedID, userRole: false, otherUser: props.otherUser})
            // props.changeModalVisibility(false)
        } else if(item === "Report User"){
            navigation.navigate("ReportUserDrawer", {userReportedID: props.userReportedID, userFullName: props.userFullName, userRole: "Worker", userProfilePicture: props.userProfilePicture})
        }
        props.changeModalVisibility(false)
    }

    const workListSelection = workList.map(function(item ,index){
        return(
            <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => onPressItemServices(item, index)}
            >   
                <TText style={styles.text}>
                    {item.ServiceSubId.ServiceSubCategory}
                </TText>
            </TouchableOpacity>
        )
    })

    const serviceListOptions = serviceList.map(function(item, index) {
        return(
            <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => onPressItemServices(item, index)}
            >   
                <TText style={styles.text}>
                    {item.ServiceSubCategory}
                </TText>
            </TouchableOpacity>
        )
    })


    const option = SEX.map((item, index) => {
        return(
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <TText style={styles.text}>
                    {item}
                </TText>
            </TouchableOpacity>
        )
    })

    const optionBarangay = BARANGAY.map((item, index) => {
        return(
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <TText style={styles.text}>
                    {item}
                </TText>
            </TouchableOpacity>
        )
    })

    const optionCategory = categories.map(function(item, index) {
        // console.log(categories)
        return(
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <TText style={styles.text}>
                    {item.Category}
                </TText>
            </TouchableOpacity>
        )
    })


    const optionFilterVerified = FILTER_VERIFIED.map((item, index) => {
        return(
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <TText style={styles.text}>
                    {item}
                </TText>
            </TouchableOpacity>
        )
    })

    const optionFilterRating = FILTER_RATING.map((item, index) => {
        return(
            <TouchableOpacity
                style={[styles.option, styles.inline]}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <Icon name='star' size={22} color="gold" />
                {
                    item === "5" ? 
                    <TText style={[styles.text, styles.inlineText]}>
                        {item}
                    </TText>
                    : 
                    <TText style={[styles.text, styles.inlineText]}>
                        {item}.0 and Up
                    </TText>
                }
            </TouchableOpacity>
        )
    })

    const optionContextMenu = CONTEXT_MENU.map((item, index) => {
        return(
            <TouchableOpacity
                style={[styles.option, styles.inline]}
                key={index}
                onPress={() => gotoRoute(item)}
            >
                <TText style={styles.text}>
                    {item}
                </TText>
            </TouchableOpacity>
        )
    })


  return (
    <TouchableOpacity
        onPress={() => props.changeModalVisibility(false)}
        style={styles.container}
    >
        <View style={[styles.modal, {width: WIDTH - 80, maxHeight:  !props.sex ? HEIGHT/1.5: HEIGHT/4 }]}>
            <ScrollView>
                {props.barangay ? optionBarangay : null}
                {props.category ? optionCategory : null}
                {props.verifiedFilter ? optionFilterVerified : null}
                {props.categoryFilter ? serviceListOptions : null}
                {props.ratingFilter ? optionFilterRating : null}
                {props.services ? serviceListOptions : null}
                {props.workList ? workListSelection : null}

                {
                    props.services ? 
                        <TouchableOpacity
                            style={styles.option}
                            onPress={() => onPressItemServices("unlisted")}
                        >   
                            <TText style={styles.text}>
                                Unlisted (Add new work sub-category)
                            </TText>
                        </TouchableOpacity> 
                    : null
                }

                {props.sex ? option : null}
                {props.contextMenu ? optionContextMenu : null}
            </ScrollView>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(235, 235, 235, 0.7)',
    },
    modal: {
        backgroundColor: ThemeDefaults.themeWhite,
        borderRadius: 10,
        elevation: 5,
    },
    option: {
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray'
    },
    text: {
        margin: 20,
        fontSize: 20
    },
    inline: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingLeft: 30
    },
    inlineText: {
        padding: 0,
        marginLeft: 10
    },
})

export {ModalPicker}
