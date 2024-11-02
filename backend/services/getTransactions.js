import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferCheckedWithFee, transferChecked } from '@solana/spl-token';
import axios from 'axios';

const rpcEndpoint = clusterApiUrl('devnet');

async function getTransactionDetails(signature) {
    try {
        const response = await axios.post(rpcEndpoint, {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTransaction',
            params: [signature, { commitment: 'confirmed' }],
        });

        const transactionDetails = response.data.result;

        // Check if transaction exists
        if (!transactionDetails) {
            console.log("Transaction not found for signature:", signature);
            return null; // Explicitly return null for not found
        }

        const { meta, transaction } = transactionDetails;

        // Check if there are any errors in the transaction
        if (meta.err) {
            console.log("Transaction failed:", meta.err);
            return { success: false, error: meta.err }; // Return error information
        }

        // Extract accounts and their balances
        const preBalances = meta.preBalances;
        const postBalances = meta.postBalances;
        const accountKeys = transaction.message.accountKeys;

        // Store transaction info
        const transactionInfo = {
            fromAccount: null,
            toAccount: null,
            amountTransferred: 0,
            success: true,
        };

        // Loop through each instruction
        transaction.message.instructions.forEach((instruction) => {
            const accounts = instruction.accounts.map(index => accountKeys[index]); // Map indices to public keys

            // Check if there are enough accounts for this instruction
            if (accounts.length < 2) {
                console.log(`Instruction does not have enough accounts:`, instruction);
                return;
            }

            transactionInfo.fromAccount = accounts[0]; // Assume the first account is the sender
            transactionInfo.toAccount = accounts[1]; // Assume the second account is the receiver

            // Calculate the amount transferred based on balances
            transactionInfo.amountTransferred = preBalances[instruction.accounts[0]] - postBalances[instruction.accounts[0]];
        });

        return transactionInfo; // Return the structured transaction information

    } catch (error) {
        console.error("Error fetching transaction details:", error);
        return null; // Return null in case of error
    }
}



async function getTransactions(privateKey) {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const walletOwner = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));

        // Fetch transaction signatures for the wallet address
        const transactions = await connection.getSignaturesForAddress(walletOwner.publicKey);
        const transactionDetailsList = []; // Array to hold transaction details

        // Loop through each transaction signature and get transaction details
        for (const { signature } of transactions) {
            const transactionDetails = await getTransactionDetails(signature);
            if (transactionDetails) {
                transactionDetailsList.push(transactionDetails); // Collect non-null transaction details
            }
        }

        // console.log(transactionDetailsList);
        return transactionDetailsList; // Return the list of transaction details

    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}




export default getTransactions;