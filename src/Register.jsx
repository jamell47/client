import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '' });

    function handleChange(e) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    axios.defaults.baseURL = 'http://localhost:3000';
    async function handleSubmit(e) {
        e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phoneNumber) return alert('Please fill all fields');
    // basic phone validation (digits only, length 7-15)
    const phoneDigits = form.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) return alert('Please enter a valid phone number');
        // TODO: call API to register
            try {
                        const res = await axios.post('http://localhost:3000/register', form);
                        alert(res.data.message || 'Registered');
                        const token = res.data.token;
                        if (token) {
                            localStorage.setItem('token', token);
                            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        }
                        navigate('/Login');
            } catch (err) {
                alert(err?.response?.data?.message || 'Registration failed');
            }
    }

    return (
        <div className="page-container">
            <div className="card form-card">
                <h2>Create account</h2>
                <form onSubmit={handleSubmit} className="form">
                    
                    <label className="field">
                        <span className="label">Full name</span>
                        <input name="name" value={form.name} onChange={handleChange} className="input" required />
                    </label>
                    <label className="field">
                        <span className="label">Email</span>
                        <input name="email" type="email" value={form.email} onChange={handleChange} className="input" required />
                    </label>
                    <label className="field">
                        <span className="label">Phone number</span>
                        <input name="phoneNumber" type="tel" placeholder="e.g. +1234567890" value={form.phoneNumber} onChange={handleChange} className="input" required />
                    </label>

                    <label className="field">
                        <span className="label">Password</span>
                        <input name="password" type="password" value={form.password} onChange={handleChange} className="input" required />
                    </label>

                    <div className="actions">
                        <button className="btn primary" type="submit">Register</button>
                        <button type="button" className="btn link" onClick={() => navigate('/Login')}>Already have an account</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
