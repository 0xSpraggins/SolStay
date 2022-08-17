import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
const nft_image = require('../assets/images/nft_key_image.png');

const ActiveKey = () => {
    return(
        <View style={styles.activeKeyContainer}>
            <Image
                source={nft_image}
                style={styles.keyImage} 
            />
            <Text style={[styles.pageText, styles.tapText]}>Tap to unlock door</Text>
            <Text style={[styles.pageText, styles.addressText]}>1111 Test St.</Text>
            <Text style={[styles.pageText, styles.addressText]}>City, State, 11111</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    keyImage: {
        height: 300,
        width: 300,
        marginTop: 75,
        marginBottom: 25,
        borderColor: '#707070',
        borderRadius: 10,
        borderWidth: 2,
        alignSelf: 'center',
    },
    pageText: {
        fontFamily: 'suez-one',
        fontSize: 32,
    },
    tapText: {
        color: '#4183D7',
        alignSelf: 'center',
        marginBottom: 25,
    },
    addressText: {
        color: "#000000",
        marginLeft: 55,
    },
    activeKeyContainer: {
        justifyContent: 'center',
    }

});

export default ActiveKey;