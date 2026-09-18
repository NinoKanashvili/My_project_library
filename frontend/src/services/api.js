import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('access')

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config
})


api.interceptors.response.use(
    response => {
        return response;
    },

    async error => {
        if (error.response?.status === 401) {
            const refresh = localStorage.getItem('refresh')

            if (refresh) {
                try {
                    const response = await axios.post( `${import.meta.env.VITE_API_URL}token/refresh/`,
                        {
                            refresh: refresh,
                        }
                    )

                    const newAccess = response.data.access

                    localStorage.setItem('access', newAccess)

                    error.config.headers.Authorization = `Bearer ${newAccess}`

                    return api(error.config)
                } catch (refreshError) {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');

                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
)


export default api