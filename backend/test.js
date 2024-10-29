import { Keypair } from '@solana/web3.js';

const keypair = Keypair.generate();
const publicKey = keypair.publicKey.toString();
const privateKey = Buffer.from(keypair.secretKey).toString('hex');

console.log("Private: ", privateKey);
console.log("Public: ", publicKey);