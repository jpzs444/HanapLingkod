import React from 'react';
import {
  Text,
  StyleSheet,
} from 'react-native';
import { useFonts } from 'expo-font';

export default function TText(props) {

    const [loaded] = useFonts({
        LexendDeca: require('../assets/fonts/LexendDeca-Regular.ttf'),
        LexendDeca_Medium: require('../assets/fonts/LexendDeca-Medium.ttf'),
        LexendDeca_SemiBold: require('../assets/fonts/LexendDeca-SemiBold.ttf'),
        LexendDeca_Bold: require('../assets/fonts/LexendDeca-Bold.ttf'),
        LexendDecaVar: require('../assets/fonts/LexendDeca-VariableFont_wght.ttf'),
      });
    
      if (!loaded) {
        return null;
      }

  return (
    <Text style={[styles.defaultStyle, props.style]}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  // ... add your default style here
  defaultStyle: {
    fontFamily: 'LexendDeca',
    fontSize: 16
  },
});