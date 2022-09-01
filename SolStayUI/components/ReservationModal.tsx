import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { IModalProps } from "../Interfaces/IModalProps";
import DatePicker from 'react-native-date-picker';
import * as solStayService from '../Services/SolStayService';
import { useSolanaWalletState } from "../Context/SolanaWallet";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import LoadingScreen from "./LoadingScreen";

const ReservationModal: React.FC<IModalProps> = (props: IModalProps) => {
    const [fetchedData, setFetchedData] = useState<any[]>();
    const [checkInOpen, setCheckInOpen] = useState<boolean>(false);
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutOpen, setCheckOutOpen] = useState<boolean>(false);
    const [checkOutDate, setCheckOutDate] = useState(new Date());
    const [numberOfNights, setNumberOfNights] = useState<number>(0);
    const {account, network, setBalance} = useSolanaWalletState();
    
    useEffect(() => {
        axios.get('http://localhost:3003/getPropertyDetails', {
            params: {
                id: props.input
            }
        }).then((response) => {
            setFetchedData(response.data);
        })
    },[])

    const refreshBalance = async () => {
        const balance = await solStayService.getBalance(account, network);
        setBalance(balance);
    }

    const saveReservation = (transactionAddress: string) => {
        if (fetchedData) {
            axios.post('http://localhost:3003/saveReservation', {
                renterId: account?.publicKey,
                propertyId: fetchedData[0].Id,
                checkIn: checkInDate.toLocaleDateString(),
                checkOut: checkOutDate.toLocaleDateString(), 
                transactionAddress: transactionAddress,
            }).then((response) => console.log(response));
        }
    }
    const confirmRental = async () => {
        if (account && fetchedData) {
        
            //Get property owners Id
            const ownerPubKey = new PublicKey(fetchedData[0].OwnerId); 

            //Calculate the final price plus security deposit for the transaction
            let reservationCost: number = (fetchedData[0].NightlyPrice * LAMPORTS_PER_SOL)

            let transactionId = await solStayService.mintKey(network, account, ownerPubKey, reservationCost);

            if (transactionId != null) {
                await saveReservation(transactionId);
                alert("Reservation Confirmed!");
                await refreshBalance();
                props.onClose();
            } else {
                alert("Transaction Failed, please try again");
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
            <LoadingScreen />
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
                    <Text style={[styles.modalText, styles.addressText]}>{fetchedData[0].AddressOne}, {fetchedData[0].AddressTwo}</Text>
                    <Text style={[styles.modalText, styles.addressText]}>{fetchedData[0].City}, {fetchedData[0].Region}, {fetchedData[0].PostalCode}</Text>
                    {/* <Text style={[styles.modalText, styles.addressText]}>{fetchedData[0].NightlyPrice} SOL/per night</Text> */}
                </View>
                <View style={styles.reservationDateContainer}>
                    <View style={styles.dateRow}>
                        <Pressable 
                            style={[styles.datepickBtn]}
                            onPress={() => {
                                setCheckInOpen(!checkInOpen);
                            }}
                        >
                            <Text style={[styles.modalText, styles.dateSelectText]}>Set Check In</Text>
                        </Pressable>
                        <Text style={[styles.modalText, styles.activeReservationDate]}>{checkInDate.toDateString()}</Text>
                    </View>
                    <View style={styles.dateRow}>
                        <Pressable 
                            style={[styles.datepickBtn]}
                            onPress={() => {
                                setCheckOutOpen(!checkOutOpen);
                            }}
                        >
                            <Text style={[styles.modalText, styles.dateSelectText]}>Set Check Out</Text>
                        </Pressable>
                        <Text style={[styles.modalText, styles.activeReservationDate]}>{checkOutDate.toDateString()}</Text>
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={[styles.modalText,styles.pricingText]}>{fetchedData[0].NightlyPrice} SOL x {numberOfNights} Nights = {(numberOfNights * fetchedData[0].NightlyPrice).toPrecision(3)} SOL</Text>
                    <Text style={[styles.modalText, styles.pricingText]}>+ Security Deposit = 1.015 SOL</Text>
                    <View style={styles.additionLine}></View>
                    <Text style={[styles.modalText,styles.pricingText]}>Total = {((numberOfNights * fetchedData[0].NightlyPrice) + 1.015).toPrecision(4)} SOL</Text>
                </View>
                <View style={styles.reservationActions}>
                    <Pressable
                        style={[styles.actionBtn, styles.cancelBtn]}
                        onPress={() => {props.onClose()}}
                    >
                        <Text style={[styles.cancelBtnText, styles.modalText, styles.actionBtnText]}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.actionBtn, styles.confirmBtn]}
                        onPress={confirmRental} 
                    >
                        <Text style={[styles.confirmBtnText, styles.modalText, styles.actionBtnText]}>Confirm</Text>
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
        marginVertical: 10,
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
        alignItems: 'center',
        marginBottom: 10,
    },
    datepickBtn: {
        width: 100,
        height: 25,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: '#999999',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    reservationActions: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    actionBtn: {
        width: 120,
        height: 40,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtn: {
        backgroundColor: '#ffffff',
        borderColor: "#4183D7",
        borderWidth: 3,
    },
    confirmBtn: {
        backgroundColor: '#913D88',
    },
    confirmBtnText: {
        color: "#ffffff",
    },
    cancelBtnText: {
        color: '#913D88',
    },
    actionBtnText: {
        fontSize: 18,
    },
    addressText: {
        fontSize: 25,
    },
    dateRow: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    dateSelectText: {
        fontSize: 12,
        color: "#ffffff",
        textShadowColor: "#000000"
    },
    activeReservationDate: {
        fontSize: 18,
    },
    reservationDateContainer: {
        marginBottom: 20,
    },
    additionLine: {
        width: 310,
        height: 4,
        backgroundColor: "#000000"
    },
    priceContainer: {
        alignItems: 'flex-end',
        paddingEnd: 5,
        marginBottom: 25
    },
    pricingText: {
        fontSize: 22
    }

});

export default ReservationModal;