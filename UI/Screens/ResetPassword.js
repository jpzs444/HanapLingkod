import { StyleSheet, Text, View, StatusBar, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, {useState, useRef} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import { IPAddress } from '../global/global'
import { useNavigation } from '@react-navigation/native'


const ResetPassword = ({route}) => {

    const {token} = route.params

    const navigation = useNavigation()

    const [hidden, setHidden] = useState(true)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [pwMatch, setPWMatch] = useState(true)

    const confirmRef = useRef()



    const handleSubmitResetPassword = async () => {
        console.log("Submit New Password")
        try {
            await fetch(`https://hanaplingkod.onrender.com/changePassword`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    password: confirmPassword
                })
            }).then(res => res.json())
            .then(data => {
                // console.log("fetch message: ", data)
                console.log("reset password success!")
                navigation.popToTop()
            })
        } catch (error) {
            console.log("error reset password: ", error)
        }
    }

    return (
        <View style={styles.container}>
            <Appbar onlyBackBtn={true} showLogo={true} />

            <View style={styles.body}>
                <TText style={styles.header}>Reset Password</TText>
                <TText style={styles.sub_header}>Enter a new password and sign in</TText>

                {/* new password */}
                <View style={styles.section}>
                    <TText style={styles.ressetHeader}>New Password</TText>

                    <View style={[styles.textInputContainer, styles.flexRow]}>
                        <View style={styles.flexRow}>
                            {/* <Icon name='lock' size={18} color={'#1B233A'} /> */}
                            <TextInput 
                                autoCapitalize='none'
                                value={newPassword ? newPassword : ""}
                                placeholder='New Password'
                                placeholderTextColor={"rgba(0, 0, 0, 0.35)"}
                                secureTextEntry={hidden}
                                textContentType='password'
                                returnKeyType='next'
                                onChangeText={val => {
                                    setNewPassword(val)
                                    if(confirmPassword){
                                        setPWMatch(val === confirmPassword)
                                    }
                                }}
                                onSubmitEditing={() => confirmRef.current.focus()}
                                style={styles.textInput}
                            />
                        </View>
                        <Icon 
                            name= { hidden ? 'eye-off' : 'eye' }
                            size={18} color={'#a3a096'}
                            onPress={ () => setHidden(!hidden) }
                        />
                    </View>
                    {
                        newPassword.length < 8 &&
                        <TText style={styles.passwordInstruction}>Password must be 8 characters long</TText>
                    }
                </View>

                {/* confirm password */}
                <View style={styles.section}>
                    <TText style={styles.ressetHeader}>Confirm Password</TText>

                    <View style={[styles.textInputContainer, styles.flexRow]}>
                        <View style={styles.flexRow}>
                            {/* <Icon name='lock' size={18} color={'#1B233A'} /> */}
                            <TextInput 
                                autoCapitalize='none'
                                value={confirmPassword ? confirmPassword : ""}
                                placeholder='Confirm Password'
                                placeholderTextColor={"rgba(0, 0, 0, 0.35)"}
                                secureTextEntry={hidden}
                                textContentType='password'
                                onChangeText={val => {
                                    setConfirmPassword(val)
                                    if(newPassword){
                                        setPWMatch(newPassword === val)
                                    }
                                }}
                                style={styles.textInput}
                                ref={confirmRef}
                                returnKeyType={"go"}
                            />
                        </View>
                        <Icon 
                            name= { hidden ? 'eye-off' : 'eye' }
                            size={18} color={'#a3a096'}
                            onPress={ () => setHidden(!hidden) }
                        />
                    </View>
                    {
                        pwMatch ? null :
                        <TText style={[styles.passwordInstruction, {color: ThemeDefaults.themeRed}]}>Password does not match. Try again</TText>
                    }
                </View>



            </View>
            
            {/* confirm reset password button */}
            <TouchableOpacity style={[styles.confirmResetBtn, (!(newPassword.length > 7) || !(newPassword === confirmPassword)) && {backgroundColor: '#ccc', elevation: 0} ]}
                activeOpacity={0.5}
                disabled={!(newPassword.length > 7) || !(newPassword === confirmPassword)}
                onPress={() => {
                    handleSubmitResetPassword()
                }}
            >
                <TText style={styles.btnText}>Reset Password</TText>
            </TouchableOpacity>
        </View>
    )
}

export default ResetPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    body: {
        marginTop: 20
    },
    header: {
        textAlign: 'center',
        fontFamily: 'LexendDeca_Medium',
        fontSize: 18,
        marginBottom: 20
    },
    sub_header: {
        textAlign: 'center',
        marginBottom: 30
    },
    section: {
        marginTop: 40,
        marginHorizontal: 30,
    },
    ressetHeader: {
        fontSize: 16,
        marginBottom: 10
    },
    textInputContainer: {
        borderWidth: 1,
        borderColor: '#bbb',
        justifyContent: 'space-between',
        marginBottom: 3,
        paddingLeft: 10,
        paddingRight: 15,
        borderRadius: 8
    },
    textInput: {
        padding: 5,
        paddingLeft: 10,
        width : '70%',
        fontFamily: "LexendDeca",
        fontSize: 16
    },
    passwordInstruction: {
        fontSize: 14,
        color: 'gray'
    },
    confirmResetBtn: {
        marginHorizontal: 50,
        backgroundColor: ThemeDefaults.themeOrange,
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
        // marginTop: 100,
        elevation: 3,

        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0
    },
    btnText: {
        fontFamily: 'LexendDeca_SemiBold',
        fontSize: 18,
        color: ThemeDefaults.themeWhite
    },
})