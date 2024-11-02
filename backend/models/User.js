import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

const UserSchema = new mongoose.Schema({
    uniqueID: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    publicKey:{
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
});

UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password, 10);
    }

    if (user.isModified('privateKey')) {
        const encryptedPrivateKey = CryptoJS.AES.encrypt(user.privateKey, process.env.SECRET_KEY).toString();
        user.privateKey = encryptedPrivateKey;
    }

    next();
});

UserSchema.methods.decryptPrivateKey = function () {
    const bytes = CryptoJS.AES.decrypt(this.privateKey, process.env.SECRET_KEY);
    const originalPrivateKey = bytes.toString(CryptoJS.enc.Utf8);
    return originalPrivateKey;
};

const User = mongoose.model('User', UserSchema);

export default User;