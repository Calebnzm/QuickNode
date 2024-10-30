import express from 'express';
import sendPYUSD from '../services/sendPYUSD.js';
import createUserAccount from '../services/walletCreationService.js';
import sendP2P from '../services/p2pTransactions.js';
import { setDriver } from 'mongoose';


const router = express.Router();

router.post('/register', async (req, res) => {
    const { uniqueID, email, password } = req.query;

    try {
        const userInfo = await createUserAccount(uniqueID, email, password);
        res.status(201).json({ success: true, userInfo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/send', async (req, res) => {
    const { senderUniqueId, recepientPublicKey, amount} = req.query;
    console.log(recepientPublicKey);
    try {
        await sendPYUSD(senderUniqueId, recepientPublicKey, amount);
        res.status(200).json({ succes: true, message: 'Transaction completed.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/p2p', async (req, res) => {
    const {senderUniqueId, recepientUniqueId, amount} = req.query;
    try {
        await sendP2P(senderUniqueId, recepientUniqueId, amount);
        res.status(200).json({ success: true, message: "Transactions succesfull" }) 
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export default router;