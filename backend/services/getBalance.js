import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferCheckedWithFee, transferChecked } from '@solana/spl-token';

async function getBalance(privateKey) {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');


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
        return Number(data.amount.toString()/1000000)
    } else {
        return 0;
    }
}

export default getBalance;