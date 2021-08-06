import { SET_VC, SET_JWT, SET_LOADING } from "../Types/Type"
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

export const setLoading = (data) => ({
  type: SET_LOADING,
  payload: data,
})

export const isLoading = (data) => {
  return async function (dispatch, getState) {
    dispatch(setLoading(data))
  }
}

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

export const editDefault = (data) => {
  return async function (dispatch, getState) {
    try {
      const resp = await axios.post(`${ENDPOINT}/target/default/`, data)
      return resp
    } catch (err) {
      return err.response
    }
  }
}

export default {
  getDefault,
  editDefault,
  isLoading,
}
