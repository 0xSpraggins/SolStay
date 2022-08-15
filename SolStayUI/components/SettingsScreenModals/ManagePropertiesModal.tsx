import React, { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Property } from "../../Models/Properties";
import axios from "axios";
import { useSolanaWalletState } from "../../Context/SolanaWallet";
import { IStackScreenProps } from "../../navigation/StackScreenProps";
import { IModalProps } from "../../Interfaces/IModalProps";
import NewProperty from "../NewProperty";
import OwnedProperties from "../OwnedProperties";


const ManagePropertiesModal: React.FC<IModalProps> = ( props: IModalProps) => {

    const {account} = useSolanaWalletState();
    const [createScreen, setCreateScreen] = useState(false);
    
    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.headerText}>Properties</Text>
            </View>
            <ScrollView style={styles.propertyPage}>
                {(createScreen) ? <NewProperty onClose={() => {setCreateScreen(!createScreen)}}/> : <OwnedProperties />}
            </ScrollView>
            <View style={styles.modalOptions}>
                <Pressable 
                    style={[styles.closeBtn, styles.footerBtn]}
                    onPress={() => {props.onClose()}}
                >
                    <FontAwesomeIcon 
                        icon={faXmark}
                        color={'#4183D7'}
                        size={55}
                    />
                </Pressable>
                <Pressable style={[styles.editBtn, styles.footerBtn]}>
                    <FontAwesomeIcon 
                        icon={faPenToSquare}
                        color={'#4183D7'}
                        size={40}
                    />
                </Pressable>
                <Pressable 
                    style={[styles.addBtn, styles.footerBtn]}
                    onPress={() => setCreateScreen(true)}
                >
                    <FontAwesomeIcon 
                        icon={faPlus}
                        color={'#4183D7'}
                        size={50}
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#000000',
        borderBottomWidth: 2,
        height: 75
    },
    headerText: {
        fontSize: 30,
    },
    propertyPage: {
        height: 525,
    },
    modalOptions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
    },
    footerText: {
        fontSize: 20,
    },
    closeBtn: {
        position: 'absolute',
        left: 30
    },
    editBtn: {
        position: 'absolute',
    },
    addBtn: {
        position: 'absolute',
        right: 30,
    },
    footerBtn: {
        paddingTop: 65
    }
})

export default ManagePropertiesModal;