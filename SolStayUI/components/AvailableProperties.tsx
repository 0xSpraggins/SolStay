import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Data from '../MockData/MockData.json';
const MockHousePicture = require('../assets/images/mock_house_picture.png');

const AvailableProperties = () => {
    return (
        <View>
            {Data['AvailableReservations'].map((x) => (
                <View style={styles.reservationCard} key={x.id}>
                    <Image 
                        source={MockHousePicture}
                        style={styles.propertyImage}
                    />
                    <View style={styles.propertyDetails}>
                        <View style={styles.mainDetailText}>
                            <View style={styles.addressContainer}>
                                <Text style={[styles.addressText, styles.pageText]}>{x.address.street1} {x.address.street2}</Text>
                                <Text style={[styles.addressText, styles.pageText]}>{x.address.city}, {x.address.state}, {x.address.zipcode}</Text>
                            </View>
                            <Text style={[styles.pageText]}>Owner: {x.owner}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={[styles.pageText, styles.priceText]}>{x.nightlyPrice} Sol</Text>
                                <Text style={[styles.pageText, styles.perNightText]}>/per night</Text>
                            </View>
                        </View>
                        <View style={styles.cardButtonContainer}>
                            <Pressable style={styles.cardButton}>
                                <Text style={[styles.buttonText, styles.pageText]}>Contact Owner</Text>
                            </Pressable>
                            <Pressable style={styles.cardButton}>
                                <Text style={[styles.buttonText, styles.pageText]}>Reserve</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    reservationCard: {
        borderColor: "#000000",
        borderWidth: .5,
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 10,
        height: 150,
        flexDirection: 'row',
        backgroundColor: "#D7E6F8",
    },
    propertyImage: {
        height: 125,
        width: 125,
        borderColor: '#000000',
        borderWidth: 1,
        marginTop: 12,
        marginLeft: 12,
    },
    cardButtonContainer: {
        flexDirection: 'row',
        marginLeft: 15,
        
    },
    propertyDetails: {
        marginTop: 12,
    },
    cardButton: {
        borderColor: "#4183D7",
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        width: 100,
        height: 25,
        marginHorizontal: 3,
        justifyContent: 'center',
    },
    addressContainer: {
        marginBottom: 1,
    },
    addressText: {
        fontSize: 20,
    },
    pageText: {
        fontFamily: 'suez-one',
    },
    buttonText: {
        color: "#913D88",
        fontSize: 12,
        alignSelf: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    priceText: {
        fontSize: 20,
        color: "#913D88",
    },
    perNightText: {
        fontSize: 10,
        marginTop: 10,
        color: "#913D88",
    },
    mainDetailText: {
        marginLeft: 35,
    }
})

export default AvailableProperties;