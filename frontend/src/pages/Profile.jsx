import { useEffect, useState } from 'react'
import { fetchBorrowings, returnBorrowing } from '../services/borrowing'
import './Profile.css'

export default function Profile() {
    const [borrowings, setBorrowings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
   

    async function loadBorrowings() {
        try {
            const data = await fetchBorrowings()
            setBorrowings(data)
        } catch (error) {
            console.log('Failed to fetch borrowings', error)
            setError('Failed to load borrowed books.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadBorrowings()
    }, [])

    async function handleReturn(id) {
        try {
            setError('')
            await returnBorrowing(id)
            await loadBorrowings()
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                'Failed to return the book.'
            )
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1>My Borrowed Books</h1>

                {error && (
                    <p className="profile-error">{error}</p>
                )}

                {borrowings.length === 0 ? (
                    <div className="empty-borrowings">
                        <p>You have no borrowed books.</p>
                    </div>
                ) : (
                    <div className="borrowings-list">
                        {borrowings.map(borrowing => (
                            <div key={borrowing.id} className="borrowing-card">
                                <div>
                                    <h2>{borrowing.book_title}</h2>
                                    <p>
                                        <strong>Due date:</strong> {borrowing.due_date}
                                    </p>
                                </div>

                                <button onClick={() => handleReturn(borrowing.id)}>
                                    Return
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}