import { BottomTabBarHeightCallbackContext } from "@react-navigation/bottom-tabs";
import React, { useContext, useState } from "react";
import { Pressable, Image, StyleSheet, Text, View, TextInput } from "react-native";
import { useSolanaWalletState } from "../Context/SolanaWallet";
import { IStackScreenProps } from "../navigation/StackScreenProps";
import * as solStayService from '../Services/SolStayService';
const MainLogo = require('../assets/images/SolStayLogo.png');

const ImportAccount: React.FunctionComponent<IStackScreenProps> = (props) => {
    const {navigation, route, nameProp} = props;
    const [recoveryPhrase, setRecoverPhrase] = useState('');
    const {setAccount} = useSolanaWalletState();

    const signIn_Click = async () => {
        const userWallet = await solStayService.accountFromMnemonic(recoveryPhrase);
        setAccount(userWallet);
    }

    return (
        <View style={styles.startupContainer}>
            <Image 
                source={MainLogo}
                style={styles.logo}
            />
            {/* Add form validation to make sure the user enters 12 words */}
            <TextInput
                multiline={true}
                numberOfLines={6}
                onChangeText={(i) => {setRecoverPhrase(i)}}
                value={recoveryPhrase}
                style={styles.recoveryPhraseInput}
            />
            <Text style={[styles.importText, styles.importDescription]}>Enter your key phrase with a space between each word</Text>
            <Pressable 
                style={[styles.importBtns, styles.signInBtn]}
                onPress={signIn_Click}
            >
                <Text style={[styles.importText, styles.signInBtnText]}>Sign In</Text>
            </Pressable>
            <Pressable style={[styles.importBtns, styles.backBtnBtn]} 
                onPress={() => {navigation.navigate('Startup')}}>
                <Text style={[styles.importText, styles.backBtnText]}>Back</Text>
            </Pressable>
            
        </View>
    );
}

const styles = StyleSheet.create({
    startupContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        textAlign: 'center',
    },
    logo: {
        width: 262,
        height: 262,
        margin: -35,
    },
    importBtns: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 337,
        height: 72,
        borderRadius: 10,
        margin: 10,
        elevation: 3,
    },
    importText: {
        fontSize: 24,
        fontFamily: "suez-one",
        textAlign: 'center',
    },
    signInBtn: {
        borderColor: "#4183D7",
        borderWidth: 4,
    },
    signInBtnText: {
        color: "#913D88",
    },
    backBtnBtn: {
        borderColor: "white",
    },
    backBtnText: {
        color: "black",
        textDecorationLine: 'underline' 
    },
    recoveryPhraseInput: {
        height: 150,
        width: 300,
        margin: 12,
        borderWidth: 2,
        padding: 10,
        borderColor: 'black',
        fontSize: 24,
        fontFamily: 'suez-one',
    },
    importDescription: {
        margin: 5,
    }

});

export default ImportAccount;