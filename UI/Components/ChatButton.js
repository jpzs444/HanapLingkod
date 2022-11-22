import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import ThemeDefaults from './ThemeDefaults'

const ChatButton = ({status}) => {
  return (
    <TouchableOpacity 
        style={{
            backgroundColor: ThemeDefaults.themeOrange, 
            borderRadius: 20, 
            padding: 8, 
            elevation: 4, 
            position: 'absolute', 
            right: 15, 
            top: status !== '1' ? 50 : 15, 
            zIndex: 5
        }}
        activeOpacity={0.5}
        onPress={() => {
            console.log("HI")
        }}
    >
        <Image source={require('../assets/icons/chat-bubble.png')} style={{width: 25, height: 25,}} />
    </TouchableOpacity>
  )
}

export default ChatButton

const styles = StyleSheet.create({})