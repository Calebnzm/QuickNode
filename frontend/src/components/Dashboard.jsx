import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);

    const handleOnRamp = () => {
        const loadMoonPaySdk = () => {
            const moonpaySdk = window.MoonPayWebSdk.init({
                flow: "buy",
                environment: "sandbox",
                variant: "overlay",
                params: {
                    apiKey: "pk_test_iSatcTAnG1ybd0UlnN5hTxP2Z0a0GNFu",
                    baseCurrencyCode: "kes",
                    baseCurrencyAmount: "30",
                    defaultCurrencyCode: "pyusd",
                    userAddress: userInfo.publicKey
                }
            });
            moonpaySdk.show();
        };

        const script = document.createElement('script');
        script.src = "https://static.moonpay.com/web-sdk/v1/moonpay-web-sdk.min.js";
        script.defer = true;
        script.onload = loadMoonPaySdk;
        document.body.appendChild(script);
    };

    const handleOffRamp = () => {
        const loadMoonPaySdk = () => {
            const moonpaySdk = window.MoonPayWebSdk.init({
                flow: "sell",
                environment: "sandbox",
                variant: "overlay",
                params: {
                    apiKey: "pk_test_iSatcTAnG1ybd0UlnN5hTxP2Z0a0GNFu",
                    baseCurrencyCode: "pyusd",
                    baseCurrencyAmount: balance,
                    userAddress: userInfo.publicKey,
                    externalCustomerId: userInfo.uniqueID
                }
            });
            moonpaySdk.show();
        };

        const script = document.createElement('script');
        script.src = "https://static.moonpay.com/web-sdk/v1/moonpay-web-sdk.min.js";
        script.defer = true;
        script.onload = loadMoonPaySdk;
        document.body.appendChild(script);
    };

    const handleNavigate = () => {
        navigate('/send-money', {
            state: {
                uniqueID: userInfo.uniqueID
            }
        });
        console.log(userInfo.uniqueID);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('This is the user on dashboard:', user);
        if (!user) {
            navigate('/login');
            return;
        }

        setUserInfo(user);
        fetchUserData(user.uniqueID);

        const intervalId = setInterval(() => {
            fetchUserData(user.uniqueID);
        }, 400000);

        return () => clearInterval(intervalId);
    }, [navigate]);

    const fetchUserData = async (uniqueID) => {
        console.log('This is the uniqueID:', uniqueID);
        try {
            const response = await axios.get(`http://localhost:5000/api/users/dashboard/${uniqueID}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });
            setTransactions(response.data.transactions);
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    if (!userInfo) return null;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-600">Your Unique ID</h2>
                        <div className="flex items-center gap-2">
                            <p className="font-mono text-gray-800">{userInfo.uniqueID || 'No address available'}</p>
                            <button
                                onClick={() => navigator.clipboard.writeText(userInfo.publicKey)}
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
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Wallet Balance</h2>
                    <p className="text-4xl font-bold text-blue-600">{balance} PYUSD</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={handleNavigate}
                            className="bg-[#F4A261] text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Send Money
                        </button>
                        <button
                            onClick={handleOnRamp}
                            className="bg-[#F4A261] text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Credit Wallet
                        </button>
                        <button
                            onClick={handleOffRamp}
                            className="bg-[#F4A261] text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Cash Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4">From Account</th>
                                <th className="text-left p-4">To Account</th>
                                <th className="text-left p-4">Amount Transferred</th>
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
                                transactions.map((tx, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{tx.fromAccount}</td>
                                        <td className="p-4">{tx.toAccount}</td>
                                        <td className="p-4">{tx.amountTransferred}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-sm ${tx.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {tx.success ? 'Success' : 'Failed'}
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
