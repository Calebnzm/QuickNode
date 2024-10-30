import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferCheckedWithFee, transferChecked } from '@solana/spl-token';
// import User from '../models/User.js';

async function getBalance(privateKey) {
    // console.log('This is the private key:', privateKey);
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    // const connection = new Connection("https://capable-white-dream.solana-devnet.quiknode.pro/573a750d5fd9cfdeed9c430542e2a245dfcd5b7d", 'confirmed');


    const walletOwner = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));

    const tokenAccounts = await connection.getTokenAccountsByOwner(
        walletOwner.publicKey,
        {
            programId: TOKEN_2022_PROGRAM_ID,
        }
    );

    if (tokenAccounts.value.length === 0) {
        return 0;
    }

    console.log('This is the token accounts:', tokenAccounts);
    const data = AccountLayout.decode(tokenAccounts?.value[0]?.account?.data)
    if (data) {
        return data.amount
    } else {
        return 0;
    }
    // console.log('This is the account data', data.amount);
    // console.log("Token                                         Balance");
    // console.log("------------------------------------------------------------");
    // tokenAccounts.value.forEach((tokenAccount) => {
    //     const accountData = AccountLayout.decode(tokenAccount.account.data);
    //     console.log(`${new PublicKey(accountData.mint)}   ${accountData.amount}`);
    // })
    // console.log("------------------------------------------------------------");
}

export default getBalance;