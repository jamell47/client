


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Send() {
    const[balance ,setBalance] = useState(null);
    const[userID,setUserId]= useState('');
    useEffect(()=>{
        const fetchBalance = async ()=>{
            try{
                const response = await axios.get('/api/user/balance');
                setBalance (response.data.balance);
            }catch(error){
                console.error(error)

            }
            }
            fetchBalance();
        },[])
    
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const navigate = useNavigate();
    const [validPhones, setValidPhones] = useState([]);
    const [recipientName, setRecipientName] = useState('');
    const [recipientFound, setRecipientFound] = useState(false);
    const feePercentage= 0.05;
    const fee = amount * feePercentage;
    const totalDeduction = parseFloat(amount) + parseFloat(fee) ;
    const newBalance = balance - totalDeduction;
    



    // lookup a recipient by phone and set recipientFound/recipientName
    async function lookupRecipient(phone) {
        if (!phone || String(phone).trim().length < 4) {
            setRecipientName('');
            setRecipientFound(false);
            return;
        }
        try {
            const res = await axios.get('http://localhost:3000/users/find', { params: { phone } });
            if (res?.data) {
                setRecipientName(res.data.name || '');
                setRecipientFound(true);
            } else {
                setRecipientName('');
                setRecipientFound(false);
            }
        } catch (err) {
            setRecipientName('');
            setRecipientFound(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!to || !amount || !pin) return alert('Please fill all fields');
    
        // if recipient was found show confirm with their name
        if (!recipientFound) return alert('Number not recognised');
        const confirmed = window.confirm(`confirm ${amount}  sent to ${recipientName || to}  total deduction ${totalDeduction} new balance${newBalance} `);
        if (!confirmed) return;
        try {
            const res = await axios.post('http://localhost:3000/send', { toPhone: to, amount, pin }, { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } });
            alert(res.data?.message || 'Send successful');
            // update local stored user balance if server returned updated sender
            if (res.data?.sender) {
                try {
                    const stored = localStorage.getItem('user');
                    const parsed = stored ? JSON.parse(stored) : {};
                    const updated = { ...parsed, balance: res.data.sender.balance };
                    localStorage.setItem('user', JSON.stringify(updated));
                } catch (e) { /* ignore */ }
            }
            navigate('/Dashboard');
        } catch (err) {
            alert(err?.response?.data?.message || 'Send failed');
        }
    }

    

    return (
        <div className="page-container">
            <div className="card form-card">
                <h2>Send Cash</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <label className="field">
                        <span className="label">Recipient</span>
                        <input
                            className="input"
                            value={to}
                            onChange={e => { setTo(e.target.value); setRecipientFound(false); setRecipientName(''); }}
                            onBlur={() => lookupRecipient(to)}
                            placeholder="Enter recipient phone number"
                        />
                        {recipientFound ? <div style={{marginTop:6, color:'#333', fontSize:14}}>Recipient: <strong>{recipientName || to}</strong></div> : null}
                    </label>
                    <label className="field">
                        <span className="label">Amount</span>
                        <input className="input" value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Amount" />
                    </label>
                    <label className="field">
                        <span className="label">PIN</span>
                        <input className="input" value={pin} onChange={e => setPin(e.target.value)} type="password" placeholder="PIN" />
                    </label>
                    <div className="actions">
                        <button className="btn primary" type="submit">Send</button>
                        <button type="button" className="btn link" onClick={() => navigate('/Dashboard')}>Back</button>
                        <p value={balance} onChange={e=>setBalance(e.target.value)}>${balance}</p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Send;