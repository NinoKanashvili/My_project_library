import { useState } from "react";
import { login } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const navigate = useNavigate()
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const {setIsAuthenticated} = useAuth()
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await login(username, password);
            setIsAuthenticated(true)
            navigate('/')
        } 
        catch (error) {
            setError(
                error.response?.data?.detail ||
                'Invalid username or password.'
            )
        }
        setUsername('')
        setPassword('')
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Welcome back</h1>
                <p className="login-subtitle">Log in to your account</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" required />

                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required />

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}
