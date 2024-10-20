import 'dotenv/config'

export const env = {
  BUILD_MODE: process.env.BUILD_MODE || 'dev'
}
