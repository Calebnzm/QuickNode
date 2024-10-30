import express from 'express';
import sendPYUSD from '../services/sendPYUSD.js';
import createUserAccount from '../services/walletCreationService.js';
import User from '../models/User.js';
// import { getUserByUniqueID, getTransactionsByUser, getUserBalance } from '../services/databaseService.js';


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

// router.get('/dashboard/:uniqueID', async (req, res) => {
//     try {
//         const { uniqueID } = req.params;
//         // Implement these functions in your database service
//         const user = await getUserByUniqueID(uniqueID);
//         const transactions = await getTransactionsByUser(uniqueID);
//         const balance = await getUserBalance(uniqueID);

//         res.json({
//             success: true,
//             transactions,
//             balance
//         });
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// });

export default router;