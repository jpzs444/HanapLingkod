import { StyleSheet, Text, View, StatusBar, TouchableOpacity,  } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import DialogueModal from '../Components/DialogueModal'
import { FlashList } from '@shopify/flash-list'

import dayjs from 'dayjs'
import { useNavigation, useIsFocused } from '@react-navigation/native'

const Reports = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const [viewReportItem, setViewReportItem] = useState(false)
    const [reports, setReports] = useState([])
    const [viewReportItemMessage, setViewReportItemMessage] = useState([])

    useEffect(() => {
        handleFetchUserReports()
    }, [isFocused]);

    const handleFetchUserReports = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/yourReports/${global.userData._id}`, {
                method: "GET",
                headers: {
                    'content-type': "application/json",
                    "Authorization": global.accessToken
                }
            }).then(res => res.json())
            .then(data => {
                setReports([...data])
                console.log("user reports: ", data)
            })
        } catch (error) {
            console.log("error fetch user submitted reports: ", error)
        }
    }

    return (
        <View style={styles.container}>
            <Appbar menuBtn={true} showLogo={true} hasPicture={true} />
            
            <Text style={styles.headerTitle}>Reports about others</Text>


            <View style={styles.body}>

                <FlashList 
                    data={reports}
                    keyExtractor={item => item._id}
                    estimatedItemSize={80}
                    ListEmptyComponent={() => (<View style={{marginTop: 50, alignItems: 'center'}}><TText style={{color: '#ccc', fontSize: 14}}>No reports available</TText></View>)}
                    renderItem={({item}) => (
                        <TouchableOpacity style={styles.reportItem}
                            activeOpacity={0.5}
                            onPress={() => {
                                console.log("view report item")
                                setViewReportItem(true)
                                setViewReportItemMessage(item.description)
                            }}
                        >
                            <Text style={styles.reportTitle}>{item.title}</Text>
                            <Text style={styles.reportSubTitle}>{item.description}</Text>
                            <View style={styles.dateContainer}>
                                <Icon name="calendar-month" size={14} color={ThemeDefaults.themeLighterBlue} />
                                <TText style={styles.report_dateReported}>{dayjs(item.created_at).format("MMM DD, YYYY")}</TText>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <DialogueModal 
                firstMessage={"Title of Report"}
                secondMessage={viewReportItemMessage}
                numBtn={1}
                visible={viewReportItem}
                onDecline={setViewReportItem}
            />

        </View>
    )
}

export default Reports

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        backgroundColor: ThemeDefaults.themeWhite,
        flexGrow: 1
    },
    headerTitle: {
        marginTop: 20,
        marginBottom: 30,
        fontFamily: "LexendDeca_Medium",
        fontSize: 18,
        textAlign: 'center'
    },
    body: {
        flexGrow: 1,
        width: '100%',
    },
    reportItem: {
        marginBottom: 15,
        backgroundColor: "#f6f6f6",
        elevation: 4,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 30,
    },
    reportTitle: {
        fontSize: 17,
        fontFamily: "LexendDeca_Medium"
    },
    reportSubTitle: {
        fontSize: 13,
        fontFamily: "LexendDeca"
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    report_dateReported: {
        fontSize: 12,
        paddingLeft: 8
    },
})