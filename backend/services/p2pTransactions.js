import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferCheckedWithFee, transferChecked } from '@solana/spl-token';

import User from '../models/User.js';

async function sendP2P(senderUniqueId, recipientUniqueId, amount) {
    try {
        // Find sender's user info
        const sender = await User.findOne({ uniqueID: senderUniqueId });
        if (!sender) {
            throw new Error("Sender not found!");
        }

        // Find the recepients user info
        const recepient = await User.findOne({ uniqueID: recipientUniqueId });
        if (!recepient) {
            throw new Error("Recepient not found!");
        }

        try {
            // Connect to cluster
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

            //Create sender's keypair
            const privateKey = sender.privateKey;
            const fromWallet = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));

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

            console.log(recepient.publicKey);
            // Get the token account of the toWallet address, and if it does not exist, create it
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection,
                fromWallet,
                PYUSD_MINT_ADDRESS,
                new PublicKey(recepient.publicKey),
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

export default sendP2P;
