import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Messaging = () => {
  return (
    <View style={styles.container}>
      <Text>Messaging</Text>
    </View>
  )
}

export default Messaging

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    },
})