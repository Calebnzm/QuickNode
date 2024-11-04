# PayPyUSD

**PayPyUSD** is a secure, user-friendly payment solution for online and peer-to-peer (P2P) transactions using the PYUSD stablecoin by PayPal. It allows customers and merchants to transact without sharing sensitive information, reducing fraud risks and eliminating chargeback obligations for merchants.

## Overview

Traditional payment methods often require customers to share sensitive data, such as credit card information, with merchants. While most merchants are trustworthy, customers may still face risks from fraudulent parties or data breaches. **PayPyUSD** addresses these vulnerabilities by offering a “Pay with PYUSD” option that eliminates the need for customers to disclose any sensitive information to merchants, instead using a unique Customer ID to facilitate secure transactions.

PayPyUSD employs a custodial wallet system, making it accessible for users unfamiliar with Web3, crypto, or blockchain technology. The wallet operates transparently to enhance usability, and payments are stable through the PYUSD stablecoin, protecting users from value fluctuations over time. Users can also easily fund their accounts and cash out instantly using MoonPay.

## Key Features

- **Secure Transactions**: Customers transact with a unique Customer ID, reducing exposure to fraud or data theft.
- **Multiple Authentication Layers**: PayPyUSD includes several layers of authentication for merchants, ensuring that transactions are genuinely initiated by account owners, eliminating the need for chargebacks.
- **Custodial Wallet System**: Designed for accessibility, PayPyUSD’s custodial wallet is invisible to users unfamiliar with blockchain, allowing them to benefit from Web3 without additional complexity.
- **Value Stability**: Payments are made using PayPal’s PYUSD stablecoin, ensuring funds retain value over time.
- **Easy Funding and Cash-Out**: Users can fund their accounts and cash out via MoonPay instantly.

## How It Works

### One-Time Purchases

1. Merchants offer the "Pay with PYUSD" option on their site.
2. Customers enter their unique Customer ID.
3. They are redirected to a secure page to confirm and authorize the payment with their password.
4. Payment is completed, and the customer is returned to the merchant’s website.
5. The merchant receives a transaction hash for payment verification.

### P2P Transactions

PayPyUSD also facilitates P2P transactions, making cross-border transfers fast, affordable, and straightforward.

1. Users need only the recipient’s unique Customer ID to initiate a transfer.
2. PYUSD transfers can be cashed out to fiat currency immediately using MoonPay.

## Benefits

- **Enhanced Security**: Transactions require only a Customer ID, safeguarding sensitive data.
- **Reduced Chargebacks**: Merchant authentication ensures genuine transactions.
- **Accessible to All Users**: The custodial wallet model simplifies use, even for those new to Web3.
- **Seamless P2P and Cross-Border Payments**: Quick, low-cost transfers that users can convert to fiat.

---

## Project Overview

The project is structured with three main folders:

1. **Backend**: Contains all business logic, transaction logic, and operational logic.
2. **Frontend**: Holds the front-end UI for using the application.
3. **Merchant**: Includes an abstract implementation of the "Pay with PYUSD" option for integration on a merchant website.

### Running the Project

To set up and run the project locally:

1. Clone the repository.
2. Run `npm install` in each folder (`Backend`, `Frontend`, and `Merchant`).
3. Start each component using the following commands:
   - **Backend**: `nodemon start`
   - **Frontend**: `npm run dev`
   - **Merchant**: `npm start`

### Troubleshooting

If you encounter issues with the MoonPay on-ramp and off-ramp, you can use the following faucets to fund your wallet:

- **PYUSD (Solana devnet)**: [faucet.paxos.com](https://faucet.paxos.com)
- **SOL**: [faucet.solana.com](https://faucet.solana.com)

Your public key can be found by clicking the copy button next to your Unique Customer ID in the application.
