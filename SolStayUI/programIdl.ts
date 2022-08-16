import * as anchor from '@project-serum/anchor';

export const programIdl: anchor.Idl = {
  "version": "0.1.0",
  "name": "solstay_key_program",
  "instructions": [
    {
      "name": "mint",
      "accounts": [
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEditionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mplTokenMetadata",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nftName",
          "type": "string"
        },
        {
          "name": "nftSymbol",
          "type": "string"
        },
        {
          "name": "nftUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "transfer",
      "accounts": [
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    }
  ],
  "metadata": {
    "address": "8PCTb312rhuBU7pM1btq6Dy9XPjrEnqEPQySxxADRjGA"
  }
}