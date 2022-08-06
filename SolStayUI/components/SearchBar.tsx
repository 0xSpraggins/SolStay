import React from "react";
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const filterIcon = require("../assets/images/filter_icon.png");

const SearchBar = () => {
    return (
        <View style={styles.searchBarContainer}>
            <View style={styles.SearchBarShape}>
                <TextInput
                    multiline={false}
                    // onChangeText={(i) => {setRecoverPhrase(i)}}
                    // value={}
                    style={styles.searchBarInput}
                />
            </View>
            <FontAwesomeIcon 
                size={30}
                color={'#000000'}
                icon={faMagnifyingGlass as IconProp}
                style={styles.magnifyingGlass}
            />
            <Pressable>
                <Image 
                    source={filterIcon}
                    style={styles.filter}/>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    SearchBarShape: {
        height: 50,
        width: 300,
        borderWidth: 2,
        padding: 10,
        borderColor: 'black',
        borderRadius: 100,
    },
    searchBarInput: {
        height: 50,
        width: 270,
        paddingLeft: 45,
        paddingBottom: 20,
        fontSize: 24,
        fontFamily: 'suez-one',
    },
    searchBarContainer: {
        paddingTop: 50,
        marginLeft: 15,
        flexDirection: 'row',
    },
    filter: {
        height: 50,
        width: 50,
        marginLeft: 10,
    },
    magnifyingGlass: {
        position: 'absolute',
        top: 60,
        left: 15,
    }
});


export default SearchBar;