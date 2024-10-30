import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);

    // Mock data
    const mockTransactions = [
        {
            _id: '1',
            date: '2023-10-01',
            type: 'Send',
            amount: 100.00,
            status: 'completed'
        },
        {
            _id: '2', 
            date: '2023-10-02',
            type: 'Receive',
            amount: 250.50,
            status: 'completed'
        },
        {
            _id: '3',
            date: '2023-10-03', 
            type: 'Send',
            amount: 75.25,
            status: 'pending'
        },
        {
            _id: '4',
            date: '2023-10-04',
            type: 'Send',
            amount: 500.00,
            status: 'failed'
        }
    ];

    const mockBalance = 1275.25;

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('This is the user:', user);
        if (!user) {
            navigate('/login');
            return;
        }
        
        setUserInfo(user);
        fetchUserData(user.uniqueId);
        // setTransactions(mockTransactions);
        // setBalance(mockBalance);
    }, [navigate]);

    const fetchUserData = async (uniqueID) => {
        console.log('This is the uniqueID:', uniqueID);
        try {
            const response = await axios.get(`http://localhost:5000/api/users/dashboard/${uniqueID}`);
            setTransactions(response.data.transactions);
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    if (!userInfo) return null;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Add Public Address Display */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-600">Your Public Address</h2>
                        <div className="flex items-center gap-2">
                            <p className="font-mono text-gray-800">{userInfo.publicAddress || 'No address available'}</p>
                            <button 
                                onClick={() => navigator.clipboard.writeText(userInfo.publicAddress)}
                                className="text-blue-600 hover:text-blue-700"
                                title="Copy to clipboard"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Balance Card */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Wallet Balance</h2>
                    <p className="text-4xl font-bold text-blue-600">${balance.toFixed(2)}</p>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => navigate('/send-money')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Send Money
                        </button>
                        {/* Add more action buttons as needed */}
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4">Date</th>
                                <th className="text-left p-4">Type</th>
                                <th className="text-left p-4">Amount</th>
                                <th className="text-left p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="p-4">{tx.type}</td>
                                        <td className="p-4">${tx.amount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;