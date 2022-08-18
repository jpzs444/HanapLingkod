import React from 'react'
import {
    StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions, ScrollView
} from 'react-native';
import ThemeDefaults from './ThemeDefaults';
import TText from './TText';

const OPTIONS = ['Male', 'Female']
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const ModalPicker = (props) => {

    const onPressItem = (option) => {
        props.changeModalVisibility(false)
        props.setData(option)
    }

    const option = OPTIONS.map((item, index) => {
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
        <View style={[styles.modal, {width: WIDTH - 80, maxHeight: HEIGHT/4 }]}>
            <ScrollView>
                {option}
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
