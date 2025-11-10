import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Pay() {
    const [business, setBusiness] = useState('');
    const [acct, setAcct] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        if (!business || !acct || !amount) return alert('Please fill all fields');
        alert(` confirm ${amount} Paid to ${business} (acct: ${acct})`);
        navigate('/Dashboard');
    }

    return (
        <div className="page-container">
            <div className="card form-card">
                <h2>Pay bill</h2>
                <form onSubmit={handleSubmit} className="form">
                    <label className="field">
                        <span className="label">Business number</span>
                        <input className="input" value={business} onChange={e => setBusiness(e.target.value)} />
                    </label>
                    <label className="field">
                        <span className="label">Account number</span>
                        <input className="input" value={acct} onChange={e => setAcct(e.target.value)} />
                    </label>
                    <label className="field">
                        <span className="label">Amount</span>
                        <input className="input" value={amount} onChange={e => setAmount(e.target.value)} type="number" />
                    </label>
                    <div className="actions">
                        <button className="btn primary" type="submit">Pay</button>
                        <button type="button" className="btn link" onClick={() => navigate('/Dashboard')}>Back</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Pay;