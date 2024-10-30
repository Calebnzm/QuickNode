import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferCheckedWithFee, transferChecked } from '@solana/spl-token';

import User from '../models/User.js';

async function sendPYUSD(senderUniqueId, recipientPublicKeyString, amount) {
    try {
        const connection = new Connection("https://capable-white-dream.solana-devnet.quiknode.pro/573a750d5fd9cfdeed9c430542e2a245dfcd5b7d", 'confirmed');

        console.log(senderUniqueId)
        // Find sender's user info
        const sender = await User.find({ uniqueID: senderUniqueId });

        try {
            // Connect to cluster
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

            const privateKey = "6414d3d7125738c39150f78fb110e9e68e59bad05b9c5ab76583663d0853c452fb6a538afd21b50c2c581e7267cd62590121656d366a32b3c260405df4447931";
            const privateKey2 = "f6c78d781188a3b7c54003aed64489de7b8bcf03079d672c30d154609ffe45ad7c30683c5cf43ad3ab6c1b107f43e7699921ca6ca74083781b8d49ca7c747254";
            const fromWallet = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));
            const toWallet = Keypair.fromSecretKey(Buffer.from(privateKey2, 'hex'));

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


            const PYUSD_MINT_ADDRESS = new PublicKey('CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM');

            // Get the token account of the fromWallet address, and if it does not exist, create it
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                PYUSD_MINT_ADDRESS,
                fromWallet.publicKey,
                undefined,
                undefined,
                undefined,
                TOKEN_2022_PROGRAM_ID,
                // associatedTokenProgramId: ASSOCIATED_TOKEN_PROGRAM_ID
            );

            // Get the token account of the toWallet address, and if it does not exist, create it
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection,
                fromWallet,
                PYUSD_MINT_ADDRESS,
                new PublicKey(recipientPublicKeyString),
                undefined, undefined, undefined, TOKEN_2022_PROGRAM_ID);

            console.log('Reached transfer')


            let signature = await transferChecked(
                connection,
                fromWallet,
                fromTokenAccount.address,
                PYUSD_MINT_ADDRESS,
                toTokenAccount.address,
                fromWallet.publicKey,
                amount * 1000000,
                6,
                undefined,
                undefined,
                TOKEN_2022_PROGRAM_ID,
            );
            console.log('transfer tx:', signature);
        } catch (error) {
            console.error("Transaction failed with error:", error);
        }

    } catch (error) {
        console.error('Error sending PYUSD', error);
        throw error;
    }
}

export default sendPYUSD;
