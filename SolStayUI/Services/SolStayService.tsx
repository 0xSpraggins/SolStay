import { faBalanceScale, faRandom } from '@fortawesome/free-solid-svg-icons';
import { getStateFromPath } from '@react-navigation/native';
import { Keypair, Connection, clusterApiUrl, Cluster, LAMPORTS_PER_SOL} from '@solana/web3.js';
import * as Bip39 from "bip39";
import { ethers } from "ethers";
import * as Random from "expo-random";
import { useSolanaWalletState } from '../Context/SolanaWallet';

if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer

export const solanaConnect = (network: Cluster) => {
    return new Connection(clusterApiUrl(network), 'confirmed');
}

export async function createNewWallet(recoveryPhrase: string): Promise<Keypair> {
    
    console.log(`Creating wallet with recovery phrase: ${recoveryPhrase}`);
    const newAccount = await accountFromMnemonic(recoveryPhrase);
    console.log(`Public Key: ${newAccount.publicKey}`);
    return newAccount;


}

export async function generateMnemonic(): Promise<string> {
    // Generate a random byte array to use to read the mnemonic phrase
    const randomBytes = await Random.getRandomBytesAsync(16);
    const mnemonic = ethers.utils.entropyToMnemonic(randomBytes);
    
    return mnemonic;
}

export async function accountFromMnemonic(recoveryPhrase: string): Promise<Keypair> {
    //Convert the mnemonic phrase to a seed phrase
    const seed = Bip39.mnemonicToSeedSync(recoveryPhrase);
    return Keypair.fromSeed(seed.subarray(0, 32));

}

// export async function importAccountFromMnemonic(recoveryPhrase: string) {

//     console.log(`Loading Wallet from Key Phrase: ${recoveryPhrase}`)
//     const seed = Bip39.mnemonicToSeedSync(recoveryPhrase);
//     const userWallet = Keypair.fromSeed(seed.subarray(0, 32));

//     setAccount(userWallet);

//     if (account) {
//         console.log("Wallet Created!");
//         console.log(`Public Key: ${account.publicKey}`);
//     } else {
//         console.log("No public key could be found");
//     }
    
// }

export async function getBalance(account: Keypair | null, network: Cluster): Promise<number> {

    if (account) {
        try {
            const connection = solanaConnect(network);
            const balance = await connection.getBalance(account.publicKey);
            return balance;
        } catch (err) {
            console.log(err);
            return 0;
        }
    } else {
        console.log("No account is loaded");
        return 0;
    }
}

export async function airDropSol(account: Keypair, network: Cluster): Promise<boolean> {
    const lamports = (network === 'devnet') ? 2 * LAMPORTS_PER_SOL : LAMPORTS_PER_SOL;

    try {
        const connection = solanaConnect(network);
        await connection.requestAirdrop(account.publicKey, lamports);
    } catch (err) {
        console.log(err);
        return false;
    }
    return true;
}

