import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_API_URL

const publicApi = axios.create({
    baseURL: BASE_URL,
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

const privateApi = axios.create({
    baseURL: BASE_URL,
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export const apiConfig = { publicApi, privateApi };