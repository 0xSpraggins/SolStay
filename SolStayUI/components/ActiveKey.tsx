import React, {useEffect, useState} from "react";
import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import axios from "axios";
import {useSolanaWalletState} from "../Context/SolanaWallet";
import LoadingScreen from "./LoadingScreen";
const unavailableImage = require("../assets/images/image_unavailable.png");
const nftImage = require("../assets/images/nft_key_image.png");

const ActiveKey = () => {
    const [fetchedData, setFetchedData] = useState<any | null>();
    const {account, network} = useSolanaWalletState();

    useEffect(() => {
        axios.get('http://localhost:3003/reservations/active/:renterId', {
            params: {
                pubkey: account?.publicKey.toString(),
                date: new Date().toLocaleDateString(),
            }
        }).then(async (response) => {
            const data = (response.data);
            await setFetchedData(data[0]);

        })
    },[])

    if (fetchedData == null) {
        return (
            <LoadingScreen />
        )
    } else if (fetchedData === []) {
        return (
            <View style={styles.activeKeyContainer}>
                <Text style={styles.pageText}>No Active Key</Text>
                <Text style={[styles.pageText, styles.smallerText]}>Check again on your next check in date</Text>
            </View>
        )
    } else {
        return(
            <View style={styles.activeKeyContainer} >
                <Pressable>
                    <Image
                        source={nftImage}
                        style={styles.keyImage}
                    />
                </Pressable>
                <Text style={[styles.pageText, styles.tapText]}>Tap to unlock door</Text>
                <Text style={[styles.pageText, styles.addressText]}>{fetchedData.AddressOne}</Text>
                {(fetchedData.AddressTwo.length > 1) ? <Text>{fetchedData.Two}</Text>: null}
                <Text style={[styles.pageText, styles.addressText]}>{fetchedData.City}, {fetchedData.Region}, {fetchedData.PostalCode}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    keyImage: {
        height: 300,
        width: 300,
        marginTop: 75,
        marginBottom: 25,
        borderColor: '#707070',
        borderRadius: 10,
        borderWidth: 2,
        alignSelf: 'center',
    },
    pageText: {
        fontFamily: 'suez-one',
        fontSize: 32,
    },
    tapText: {
        color: '#4183D7',
        alignSelf: 'center',
        marginBottom: 25,
    },
    addressText: {
        color: "#000000",
        marginLeft: 55,
    },
    activeKeyContainer: {
        justifyContent: 'center',
    },
    smallerText: {
        fontSize: 18,
    }

});

export default ActiveKey;