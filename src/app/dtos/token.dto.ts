import { IsString } from 'class-validator'

export class UpdateTokenDto {
  @IsString()
  type: string

  @IsString()
  clientId: string

  @IsString()
  clientSecret: string

  @IsString()
  refreshToken: string
}
