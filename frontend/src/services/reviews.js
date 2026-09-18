import api from "./api"

export async function fetchReviews(params = {}){
    const res = await api.get('reviews/',{
        params: params
    })

    return res.data
}

export async function createReview(bookId, rating, comment) {
    const res = await api.post('reviews/', {
        book: bookId,
        rating: rating,
        comment: comment
    })

    return res.data
}

export async function updateReview(id, rating, comment) {
    const res = await api.patch(`reviews/${id}/`, {
        rating,
        comment
    })
    return res.data
}

export async function deleteReview(id) {
    await api.delete(`reviews/${id}/`)
}