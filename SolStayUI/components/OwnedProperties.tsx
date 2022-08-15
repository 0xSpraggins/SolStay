import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSolanaWalletState } from "../Context/SolanaWallet";
import { Property } from "../Models/Properties";

const OwnedProperties = () => {
    const {account} = useSolanaWalletState();
    const [fetchedData, setFetchedData] = useState<any[]>()

    useEffect(() => {
        axios.get('http://localhost:3003/getUserProperties', {
            params: {
                pubkey: account?.publicKey.toString()
            }
        }).then((response) => {
            const data = (response.data);
            setFetchedData(data);
        });
    }, []);

    if (!fetchedData) {
        return (
            <Text>Loading....</Text>
        )
    } else {
        return (
            <View>
                {fetchedData.map((x) => (
                    <View style={styles.propertyContainer} key={x.Id}>
                        <View style={styles.imageContainer}>
                            <Image source={{uri: x.ImageOne}} style={{height: '100%', width: '100%'}} />
                        </View>
                        <View>
                            <Text>{x.AddressOne}</Text>
                            {(x.AddressTwo.length > 1) ? <Text>{x.AddressTwo}</Text> : null}
                            <View style={styles.addressLineThree}>
                                <Text>{x.City}, </Text>
                                <Text>{x.Region} </Text>
                                <Text>{x.PostalCode}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    propertyContainer: {
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'row',
    },
    imageContainer: {
        height: 100,
        width: 100,
        borderWidth: 1,
    },
    addressLineThree: {
        flexDirection: 'row'
    }
})


export default OwnedProperties;

function UseEffect() {
    throw new Error("Function not implemented.");
}
