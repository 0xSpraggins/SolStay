import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Data from '../MockData/MockData.json';
import ReservationModal from "./ReservationModal";
const MockHousePicture = require('../assets/images/mock_house_picture.png');

const AvailableProperties = () => {
    const [availableProperties, setAvailableProperties] = useState<any[]>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalIdValue, setModalIdValue] = useState<number>();

    useEffect(() => {
        axios.get('http://localhost:3003/getAllProperties').then((response) => {
            const data = (response.data);
            setAvailableProperties(data);
        })
    })

    const reserveBtn_Click = (propertyId: number) => {
        setModalIdValue(propertyId);
        setModalVisible(!modalVisible);
    }

    if (!availableProperties) {
        return (
            <Text>Loading...</Text>
        )
    } else {
        return (
            <View>
                {availableProperties.map((x) => (
                    <View style={styles.reservationCard} key={x.Id}>
                        <Image 
                            source={{uri: x.ImageOne}}
                            style={styles.propertyImage}
                        />
                        <View style={styles.propertyDetails}>
                            <View style={styles.mainDetailText}>
                                <View style={styles.addressContainer}>
                                    <Text style={[styles.addressText, styles.pageText]}>{x.AddressOne}</Text>
                                    {(x.AddressTwo.length > 1) ? <Text style={[styles.addressText, styles.pageText]}>{x.AddressTwo}</Text> : null}
                                    <Text style={[styles.addressText, styles.pageText]}>{x.City}, {x.Region}, {x.PostalCode}</Text>
                                </View>
                                {/* <Text style={[styles.pageText]}>Owner: {x.OwnerId.substring(0,12)}...</Text> */}
                                <View style={styles.priceContainer}>
                                    {/* Hardcoded price value for now */}
                                    <Text style={[styles.pageText, styles.priceText]}>5 Sol</Text>
                                    <Text style={[styles.pageText, styles.perNightText]}>/per night</Text>
                                </View>
                            </View>
                            <View style={styles.cardButtonContainer}>
                                <Pressable style={styles.cardButton}>
                                    <Text style={[styles.buttonText, styles.pageText]}>Contact Owner</Text>
                                </Pressable>
                                <Pressable 
                                    style={styles.cardButton}
                                    onPress={() => reserveBtn_Click(x.Id)}
                                >
                                    <Text style={[styles.buttonText, styles.pageText]}>Reserve</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ))}
                <View style={styles.modalCenteredView}>
                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.modalCenteredView}>
                            <View style={styles.modalView}>
                                <ReservationModal 
                                    input={modalIdValue} 
                                    onClose={() => {
                                        setModalVisible(!modalVisible);
                                        setModalIdValue(undefined)
                                }}/>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
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
        fontSize: 18,
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
    },
    modalCenteredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: "#ffffff",
        height: 400,
        width: 300,
        borderBottomColor: "000000",
        borderRadius: 10,
        borderWidth: 4,
    },
})

export default AvailableProperties;