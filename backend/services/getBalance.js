import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferCheckedWithFee, transferChecked } from '@solana/spl-token';
import User from '../models/User.js';


async function getBalance(uniqueID) {
    
    // const user = User.findOne({ uniqueID });
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const tokenAccounts = await connection.getTokenAccountsByOwner(
        new PublicKey("HvRNKv5ZiFAxczYX2ksBizYNKGXY74LTv41pRCWjbPFW"),
        {
            programId: TOKEN_2022_PROGRAM_ID,
        }
    );

    console.log("Token                                         Balance");
    console.log("------------------------------------------------------------");
    tokenAccounts.value.forEach((tokenAccount) => {
        const accountData = AccountLayout.decode(tokenAccount.account.data);
        console.log(`${new PublicKey(accountData.mint)}   ${accountData.amount}`);
    })
    console.log("------------------------------------------------------------");



}

export default getBalance;