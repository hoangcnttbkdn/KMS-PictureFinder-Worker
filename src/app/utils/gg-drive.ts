import { JSONClient } from 'google-auth-library/build/src/auth/googleauth'
import { google } from 'googleapis'
import { TokenRepository } from '../repositories'

class GoogleDriveHelper {
  private tokenRepository: TokenRepository
  constructor() {
    this.tokenRepository = new TokenRepository()
  }

  private authorize = async (): Promise<JSONClient> => {
    try {
      const token = await this.tokenRepository.findOne({ where: { id: 1 } })
      return google.auth.fromJSON({
        type: token.type,
        client_id: token.clientId,
        client_secret: token.clientSecret,
        refresh_token: token.refreshToken,
      })
    } catch (err) {
      return null
    }
  }

  public getGGBuffer = async (fileId: string): Promise<Buffer> => {
    const auth = await this.authorize()
    const drive = google.drive({
      auth,
      version: 'v3',
    })
    return new Promise((resolve, reject) => {
      drive.files.get(
        {
          fileId,
          alt: 'media',
        },
        {
          responseType: 'arraybuffer',
        },
        (err: any, res: any) => {
          if (err) return reject(null)
          resolve(Buffer.from(res.data, 'binary'))
        },
      )
    })
  }
}

export const googleDriveHelper = new GoogleDriveHelper()
