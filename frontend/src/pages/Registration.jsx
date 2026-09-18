import { useState } from 'react'
import { register } from '../services/auth'
import { useNavigate } from 'react-router-dom'
import './Registration.css'

export default function Registration() {
    const navigate = useNavigate()
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [email,setEmail] = useState('')
    const [errors, setErrors] = useState({})


    async function handleRegister(e) {
        e.preventDefault()
        setErrors({})

        try {
            await register(username, email, password)

            setUsername('')
            setPassword('')
            setEmail('')

            navigate('/login/')
        } catch (error) {
            setErrors(error.response?.data || {})
        }
    }

    return (
        <div className="registration-page">
            <div className="registration-card">
                <h1>Create account</h1>
                <p className="registration-subtitle">Create your library account</p>

                <form onSubmit={handleRegister} className="registration-form">
                    <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" required />
                    {errors.username && <p className="registration-error">{errors.username[0]}</p>}

                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required />
                    {errors.email && <p className="registration-error">{errors.email[0]}</p>}

                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required />
                    {errors.password && <p className="registration-error">{errors.password[0]}</p>}

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    )
}
