
import './Dashboard.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

// import {useNavigate} from 'react-router-dom'

function Dashboard() {
    // load logged-in user from localStorage (set on login)

    const defaultUser = {
        name: 'Guest',
        avatar: '/pay.png',
        balance: 0,
    
    
        
        recent: [
            { id: 1, action: 'Sent $200 to Alice', time: '2h ago' },
            { id: 2, action: 'Received $150 from Bob', time: '1d ago' },
            { id: 3, action: 'Loan payment: $100', time: '3d ago' },
        ],

      
        
    };

    const LogoutButton = () =>{
        const handleLogout = async () =>{
            try{
                await axios .post('/logout')
                localStorage.removeItem('/authToken');
                window.location.href = '/login';
            }catch(error){
                console.error(error);
            };
        };
         <button onClick={LogoutButton}>logout</button>


    };

    const [user, setUser] = useState(() => {
        // try initialize from localStorage synchronously
        try {
            const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    ...defaultUser,
                    ...parsed,
                    recent: Array.isArray(parsed.recent) ? parsed.recent : defaultUser.recent,
                    avatar: parsed.avatar || defaultUser.avatar,
                };
            }
        } catch (e) {
            // ignore
        }
        return defaultUser;
    });
    const [balance, setBalance] = useState(() => Number((typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}').balance) || 0));
    const [editingBalance, setEditingBalance] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);

    // fetch notifications
    async function fetchNotifications(token) {
        try {
            const res = await axios.get('http://localhost:3000/me/notifications', { headers: { Authorization: `Bearer ${token}` } });
            if (Array.isArray(res.data)) setNotifications(res.data);
        } catch (e) {
            // ignore
        }
    }

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;
        axios.get('http://localhost:3000/me', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                const serverUser = res.data || {};
                setUser(prev => ({ ...prev, ...serverUser }));
            })
            .catch(err => {
                console.warn('Failed to fetch /me', err?.message || err);
            });
        // fetch activity
        axios.get('http://localhost:3000/me/activity', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                const act = Array.isArray(res.data) ? res.data.map(a => ({ id: a.id, action: a.type === 'sent' ? `Sent $${a.amount} to ${a.to?.name || a.to?.phoneNumber}` : `Received $${a.amount} from ${a.from?.name || a.from?.phoneNumber}`, time: new Date(a.time).toLocaleString() })) : [];
                setUser(prev => ({ ...prev, recent: act }));
            })
            .catch(err => {
                // ignore activity failure
            });
        // initial notifications + polling
        fetchNotifications(token);
        const poll = setInterval(() => fetchNotifications(token), 10000);
        return () => clearInterval(poll);
    }, []);

    // keep local balance state in sync with server-provided user.balance
    useEffect(() => {
        setBalance(Number(user.balance) || 0);
    }, [user.balance]);

    function handleShowDetails() {
        // show an alert with user details including email and phone if available
        const lines = [`Account holder: ${user.name}`, `Balance: ${user.balance}`];
        if (user.email) lines.push(`Email: ${user.email}`);
        if (user.phoneNumber) lines.push(`Phone: ${user.phoneNumber}`);
        alert(lines.join('\n'));
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-shell">
                <header className="dashboard-header">
                    <div className="profile">
                        <div className="avatar-wrap">
                            <img src={user.avatar || '/quickpay-badge.svg'} alt="QuickPay" className="avatar" onError={(e)=>{e.target.onerror=null; e.target.src='/quickpay-badge.svg'}} />
                            <span className="avatar-badge">QuickPay</span>
                        </div>
                        <div>
                            <h1 className="welcome">Welcome back,</h1>
                            <h2 className="username">{user.name}</h2>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="btn primary" onClick={handleShowDetails}>Show Account</button>
                        <div style={{ display: 'inline-block', position: 'relative', marginLeft: 12 }}>
                            <button className="btn" onClick={() => setShowNotifs(s => !s)} aria-haspopup="true">🔔{notifications.filter(n => !n.read).length > 0 ? ` (${notifications.filter(n => !n.read).length})` : ''}</button>
                            {showNotifs && (
                                <div style={{ position: 'absolute', right: 0, top: '36px', width: 320, maxHeight: 300, overflow: 'auto', background: '#fff', color: '#111', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.12)', zIndex: 50 }}>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 8 }}>
                                        {notifications.length === 0 ? <li style={{ padding: 8 }}>No notifications</li> : notifications.map(n => (
                                            <li key={n.id} style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 13 }}>{n.message}</div>
                                                    <div style={{ fontSize: 11, color: '#666' }}>{new Date(n.createdAt).toLocaleString()}</div>
                                                </div>
                                                <div style={{ marginLeft: 8 }}>
                                                    {!n.read && <button className="btn" onClick={async () => { try{ await axios.post(`http://localhost:3000/me/notifications/${n.id}/read`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } }); fetchNotifications(localStorage.getItem('token')); }catch(e){} }}>Mark read</button>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Welcoming silent video: place a file at client/public/welcome.mp4 or change src to an external URL */}
                <div className="welcome-video-wrap">
                    <video
                        className="welcome-video"
                        src="/welcome.mp4"
                        poster="/welcome-poster.jpg"
                        muted
                        autoPlay
                        loop
                        playsInline
                        aria-hidden="true"
                        preload="metadata"
                        onError={(e) => { /* fallback: hide video if not found */ e.target.style.display = 'none'; }}
                    />
                </div>

                <main className="dashboard-main">
                    <section className="cards">
                        <div className="card balance-card">
                            <div className="card-title">Account Balance</div>
                            <div className="card-value">
                                {editingBalance ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={balance}
                                        onChange={e => setBalance(e.target.value)}
                                        onBlur={() => {
                                            setEditingBalance(false);
                                            // persist to localStorage so UI reflects change immediately
                                            try {
                                                const stored = localStorage.getItem('user');
                                                const parsed = stored ? JSON.parse(stored) : {};
                                                parsed.balance = Number(balance) || 0;
                                                localStorage.setItem('user', JSON.stringify(parsed));
                                            } catch (e) {
                                                // ignore
                                            }
                                        }}
                                        autoFocus
                                        style={{ width: 120, padding: '6px 8px', fontSize: 18 }}
                                    />
                                ) : (
                                    <p onClick={() => setEditingBalance(true)} style={{ cursor: 'pointer', margin: 0 }}>${Number(balance).toFixed(2)}</p>
                                )}
                            </div>
                            <div className="card-meta">Available now</div>
                        </div>

                        <div className="card links-card">
                            <div className="card-title">Quick Actions</div>
                            <div className="links">
                                <a className="link" href="Send">Send</a>
                                <a className="link" href="withdraw">Withdraw</a>
                                <a className="link" href="pay">Lipa</a>
                                <a className="link" href="loan">Loans</a>
                                <a className="link" href="account">Account</a>
                            </div>
                        </div>
                    </section>

                    <section className="activity">
                        <div className="activity-card">
                            <h3>Recent Activity</h3>
                            <ul className="recent-list">
                                {user.recent.map(item => (
                                    <li key={item.id} className="recent-item">
                                        <div className="recent-action">{item.action}</div>
                                        <div className="recent-time">{item.time}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <aside className="tip-card">
                            <h4>Tip</h4>
                            <p>Keep your account secure. Enable two-factor authentication in your profile settings.</p>
                            <button className="btn ghost">Manage Security</button>
                           
                            
                        </aside>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;