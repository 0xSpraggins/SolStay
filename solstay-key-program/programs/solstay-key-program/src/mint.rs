use anchor_lang::{prelude::*, solana_program::program::invoke, system_program};
use anchor_spl::{associated_token, token};
use mpl_token_metadata::{instruction as metaplex_instruction, ID as TOKEN_METADATA_ID};

pub fn mint(
    ctx: Context<NFTMint>,
    nft_name: String,
    nft_symbol: String,
    nft_uri: String,
) -> Result<()> {
    // Step 1: Create Mint Account
    msg!("Creating Mint Account....");
    system_program::create_account(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            system_program::CreateAccount {
                from: ctx.accounts.mint_authority.to_account_info(),
                to: ctx.accounts.mint.to_account_info(),
            },
        ),
        10000000,
        82,
        &ctx.accounts.token_program.key(),
    )?;
    msg!("Mint Account Created");

    token::initialize_mint(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::InitializeMint {
                mint: ctx.accounts.mint.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        ),
        0,
        &ctx.accounts.mint_authority.key(),
        Some(&ctx.accounts.mint_authority.key()),
    )?;
    msg!("Mint Initialized");

    // Step 2: Create Token Account
    associated_token::create(CpiContext::new(
        ctx.accounts.associated_token_program.to_account_info(),
        associated_token::Create {
            payer: ctx.accounts.mint_authority.to_account_info(),
            associated_token: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        },
    ))?;

    // Step 3: Mint NFT to Token Account
    msg!("NFT minting to token account");
    token::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
        ),
        1,
    )?;
    msg!("Minting Complete");

    // Step 4: Create Metadata accounts for metadata and master_edition_metadata
    msg!("Creating metadata...");
    invoke(
        &metaplex_instruction::create_metadata_accounts_v3(
            TOKEN_METADATA_ID,
            ctx.accounts.metadata.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.mint_authority.key(),
            nft_name,
            nft_symbol,
            nft_uri,
            None,
            0,
            true,
            true,
            None,
            None,
            None,
        ),
        &[
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.token_account.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
    )?;

    msg!("Creating master edition...");
    invoke(
        &metaplex_instruction::create_master_edition_v3(
            TOKEN_METADATA_ID,
            ctx.accounts.master_edition_metadata.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.metadata.key(),
            ctx.accounts.mint_authority.key(),
            Some(0),
        ),
        &[
            ctx.accounts.master_edition_metadata.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.token_account.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
    )?;

    msg!("Metadata and master edition created");

    Ok(())
}

#[derive(Accounts)]
pub struct NFTMint<'info> {
    /// CHECK: Account created via Metaplex
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: Account created via Metaplex
    #[account(mut)]
    pub master_edition_metadata: UncheckedAccount<'info>,
    #[account(mut)]
    pub mint: Signer<'info>,
    /// CHECK: Account created via Anchor
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    // Various programs involved in mint process
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    ///CHECK: Metaplex with check this program
    pub mpl_token_metadata: UncheckedAccount<'info>,
}
