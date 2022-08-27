import React, { useState, useEffect } from 'react'
import {
    StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions, ScrollView
} from 'react-native';
import { IPAddress } from '../global/global';
import ThemeDefaults from './ThemeDefaults';
import TText from './TText';

const SEX = ['Male', 'Female']
const BARANGAY =[
    'Alawihao', 'Awitan', 'Bagasbas', 'Barangay I (Hilahod)',
    'Barangay II (Pasig)', 'Barangay III (Iraya)', 'Barangay IV (Mantagbac)',
    'Barangay V (Pandan)', 'Barangay VI (Centro)', 'Barangay VII (Diego Liñan)',
    'Barangay VIII (Salcedo)', 'Bibirao', 'Borabod', 'Calasgasan', 'Camambugan',
    'Cobangbang', 'Dagongan', 'Gahonon', 'Gubat', 'Lag-on', 'Magang', 'Mambalite', 
    'Mancruz', 'Pamorangon', 'San Isidro'
];

const SERVICES = [
    {display_category: 'Unlisted (Add new subcategory)', sub_category: 'unlisted'}
]

const CLEANING = [
    {category: "Cleaning", sub_category: "Deep Cleaning Services"}, 
    {category: "Cleaning", sub_category: "Bathroom Cleaning"},
    {category: "Cleaning", sub_category: "Carpet Cleaning"},
    {category: "Cleaning", sub_category: "Disinfection Cleaning"},
    {category: "Cleaning", sub_category: "Aircon Cleaning"},
]
const PLUMBING = [
    {category: "Plumbing", sub_category: "Plumbing Installation"}, 
    {category: "Plumbing", sub_category: "Plumbing Repair"}, 
    {category: "Plumbing", sub_category: "Faucet Installation"}, 
    {category: "Plumbing", sub_category: "Bidet Installation"}, 
    {category: "Plumbing", sub_category: "Pipe Cleaning"},
    {category: "Plumbing", sub_category: "Water Heater Installation"}
]
const INSTALLATION = [
    {category: "Installation", sub_category: "Aircon Mounting"}, 
    {category: "Installation", sub_category: "TV Mount Installation"}, 
    {category: "Installation", sub_category: "CCTV Installation"}
]
const BODY_SERVICE = [
    {category: "Body Service", sub_category: "Haircut"},
    {category: "Body Service", sub_category: "Manicure"},
    {category: "Body Service", sub_category: "Pedicure"},
    {category: "Body Service", sub_category: "Waxing"},
    {category: "Body Service", sub_category: "Massage"},
]

const ELECTRICAL = [
    {category: "Electrical", sub_category: "Aircon Repair"},
    {category: "Electrical", sub_category: "Lighting Repair"},
    {category: "Electrical", sub_category: "Lignting Installation"},
    {category: "Electrical", sub_category: "Outlet Installation/Repair"},
    {category: "Electrical", sub_category: "Electric fan Repair"},
]

let servicesList = []

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const ModalPicker = (props) => {
    
    const [serviceList, setServiceList] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    // const sL = serviceList.values()

    useEffect(() => {
        setIsLoading(true)
        fetch("http://"+ IPAddress +":3000/service-sub-category", {
            method: "GET",
            headers: {
                "content-type": "application/json",
              },
        }).then((response)=> response.json())
        .then((res) => {
            console.log("response effect: ", res)
            setServiceList([...res])

        }).catch((error) => console.log("error: ", error.message))
        setIsLoading(false)
    }, [])

    const onPressItem = (selected) => {
        props.changeModalVisibility(false)
        props.setData(selected)
    }

    const onPressItemServices = (selected, index) => {
        props.changeModalVisibility(false)
        props.setData(selected)
    }

    const serviceListOptions = serviceList.map(function(item, index) {
        
        return(
            item.ServiceID.Category !== "unlisted" ?
            <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => onPressItemServices(item, index)}
            >   
                <TText style={styles.text}>
                    {item.ServiceSubCategory}
                </TText>
            </TouchableOpacity>
            : null
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

    const optionServices = SERVICES.map((item, index) => {
        return(
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <TText style={styles.text}>
                    {item.display_category}
                </TText>
            </TouchableOpacity>
        )
    })

    const optionCleaningServices = CLEANING.map((item, index) => {
        return(
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <TText style={styles.text}>
                    {item.sub_category}
                </TText>
            </TouchableOpacity>
        )
    })

    const optionElectricalServices = ELECTRICAL.map((item, index) => {
        return(
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <TText style={styles.text}>
                    {item.sub_category}
                </TText>
            </TouchableOpacity>
        )
    })

    const optionPlumbingServices = PLUMBING.map((item, index) => {
        return(
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <TText style={styles.text}>
                    {item.sub_category}
                </TText>
            </TouchableOpacity>
        )
    })

    const optionInstallationServices = INSTALLATION.map((item, index) => {
        return(
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <TText style={styles.text}>
                    {item.sub_category}
                </TText>
            </TouchableOpacity>
        )
    })

    const optionBodyServices = BODY_SERVICE.map((item, index) => {
        return(
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <TText style={styles.text}>
                    {item.sub_category}
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
                
                {/* {props.services ? optionServices : null} */}
                {/* {props.services ? optionCleaningServices : null}
                {props.services ? optionInstallationServices : null}
                {props.services ? optionElectricalServices : null}
                {props.services ? optionPlumbingServices : null}
                {props.services ? optionBodyServices : null}
                {props.services ? optionServices : null} */}
                {props.services ? serviceListOptions : null}
                {props.services && !isLoading ? optionServices : null}
                

                {props.sex ? option : null}
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
})

export {ModalPicker}
