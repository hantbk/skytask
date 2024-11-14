export const API_ROOT = process.env.BUILD_MODE === 'dev'
  ? import.meta.env.VITE_DEV_API_ROOT
  : import.meta.env.VITE_PROD_API_ROOT

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}