import { configureStore } from '@reduxjs/toolkit'
import themeReducer from "../slice/themeslice"
import authReducer from "../slice/authSlice"
export const store = configureStore({
  reducer: {
    theme:themeReducer,
    auth:authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})