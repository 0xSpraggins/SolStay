import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSolanaWalletState } from "../Context/SolanaWallet";
import LoadingScreen from "./LoadingScreen";

//TODO: Align the Dates with the Date title
//TODO: Cutoff overflow Address Text
const Reservations = () => {
    const {account} = useSolanaWalletState();
    const [fetchedData, setFetchedData] = useState<any[]>();

    useEffect(() => {
        axios.get('http://localhost:3003/reservations/:renterId', {
            params: {
                pubkey: account?.publicKey.toString(),
                date: new Date().toLocaleDateString(),
            }
        }).then((response) => {
            console.log(response);
            const data = (response.data);
            setFetchedData(data);
        })
    },[])

    console.log(fetchedData);

    if (!fetchedData) {
        return (
            <LoadingScreen />
        )
    } else {
        return(
            <View style={styles.reservationContainer}>
                <View style={styles.reservationHeader}>
                    <Text style={styles.headerText}>Address</Text>
                    <Text style={styles.headerText}>Date</Text>
                </View>
                <ScrollView style={styles.pageScroll}>
                    {fetchedData.map((x) => (
                        <View key={x.id}>
                            <View style={styles.reservationRow}>
                                <Text style={styles.componentText}>{x.AddressOne}</Text>
                                <Text style={styles.componentText}>{x.CheckIn}</Text>
                            </View>
                            <View style={styles.reservationSeparator}></View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    }
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
        fontSize: 20,
        marginEnd: 50,
    },
    reservationHeader: {
        flexDirection: 'row',
    },
    reservationSeparator: {
        height: 1,
        width: 300,
        backgroundColor: 'black',
    },
    pageScroll: {
        height: 400,
    }
});

export default Reservations;