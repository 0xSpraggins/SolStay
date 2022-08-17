import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
    createKeypairFromFile,
} from './util';
import os from 'os';
import path from 'path';
import * as borsh from '@project-serum/borsh';
const BN = require('bn.js');

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

// Use as SOLSTAY Profit account
const SOLSTAY_PUBKEY = new PublicKey("73x2NKEnXPo4qMupw75VgLLBTxDHKutJVG7ndPxP3qK");

export async function main() {

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    console.log(`Successfully connected to Solana dev net.`);

    // Logged in users account
    const wallet = await createKeypairFromFile('./keypair');
    console.log(`Local account loaded successfully.`);
    
    const programId = new PublicKey("C8RnUrXm2TUQ6SKTEnUxcuDPhLSwNY3yQDgiQnJ5pYbW");


    // Property ownerId
    const propertyOwnerPublicKey = new PublicKey("9rwdVvqDC1NrPPVp4Ygaaoc5UY5pG3JzjByBXYoJ2LB6");

    console.log(`Program ID: ${programId.toBase58()}`);

    // Derive the mint address and the associated token account address
    const mintKeypair: Keypair = Keypair.generate();
    const tokenAddress = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      wallet.publicKey
    );
    console.log(`New token: ${mintKeypair.publicKey}`);

    // create metadata address
    const metadataAddress = (await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      ))[0];

      console.log("Metadata created!");
  
      const masterEditionAddress = (await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      ))[0];
    
    // Define the borsh struct and schema definition for creating the
    const paymentSchema = borsh.struct([
        borsh.u64('num_lamports'),
    ])

    const paymentAmount = new BN(2 * LAMPORTS_PER_SOL);

    const buffer = Buffer.alloc(100);
    paymentSchema.encode({num_lamports: paymentAmount}, buffer);

    const dataBuffer = buffer.subarray(0, paymentSchema.getSpan(buffer));


    console.log(dataBuffer);

    console.log("Master Edition Created");
    // Transact with our program
    // Update this code in order to mint an NFT with metadata
    const instruction = new TransactionInstruction({
        keys: [
            // Mint account
            {
                pubkey: mintKeypair.publicKey,
                isSigner: true,
                isWritable: true,
            },
            // Token account
            {
                pubkey: tokenAddress,
                isSigner: false,
                isWritable: true,
            },
            // Mint Authority
            {
                pubkey: wallet.publicKey,
                isSigner: true,
                isWritable: true,
            },
            // Rent account
            {
                pubkey: SYSVAR_RENT_PUBKEY,
                isSigner: false,
                isWritable: false,
            },
            // System program
            {
                pubkey: SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
            // Token program
            {
                pubkey: TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
            // Associated token program
            {
                pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
            // Metdata account
            {
                pubkey: metadataAddress,
                isSigner: false,
                isWritable: true,
            },
            // Master edition metadata account
            {
                pubkey: masterEditionAddress,
                isSigner: false,
                isWritable: true,
            },
            // Metaplex Token metadata account
            {
                pubkey: TOKEN_METADATA_PROGRAM_ID,
                isSigner: false,
                isWritable: false
            },
            // Property owner account
            {
                pubkey: propertyOwnerPublicKey,
                isSigner: false,
                isWritable: true,
            },
            // Solstay wallet account
            {
                pubkey: SOLSTAY_PUBKEY,
                isSigner: false,
                isWritable: true,
            }
        ],
        programId: programId,
        data: dataBuffer,
    })
    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [wallet, mintKeypair],
    ).then((response) => {
        console.log(response);
    });
    
}

main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  );