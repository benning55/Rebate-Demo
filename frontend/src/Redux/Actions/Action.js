import { SET_VC, SET_JWT } from "../Types/Type"

export const setVc = (data) => ({
  type: SET_VC,
  payload: data,
})

export const setJWT = (data) => ({
  type: SET_JWT,
  payload: data,
})
