import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function SendMoney() {
    const location = useLocation();
    const { uniqueID } = location.state || {};
    console.log(uniqueID);

    const [formData, setFormData] = useState({
        recepientUniqueId: '',
        amount: ''
    });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);
        try {
            const response = await axios.post(`http://localhost:5000/api/users/p2p`, {
                params: {
                    senderUniqueId: uniqueID,
                    recepientUniqueId: formData.recepientUniqueId,
                    amount: formData.amount
                }
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Send Money</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        name="recepientUniqueId"
                        placeholder="Recipient's Public Key"
                        value={formData.recepientUniqueId}
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
        </div>
    );
}

export default SendMoney;
