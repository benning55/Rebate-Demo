import { SET_LOADING } from "../Types/Type"

const initialState = {
  isLoading: false,
}

export const vcReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}
