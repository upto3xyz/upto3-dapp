import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  authState: boolean
}

const initialState = {
  authState: false,
} as AuthState

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: () => initialState,
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.authState = action.payload
    },
  },
})

export const { setAuthState, resetAuth } = auth.actions
export default auth.reducer
