import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSolanaWalletState } from "../Context/SolanaWallet";
import { IStackScreenProps } from "../navigation/StackScreenProps";
import * as solStayService from '../Services/SolStayService';

const SettingsScreen: React.FunctionComponent<IStackScreenProps> = (props) => {
    const {navigation, route, nameProp} = props;
    const {account, balance, network, setAccount, setMnemonic,setBalance } = useSolanaWalletState();
    const userPublicKey = account?.publicKey.toString();

    const refreshBalance = async () => {
        const balance = await solStayService.getBalance(account, network);
        setBalance(balance);
    }

    const logout_Click = () => {
        setMnemonic(null);
        setBalance(0);
        setAccount(null);
    }

    return (
        <View style={styles.settingsContainer}>
            <Pressable style={styles.accountOverviewContainer}>
                <Text style={styles.accountInfoText}>Account: {userPublicKey?.substring(0,10)}...</Text>
                <Text style={styles.accountInfoText}>Balance: {balance} SOL</Text>
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
            <Pressable style={styles.settingsBtn}>
                <Text style={styles.btnText}>Select Account Type</Text>
            </Pressable>
            <Pressable style={styles.settingsBtn}>
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
    }
})

export default SettingsScreen;