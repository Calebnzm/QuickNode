// import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
// import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';

// (async () => {
//     const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

//     const hexString = '01411e6394a28676b13a7a2a8b3f7023c92dbdbe80cf565601092788e36a57d5d2164251588e68d9e1a27dc1c8877e1a5b7cef44d99bbfc773565c509ad14fd3';

//     const secretKey = Uint8Array.from(Buffer.from(hexString, 'hex'));
    
//     const sender = Keypair.fromSecretKey(secretKey);
//     const receiverPublicKey = new PublicKey('9MnNETdMHx3fevw1xN2iBiawh8xbUTUqMPfiL3Kv4zwD');

//     const tokenMintAddress = new PublicKey('CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM');

//     const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
//         connection,
//         sender,
//         tokenMintAddress,
//         sender.publicKey
//     );

//     const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
//         connection,
//         sender,
//         tokenMintAddress,
//         receiverPublicKey
//     );

//     const amount = 50;
//     const transferSignature = await transer(
//         connection,
//         sender,
//         senderTokenAccount.address,
//         receiverTokenAccount.address,
//         sender.publicKey,
//         amount
//     );

//     console.log('Transfer completed with signature', transferSignature);
// })();



import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";

// Hex string for the private key
const hexString = '01411e6394a28676b13a7a2a8b3f7023c92dbdbe80cf565601092788e36a57d5d2164251588e68d9e1a27dc1c8877e1a5b7cef44d99bbfc773565c509ad14fd3';
const secretKey = Uint8Array.from(Buffer.from(hexString, 'hex'));

// Keypair and connection setup
const FROM_KEYPAIR = Keypair.fromSecretKey(secretKey);
const QUICKNODE_RPC = 'https://capable-white-dream.solana-devnet.quiknode.pro/573a750d5fd9cfdeed9c430542e2a245dfcd5b7d';
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

// Wallet addresses and token details
const DESTINATION_WALLET = '9MnNETdMHx3fevw1xN2iBiawh8xbUTUqMPfiL3Kv4zwD';
const MINT_ADDRESS = 'CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM';
const TRANSFER_AMOUNT = 100;



// async function sendTokens() {
//   console.log(`Sending ${TRANSFER_AMOUNT} tokens from ${FROM_KEYPAIR.publicKey.toString()} to ${DESTINATION_WALLET}.`);

//   // Step 1: Get Source Token Account
//   console.log(`1 - Getting Source Token Account`);
//   const sourceAccount = await getOrCreateAssociatedTokenAccount(
//     SOLANA_CONNECTION,
//     FROM_KEYPAIR,
//     new PublicKey(MINT_ADDRESS),
//     FROM_KEYPAIR.publicKey
//   );

//   // Step 2: Get Destination Token Account
//   console.log(`2 - Getting Destination Token Account`);
//   const destinationAccount = await getOrCreateAssociatedTokenAccount(
//     SOLANA_CONNECTION,
//     FROM_KEYPAIR,
//     new PublicKey(MINT_ADDRESS),
//     new PublicKey(DESTINATION_WALLET)
//   );
//   console.log(`Destination Account: ${destinationAccount.address.toString()}`);

//   // Step 3: Fetch Number of Decimals for Mint
// //   console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
// //   const numberDecimals = await getNumberDecimals(MINT_ADDRESS);
// //   console.log(`Number of Decimals: ${numberDecimals}`);

//   // Step 4: Create and Send Transaction
//   console.log(`4 - Creating and Sending Transaction`);
//   const tx = new Transaction();
//   tx.add(createTransferInstruction(
//     sourceAccount.address,
//     destinationAccount.address,
//     FROM_KEYPAIR.publicKey,
//     TRANSFER_AMOUNT // Adjusted for decimals
//   ));

//   // Confirm transaction
//   const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION, tx, [FROM_KEYPAIR]);
//   console.log(`Transaction successful with signature: ${signature}`);
// }

// // Execute the sendTokens function
// sendTokens().catch(err => console.error('Error:', err));

async function transferSOL(senderKeypair, recipientAddress, amount) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: new PublicKey(recipientAddress),
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const signature = await connection.sendTransaction(transaction, [senderKeypair]);
  await connection.confirmTransaction(signature);
  console.log("Transaction Signature:", signature);
}