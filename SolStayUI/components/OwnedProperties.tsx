import axios from "axios";
import React, { useEffect, useState } from "react";
import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import { useSolanaWalletState } from "../Context/SolanaWallet";
import { Property } from "../Models/Properties";
import LoadingScreen from "./LoadingScreen";

const OwnedProperties = () => {
    const {account} = useSolanaWalletState();
    const [fetchedData, setFetchedData] = useState<any[]>();
    const [selectedProperty, setSelectedProperty] = useState();

    useEffect(() => {
        axios.get('http://localhost:3003/properties/:ownerId', {
            params: {
                pubkey: account?.publicKey.toString()
            }
        }).then((response) => {
            const data = (response.data);
            setFetchedData(data);
        });
    },[]);

    function selectProperty_Click(selectedItem: any) {
        setSelectedProperty(selectedItem);
    }


    if (!fetchedData) {
        return (
            <LoadingScreen />
        )
    } else {
        return (
            <View>
                {fetchedData.map((x) => (
                    <Pressable
                            onPress={() => selectProperty_Click(x.Id)}
                    >
                        <View style={[styles.propertyContainer, (selectedProperty === x.Id) ? styles.selectedContainer: null]} key={x.Id}>
                            <View style={styles.imageContainer}>
                                <Image source={{uri: x.ImageOne}} style={{height: '100%', width: '100%'}} />
                            </View>
                            <View>
                                <Text style={styles.addressText}>{x.AddressOne}</Text>
                                {(x.AddressTwo.length > 1) ? <Text style={styles.addressText}>{x.AddressTwo}</Text> : null}
                                <View style={styles.addressLineThree}>
                                    <Text style={styles.addressText}>{x.City}, </Text>
                                    <Text style={styles.addressText}>{x.Region} </Text>
                                    <Text style={styles.addressText}>{x.PostalCode}</Text>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    propertyContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 5,
    },
    imageContainer: {
        height: 100,
        width: 100,
        borderWidth: 1,
        marginRight: 20,
        marginLeft: 10,
    },
    addressLineThree: {
        flexDirection: 'row'
    },
    addressText: {
        fontFamily: 'suez-one',
        fontSize: 18,
    },
    selectedContainer: {
        backgroundColor: '#D7E6F8',
        paddingVertical: 10,
    }
})


export default OwnedProperties;

function UseEffect() {
    throw new Error("Function not implemented.");
}
