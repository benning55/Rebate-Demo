import { SET_VC, SET_JWT } from "../Types/Type"
import ENDPOINT from "../Types/Endpoints"
import axios from "axios"

export const setVc = (data) => ({
  type: SET_VC,
  payload: data,
})

export const setJWT = (data) => ({
  type: SET_JWT,
  payload: data,
})

export const getDefault = () => {
  return async function (dispatch, getState) {
    try {
      const resp = await axios.get(`${ENDPOINT}/target/default/`)
      return resp.data.data
    } catch (err) {
      console.log(err)
      return "hello"
    }
  }
}

export default {
  getDefault,
}
