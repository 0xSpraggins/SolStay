import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSolanaWalletState } from "../Context/SolanaWallet";


const Reservations = () => {
    const {account} = useSolanaWalletState();
    const [fetchedData, setFetchedData] = useState<any[]>();

    useEffect(() => {
        axios.get('http://localhost:3003/getUsersReservations', {
            params: {
                pubkey: account?.publicKey
            }
        }).then((response) => {
            const data = (response.data);
            setFetchedData(data);
        })
    },[])
    
    if (!fetchedData) {
        return (
            <Text>Loading...</Text>
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
                                <Text style={styles.componentText}>{x.PropertyId}</Text>
                                <Text style={styles.componentText}>{x.CheckIn}</Text>
                            </View>
                            <View style={styles.reservationSeperator}></View>
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