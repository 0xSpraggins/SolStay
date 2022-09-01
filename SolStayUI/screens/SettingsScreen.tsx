import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useContext, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import AccountTypeModal from "../components/Modals/AccountTypeModal";
import { useSolanaWalletState } from "../Context/SolanaWallet";
import { IStackScreenProps } from "../navigation/StackScreenProps";
import * as solStayService from '../Services/SolStayService';
import * as encryptedStorage from '../Services/EncryptedStorageService';
import ManagePropertiesModal from "../components/Modals/ManagePropertiesModal";

//TODO: Account balance refresh doesnt load on mount?

const SettingsScreen: React.FunctionComponent<IStackScreenProps> = (props) => {
    const {navigation, route, nameProp} = props;
    const {account, balance, network, setNetwork, setAccount, setMnemonic,setBalance } = useSolanaWalletState();
    const [modalType, setModalType] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const userPublicKey = account?.publicKey.toString();
    
    const refreshBalance = async () => {
        const balance = await solStayService.getBalance(account, network);
        setBalance(balance);
    }

    const closeModal = () => {
        setModalVisible(false);
        refreshBalance();
    }

    const logout_Click = async () => {
        
        if (await encryptedStorage.clearStorage()) {
            setMnemonic(null);
            setBalance(0);
            setAccount(null);
        }
    }

    refreshBalance();
    return (
        <View style={styles.settingsContainer}>
            <Pressable style={styles.accountOverviewContainer}>
                <Text style={styles.accountInfoText}>Account: {userPublicKey?.substring(0,10)}...</Text>
                <Text style={styles.accountInfoText}>Balance: {(balance / LAMPORTS_PER_SOL).toPrecision(4)} SOL</Text>
                <View style={styles.accountBtnContainer}>
                    <Pressable style={styles.accountInfoBtn}>
                        <Text style={[styles.btnText, styles.accountBtnText]}>Deposit</Text>
                    </Pressable>
                    <Pressable style={styles.accountInfoBtn}>
                        <Text style={[styles.btnText, styles.accountBtnText]}>Withdraw</Text>
                    </Pressable>
                </View>
            </Pressable>
            <Pressable style={styles.settingsBtn}>
                <Text style={styles.btnText}>Export Key Phrase</Text>
            </Pressable>
            <Pressable style={styles.settingsBtn}
                onPress={() => {
                    setModalType('accountType');
                    setModalVisible(true);
                }}
            >
                <Text style={styles.btnText}>Select Account Type</Text>
            </Pressable>
            <Pressable 
                style={styles.settingsBtn}
                onPress={() => {
                    setModalType('manageProperties');
                    setModalVisible(true);
                }}
            >
                <Text style={styles.btnText}>Manage Properties</Text>
            </Pressable>
            <Pressable style={styles.settingsBtn}>
                <Text style={styles.btnText}>Set Location</Text>
            </Pressable>
            <Pressable style={styles.settingsBtn}>
                <Text style={styles.btnText}>Search Preferences</Text>
            </Pressable>
            <Pressable 
                style={[styles.settingsBtn, styles.logoutBtn]}
                onPress={logout_Click}
            >
                <Text style={styles.btnText}>Log out</Text>
            </Pressable>
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
                        <View style={[styles.modalView, (modalType === 'manageProperties')? styles.fullScreenModal : null]}>
                            {
                                {
                                    'accountType': <AccountTypeModal onClose={closeModal} />,
                                    'manageProperties': <ManagePropertiesModal  onClose={closeModal}/>
                                }[modalType]
                            }
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    settingsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountOverviewContainer: {
        height: 120,
        width: 350,
        backgroundColor: '#913D88',
        marginTop: 55,
        marginBottom: 10,
        paddingTop: 5,
    },
    settingsBtn: {
        height: 60,
        width: 350,
        backgroundColor: '#E3E3E3',
        marginVertical: 5,
        justifyContent: 'center',
    },
    logoutBtn: {
        backgroundColor: '#000000'
    },
    btnText: {
        fontFamily: 'suez-one',
        fontSize: 24,
        alignSelf: 'center',
        color: '#4183D7',
    },
    accountInfoText: {
        fontFamily: 'suez-one',
        fontSize: 28,
        color: '#ffffff',
        marginLeft: 10,
    },
    accountBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountInfoBtn: {
        backgroundColor: "#ffffff",
        borderColor: '#4183D7',
        borderWidth: 2,
        borderRadius: 30,
        marginHorizontal: 10,
        width: 150,
        height: 35
    },
    accountBtnText: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 2,
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
    fullScreenModal: {
        height: 675,
        width: 350,
        position: "absolute",
        top: 50,
    }
})

export default SettingsScreen;