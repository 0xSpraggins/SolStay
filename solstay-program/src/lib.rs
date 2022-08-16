use {
    mpl_token_metadata::{instruction as metaplex_instruction, ID as TOKEN_METADATA_ID},
    solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint,
        entrypoint::ProgramResult,
        msg,
        native_token::LAMPORTS_PER_SOL,
        program::invoke,
        pubkey::Pubkey,
        system_instruction,
    },
    spl_associated_token_account::instruction as token_account_instruction,
    spl_token::instruction as token_instruction,
};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instrcution_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    // Iterate through all the accounts
    let mint = next_account_info(accounts_iter)?;
    let token_account = next_account_info(accounts_iter)?;
    let mint_authority = next_account_info(accounts_iter)?;
    let rent = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;
    let associated_token_program = next_account_info(accounts_iter)?;
    let metadata = next_account_info(accounts_iter)?;
    let master_edition_metadata = next_account_info(accounts_iter)?;
    let metaplex_token_metadata = next_account_info(accounts_iter)?;

    msg!("Pay the creator for the mint...");
    msg!("Creating mint account...");
    msg!("Mint: {}", mint.key);
    invoke(
        &system_instruction::create_account(
            &mint_authority.key,
            &mint.key,
            LAMPORTS_PER_SOL,
            82,
            &token_program.key,
        ),
        &[mint.clone(), mint_authority.clone(), token_program.clone()],
    )?;

    msg!("Initializing mint account...");
    msg!("Mint: {}", mint.key);
    invoke(
        &token_instruction::initialize_mint(
            &token_program.key,
            &mint.key,
            &mint_authority.key,
            Some(&mint_authority.key),
            0,
        )?,
        &[
            mint.clone(),
            mint_authority.clone(),
            token_program.clone(),
            rent.clone(),
        ],
    )?;

    msg!("Creating token account...");
    msg!("Token Address {}", token_account.key);
    invoke(
        &token_account_instruction::create_associated_token_account(
            &mint_authority.key,
            &mint_authority.key,
            &mint.key,
        ),
        &[
            mint.clone(),
            token_account.clone(),
            mint_authority.clone(),
            token_program.clone(),
            associated_token_program.clone(),
        ],
    )?;

    msg!("Mint NFT to token account...");
    invoke(
        &token_instruction::mint_to(
            &token_program.key,
            &mint.key,
            &token_account.key,
            &mint_authority.key,
            &[&mint_authority.key],
            1,
        )?,
        &[
            mint.clone(),
            mint_authority.clone(),
            token_account.clone(),
            token_program.clone(),
            rent.clone(),
        ],
    )?;

    msg!("Creating Metadata...");
    invoke(
        &metaplex_instruction::create_metadata_accounts_v3(
            TOKEN_METADATA_ID,
            *metadata.key,
            *mint.key,
            *mint_authority.key,
            *mint_authority.key, //Payer
            *mint_authority.key,
            String::from("Sol Stay | Key"),
            String::from("STAY"),
            String::from("https://github.com/baileyspraggins/SolStay/blob/main/solstay-program/solstaymetadata.json"),
            None,
            0,
            true,
            true,
            None,
            None,
            None,
        ),
        &[
            metadata.clone(),
            mint.clone(),
            mint_authority.clone(),
            token_account.clone(),
            rent.clone(),
        ],
    )?;

    msg!("Creating master edition...");
    invoke(
        &metaplex_instruction::create_master_edition_v3(
            TOKEN_METADATA_ID,
            *master_edition_metadata.key,
            *mint.key,
            *mint_authority.key,
            *mint_authority.key,
            *metadata.key,
            *mint_authority.key,
            Some(0),
        ),
        &[
            master_edition_metadata.clone(),
            mint.clone(),
            mint_authority.clone(),
            metadata.clone(),
            token_account.clone(),
            rent.clone(),
        ],
    );

    msg!("Metadata and master edition created");

    //msg!("Transfer NFT to the user and pay the owner of the house")

    Ok(())
}
