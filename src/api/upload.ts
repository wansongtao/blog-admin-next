import axios from 'axios'
import request from '@/utils/axiosRequest'

export const uploadFile = (url: string, file: File) => {
  return axios.put(url, file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getPresignedUrl = (filename: string) => {
  return request<{ presignedUrl: string }>({
    url: '/upload/presigned',
    method: 'post',
    data: {
      filename
    }
  })
}
