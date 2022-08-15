import React, { useState } from "react";
import { Image, ImagePickerResult, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { useSolanaWalletState } from "../Context/SolanaWallet";
import { IModalProps } from "../Interfaces/IModalProps";

const NewProperty: React.FC<IModalProps> = (props: IModalProps) => {

    const {account} = useSolanaWalletState();
    const [addressOne, setAddressOne] = useState<string>('');
    const [addressTwo, setAddressTwo] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [region, setRegion] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [photo, setPhoto] = useState<string | null>(null);

    const selectImagePicker = async () => {
        if (Platform.OS !== 'web') {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert("Please grant SolStay access to camera roll to select an image");
            }
        }
    }

    const uploadImage = async () => {
        let photo = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,4],
            quality: 1,
        });

        if (!photo.cancelled) {
            setPhoto(photo.uri);
            console.log(photo);
        }
    }

    const addNewProperty = () => {
        //const imageData = new FormData();
        axios.post('http://localhost:3003/newProperty', {
            pubkey: account?.publicKey,
            addressOne: addressOne,
            addressTwo: addressTwo,
            city: city,
            region: region,
            country: country,
            postalCode: postalCode,
            image: photo
        }).then(() => console.log("success"))
        .then(closeWindow);
    }
    
    const clearInputs = () => {
        setAddressOne('');
        setAddressTwo('');
        setCity('');
        setRegion('');
        setCountry('');
        setPostalCode('');
        setPhoto(null);
    }

    const closeWindow = () => {
        clearInputs();
        props.onClose();
    }

    return (
        <View style={styles.formContainer}>
            <View style={styles.header}>
                <Text style={[styles.sectionFont, styles.headerFont]}>Add New Property</Text>
            </View>
            <TextInput
                multiline={false}
                onChangeText={(i) => {setAddressOne(i)}}
                value={addressOne}
                placeholder={'Address One'}
                style={[styles.addressInput, styles.sectionFont]}
            />
            <TextInput
                multiline={false}
                onChangeText={(i) => {setAddressTwo(i)}}
                value={addressTwo}
                placeholder={'Address Two'}
                style={[styles.addressInput, styles.sectionFont]}
            />
            <TextInput
                multiline={false}
                onChangeText={(i) => {setCity(i)}}
                value={city}
                placeholder={'City'}
                style={[styles.addressInput, styles.sectionFont]}
            />
            <TextInput
                multiline={false}
                onChangeText={(i) => {setRegion(i)}}
                value={region}
                placeholder={'Region'}
                style={[styles.addressInput, styles.sectionFont]}
            />
            <TextInput
                multiline={false}
                onChangeText={(i) => {setCountry(i)}}
                value={country}
                placeholder={'Country'}
                style={[styles.addressInput, styles.sectionFont]}
            />
            <TextInput
                multiline={false}
                onChangeText={(i) => {setPostalCode(i)}}
                value={postalCode}
                placeholder={'Postal Code'}
                style={[styles.addressInput, styles.sectionFont]}
            />
            <View style={styles.imagePicker}>
                <Text style={[styles.sectionFont, styles.uploadtext]}>Upload Image</Text>
                <Pressable 
                    onPress={uploadImage}
                >
                    <FontAwesomeIcon 
                        icon={faUpload}
                        size={30}
                    />
                </Pressable>
            </View>
            <View style={styles.imageConfirmation}>
                {(photo && photo.length > 1) ? <Image source={{uri: photo}} style={{width: '100%', height: '100%'}} /> : null}
            </View>
            <View style={styles.actionBtns}>
                <Pressable>
                    <Text 
                        style={[styles.sectionFont, styles.cancelText]}
                        onPress={closeWindow}
                    >CANCEL</Text>
                </Pressable>
                <Pressable>
                    <Text 
                        style={[styles.sectionFont, styles.saveText]}
                        onPress={addNewProperty}    
                    >SAVE</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        height: 50,
    },
    addressInput: {
        width: 200,
        height: 40,
        borderWidth: 2,
        borderRadius: 3,
        marginVertical: 5,
        padding: 5,
    },
    sectionFont: {
        fontFamily: 'suez-one'
    },
    headerFont: {
        fontSize: 20,
        paddingTop: 10,
    },
    imagePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    uploadtext: {
        marginEnd: 25,
        fontSize: 20
    },
    imageConfirmation: {
        height: 100,
        width: 100,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionBtns: {
        marginVertical: 35,
        flexDirection: 'row',
    },
    cancelText: {
        fontSize: 25,
        marginEnd: 50,
    },
    saveText: {
        fontSize: 25,
        color: '#913D88'
    }
})

export default NewProperty;
