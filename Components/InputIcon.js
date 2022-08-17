import React from 'react'
import { StyleSheet, View, SafeAreaView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TText from './TText';

export default function InputIcon() {
  return (
    <View>
        <Icon name="account-circle" />
        <TextInput style={styles.input} 
            placeholder={"Username"}
            placeholderTextColor={"#1B233A"}
            returnKeyType={"next"}
            textContentType={'username'}
            // onChangeText={ (val) => setUser((prev) => ({...prev, username: val})) }
            onSubmitEditing={ () => ref_pw.current.focus() } />
    </View>
  )
}
