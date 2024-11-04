import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function ConfirmPayment() {
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const userUniqueId = params.get("userUniqueId");
    const merchantPublicKey = params.get("merchantUniqueId");
    const amount = params.get("amount");
    const returnUrl = params.get('returnUrl');
    console.log(`Sender ${userUniqueId}, Merchant: ${merchantPublicKey}, amount: ${amount}`);

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleConfirm = async () => {
        setLoading(true);
        setError("");
    
        try {
            console.log("Merchant Unique Id: ", merchantPublicKey);

            const response = await axios.post("http://localhost:5000/api/users/send", {
                params: {
                    senderUniqueId: userUniqueId,
                    password,
                    amount,
                    recepientUniqueId: merchantPublicKey,
                }
            });
    
            if (response.data.success) {
                const transactionHash = response.data.transactionHash;
                const redirectUrl = `${returnUrl}?status=success&transactionHash=${transactionHash}`;
                window.location.href = redirectUrl;
            } else {
                setError("Payment failed. Please check your balance and password.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-[#0D3B66] mb-6">Confirm Payment</h2>
            <p className="mb-2"><strong>Amount:</strong> ${amount}</p>
            <p className="mb-4"><strong>Merchant:</strong> {merchantPublicKey}</p>

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
            />

            <button
                onClick={handleConfirm}
                className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
                    loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-[#F4A261] hover:bg-[#F4A261]/80 focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:ring-opacity-50"
                }`}
                disabled={loading}
            >
                {loading ? "Processing..." : "Confirm Payment"}
            </button>

            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </div>
    );
}

export default ConfirmPayment;