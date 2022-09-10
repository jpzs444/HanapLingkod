import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PostRequests = () => {
  return (
    <View style={styles.container}>
      <Text>PostRequests</Text>
    </View>
  )
}

export default PostRequests

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
    },
})