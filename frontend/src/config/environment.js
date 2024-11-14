import 'dotenv/config'

export const env = {
  BUILD_MODE: process.env.BUILD_MODE,
  DEV_API_ROOT: process.env.DEV_API_ROOT,
  PROD_API_ROOT: process.env.PROD_API_ROOT
}
