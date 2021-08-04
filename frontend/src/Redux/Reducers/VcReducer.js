import { SET_VC, SET_JWT } from "../Types/Type"

const initialState = {
  data: null,
  jwt: null,
}

export const vcReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_VC:
      return {
        ...state,
        data: action.payload,
      }
    case SET_JWT:
      return {
        ...state,
        jwt: action.payload,
      }
    default:
      return state
  }
}
