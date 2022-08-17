import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
const SecondaryLogo = require('../assets/images/solstay_secondary_logo.png');

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Image
            source={SecondaryLogo} 
            style={styles.logo}
            />
            <Text style={styles.text}>Loading...</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 200,
    },
    logo: {
        height: 100,
        width: 100,
    },
    text: {
        fontSize: 20,
        fontFamily: 'suez-one'
    }
})


export default LoadingScreen;