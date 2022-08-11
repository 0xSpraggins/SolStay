import { Pressable, Image, StyleSheet, View, Text } from "react-native";
import React from "react";
import { IStackScreenProps } from "../navigation/StackScreenProps";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import * as solStayService from '../Services/SolStayService';
import { useSolanaWalletState } from "../Context/SolanaWallet";
const secrete_icon = require('../assets/images/secret_icon.png');

const CreateAccount: React.FunctionComponent<IStackScreenProps> = (props) => {

    const {navigation, route, nameProp} = props;
    const {mnemonic, setMnemonic} = useSolanaWalletState();

    const generateRecoveryPhrase = () => {
        solStayService.generateMnemonic().then((response) => {
            setMnemonic(response);
            console.log(mnemonic);
        }
    )}

    return (
        <View style={styles.recoveryPhraseContainer}>
            <Text style={[styles.pageText,styles.recoveryPhraseTitle]}>Recovery Phrase</Text>
          <Image 
           source={secrete_icon}
           style={styles.logo} />
            <Text style={styles.pageText}>The recovery phrase is the only 
            way you will be able to access 
            your account if logged out. </Text>
            <Text style={styles.pageText}>Please write it down and keep 
            it safe.</Text>
            <Text style={styles.pageText}>Never share your phrase or store
            it on an internet-connected 
            device</Text>
            <Pressable
                onPress={() =>
                    navigation.navigate('Startup')
                }>
                <FontAwesomeIcon 
                    size={60}
                    color={'black'}
                    icon={faArrowLeft as IconProp}
                    style={styles.arrowBack} />
            </Pressable>
            <Pressable
                onPress={() => {
                    generateRecoveryPhrase();
                    navigation.navigate('RecoveryPhrase');
                }}>
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
    logo: {
        width: 150,
        height: 150,
        marginBottom: 50,
        marginTop: 25,
    },
    recoveryPhraseContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    recoveryPhraseTitle: {
        fontSize: 32,
        color: '#000000',
        margin: 1,
        position: "absolute",
        top: 75,
    },
    pageText: {
        fontSize: 20,
        fontFamily: "suez-one",
        textAlign: 'center',
        margin: 15,
        color: '#913D88'
    },
    arrowBack: {
        position: "absolute",
        top: 75,
        right: 110
    },
    arrowContinue: {
        position: "absolute",
        top: 75,
        left: 110
    }
});

export default CreateAccount;