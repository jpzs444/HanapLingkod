import React from 'react';
import { SafeAreaView, ScrollView, View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ThemeDefaults from './ThemeDefaults';
import TText from './TText';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default function ModalDialog(props) {

    const onPressCancel = () => {
        props.changeModalVisibility(false)
        console.log("Cancel")
    }
    const onPressConfirm = () => {
        props.changeModalVisibility(false)
        props.setData(true)
    }

  return (
    <View
        style={styles.container}
    >
        <View style={[styles.modal, {width: WIDTH - 90, maxHeight: HEIGHT/1.5, paddingTop: 25 }]}>
            {/* Message */}
            {/* <TText style={[styles.text, styles.textHeader]}>Data Privacy Act Title Something</TText> */}
            <TText style={[styles.text,]}>All the details you have provided to HanapLingkod will be treated with utmost confidentiality with regards to the Data Privacy Act of 2012.</TText>
            <TText style={styles.text}>By clicking confirm, you hereby acknowledge and agree that HanapLingkod will collect and store your data. Your account will then be registered, and no further changes can be made upon registration.</TText>


            {/* Buttons */}
            {
                props.numBtn == 2 ?
                    <View style={styles.btnContainer}>
                        {/* Cancel */}
                        <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            onPressCancel()
                        }}>

                            <TText style={styles.btnText}>{props.cancelText}</TText>
                        </TouchableOpacity>
                        
                        <View style={{borderLeftWidth: 2, borderColor: ThemeDefaults.themeOrange, width: 2, height: 25, marginLeft: 1}}></View>
                        {/* Confirm */}
                        <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            onPressConfirm()
                            // console.log("confirm")
                        }}>
                            <TText style={[styles.btnText, {color: ThemeDefaults.themeOrange}]}>{props.confirmText}</TText>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.btnContainer}>
                        {/* Confirm */}
                        <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            props.changeModalDialogVisibility(false)
                            console.log("confirm")
                        }}>
                            <TText style={[styles.btnText, {color: ThemeDefaults.themeOrange}]}>Confirm</TText>
                        </TouchableOpacity>
                    </View>
            }
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: 'rgba(235, 235, 235, 0.7)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal: {
        alignItems: 'center',
        backgroundColor: '#D9672B',
        borderWidth: 2,
        borderColor: '#D9672B',
        borderRadius: 15,
        overflow: 'hidden',
    },
    textHeader: {
        marginTop: 30, fontFamily: 'LexendDeca_SemiBold', fontSize: 20
    },
    text: {
        fontFamily: 'LexendDeca_Medium',
        // fontWeight: '500',
        fontSize: 18, 
        color: ThemeDefaults.themeWhite, 
        // paddingVertical: 20, 
        paddingHorizontal: 25, 
        marginBottom: 30,
        textAlign: 'center',
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: ThemeDefaults.themeWhite,
        width: '100%',
        // padding: 10,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    btn: {
        paddingVertical: 20,
        paddingHorizontal: 40
    },
    btnText: {
        fontFamily: 'sans-serif',
        fontWeight: '700',
        fontSize: 20
    },
})
