import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuthUser = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

type AuthState = {
  user: AuthUser | null
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setUser: (
      state,
      action: PayloadAction<AuthUser | null>
    ) => {
      state.user = action.payload
      state.isLoading = false
    },

    setUserPhoto: (
      state,
      action: PayloadAction<string | null>
    ) => {
      if (state.user) {
        state.user.photoURL = action.payload
      }
    },
  },
})

export const { setUser, setUserPhoto } = authSlice.actions

export const selectCurrentUser = (state: {
  auth: AuthState
}) => state.auth.user

export const selectAuthLoading = (state: {
  auth: AuthState
}) => state.auth.isLoading

export const selectUserPhoto = (state: {
  auth: AuthState
}) => state.auth.user?.photoURL ?? null

export default authSlice.reducer