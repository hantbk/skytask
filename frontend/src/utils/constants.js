import { env } from '~/config/environment'

export const API_ROOT = env.BUILD_MODE === 'dev'
  ? env.DEV_API_ROOT
  : env.PROD_API_ROOT

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}