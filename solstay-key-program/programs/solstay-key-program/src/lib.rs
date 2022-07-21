use anchor_lang::prelude::*;
pub mod mint;
pub mod transfer;
use mint::*;
use transfer::*;

declare_id!("8PCTb312rhuBU7pM1btq6Dy9XPjrEnqEPQySxxADRjGA");

#[program]
pub mod solstay_key_program {
    use super::*;

    pub fn mint(
        ctx: Context<NFTMint>,
        nft_name: String,
        nft_symbol: String,
        nft_uri: String,
    ) -> Result<()> {
        mint::mint(ctx, nft_name, nft_symbol, nft_uri)
    }

    pub fn transfer(ctx: Context<TransferNFT>, price: u64) -> Result<()> {
        transfer::transfer(ctx, price)
    }
}
