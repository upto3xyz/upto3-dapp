import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UserInfoState = {
  bio: string
  displayName: string | null
  following: number
  followingOrg: number
  honors: number
  photoURL: string
  twitterHandle: string | undefined
  twitterName: string | undefined
}

const initialState = {
  bio: '',
  displayName: null,
  following: 0,
  followingOrg: 0,
  honors: 0,
  photoURL: '',
  twitterHandle: '',
  twitterName: '',
} as UserInfoState

export const userInfo = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    resetUserInfo: () => initialState,
    setUserInfo: (state, action: PayloadAction<UserInfoState>) => {
      state.bio = action.payload.bio
      state.displayName = action.payload.displayName
      state.following = action.payload.following
      state.followingOrg = action.payload.followingOrg
      state.honors = action.payload.honors
      state.photoURL = action.payload.photoURL
      state.twitterHandle = action.payload.twitterHandle
      state.twitterName = action.payload.twitterName
    },
  },
})

export const { setUserInfo, resetUserInfo } = userInfo.actions
export default userInfo.reducer
