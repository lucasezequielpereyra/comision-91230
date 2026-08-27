import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuthUser = {
  uid: string
  email: string | null
  displayName: string | null
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
  },
})

export const { setUser } = authSlice.actions

export const selectCurrentUser = (state: {
  auth: AuthState
}) => state.auth.user

export const selectAuthLoading = (state: {
  auth: AuthState
}) => state.auth.isLoading

export default authSlice.reducer