import axios from 'axios'
import { ImageUrl } from '../typings'
import { SessionTypeEnum } from '../../shared/constants'
import { googleDriveHelper } from '../utils'

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

export const fetchImageFromSource = async (
  file: ImageUrl,
  type: SessionTypeEnum,
) => {
  switch (type) {
    case SessionTypeEnum.FACEBOOK:
      return fetchImageFromUrl(file.url)
    case SessionTypeEnum.DRIVE:
      return googleDriveHelper.getGGBuffer(file.id)
    default:
      return
  }
}
