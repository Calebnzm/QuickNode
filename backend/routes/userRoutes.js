import express from 'express';
import sendPYUSD from '../services/sendPYUSD.js';
import createUserAccount from '../services/walletCreationService.js';
import sendP2P from '../services/p2pTransactions.js';


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
        // You'll need to implement this service
        const userInfo = await User.findOne({ uniqueID });
        if (!userInfo) {
            throw new Error('User not found');
        }
        console.log('User Info', userInfo)
        if(userInfo.password !== password){
            throw new Error('Invalid password');
        }
        res.status(200).json({ success: true, userInfo });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
});

router.post('/send', async (req, res) => {
    const { senderUniqueId, recepientPublicKey, amount } = req.query;
    console.log(recepientPublicKey);
    try {
        await sendPYUSD(senderUniqueId, recepientPublicKey, amount);
        res.status(200).json({ succes: true, message: 'Transaction completed.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/p2p', async (req, res) =>{
    const { senderUniqueId, recepientUniqueId, amount } = req.query;
    try {
        await sendP2P(senderUniqueId, recepientUniqueId, amount);
        res.status(200).json({ success: true, message: 'P2P transaction completed.'});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;