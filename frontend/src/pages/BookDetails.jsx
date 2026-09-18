import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchBook, fetchBooks } from '../services/books'
import { createBorrowing, fetchBorrowings, returnBorrowing } from '../services/borrowing'
import { fetchReviews, createReview, updateReview, deleteReview } from '../services/reviews'
import { useAuth } from '../context/AuthContext'
import './BookDetails.css'
import { jwtDecode } from 'jwt-decode'

export default function BookDetails() {
    const { id } = useParams()
    const { isAuthenticated } = useAuth()
    const token = localStorage.getItem('access')
    const currentUserId = token ? jwtDecode(token).user_id : null

    const [book, setBook] = useState(null)
    const [borrowings, setBorrowings] = useState([])
    const [borrowMessage, setBorrowMessage] = useState('')
    const [borrowError, setBorrowError] = useState('')
    const [reviewMessage, setReviewMessage] = useState('')
    const [reviewError, setReviewError] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [loading, setLoading] = useState(false)

    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState('')
    const [comment, setComment] = useState('')

    const [editingReview, setEditingReview] = useState(null)
    const [editRating, setEditRating] = useState('')
    const [editComment, setEditComment] = useState('')

    useEffect(() => {
        async function loadData() {
            try {
                const bookData = await fetchBook(id)
                const reviewsData = await fetchReviews({ book: id })
                if (isAuthenticated) {
                    const borrowingsData = await fetchBorrowings({ book: id })
                    setBorrowings(borrowingsData)
                }

                setBook(bookData)
                setReviews(reviewsData.results)
            } catch (error) {
                console.log('BOOK DETAILS ERROR:', error.response?.status)
                console.log('BOOK DETAILS ERROR DATA:', error.response?.data)
                console.log('Failed to fetch book details', error)
            }
        }

        loadData()
    }, [id, isAuthenticated])

    if (!book) {
        return <p>Loading...</p>
    }

    async function handleBorrow() {
        try {
            setLoading(true)
            setBorrowMessage('')
            setBorrowError('')

            const newBorrowing = await createBorrowing(book.id, dueDate)
            setBorrowings(prev => [...prev, newBorrowing])

            setBook(prev => ({
                ...prev,
                available_copies: prev.available_copies - 1
            }))

            setBorrowMessage('Book borrowed successfully!')
            setTimeout(() => {
                setBorrowMessage('')
            }, 2000)
            setDueDate('')
        } catch (error) {
            setBorrowError(
                error.response?.data?.detail ||
                error.response?.data?.due_date?.[0] ||
                'Failed to borrow the book.'
            )
        } finally {
            setLoading(false)
        }
    }

    async function handleReturn() {
        try {
            setLoading(true)
            setBorrowMessage('')
            setBorrowError('')

            await returnBorrowing(activeBorrowing.id)
            setBorrowings(prev => prev.filter(borrowing => borrowing.id !== activeBorrowing.id))

            setBook(prev => ({
                ...prev,
                available_copies: prev.available_copies + 1
            }))

            setBorrowMessage('Book returned successfully!')
            setTimeout(() => {
                setBorrowMessage('')
            }, 2000)
        } catch (error) {
            setBorrowError(error.response?.data?.detail || 'Failed to return the book.')
        } finally {
            setLoading(false)
        }
    }

    const activeBorrowing = borrowings.find(
        borrowing => borrowing.book === book.id && borrowing.returned_at === null
    )

    async function handleReviewSubmit(event) {
        event.preventDefault()

        try {
            setReviewError('')
            setReviewMessage('')

            const newReview = await createReview(book.id, rating, comment)
            setReviews(prev => [...prev, newReview])

            setReviewMessage('Review added successfully!')

            setTimeout(() => {
                setReviewMessage('')
            }, 2000)
            setRating('')
            setComment('')
        } catch (error) {
            setReviewError(error.response?.data?.detail || 'Failed to add review.')
        }
    }

    async function handleDelete(id) {
        try {
            await deleteReview(id)
            setReviews(prev => prev.filter(review => review.id !== id))
            setReviewMessage('Review deleted successfully!')
            setTimeout(() => {
                setReviewMessage('')
            }, 2000)
        } catch (error) {
            setReviewError(
                error.response?.data?.detail ||
                'Failed to delete review.'
            )
        }
    }

    function handleEdit(review) {
        setEditingReview(review.id)
        setEditRating(review.rating)
        setEditComment(review.comment)
    }

    async function handleUpdate(id) {
        try {
            setReviewError('')
            const updatedReview = await updateReview(id, editRating, editComment)

            setReviews(prev =>
                prev.map(review =>
                    review.id === id ? updatedReview : review
                )
            )

            setEditingReview(null)
            setReviewMessage('Review updated successfully!')

            setTimeout(() => {
                setReviewMessage('')
            }, 2000)
        } catch (error) {
            setReviewError(
                error.response?.data?.detail ||
                'Failed to update review.'
            )
        }
    }

    return (
        <div className="book-details-page">
            <div className="book-details-container">
                <div className="book-details-card">
                    <div className="book-details-cover">
                        {book.cover_image ? (
                            <img src={book.cover_image} alt={book.title} />
                        ) : (
                            <div className="book-details-cover-placeholder">No cover</div>
                        )}
                    </div>

                    <div className="book-details-info">
                        <h1>{book.title}</h1>
                        <p className="book-details-description">{book.description}</p>
                        <p><strong>Author:</strong> {book.author_details.name}</p>
                        <p><strong>Category:</strong> {book.category_details.name}</p>
                        <p><strong>Published year:</strong> {book.published_year}</p>
                        <p><strong>Available copies:</strong> {book.available_copies}</p>

                        {!activeBorrowing && book.available_copies > 0 && (
                            <div className="due-date">
                                <label>Due date:</label>
                                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                            </div>
                        )}

                        <div className="borrowing-actions">
                            {activeBorrowing ? (
                                <>
                                    <button className="borrow-button secondary" disabled>Already borrowed</button>
                                    <button className="return-button" onClick={handleReturn} disabled={loading}>Return</button>
                                </>
                            ) : book.available_copies === 0 ? (
                                <button className="borrow-button unavailable" disabled>Not available</button>
                            ) : (
                                <button className="borrow-button" onClick={handleBorrow} disabled={!dueDate || loading}>Borrow</button>
                            )}
                        </div>

                        {borrowMessage && <p className="book-details-message">{borrowMessage}</p>}
                        {borrowError && <p className="book-details-error">{borrowError}</p>}
                    </div>
                </div>

                <section className="reviews-section">
                    <h2>Reviews</h2>

                    {reviews.length === 0 ? (
                        <p className="no-reviews">No reviews yet.</p>
                    ) : (
                        <div className="reviews-list">
                            {reviews.map(review => (
                                <div key={review.id} className="review-card">
                                    <p className="review-username">user: {review.username}</p>
                                    <p className="review-date">Posted: {review.created_at.slice(0, 10)}</p>
                                    <div className="review-top">

                                        <p className="review-rating">
                                            {'★'.repeat(review.rating)}
                                            {'☆'.repeat(5 - review.rating)}
                                        </p>

                                        {Number(review.user) === Number(currentUserId) &&  (
                                            <div className="review-actions">
                                                <button onClick={() => handleEdit(review)}>Edit</button>
                                                <button onClick={() => handleDelete(review.id)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                    {editingReview === review.id ? (
                                        <div className="review-edit-form">
                                            <select value={editRating} onChange={(e) => setEditRating(e.target.value)}>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>

                                            <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} />

                                            <button onClick={() => handleUpdate(review.id)}>Save</button>
                                            <button onClick={() => setEditingReview(null)}>Cancel</button>
                                        </div>
                                    ) : (
                                        <p className="review-comment">{review.comment}</p>
                                    )}
                                   
                                </div>
                            ))}
                        </div>
                    )}

                    {reviewMessage && <p className="book-details-message">{reviewMessage}</p>}
                    {reviewError && <p className="book-details-error">{reviewError}</p>}
                </section>

                {isAuthenticated && (
                    <section className="review-form-section">
                        <h2>Write a review</h2>

                        <form onSubmit={handleReviewSubmit} className="review-form">
                            <label>Rating:</label>
                            <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                                <option value="">Select rating</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>

                            <label>Comment:</label>
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />

                            <button type="submit">Submit review</button>
                        </form>

                        
                    </section>
                )}
            </div>
        </div>
    )
}