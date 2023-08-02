import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SignInState = {
  signInState: boolean
}

const initialState = {
  signInState: false,
} as SignInState

export const signIn = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    resetSignIn: () => initialState,
    setSignInState: (state, action: PayloadAction<boolean>) => {
      state.signInState = action.payload
    },
  },
})

export const { setSignInState, resetSignIn } = signIn.actions
export default signIn.reducer
