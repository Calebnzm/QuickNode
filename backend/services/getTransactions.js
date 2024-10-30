import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferCheckedWithFee, transferChecked } from '@solana/spl-token';
//
async function getTransactions(privateKey) {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const walletOwner = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));

        const transactions = await connection.getSignaturesForAddress(walletOwner.publicKey);
        console.log(transactions);
        return transactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}
export default getTransactions;