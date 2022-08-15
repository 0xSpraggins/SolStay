import { BottomTabBarHeightCallbackContext } from "@react-navigation/bottom-tabs";
import React, { useContext, useState } from "react";
import { Pressable, Image, StyleSheet, Text, View, TextInput } from "react-native";
import { useSolanaWalletState } from "../Context/SolanaWallet";
import { IStackScreenProps } from "../navigation/StackScreenProps";
import * as solStayService from '../Services/SolStayService';
const MainLogo = require('../assets/images/SolStayLogo.png');
import * as encryptedStorage from '../Services/EncryptedStorageService';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const ImportAccount: React.FunctionComponent<IStackScreenProps> = (props) => {
    const {navigation, route, nameProp} = props;
    const [recoveryPhrase, setRecoverPhrase] = useState('');
    const {setAccount, setIsOwner, isOwner} = useSolanaWalletState();

    const signIn_Click = async () => {
        const userWallet = await solStayService.accountFromMnemonic(recoveryPhrase);
        if (recoveryPhrase) {
            if (await encryptedStorage.saveWallet(recoveryPhrase)) {
                await getUser(userWallet.publicKey.toString());
                console.log(isOwner);
                setAccount(userWallet);
            }
        }
    }

    const addUser = (pubKey: string) => {
        axios.post('http://localhost:3003/user', 
        {pubkey: pubKey, isOwner: false})
        .then(() => console.log("success")); 
    }

    const getUser = (publicKey: string) => {

        axios.get('http://localhost:3003/getUser', {
            params: {
                pubkey: publicKey
            }
        }).then((response) => {
            if (response.data.length > 0) {
                const ownerData = (response.data.IsOwner) ? true : false
                setIsOwner(ownerData);
            } else {
                addUser(publicKey);
            }
        });
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