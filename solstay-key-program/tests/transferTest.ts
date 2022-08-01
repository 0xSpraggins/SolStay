import * as anchor from "@project-serum/anchor";
import { create } from "domain";
import fs from 'mz/fs';
import { SolstayKeyProgram } from "../target/types/solstay_key_program";

async function createKeypairFromFile(filepath: string): Promise<anchor.web3.Keypair> {
    const secretKeyString = await fs.readFile(filepath, {encoding: 'utf8'});
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return anchor.web3.Keypair.fromSecretKey(secretKey);
}

describe("NFT Transfer", async () => {
    // Import necessary setup and program
    const provider = anchor.AnchorProvider.env();
    const wallet = provider.wallet as anchor.Wallet;
    anchor.setProvider(provider);

    const program = anchor.workspace.SolstayKeyProgram as anchor.Program<SolstayKeyProgram>;

    // Begin Test
    it("Transfer NFT", async () => {

        //Initialize the transfer price and mint account
        const saleAmount = 1 * anchor.web3.LAMPORTS_PER_SOL;
        const mint: anchor.web3.PublicKey = new anchor.web3.PublicKey(
            // Add the new address after transfer
            "CshtxwQwwCf8HuSN1kdtmBCGhMiqtvs4CvLCgkFYRyeo"
        );
        

        // Bring in the keypair for the customer trying to buy the NFT
        const buyer: anchor.web3.Keypair = await createKeypairFromFile(__dirname + "/Keypairs/customer1.json");
        console.log(`Buyers Public Key: ${buyer.publicKey}`);


        // Get the associated token address for the both the owner and buyer
        const ownerTokenAddress = await anchor.utils.token.associatedAddress({
            mint: mint,
            owner: wallet.publicKey
        });

        const buyerTokenAddress = await anchor.utils.token.associatedAddress({
            mint: mint,
            owner: buyer.publicKey
        });

        //transfer NFT
        await program.methods.transfer(
            new anchor.BN(saleAmount)
        )
        .accounts({
            mint: mint,
            ownerTokenAccount: ownerTokenAddress,
            ownerAuthority: wallet.publicKey,
            buyerTokenAccount: buyerTokenAddress,
            buyerAuthority: buyer.publicKey,
        })
        .signers([buyer])
        .rpc();
    })
})