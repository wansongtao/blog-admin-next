import axios, { AxiosError } from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_MINIO_API,
  timeout: 10000,
  withCredentials: true
})

export const uploadFile = (url: string, file: File) => {
  return new Promise<[err?: AxiosError, data?: true]>((resolve) => {
    instance
      .put(url, file, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        resolve([undefined, true])
      })
      .catch((err) => {
        resolve([err])
      })
  })
}
