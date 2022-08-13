import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { useSolanaWalletState } from '../Context/SolanaWallet';
import { SYSVAR_STAKE_HISTORY_PUBKEY } from '@solana/web3.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { hexValue } from 'ethers/lib/utils';

const Dropdown = ({data = [''], value = '', onSelect = (item: any) => { }}) => {
    const [showOptions, setShowOptions] = useState<boolean>(false);

    const onSelectedItem = (value: any) => {
        setShowOptions(false);
        onSelect(value);
    }

    return (
    <View>
        <TouchableOpacity 
            style={styles.dropdownContainer}
            activeOpacity={0.8}
            onPress={() => setShowOptions(!showOptions)}
            >
            <Text style={styles.dropdownText} >{!!value ? value : `Choose Option`}</Text>
            <FontAwesomeIcon 
            style={{
                transform: [{rotate: showOptions ? '180deg': '0deg'}] 
            }}
            icon={faCaretDown}
            color={'#000000'}
            size={20}
            />
        </TouchableOpacity>
        {showOptions && (<View style={styles.optionsContainer}>{data.map((value: any, index: number) => {
            return(
                <TouchableHighlight 
                    key={index}
                    onPress={() => onSelectedItem(value)}
                    underlayColor={"#e1b7dd"}
                    style={{
                        paddingVertical: 4,
                        paddingHorizontal: 4,
                        borderColor: '#000000',
                        borderWidth: 1,
                    }}
                >
                    <Text style={styles.dropdownText}>{value}</Text>
                </TouchableHighlight>
            )
        })}</View>)}
    </View>
    )
}

const styles = StyleSheet.create({
    dropdownContainer: {
        backgroundColor: '#bfbfbf',
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        minWidth: 100,
        width: 200,
        height: 40,
        marginBottom: 2
    },
    dropdownText: {
        fontFamily: 'suez-one',
        size: 35,
    },
    optionsContainer: {
        borderColor: "#000000",
        borderWidth: 1,
        borderRadius: 6
    }
})


export default Dropdown;