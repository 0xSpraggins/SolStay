import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { IModalProps } from "../Interfaces/IModalProps";
import DatePicker from 'react-native-date-picker';
import * as solStayService from '../Services/SolStayService';
import { useSolanaWalletState } from "../Context/SolanaWallet";
import * as anchor from "../Anchor/dist/browser/index";
//import * as anchor from '@project-serum/anchor';
import { fetchData } from "@project-serum/anchor/dist/cjs/utils/registry";
const assert = require("assert");
const SOLSTAYWALLET = new anchor.web3.PublicKey("73x2NKEnXPo4qMupw75VgLLBTxDHKutJVG7ndPxP3qK");

const ReservationModal: React.FC<IModalProps> = (props: IModalProps) => {
    const [fetchedData, setFetchedData] = useState<any[]>();
    const [checkInOpen, setCheckInOpen] = useState<boolean>(false);
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutOpen, setCheckOutOpen] = useState<boolean>(false);
    const [checkOutDate, setCheckOutDate] = useState(new Date());
    const [numberOfNights, setNumberOfNights] = useState<number>(0);
    const [paymentConfirmed, setPaymentConfirmed] = useState<boolean>(false);
    const {account, network} = useSolanaWalletState();
    
    useEffect(() => {
        axios.get('http://localhost:3003/getPropertyDetails', {
            params: {
                id: props.input
            }
        }).then((response) => {
            setFetchedData(response.data);
        })
    },[])

    const saveReservation = () => {
        if (fetchedData) {
            axios.post('http://localhost:3003/saveReservation', {
                renterId: account?.publicKey,
                propertyId: fetchedData[0].Id,
                checkIn: checkInDate,
                checkOut: checkOutDate, 
                transactionAddress: "null",
                paymentConfirmed: paymentConfirmed
            }).then((response) => console.log(response));
        }
    }
    const confirmRental = async () => {
        if (account && fetchedData) {
        // Pay a .01 Sol transaction fee to the SolStayWallet
            if (!solStayService.transferSol(account, SOLSTAYWALLET, 0.01, network)) {
                alert("Transaction failed")
                return false;
            } else {
                const ownerPubKey = new anchor.web3.PublicKey(fetchedData[0].OwnerId); 

                if (!solStayService.transferSol(account, ownerPubKey, numberOfNights * 1, network)) {
                    alert("Transaction failed");
                } else {
                    setPaymentConfirmed(true);
                    let mintstatus;
                    
                    solStayService.mintNFT(network, account).then((response) => {mintstatus = response});

                    if (mintstatus) {
                        alert("Transaction Confirmed");
                    }
                }
            }
        }
    }   

    const toggleNights = () => {
        const ms_per_day = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(checkInDate.getFullYear(), checkInDate.getMonth(), checkInDate.getDate());
        const utc2 = Date.UTC(checkOutDate.getFullYear(), checkOutDate.getMonth(), checkOutDate.getDate());

        const nights =  Math.floor(((utc2 - utc1) / ms_per_day))

        setNumberOfNights(nights);
    }

    useEffect(() => {toggleNights()},[checkInDate, checkOutDate]);

    if (!fetchedData) {
        return (
            <Text>Loading...</Text>
        )
    } else {
        return (
            <View style={styles.modalData}>
                <View style={styles.modalHeader}>
                    <Text style={[styles.modalText, styles.headerText]}>Reserve Property</Text>
                </View>
                <View style={styles.imageContainer}>
                    <Image source={{uri: fetchedData[0].ImageOne}} style={{height: '100%', width: '100%'}} />
                </View>
                <View style={styles.propertyDescription}>
                    <Text>{fetchedData[0].AddressOne}, {fetchedData[0].AddressTwo}</Text>
                    <Text>{fetchedData[0].City}, {fetchedData[0].Region}, {fetchedData[0].PostalCode}</Text>
                    <Text>5 SOL/per night</Text>
                </View>
                <View style={styles.reservationDateContainer}>
                    <View>
                        <Pressable 
                            style={[styles.datepickBtn]}
                            onPress={() => {
                                setCheckInOpen(!checkInOpen);
                            }}
                        >
                            <Text>Check In</Text>
                        </Pressable>
                        <Text>{checkInDate.toDateString()}</Text>
                    </View>
                    <View>
                        <Pressable 
                            style={[styles.datepickBtn]}
                            onPress={() => {
                                setCheckOutOpen(!checkOutOpen);
                            }}
                        >
                            <Text>Check Out</Text>
                        </Pressable>
                        <Text>{checkOutDate.toDateString()}</Text>
                    </View>
                </View>
                <View>
                    <Text>5 SOL x {numberOfNights} Nights = {numberOfNights * 5} SOL</Text>
                </View>
                <View style={styles.reservationActions}>
                    <Pressable
                        onPress={() => {props.onClose()}}
                    >
                        <Text>Cancel</Text>
                    </Pressable>
                    <Pressable
                        onPress={confirmRental} 
                    >
                        <Text>Confirm</Text>
                    </Pressable>
                </View>
                <DatePicker
                    modal
                    mode={"date"}
                    minimumDate={new Date()}
                    maximumDate={new Date("2023-12-30")}
                    open={checkInOpen}
                    date={checkInDate}
                    onConfirm={(date) => {
                        setCheckInDate(date);
                        setCheckInOpen(!checkInOpen);
                    }}
                    onCancel={() => {
                        setCheckInOpen(!checkInOpen);
                    }}
                />
                <DatePicker
                    modal
                    mode={"date"}
                    minimumDate={new Date()}
                    maximumDate={new Date("2023-12-31")}
                    open={checkOutOpen}
                    date={checkOutDate}
                    onConfirm={(date) => {
                        setCheckOutDate(date);
                        setCheckOutOpen(!checkOutOpen);

                    }}
                    onCancel={() => {
                        setCheckOutOpen(!checkOutOpen);
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalData: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalHeader: {
        alignItems: 'center',
        marginVertical: 20,
    },
    modalText: {
        fontFamily: 'suez-one',
        fontSize: 24,
    },
    headerText: {
        fontSize: 28,
    },
    imageContainer: {
        width: 150,
        height: 150,
        borderWidth: 2,
    },
    propertyDescription: {

    },
    reservationDateContainer: {
        flexDirection: 'row'
    },
    datepickBtn: {
        width: 75,
        height: 25,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: 'pink',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    reservationActions: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }
});

export default ReservationModal;