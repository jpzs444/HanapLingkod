import { StyleSheet, Text, View, Image, Dimensions, StatusBar } from 'react-native'
import React from 'react'
import Appbar from './Appbar'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const ViewImage = (props) => {
  return (
    <View style={{flex: 1, zIndex: 10, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)', paddingTop: StatusBar.currentHeight }}>
        <Appbar backBtn={true} light={true} showLogo={false} photo={true} />

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: WIDTH}}>
            <Image resizeMode='contain' source={{uri: props.route.params.imageUrl}} style={{ width: '100%', height: HEIGHT}} />
        </View>
    </View>
  )
}

export default ViewImage

const styles = StyleSheet.create({})