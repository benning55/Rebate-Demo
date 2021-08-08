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
      return resp
    } catch (err) {
      return err.response
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

export const getNameColumn = () => {
  return async function (dispatch, getState) {
    try {
      const resp = await axios.get(`${ENDPOINT}/column/`)
      return resp
    } catch (err) {
      return err.response
    }
  }
}

export const getDefaultRebate = () => {
  return async function (dispatch, getState) {
    try {
      const resp = await axios.get(`${ENDPOINT}/rebate/default/`)
      return resp
    } catch (err) {
      return err.response
    }
  }
}

export const editDefaultRebate = (data) => {
  return async function (dispatch, getState) {
    try {
      const resp = await axios.post(`${ENDPOINT}/rebate/default/`, data)
      return resp
    } catch (err) {
      return err.response
    }
  }
}

export const getCustomTemplate = () => {
  return async function (dispatch, getState) {
    try {
      const resp = await axios.get(`${ENDPOINT}/custom/`)
      return resp
    } catch (err) {
      return err.response
    }
  }
}

export const createCustom = (data) => {
  return async function (dispatch, getState) {
    try {
      const resp = await axios.post(`${ENDPOINT}/custom/`, data)
      return resp
    } catch (err) {
      return err.response
    }
  }
}

export default {
  getDefault,
  editDefault,
  getDefaultRebate,
  getNameColumn,
  editDefaultRebate,
  getCustomTemplate,
  createCustom,
  isLoading,
}
