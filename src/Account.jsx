import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Account() {
    const navigate = useNavigate();
    // Example account state
    const [email, setEmail] = useState('you@example.com');
    const [phone, setPhone] = useState('+254700000000');
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingPhone, setEditingPhone] = useState(false);


    function handleDeposit() {
        alert('To deposit money, visit any agent or use the Deposit option in your bank app.');
    }

    function handleStatement() {
        alert('Mini statement:\n1) -200 KES (Sent)\n2) +150 KES (Received)\n3) -100 KES (Loan)');
    }

    function handlePinManager() {
        alert('PIN Manager: You can change or disable your PIN from the security settings.');
    }

    function handleResetPin() {
        alert('Reset PIN: A reset code will be sent to your phone. Follow the instructions to set a new PIN.');
    }

    function handleLanguage() {
        alert('Language settings: English selected. More languages coming soon.');
    }

    function handleViewProfile() {
        alert(`Profile:\nName: Dennis Banks\nEmail: ${email}\nPhone: ${phone}`);
    }

    function handleBalance() {
        alert('Current balance: ${balance}');
    }

    function saveEmail(e) {
        e.preventDefault();
        setEditingEmail(false);
        alert(`Email updated to ${email}`);
    }

    function savePhone(e) {
        e.preventDefault();
        setEditingPhone(false);
        alert(`Contact updated to ${phone}`);
    }

    return (
        <div className="page-container">
            <div className="card">
                <h2>Account Services</h2>

                <div className="links-grid">
                    <button className="btn" onClick={handleDeposit}>Deposit Money</button>
                    <button className="btn" onClick={handleStatement}>Mini Statement</button>
                    <button className="btn" onClick={handlePinManager}>PIN Manager</button>
                    <button className="btn" onClick={handleResetPin}>Reset PIN</button>
                    <button className="btn" onClick={handleLanguage}>Change Language</button>
                    <div style={{ padding: 8 }}>
                        {editingPhone ? (
                            <form onSubmit={savePhone} className="form">
                                <label className="field">
                                    <span className="label">Phone</span>
                                    <input className="input" value={phone} onChange={e => setPhone(e.target.value)} />
                                </label>
                                <div className="actions">
                                    <button className="btn primary" type="submit">Save</button>
                                    <button className="btn link" type="button" onClick={() => setEditingPhone(false)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div style={{ marginBottom: 8 }}><strong>Phone:</strong> {phone}</div>
                                <button className="btn" onClick={() => setEditingPhone(true)}>Update Contact</button>
                            </>
                        )}
                    </div>

                    <div style={{ padding: 8 }}>
                        {editingEmail ? (
                            <form onSubmit={saveEmail} className="form">
                                <label className="field">
                                    <span className="label">Email</span>
                                    <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
                                </label>
                                <div className="actions">
                                    <button className="btn primary" type="submit">Save</button>
                                    <button className="btn link" type="button" onClick={() => setEditingEmail(false)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div style={{ marginBottom: 8 }}><strong>Email:</strong> {email}</div>
                                <button className="btn" onClick={() => setEditingEmail(true)}>Update Email</button>
                            </>
                        )}
                    </div>

                    <button className="btn" onClick={handleViewProfile}>View Profile</button>
                    <button className="btn" onClick={handleBalance}>Check Balance</button>
                </div>

                <div style={{ marginTop: 12 }}>
                    <button className="btn link" onClick={() => navigate('/Dashboard')}>Back</button>
                </div>
            </div>
        </div>
    );
}

export default Account;