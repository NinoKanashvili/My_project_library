import './Footer.css'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
    const { isAuthenticated } = useAuth()

    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-brand">
                    <h2>BookHaven</h2>
                    <p>
                        A quiet place for every story,
                        every reader, and every new adventure.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Explore</h3>
                    <a href="/">Books</a>
                    {isAuthenticated && (
                        <a href="/profile/">My Borrowed Books</a>
                    )}
                </div>

                <div className="footer-contact">
                    <h3>Contact</h3>
                    <a href="mailto:hello@bookhaven.com">
                        hello@bookhaven.com
                    </a>
                    <a href="tel:+995555123456">
                        +995 555 12 34 56
                    </a>
                    <a
                        href="https://instagram.com/bookhaven"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Instagram
                    </a>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© 2026 BookHaven. All rights reserved.</p>
            </div>
        </footer>
    )
}

