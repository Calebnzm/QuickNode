import { Connection, Keypair, Transaction, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, createAssociatedTokenAccountIdempotent, createTransferInstruction, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import User from '../models/User.js';

async function sendPYUSD(senderUniqueId, recipientPublicKeyString, amount) {
    try {
        const connection = new Connection("https://capable-white-dream.solana-devnet.quiknode.pro/573a750d5fd9cfdeed9c430542e2a245dfcd5b7d", 'confirmed');

        console.log(senderUniqueId)
        // Find sender's user info
        const sender = await User.find({ uniqueId: senderUniqueId });
        // if (!sender) {
        //     throw new Error('Sender not found.');
        // }

        // Decrypt sender's private key and create Keypair
        // console.log(sender);
        // const privateKey = sender.privateKey;
        const privateKey = "6414d3d7125738c39150f78fb110e9e68e59bad05b9c5ab76583663d0853c452fb6a538afd21b50c2c581e7267cd62590121656d366a32b3c260405df4447931";

        const senderKeypair = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));

        const senderPublicKey = new PublicKey("HvRNKv5ZiFAxczYX2ksBizYNKGXY74LTv41pRCWjbPFW");

        // Replace with the actual PYUSD mint address
        const PYUSD_MINT_ADDRESS = new PublicKey('CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM'); 

        console.log(recipientPublicKeyString);
        const recipientPublicKey = new PublicKey(recipientPublicKeyString);

        // Get or create the sender's associated token account
        // const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        //     connection,
        //     senderKeypair,
        //     PYUSD_MINT_ADDRESS,
        //     senderPublicKey
        // );

        const senderTokenAccount = await createAssociatedTokenAccountIdempotent(
            connection,
            senderKeypair,
            PYUSD_MINT_ADDRESS,
            senderPublicKey,
            {}, 
            TOKEN_2022_PROGRAM_ID
        );

        // // Get or create the recipient's associated token account
        // const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        //     connection,
        //     senderKeypair,
        //     PYUSD_MINT_ADDRESS,
        //     new PublicKey(recipientPublicKey)
        // );

        const recipientTokenAccount = await createAssociatedTokenAccountIdempotent(
            connection,
            senderKeypair,
            PYUSD_MINT_ADDRESS,
            recipientPublicKey,
            {}, 
            TOKEN_2022_PROGRAM_ID
        );

        
        console.log(`Token addresses ${senderTokenAccount}, ${recipientTokenAccount}, ${senderKeypair.publicKey}, ${amount}`)
        // Create the transfer instruction
        // const transferInstruction = createTransferInstruction(
        //     senderTokenAccount.address,
        //     recipientTokenAccount.address,
        //     senderKeypair.publicKey,
        //     amount,
        //     [],
        //     TOKEN_2022_PROGRAM_ID
        // );

        // // Create and send the transaction
        // const transaction = new Transaction().add(transferInstruction);
        // const signature = await connection.sendTransaction(transaction, [senderKeypair]);
        // console.log("Transaction sent:", signature);

        // // Confirm the transaction
        // await connection.confirmTransaction(signature);
        // console.log("Transaction confirmed.");

        const transaction = new Transaction().add(
            createTransferInstruction(
              senderTokenAccount,
              recipientTokenAccount,
              senderPublicKey,
              1,
            ),
          );
         
          // Sign transaction, broadcast, and confirm
          console.log(senderKeypair);
          await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
    } catch (error) {
        console.error('Error sending PYUSD', error);
        throw error;
    }
}

export default sendPYUSD;
