import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Data from '../MockData/MockData.json';

const Reservations = () => {
    return(
        <View style={styles.reservationContainer}>
            <View style={styles.reservationHeader}>
                <Text style={styles.headerText}>Address</Text>
                <Text style={styles.headerText}>Date</Text>
            </View>
            <ScrollView style={styles.pageScroll}>
                {Data['CurrentUser'].ActiveReservations.map((x) => (
                    <View key={x.id}>
                        <View style={styles.reservationRow}>
                            <Text style={styles.componentText}>{x.address}</Text>
                            <Text style={styles.componentText}>{x.date}</Text>
                        </View>
                        <View style={styles.reservationSeperator}></View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    reservationContainer: {
        marginLeft: 40,
    },
    reservationRow: {
        flexDirection: 'row',
    },
    headerText: {
        color: '#8B8B8B',
        fontSize: 24,
        marginEnd: 110,
        marginTop: 25,

    },
    componentText: {
        fontFamily: "noto-sans-semiBold",
        fontSize: 24,
        marginEnd: 50,
    },
    reservationHeader: {
        flexDirection: 'row',
    },
    reservationSeperator: {
        height: 1,
        width: 300,
        backgroundColor: 'black',
    },
    pageScroll: {
        height: 400,
    }
});

export default Reservations;