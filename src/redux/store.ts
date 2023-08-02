import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import signInReducer from './features/signInSlice'
import userInfoReducer from './features/userInfoSlice'

export const store = configureStore({
  reducer: { authReducer, signInReducer, userInfoReducer },
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
