import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'


export default function Navbar() {
    const {isAuthenticated, logout} = useAuth()

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src="/logo.jpg" alt="Library logo" />
                    <span>Bookhaven</span>
                </Link>
            </div>

            <div className="navbar-center">
                <Link to="/">Books</Link>
                <Link to="/books/add/">Add Book</Link>
            </div>

            <div className="navbar-right">
                {isAuthenticated ? (
                    <>
                        <Link to="/profile/">Profile</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login/">Login</Link>
                        <Link to="/register/">Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}
