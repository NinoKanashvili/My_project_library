import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBook } from '../services/books'
import {fetchAuthors} from '../services/authors'
import {fetchCategories} from '../services/categories'
import './AddBook.css'

export default function AddBook() {
    const navigate = useNavigate()

    const [authors, setAuthors] = useState([])
    const [categories, setCategories] = useState([])

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [coverImage, setCoverImage] = useState(null)
    const [author, setAuthor] = useState('')
    const [category, setCategory] = useState('')
    const [publishedYear, setPublishedYear] = useState('')
    const [totalCopies, setTotalCopies] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadData() {
            try {
                const authorsData = await fetchAuthors()
                const categoriesData = await fetchCategories()

                setAuthors(authorsData)
                setCategories(categoriesData)
            } catch (error) {
                console.log('Failed to load authors and categories', error)
            }
        }

        loadData()
    }, [])

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setError('')

            const formData = new FormData()

            formData.append('title', title)
            formData.append('description', description)
            formData.append('author', author)
            formData.append('category', category)
            formData.append('published_year', publishedYear)
            formData.append('total_copies', totalCopies)

            if (coverImage) {
                formData.append('cover_image', coverImage)
            }

            await createBook(formData)

            navigate('/')
        } catch (error) {
            if (error.response?.status === 403) {
                setError('You do not have permission to add books.')
            } else {
                setError(
                    error.response?.data?.detail ||
                    'Failed to add book.'
                )
            }
        }
    }

    return (
        <div className="add-book-page">
            <div className="add-book-container">
                <h1>Add Book</h1>

                {error && (
                    <p className="add-book-error">{error}</p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="add-book-form"
                >
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label>Cover image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                    />

                    <label>Author:</label>
                    <select
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    >
                        <option value="">Select author</option>

                        {authors.map(author => (
                            <option
                                key={author.id}
                                value={author.id}
                            >
                                {author.name}
                            </option>
                        ))}
                    </select>

                    <label>Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select category</option>

                        {categories.map(category => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <label>Published year:</label>
                    <input
                        type="number"
                        value={publishedYear}
                        onChange={(e) => setPublishedYear(e.target.value)}
                        required
                    />

                    <label>Total copies:</label>
                    <input
                        type="number"
                        min="1"
                        value={totalCopies}
                        onChange={(e) => setTotalCopies(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Add Book
                    </button>
                </form>
            </div>
        </div>
    )
}

