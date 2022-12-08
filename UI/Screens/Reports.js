import { StyleSheet, Text, View, StatusBar, TouchableOpacity,  } from 'react-native'
import React, {useState, useEffect} from 'react'
import Appbar from '../Components/Appbar'
import TText from '../Components/TText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ThemeDefaults from '../Components/ThemeDefaults'
import DialogueModal from '../Components/DialogueModal'
import { FlashList } from '@shopify/flash-list'

const Reports = () => {

    const [viewReportItem, setViewReportItem] = useState(false)

    return (
        <View style={styles.container}>
            <Appbar onlyBackBtn={true} showLogo={true} hasPicture={true} />
            
            <Text style={styles.headerTitle}>Reports about others</Text>


            <View style={styles.body}>

                {/* <FlashList 
                    data
                /> */}
                <TouchableOpacity style={styles.reportItem}
                    activeOpacity={0.5}
                    onPress={() => {
                        console.log("view report item")
                        setViewReportItem(true)
                    }}
                >
                    <Text style={styles.reportTitle}>Title of Report</Text>
                    <Text style={styles.reportSubTitle}>You reported Juan D. Cruz for</Text>
                    <View style={styles.dateContainer}>
                        <Icon name="calendar-month" size={14} color={ThemeDefaults.themeLighterBlue} />
                        <TText style={styles.report_dateReported}>July 1, 2022</TText>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.reportItem}
                    activeOpacity={0.5}
                    onPress={() => {
                        console.log("view report item")
                        setViewReportItem(true)
                    }}
                >
                    <Text style={styles.reportTitle}>Title of Report</Text>
                    <Text style={styles.reportSubTitle}>You reported Juan D. Cruz for</Text>
                    <View style={styles.dateContainer}>
                        <Icon name="calendar-month" size={14} color={ThemeDefaults.themeLighterBlue} />
                        <TText style={styles.report_dateReported}>July 1, 2022</TText>
                    </View>
                </TouchableOpacity>
            </View>

            <DialogueModal 
                firstMessage={"Title of Report"}
                secondMessage={"You reported Juan D. Cruz for booking has been reviewed"}
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
        marginHorizontal: 30
    },
    reportItem: {
        marginBottom: 15,
        backgroundColor: "#fbfbfb",
        elevation: 4,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15
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
        alignItems: 'center'
    },
    report_dateReported: {
        fontSize: 12,
        paddingLeft: 8
    },
})