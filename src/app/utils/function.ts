import axios from 'axios'

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const fetchImageFromUrl = async (url: string) => {
  const res = await axios({
    url,
    responseType: 'arraybuffer',
  })
  return Buffer.from(res.data, 'binary')
}
