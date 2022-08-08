import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ActiveKey from "../components/ActiveKey";
import Reservations from "../components/Reservations";
import { IStackScreenProps } from "../navigation/StackScreenProps";

const KeysScreen: React.FunctionComponent<IStackScreenProps> = (props) => {
    const {navigation, route, nameProp} = props;
    const [showActiveKey, setShowActiveKey] = useState(false);

    return (
        <View>
            <View style={styles.topNavContainer}>
                <Pressable style={styles.navBtn}
                    onPress={() => setShowActiveKey(false)}
                >
                    <Text style={showActiveKey ? styles.topNavTextInactive : styles.topNavTextActive}>Reservations</Text>
                </Pressable>
                <Pressable style={styles.navBtn}
                    onPress={() => setShowActiveKey(true)}
                >
                    <Text style={showActiveKey ? styles.topNavTextActive : styles.topNavTextInactive}>Active Key</Text>   
                </Pressable>
            </View>
            <View style={showActiveKey ? styles.navHighlighterRight : styles.navHighlighterLeft}></View>
            {(showActiveKey) ? <ActiveKey /> : <Reservations />}

        </View>
    )
}


const styles = StyleSheet.create({
    topNavContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    navBtn: {
        marginTop: 100,
        marginHorizontal: 25,
    },
    topNavTextActive: {
        fontFamily: 'suez-one',
        fontSize: 22,
        color: "#913D88",
    },
    topNavTextInactive: {
        fontFamily: 'suez-one',
        fontSize: 22,
    },
    navHighlighterLeft: {
        height: 3,
        width: 150,
        position: "absolute",
        top: 130,
        left: 40,
        backgroundColor: '#000000',
    },
    navHighlighterRight: {
        height: 3,
        width: 125,
        position: "absolute",
        top: 130,
        right: 40,
        backgroundColor: '#000000',
    }

})

export default KeysScreen;