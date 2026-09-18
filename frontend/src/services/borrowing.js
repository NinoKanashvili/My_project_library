import api from './api'

export async function fetchBorrowings(params = {}) {
    const res = await api.get('borrowing/',
        {
            'params': params
        })

    return res.data
}

export async function createBorrowing(bookId,dueDate) {
    const res = await api.post('borrowing/', {
        book: bookId,
        due_date: dueDate
    })

    return res.data
}

export async function returnBorrowing(id) {
    const res = await api.post(`borrowing/${id}/return_book/`)

    return res.data
}