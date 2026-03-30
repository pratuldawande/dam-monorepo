import axios from 'axios'
const API_BASE = import.meta.env.VITE_API_BASE
const API = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
})

// 🔐 Request Interceptor (attach token)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ⚠️ Response Interceptor (handle errors)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - redirect to login')
      // optional: logout logic
    }
    return Promise.reject(error)
  }
)

export default API
