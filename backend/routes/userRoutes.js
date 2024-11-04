import express from 'express';
import sendPYUSD from '../services/sendPYUSD.js';
import getTransactions from '../services/getTransactions.js';
import createUserAccount from '../services/walletCreationService.js';
import sendP2P from '../services/p2pTransactions.js';
import User from '../models/User.js';
import getBalance from '../services/getBalance.js';
import bcrypt from 'bcryptjs';


const router = express.Router();

router.post('/register', async (req, res) => {
    console.log('req.body', req.body);
    const { uniqueID, email, password } = req.body.formData;

    try {
        const userInfo = await createUserAccount(uniqueID, email, password);
        res.status(201).json({ success: true, userInfo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { uniqueID, password } = req.body.formData;
    console.log("Form Data Login", req.body.formData);

    try {
        console.log("Trying");
        const userInfo = await User.findOne({ uniqueID });
        if (!userInfo) {
            throw new Error('User not found');
        }
        console.log('User Info', userInfo)
        if(!await bcrypt.compare(password, userInfo.password)){
            throw new Error('Invalid password');
        }
        res.status(200).json({ success: true, userInfo });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
});

router.post('/send', async (req, res) => {
    const { senderUniqueId, password, amount, recepientUniqueId } = req.body.params;
    console.log("Recipient: ", recepientUniqueId, amount, password, senderUniqueId);
    try {
        const transactionHash = await sendPYUSD(senderUniqueId, password, recepientUniqueId, amount);
        res.status(200).json({ success: true, message: 'Transaction completed.', transactionHash });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/p2p', async (req, res) =>{
    const { senderUniqueId, recepientUniqueId, amount } = req.body.params;
    console.log(req.body.params);
    console.log(req.body.params.recepientUniqueId)
    try {
        await sendP2P(senderUniqueId, recepientUniqueId, amount);
        res.status(200).json({ success: true, message: 'P2P transaction completed.'});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/dashboard/:uniqueID', async (req, res) => {
    try {
        const { uniqueID } = req.params;
        const user = await User.findOne({ uniqueID: uniqueID });
        console.log('This is the user:', user);
        const balance = await getBalance(user.decryptPrivateKey());
        const transactions = await getTransactions(user.decryptPrivateKey());

        res.json({
            success: true,
            transactions,
            balance
        });
    } catch (error) {
        console.log('This is the error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;