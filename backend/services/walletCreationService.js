import { Keypair } from '@solana/web3.js';
import User from '../models/User.js';

async function createUserAccount(uniqueId, email, password) {
    try {
        const keypair = Keypair.generate();

        const publicKey = keypair.publicKey.toString();
        const privateKey = Buffer.from(keypair.secretKey).toString('hex');

        const user = new User({
            uniqueID: uniqueId,
            email: email,
            password: password,
            publicKey: publicKey,
            privateKey: privateKey,
        });

        console.log(publicKey)
        await user.save();
        console.log('User and wallet created succesfully');
        return { publicKey, uniqueId };
    } catch (error) {
        console.error('Error creating user account:', error);
        throw error;
    }
}

export default createUserAccount;