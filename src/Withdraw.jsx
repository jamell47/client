import React, { useState } from 'react';
import './Withdraw.css';

function Withdraw() {
    const [agent, setAgent] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);

    function resetForm() {
        setAgent('');
        setAmount('');
        setPin('');
    }

    function handleWithdraw(e) {
        e.preventDefault();
        // Basic validation
        if (!agent.trim()) return alert('Please enter an agent number');
        if (!amount || Number(amount) <= 0) return alert('Please enter a valid amount');
        if (!pin || pin.length < 4) return alert('Please enter a 4+ digit PIN');

        setLoading(true);
        // Simulate network/processing delay
        setTimeout(() => {
            setLoading(false);
            alert(`Withdraw request submitted:\nAgent: ${agent}\nAmount: ${Number(amount).toFixed(2)}\nStatus: Successful`);
            resetForm();
        }, 700);
    }

    return (
        <div className="withdraw-page">
            <div className="withdraw-shell">
                <header className="withdraw-header">
                    <h1>Withdraw from Agent</h1>
                    <p className="subtitle">Quick, secure cash-out at the nearest agent.</p>
                </header>

                <form className="withdraw-form" onSubmit={handleWithdraw}>
                    <label className="field">
                        <span className="label">Agent Number</span>
                        <input
                            value={agent}
                            onChange={(e) => setAgent(e.target.value)}
                            type="text"
                            placeholder="Enter agent number"
                            className="input"
                        />
                    </label>

                    <label className="field">
                        <span className="label">Amount</span>
                        <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="number"
                            placeholder="Enter amount to withdraw"
                            className="input"
                            min="0"
                            step="0.01"
                        />
                    </label>

                    <label className="field">
                        <span className="label">PIN</span>
                        <input
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            type="password"
                            placeholder="Enter your PIN"
                            className="input"
                        />
                    </label>

                    <div className="actions">
                        <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Processing...' : 'Withdraw'}</button>
                        <a className="btn link" href="/Dashboard">Back</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Withdraw;