import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction,Transaction } from '@solana/web3.js';
import { transfer,createTransferInstruction, TOKEN_PROGRAM_ID, AccountLayout, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferCheckedWithFee, transferChecked } from '@solana/spl-token';


async function sendP2P(senderUniqueId, recipientUniqueId, amount) {
    try {
        // Connect to cluster
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        //Create sender's keypair
        const privateKey = '150bad298bde6ae731543c6659e3b93da3339b7701d0bda284fd1f2f61efe0833d4a7dd561c5c370f6598add6ba702b3c1f26b02e8f8938f257d5d6b85781c86';
        const fromWallet = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));
        const privateKey2 = "a7c8e9c493b9766181a6a00b66d32bb5d7adc55005ae755ba0a2848878b15e12101c4a11cd2a346cca684ef9de4f05eebf6a6bf3a5b8757e82b226c04a8364a7";
        const toWallet = Keypair.fromSecretKey(Buffer.from(privateKey2, 'hex'));

        const tokenAccounts = await connection.getTokenAccountsByOwner(
            fromWallet.publicKey,
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
            toWallet.publicKey,
            undefined, undefined, undefined, TOKEN_2022_PROGRAM_ID);

        console.log('Reached transfer')


        // let signature = await transferChecked(
        //     connection,
        //     fromWallet,
        //     fromTokenAccount.address,
        //     PYUSD_MINT_ADDRESS,
        //     toTokenAccount.address,
        //     fromWallet.publicKey,
        //     amount * 1000000,
        //     6,
        //     undefined,
        //     undefined,
        //     TOKEN_2022_PROGRAM_ID,
        // );
        // console.log('transfer tx:', signature);
        // Add token transfer instructions to transaction
        const transaction = new Transaction().add(
            createTransferInstruction(
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                10000000,
                undefined,
                TOKEN_2022_PROGRAM_ID,
            ),
        );

        // Sign transaction, broadcast, and confirm
        let trans = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
        console.log('This is the transaction', trans)
    } catch (error) {
        console.error("Transaction failed with error:", error);
    }
}
sendP2P()
export default sendP2P;
