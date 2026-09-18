import api from "./api";

export async function fetchBooks(params = {}){
    const res = await api.get('books/', {params})

    return res.data
}

export async function fetchBook(id){
    const res = await api.get(`books/${id}/`)

    return res.data
}

export async function createBook(data) {
    const res = await api.post('books/', data)
    return res.data
}

export async function updateBook(id,data){
    const res = await api.patch(`books/${id}/`,data)
    
    return res.data
}

export async function deleteBook(id){
    const res = await api.delete(`books/${id}/`)

    return res.data
}