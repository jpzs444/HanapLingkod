import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import TText from './TText'
import React from 'react'

const DialogueModal = (props) => {
  return (
    <Modal
        transparent={true}
        animationType='fade'
        // visible={
        //     props.toggleModal
        // }
        onRequestClose={() => {
            // props.handleChangeModal()
        }}
    >
        {/* Modal View */}
        <View style={styles.modalDialogue}>
            {/* Modal Container */}
            <View style={styles.dialogueContainer}>
                {/* Modal Message/Notice */}
                <View style={styles.dialogueMessage}>
                    <TText style={[styles.dialogueMessageText, {marginBottom: props.secondMessage ? 20 : 0}]}>{props.firstMessage}</TText>
                    <TText style={[styles.dialogueMessageText]}>{props.secondMessage}</TText>
                </View>
                {/* Modal Buttons */}
                <View style={styles.modalDialogueBtnCont}>
                    <TouchableOpacity
                        style={[styles.dialogueBtn, {borderRightWidth: 1.2, borderColor: ThemeDefaults.themeLighterBlue}]}
                        onPress={() => {
                            // cancelRequest(requestItem._id)
                            // setViewCancelModal(false)
                            // props.handleModalChange()
                        }}
                    >
                        <TText style={styles.dialogueCancel}>Yes</TText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.dialogueBtn}
                        onPress={() => {
                            // setViewCancelModal(false)

                            // props.handleModalChange()
                        }}
                    >
                        <TText style={styles.dialogueConfirm}>No</TText>
                    </TouchableOpacity>
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