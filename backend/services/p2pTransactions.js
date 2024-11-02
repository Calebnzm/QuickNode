import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey,sendAndConfirmTransaction,Transaction } from '@solana/web3.js';
import {createTransferInstruction ,TOKEN_PROGRAM_ID, AccountLayout, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferCheckedWithFee, transferChecked } from '@solana/spl-token';
import User from '../models/User.js';



async function sendP2P(senderUniqueId, recipientUniqueId, amount) {
    try {

        console.log(`Sender ${senderUniqueId}, Recepient ${recipientUniqueId}, Amount ${amount}`);
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
        console.log(`Recepient public key: ${recepient.publicKey}`);

        try {
            // Connect to cluster
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

            //Create sender's keypair
            const privateKey = sender.decryptPrivateKey();
            const fromWallet = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));

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
