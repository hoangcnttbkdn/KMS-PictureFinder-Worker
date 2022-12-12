/* eslint-disable @typescript-eslint/ban-types */
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth'
import { google } from 'googleapis'
import * as fs from 'fs/promises'
import path from 'path'

class GoogleDriveHelper {
  private TOKEN_PATH: string

  constructor() {
    this.TOKEN_PATH = path.join(process.cwd(), 'gg-token.json')
  }

  private authorize = async (): Promise<JSONClient> => {
    try {
      const content = await fs.readFile(this.TOKEN_PATH)
      const credentials = JSON.parse(content.toString())
      return google.auth.fromJSON(credentials)
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
