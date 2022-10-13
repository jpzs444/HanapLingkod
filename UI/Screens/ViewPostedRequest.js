import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ViewPostedRequest = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>ViewPostedRequest</Text>
    </View>
  )
}

export default ViewPostedRequest

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})