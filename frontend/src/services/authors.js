import api from './api'

export async function fetchAuthors() {
    const res = await api.get('authors/')
    return res.data
}
