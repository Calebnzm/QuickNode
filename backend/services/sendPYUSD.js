import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferCheckedWithFee, transferChecked } from '@solana/spl-token';
import bcrypt from 'bcryptjs';


import User from '../models/User.js';

async function sendPYUSD(senderUniqueId, password, recepientUniqueId, amount) {
    try {
        const connection = new Connection("https://capable-white-dream.solana-devnet.quiknode.pro/573a750d5fd9cfdeed9c430542e2a245dfcd5b7d", 'confirmed');

        console.log(senderUniqueId)
        // Find sender's user info
        const sender = await User.findOne({ uniqueID: senderUniqueId });
        if (!sender) {
            throw new Error("Sender not found");
        }

        if (!await bcrypt.compare(password, sender.password)){
            throw new Error("Incorrect password!");
        }

        const recepient = await User.findOne({ uniqueID: recepientUniqueId});
        if(!recepient){
            throw new Error("Recepient not found");
        }
        const recipientPublicKeyString = recepient.publicKey;

        try {
            // Connect to cluster
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

            const privateKey = sender.decryptPrivateKey();
            console.log("PrivateKey: ", privateKey);
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
            return signature;
        } catch (error) {
            console.error("Transaction failed with error:", error);
        }

    } catch (error) {
        console.error('Error sending PYUSD', error);
        throw error;
    }
}

export default sendPYUSD;
