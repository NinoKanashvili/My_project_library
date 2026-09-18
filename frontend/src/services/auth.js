import api from "./api";

export async function login(username,password) {
    const res = await api.post('token/',{username,password})

    localStorage.setItem('access',res.data.access)
    localStorage.setItem('refresh',res.data.refresh)
}


export async function register(username,email,password) {
    const res = await api.post('register/',{
        'username': username,
        'email': email,
        'password': password
    })
    return res.data
}

export function logout(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
}