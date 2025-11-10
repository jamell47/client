
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        if (!email || !password) return alert('Enter email and password');
            axios.post('http://localhost:3000/login', { email, password })
                .then(res => {
                    alert(res.data.message || 'Login successful');
                                        // store returned user and token so dashboard can display the logged-in name
                                        const user = res.data.user;
                                        const token = res.data.token;
                                        if (token) {
                                            localStorage.setItem('token', token);
                                            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                                        }
                                        if (user) localStorage.setItem('user', JSON.stringify(user));
                    navigate('/Dashboard');
                })
                .catch(err => alert(err?.response?.data?.message || 'Login failed'));
    }

    return (
        <div className="page-container">
            <div className="card form-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="form">
                    <label className="field">
                        <span className="label">Email</span>
                        <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </label>
                    <label className="field">
                        <span className="label">Password</span>
                        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                    </label>
                    <div className="actions">
                        <button className="btn primary" type="submit">Login</button>
                        <button type="button" className="btn link" onClick={() => navigate('/Register')}>Create account</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;