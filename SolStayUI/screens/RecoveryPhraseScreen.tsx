import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable, ScrollView, FlatList } from "react-native";
import { IStackScreenProps } from "../navigation/StackScreenProps";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import * as solStayService from '../Services/SolStayService';
import { useSolanaWalletState } from "../Context/SolanaWallet";
import * as encryptedStorage from '../Services/EncryptedStorageService';
const RecoveryPhraseScreen: React.FunctionComponent<IStackScreenProps> = (props) => {
    const {navigation, route, nameProp} = props;
    const {network, account, setAccount, setBalance, mnemonic} = useSolanaWalletState();

    const initializeAccount_Click = async () => {
        if (mnemonic != null) {
            const keyPair = await solStayService.createNewWallet(mnemonic);
            if (await encryptedStorage.saveWallet(mnemonic)) {
                setAccount(keyPair);
                refreshBalance();
            }
        } else {
            alert("No recovery phrase generated");
        }
    }

    const refreshBalance = async () => {
        const balance = await solStayService.getBalance(account, network);
        setBalance(balance);
    }

    let recoveryArray = mnemonic?.split(' ');

    return (
        <View style={styles.recoveryContainer}>
            <Text style={[styles.pageText,styles.recoveryPhraseTitle]}>Recovery Phrase</Text>
            {/* Add a box to store the recovery phrase generated when creating a Solana wallet */}
            <View style={styles.phraseBox}>
                <FlatList
                    key={'#'}
                    keyExtractor={item => "#" + item}
                    data={recoveryArray}
                    renderItem={({item, index}) => (
                        <View style={styles.textContainer} >
                            <Text style={[styles.pageText, styles.recoveryText]}>{index+1}. {item}</Text>
                        </View>
                    )}
                    numColumns={2}
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                />
            </View>
            <Text style={[styles.pageText, styles.pageDescription]}>Remember to write down your recovery phrase</Text>
            <Pressable
                onPress={() =>
                    navigation.navigate('CreateAccount')}
                >
                <FontAwesomeIcon 
                    size={60}
                    color={'black'}
                    icon={faArrowLeft as IconProp}
                    style={styles.arrowBack} />
            </Pressable>
            <Pressable
                onPress={initializeAccount_Click}
                >
                <FontAwesomeIcon 
                    size={60}
                    color={'#4183D7'}
                    icon={faArrowRight as IconProp}
                    style={styles.arrowContinue} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    recoveryContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    arrowBack: {
        position: "absolute",
        top: 110,
        right: 110
    },
    arrowContinue: {
        position: "absolute",
        top: 110,
        left: 110
    },
    pageText: {
        fontSize: 20,
        fontFamily: "suez-one",
        textAlign: 'center',
        margin: 5,
        color: '#913D88'
    },
    recoveryPhraseTitle: {
        fontSize: 32,
        color: '#000000',
        margin: 1,
        position: "absolute",
        top: 75,
    },
    phraseBox: {
        borderColor: '#4183D7',
        borderWidth: 3,
        height: 300,
        width: 350,
        alignItems: "center",
        alignContent: 'center',
        borderRadius: 10,
    },
    textContainer: {
        flexDirection: 'row',
        textAlign: "left",
        borderColor:"#000000",
        width: 175,
        height: 50,
    },
    recoveryText: {
        fontSize:20,
        alignSelf: 'center',
    },
    pageDescription: {
        marginTop: 50,
        marginHorizontal: 10,
    }
})

export default RecoveryPhraseScreen;