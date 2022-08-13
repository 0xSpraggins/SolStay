import { Keypair } from '@solana/web3.js';
import * as SecureStore from 'expo-secure-store';
import * as solStayService from './SolStayService';


export const saveWallet = async (recoveryPhrase: string): Promise<boolean> => {
    try {
        await SecureStore.setItemAsync("user_wallet", recoveryPhrase);
    } catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

export const currentWallet = async (): Promise<Keypair | null> => {
    try {
        const mnemonic = await SecureStore.getItemAsync("user_wallet");
        console.log(mnemonic);
        if (mnemonic != null) {
            return await solStayService.accountFromMnemonic(mnemonic);
        } else {
            return null;
        }

    } catch (err) {
        console.log(err);
        return null;
    }
}

export const clearStorage = async (): Promise<boolean> => {
    try {
        await SecureStore.deleteItemAsync("user_wallet");
    } catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

