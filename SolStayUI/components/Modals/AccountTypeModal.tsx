import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSolanaWalletState } from "../../Context/SolanaWallet";
import { Switch } from "@react-native-material/core";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import * as solStayService from '../../Services/SolStayService';
import { IModalProps } from "../../Interfaces/IModalProps";
import Dropdown from "../Dropdown";
import axios from "axios";


const AccountTypeModal: React.FC<IModalProps> = ( props: IModalProps) => {
    const {network, account, isOwner, setIsOwner, setNetwork} = useSolanaWalletState();
    const [selectedNetork, setSelectedNetwork] = useState(network);
    
    const availableNetworks = ['devnet', 'testnet', 'mainnet-beta'].filter(x => x != selectedNetork);
    
    const onSelect = (item: ("devnet" | "testnet" | "mainnet-beta")) => {
        setSelectedNetwork(item)
    } 

    const changeAccountType = () => {
        axios.put('http://localhost:3003/updateUser', {
                pubkey: account?.publicKey,
                isOwner: (isOwner) ? 1 : 0})
        .then((response) => console.log(response))
        .catch((err) => {
            console.log(err);
        });
    }

    const changeNetwork = () => {
        try {
            setNetwork(selectedNetork);
        } catch (err) {
            console.log("Network could not be changed");
        }
        if (network != selectedNetork) {
            alert(`Network switched to ${selectedNetork}`)
        }
    }

    const requestSol_Click = async () => {
        if (account != null) {
            const result = await solStayService.airDropSol(account, network)
            if (result) {
                alert("2 Sol have added to your account");
                //close modal
            } else {
                alert("Unable to receive airdrop");
            }
        }
        
        console.log(account?.publicKey);
    }

    return (
        <View style={styles.modalData}>
            <View style={styles.modalHeader}>
                <Text style={[styles.modalText, styles.headerText]}>Account Type</Text>
            </View>
            <View style={styles.modalBody}>
                <View style={styles.ownerSwitchContainer}>
                    <Text style={styles.modalText} >Property Owner</Text>
                    <Switch value={isOwner} onValueChange={() => setIsOwner(!isOwner)} trackColor={{true: '#4183D7'}} style={styles.switch}/>
                </View>
                <Text style={[styles.modalText, styles.entryText, styles.networkText]}>Change Network</Text>
                <View style={styles.dropdownRow}>
                    <Dropdown
                        data={availableNetworks}
                        value={selectedNetork}
                        onSelect={onSelect}
                    />
                    <Pressable 
                        style={styles.networkChangeBtn}
                        onPress={changeNetwork}
                    >
                        <FontAwesomeIcon 
                            icon={faCheck}
                            color="#ffffff"
                            size={30}
                        />
                    </Pressable>
                </View>
            </View>
            <View style={styles.modalFooter}>

                <Pressable 
                    style={[styles.btnAlignment, styles.airdropSolBtn, (network === 'mainnet-beta') ? styles.disabledBtn : null]}
                    disabled={(network === 'mainnet-beta')}
                    onPress={requestSol_Click}
                >
                    <Text style={[styles.btnText, styles.solAirdropText]}>Airdrop 2 SOL</Text>
                </Pressable>

                <View style={styles.exitConfirmContainer}>
                    <Pressable 
                        style={[styles.btnAlignment, styles.exitConfirmBtn, styles.exitBtn]}
                        onPress={props.onClose}
                    >
                        <Text style={[styles.exitBtnText, styles.btnText]}>Close</Text>
                    </Pressable>
                    <Pressable 
                        style={[styles.btnAlignment, styles.exitConfirmBtn, styles.confirmBtn]}
                        onPress={() => {
                            // Add error handling and make this its own function
                            setIsOwner(isOwner);
                            changeNetwork();
                            changeAccountType();
                            props.onClose();
                        }}
                    >
                        <Text style={[styles.btnText, styles.confirmText]}>Confirm</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}   

const styles = StyleSheet.create({
    modalData: {
        justifyContent: 'center',
    },
    ownerSwitchContainer: {
        flexDirection: 'row',
    },
    modalHeader: {
        marginTop: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    modalBody: {
        marginLeft: 20,
        height: 200
    },
    modalFooter: {
        alignItems: "center",
        justifyContent: 'center',
    },
    modalText: {
        fontFamily: 'suez-one',
        fontSize: 24,
    },
    headerText: {
        fontSize: 35,
    },
    entryText: {
        alignSelf: 'flex-start',
    },
    switch: {
        marginLeft: 25,
    },
    networkText: {
        marginTop: 20,
        marginBottom: 5,
    },
    dropdownRow: {
        flexDirection: 'row',
    },
    networkChangeBtn: {
        backgroundColor: "#4183D7",
        width: 45,
        height: 40,
        marginLeft: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    airdropSolBtn: {
        backgroundColor: "#000000",
        width: 255,
        height: 40,
        borderRadius: 10,
        marginBottom: 10,
    },
    exitConfirmContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    exitConfirmBtn: {
        width: 120,
        height: 40,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    exitBtn: {
        backgroundColor: '#ffffff',
        borderColor: "#4183D7",
        borderWidth: 3,
    },
    confirmBtn: {
        backgroundColor: '#913D88'
    },
    solAirdropText: {
        color: "#ffffff"
    },
    btnText: {
        fontFamily: 'suez-one',
        fontSize: 24
    },
    btnAlignment: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmText: {
        color: "#ffffff"
    },
    exitBtnText: {
        color: '#913D88'
    },
    disabledBtn: {
        backgroundColor: '#ffffff'
    }
})

export default AccountTypeModal;