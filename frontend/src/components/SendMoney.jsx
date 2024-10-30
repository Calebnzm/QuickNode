import { useState } from 'react';
import axios from 'axios';

function SendMoney() {
    const [formData, setFormData] = useState({
        senderUniqueId: '',
        recepientPublicKey: '',
        amount: ''
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/users/send`, {
                params: formData
            });
            setMessage('Transaction completed successfully!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Transaction failed');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Send Money</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    name="senderUniqueId"
                    placeholder="Your Unique ID"
                    value={formData.senderUniqueId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                    type="text"
                    name="recepientPublicKey"
                    placeholder="Recipient's Public Key"
                    value={formData.recepientPublicKey}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Send Money
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-center ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default SendMoney;