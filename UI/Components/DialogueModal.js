import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import TText from './TText'
import React from 'react'
import ThemeDefaults from './ThemeDefaults'

const DialogueModal = ({firstMessage, secondMessage, thirdMessage, visible, onAccept, onDecline, numBtn, warning}) => {
  return (
    <Modal
        transparent={true}
        animationType='fade'
        visible={visible}
        onRequestClose={() => {
            // props.handleChangeModal()
        }}
    >
        {/* Modal View */}
        <View style={[styles.modalDialogue]}>
            {/* Modal Container */}
            <View style={[styles.dialogueContainer, warning && {borderColor: ThemeDefaults.themeOrange}]}>
                {/* Modal Message/Notice */}
                <View style={[styles.dialogueMessage, {backgroundColor: warning ? ThemeDefaults.themeOrange:ThemeDefaults.themeLighterBlue}]}>
                    <TText style={[styles.dialogueMessageText, {marginBottom: secondMessage ? 20 : 0}]}>{firstMessage}</TText>
                    {
                        secondMessage &&
                        <TText style={[styles.dialogueMessageText, thirdMessage ? {fontSize: 14}:null]}>{secondMessage}</TText>
                    }
                    {
                        thirdMessage &&
                        <TText style={[styles.dialogueMessageText, {marginTop: 15, fontSize: 14}]}>{thirdMessage}</TText>
                    }
                </View>
                {/* Modal Buttons */}
                <View style={styles.modalDialogueBtnCont}>
                    {
                        numBtn == 2 ?
                        <>
                            <TouchableOpacity
                                style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                                onPress={() => { onAccept }}
                            >
                                <TText style={styles.dialogueCancel}>Yes</TText>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.dialogueBtn}
                                onPress={() => { onDecline(false) }}
                            >
                                <TText style={styles.dialogueConfirm}>No</TText>
                            </TouchableOpacity>
                        </>
                        :
                        <TouchableOpacity 
                            style={styles.dialogueBtn}
                            onPress={() => { onDecline(false) }}
                        >
                            <TText style={styles.dialogueConfirm}>Okay</TText>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default DialogueModal

const styles = StyleSheet.create({
    modalDialogue: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    dialogueContainer: {
        borderWidth: 1.5,
        borderColor: ThemeDefaults.themeLighterBlue,
        borderRadius: 15,
        overflow: 'hidden',
    },
    dialogueMessage: {
        paddingVertical: 40,
        paddingHorizontal: 50,
        backgroundColor: ThemeDefaults.themeLighterBlue,
    },
    dialogueMessageText: {
        color: ThemeDefaults.themeWhite,
        textAlign: 'center',
        fontFamily: 'LexendDeca_Medium',
    },
    modalDialogueBtnCont: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: ThemeDefaults.themeWhite,
    },
    dialogueBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    dialogueCancel: {

    },
    dialogueConfirm: {
        color: ThemeDefaults.themeDarkerOrange,
        fontFamily: 'LexendDeca_Medium',
    },
})