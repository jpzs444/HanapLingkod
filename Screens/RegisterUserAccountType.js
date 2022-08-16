import React, {useState} from 'react'
import { useFonts } from 'expo-font';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RegisterUserAccountType() {

  const [accType, setAccType] = useState("");

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
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={{height: 30, backgroundColor: 'transparent', alignItems: 'center', alignSelf: 'flex-start'}}>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title={<Image source={require('../assets/logo/logo_icon.png')} style={{width: 60, height: 60}} />} />
      </Appbar.Header>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Type of Account</Text>
        <Text style={styles.headerDesc}>To seek or to render on-demand home services?</Text>
        <Text style={styles.headerDesc}>Choose an account that best suits your needs.</Text>
      </View>

      {/* Account Type Button */}
      <View style={styles.btnContainer}>
        <TouchableOpacity 
          style={accType === 'recruiter' ? styles.btnActive : styles.btn}
          onPress={() => {setAccType("recruiter")}}
          >
          <View style={styles.iconView}>
            <Icon name='account-search' size={80} color={"#E3492B"} />
          </View>
          <View style={styles.btnDesc}>
            <Text style={styles.userType}>Recruiter Account</Text>
            <Text style={styles.typeDesc}>For users who are searching for on-demand home services</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={accType === 'worker' ? styles.btnActive : styles.btn}
          onPress={()=>{setAccType("worker")}}
          >
          <View style={styles.iconView}>
            <Icon name='account-hard-hat' size={80} color={"#E3492B"} />
          </View>
          <View style={styles.btnDesc}>
            <Text style={styles.userType}>Worker Account</Text>
            <Text style={styles.typeDesc}>For users who offer on-demand home services</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Next Button */}
      <View style={accType ? styles.nextContainerSelected : styles.nextContainer}>
        <TouchableOpacity
          disabled={accType ? false : true} 
          style={styles.nextBtn}
          onPress={()=> { console.log(accType) }}
          >
          <Text style={styles.nextText}>Next</Text>
          <Icon name="arrow-right-thin" size={30} color='white' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'LexendDeca_Bold',
    marginBottom: 24
  },
  headerDesc: {
    fontFamily: 'LexendDeca',
    fontSize: 18,
    flexDirection: 'row'
  },
  iconView: {
    justifyContent: 'center',
    justifyContent: 'center', 
    padding: 12, 
  },
  btnContainer: {
    width: '80%',
  },
  btnDesc: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    paddingLeft: 10,
  },
  userType: {
    fontFamily: 'LexendDeca_SemiBold',
    fontSize: 20,
    marginBottom: 7
  },
  typeDesc: {
    width: '95%',
    fontFamily: 'LexendDeca',
    fontSize: 15
  },
  btn: {
    flexDirection: 'row',
    backgroundColor: '#FBF9F7',
    padding: 10,
    marginBottom: 20,
    // borderWidth: 1,
    elevation: 4,
    borderRadius: 15,
    // padding: 5
  },
  btnActive: {
    flexDirection: 'row',
    backgroundColor: '#FBF9F7',
    padding: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF803C',
    elevation: 4,
    borderRadius: 15,
    // padding: 5
  },
  nextContainer: {
    width: 150,
    backgroundColor: 'rgba(140, 131, 126, 0.2)',
    borderRadius: 30,
    marginTop: 40,
  },
  nextContainerSelected: {
    width: 150,
    backgroundColor: '#FF803C',
    borderRadius: 30,
    marginTop: 40,
    elevation: 4
  },
  nextBtn: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  nextText: {
    fontFamily: 'LexendDeca_Medium',
    fontSize: 18,
    color: '#fff',
    marginRight: 5
  }
});