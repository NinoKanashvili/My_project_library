import React, { useEffect, useState } from 'react'
import { fetchBooks } from '../services/books'
import { fetchAuthors } from '../services/authors'
import { fetchCategories } from '../services/categories'
import { Link } from 'react-router-dom'
import Pagination from '../components/Pagination'
import './Books.css'

export default function Books() {
    const [books,setBooks] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [nextPage, setNextPage] = useState(null)
    const [previousPage, setPreviousPage] = useState(null)
    const [authors, setAuthors] = useState([])
    const [categories, setCategories] = useState([])
    const [totalCount, setTotalCount] = useState(0)

    const [author, setAuthor] = useState('')
    const [category, setCategory] = useState('')
    const [available, setAvailable] = useState('')
    const [ordering, setOrdering] = useState('')

    const params = new URLSearchParams(window.location.search)
    const [search,setSearch] = useState(params.get('search') || '')

    async function loadBooks(
        page,
        searchValue = '',
        authorValue = '',
        categoryValue = '',
        availableValue = '',
        orderingValue = ''
    ){
        try {
            const data = await fetchBooks({
                page: page,
                search: searchValue,
                author: authorValue,
                category: categoryValue,
                available: availableValue,
                ordering: orderingValue
            })
            
            setBooks(data.results)
            setNextPage(data.next)
            setPreviousPage(data.previous)
            setTotalCount(data.count)
        } catch(error){
            console.log('Failed to fetch books', error);
        }
    }

    useEffect(() => {
        async function loadAuthorsAndCategories() {
            try {
                const authorsData = await fetchAuthors()
                const categoriesData = await fetchCategories()

                setAuthors(authorsData)
                setCategories(categoriesData)
            } catch(error) {
                console.log('Failed to fetch authors or categories', error)
            }
        }

        loadAuthorsAndCategories()
    }, [])

    useEffect(() => {
        loadBooks(currentPage, search, author, category, available,ordering)
    }, [currentPage, author, category, available,ordering])


    function handleSearch(e){
        e.preventDefault()

        const params = new URLSearchParams()
        params.set('search', search)
        window.history.pushState(
            {},
            '',
            params.toString() ? `?${params.toString()}` : '/'
        )

        setCurrentPage(1)
        loadBooks(1, search, author, category, available,ordering)
    }

    function handleClearSearch() {
        setSearch('')
        setAuthor('')
        setCategory('')
        setAvailable('')
        setOrdering('')
        setCurrentPage(1)

        window.history.pushState({}, '', '/')
        loadBooks(1)
    }

    return (
        <>
            <section className="bookshelf">
                <div className="bookshelf-author">
                    <img src="./fredrik.jpg" alt="Fredrik" />
                </div>

                <div className="author-desc">
                    <h2>Fredrik Backman</h2>
                    <p>Swedish writer and blogger. He studied theology when he was young, but later left his studies and worked as a truck driver before becoming a journalist. In 2016, he was named Author of the Year.</p>
                </div>

                <img src="./bookshelf.png" alt="Bookshelf" className="bookshelf-img" />
            </section>

            <div className="books-page">
                <div className="books-container">

                    <div className="books-header">
                        <h1>Browse books</h1>
                        <p>Find your next book to read.</p>
                    </div>

                    <form onSubmit={handleSearch} className="books-filters">

                        <div className="search-row">
                            <input type="text" value={search} onChange={(e) => {setSearch(e.target.value)}} placeholder="Search books"/>

                            <button type="submit" className="search-button">Search</button>

                            <button type="button" onClick={handleClearSearch} className="clear-button">Clear</button>
                        </div>

                        <div className="filter-row">

                            <select value={author} onChange={(e) => { 
                                setAuthor(e.target.value) 
                                setCurrentPage(1)
                            }}>
                                <option value="">All authors</option>

                                {authors.map(author => (
                                    <option key={author.id} value={author.id}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>

                            <select value={category} onChange={(e) => {
                                setCategory(e.target.value)
                                setCurrentPage(1)
                            }}>
                                <option value="">All categories</option>

                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <select value={available} onChange={(e) => {
                                setAvailable(e.target.value)
                                setCurrentPage(1)
                            }}>
                                <option value="">All books</option>
                                <option value="true">Available</option>
                                <option value="false">Not available</option>
                            </select>

                            <select value={ordering} onChange={(e) => {
                                setOrdering(e.target.value)
                                setCurrentPage(1)
                            }}>
                                <option value="">Default</option>
                                <option value="title">Title: A-Z</option>
                                <option value="-title">Title: Z-A</option>
                                <option value="published_year">Year: Oldest first</option>
                                <option value="-published_year">Year: Newest first</option>
                                <option value="-created_at">Recently added</option>
                                <option value="created_at">Oldest added</option>
                            </select>

                        </div>
                    </form>

                    <div className="books-grid">
                        {books.map(book => (
                            <div key={book.id} className="book-card">

                                <div className="book-cover">
                                    {book.cover_image ? (
                                        <img src={book.cover_image} alt={book.title} />
                                    ) : (
                                        <div className="book-cover-placeholder">
                                            No cover
                                        </div>
                                    )}
                                </div>

                                <div className="book-info">
                                    <h2>{book.title}</h2>

                                    <p className="book-author">
                                        {book.author_details.name}
                                    </p>

                                    <p className="book-category">
                                        {book.category_details.name}
                                    </p>

                                    <p className="book-year">
                                        published: {book.published_year}
                                    </p>

                                    <p className="book-description">
                                        {book.description}
                                    </p>

                                    <Link to={`/books/${book.id}`}>
                                        <button className="details-button">
                                            Details
                                        </button>
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        nextPage={nextPage}
                        previousPage={previousPage}
                        totalCount={totalCount}
                        setCurrentPage={setCurrentPage}
                    />

                </div>
            </div>
        </>
    )


}
