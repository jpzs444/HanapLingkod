import React from 'react'
import {
    StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions, ScrollView
} from 'react-native';
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
    'Deep Cleaning Services', 'Bathroom Cleaning', 'Plumbing', 'Installation', 'Electrical',
    'Painting Services', 'Manicure', 'Pedicure', 'Extra', 'Unlisted (Add new subcategory)'
]

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const ModalPicker = (props) => {

    const onPressItem = (selected) => {
        props.changeModalVisibility(false)
        props.setData(selected)
    }

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
                {props.services ? optionServices : null}
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
