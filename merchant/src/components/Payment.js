import React, { useState } from 'react';

function MerchantPaymentPage() {
    const [userUniqueId, setUserUniqueId] = useState('');
    const merchantUniqueId = 'Spotify Premium'; // Replace with actual merchant public key
    const amount = 10; // Set the amount determined by the merchant

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const paymentURL = `http://localhost:5173/confirm-payment?userUniqueId=${userUniqueId}&merchantUniqueId=${merchantUniqueId}&amount=${amount}&returnUrl=${encodeURIComponent(window.location.origin + '/payment-return')}`;
        window.location.href = paymentURL;
    };
    

    return (
        <div style={styles.container}>
            <h2>Pay with PYUSD</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label htmlFor="userUniqueId" style={styles.label}>User Unique ID:</label>
                <input
                    type="text"
                    id="userUniqueId"
                    value={userUniqueId}
                    onChange={(e) => setUserUniqueId(e.target.value)}
                    required
                    placeholder="Enter your unique ID"
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Proceed to Pay</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '10px',
        fontSize: '16px',
    },
    input: {
        padding: '10px',
        width: '100%',
        marginBottom: '10px',
    },
    button: {
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default MerchantPaymentPage;
