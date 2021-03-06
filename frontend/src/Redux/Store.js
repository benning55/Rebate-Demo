import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import rootReducer from "./Reducer"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

const persistConfig = {
  key: "poc",
  whitelist: ["view"],
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// eslint-disable-next-line
export default () => {
  let store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(thunk))
  )
  let persistor = persistStore(store)
  return { store, persistor }
}
