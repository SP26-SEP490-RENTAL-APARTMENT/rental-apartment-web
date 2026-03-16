import { useAuthStore } from "@/store/authStore"
import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_API_URL

const publicApi = axios.create({
    baseURL: BASE_URL,
    headers: {
    'Content-Type': 'application/json'
  }
})

const privateApi = axios.create({
    baseURL: BASE_URL,
    headers: {
    'Content-Type': 'application/json'
  }
})

privateApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

privateApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken, setToken } = useAuthStore.getState()

        const res = await publicApi.post("/auth/refresh", {
          refreshToken,
        })

        const newAccessToken = res.data.accessToken

        setToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return privateApi(originalRequest)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        useAuthStore.getState().logout()
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export const apiConfig = { publicApi, privateApi };