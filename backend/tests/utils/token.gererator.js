import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'

export const generateToken = async (payload) => {
  return await JwtProvider.generateToken(payload, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)
}
