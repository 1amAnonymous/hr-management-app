import { configureStore } from '@reduxjs/toolkit'
import themeReducer from "../slice/themeslice"
export const store = configureStore({
  reducer: {
    theme:themeReducer,
  },
})