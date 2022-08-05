import React, { useEffect } from "react";
import { Pressable, Image, StyleSheet, Text, View } from "react-native";
import { IStackScreenProps } from "../navigation/StackScreenProps";
const MainLogo = require('../assets/images/SolStayLogo.png');


const StartupScreen: React.FunctionComponent<IStackScreenProps> = (props) => {

    const {navigation, route, nameProp} = props;
    useEffect(() => {
        console.log({navigation, route, nameProp})
    });
    
    return (
        <View style={styles.startupContainer}>
            <Image 
                source={MainLogo}
                style={styles.logo}
            />
            <Pressable style={[styles.startupBtns, styles.newAccountBtn]} 
                onPress={() =>
                    navigation.navigate('CreateAccount')
                } >
                <Text style={[styles.startupText, styles.newAccountBtnText]}>Create New Account</Text>
            </Pressable>
            <Pressable style={[styles.startupBtns, styles.importAccountBtn]} 
                onPress={() =>
                    navigation.navigate('ImportAccount')
                } >
                <Text style={[styles.startupText, styles.importAccountBtnText]}>Import Account</Text>
            </Pressable>
            
        </View>
    );
}

const styles = StyleSheet.create({
    startupContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    logo: {
        width: 262,
        height: 262,
    },
    startupBtns: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 337,
        height: 72,
        borderRadius: 10,
        margin: 10,
        elevation: 3,
    },
    startupText: {
        fontSize: 24,
        fontFamily: "suez-one",
    },
    newAccountBtn: {
        backgroundColor:"#913D88",
        borderWidth: 1,
    },
    newAccountBtnText: {
        color: "white",
    },
    importAccountBtn: {
        borderColor: "#4183D7",
        borderWidth: 4,
    },
    importAccountBtnText: {
        color: "#913D88",
    }

});

export default StartupScreen;

