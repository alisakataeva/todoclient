import Cookies from 'js-cookie'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import client from '../../api/client'
import { showFlashMsg, hideFlashMsg } from '../flashMsg/msgSlice'

const userInitialState = {
  id: null,
  username: null,
  email: null,
  isAdmin: false
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userData: userInitialState
  },
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(getCredentials.fulfilled, (state, action) => {
        if (action.payload) {
          state.userData = { ...action.payload, isAdmin: action.payload.is_admin }
        } else {
          state.userData = userInitialState
        }
      })
      .addCase(doLogin.fulfilled, (state, action) => {
        const { id, username, email, is_admin, token } = action.payload
        Cookies.set('auth_token', token)
        state.userData = { id, username, email, isAdmin: is_admin }
      })
      .addCase(doLogout.fulfilled, (state, action) => {
        Cookies.remove('auth_token')
        state.userData = userInitialState
      })
  }
})

export const getUserData = state => state.auth.userData
export const getIsAdmin = state => state.auth.userData.isAdmin

const showHideFlashMsg = (dispatch, message) => {
  dispatch(showFlashMsg({ message }))
  setTimeout(() => dispatch(hideFlashMsg()), 10000)
}

export const getCredentials = createAsyncThunk('auth/getCredentials', async (_, { rejectWithValue, dispatch }) => {
  const response = await client.getCredentials(Cookies.get('auth_token'));
  const jsonResponse = await response.json()
  return jsonResponse.userData
})

export const doLogin = createAsyncThunk('auth/doLogin', async (authData, { rejectWithValue, dispatch }) => {
  const response = await client.login(authData);
  const jsonResponse = await response.json()
  const { status, message, data } = jsonResponse
  if (status === 'ERR') return rejectWithValue(message)
  showHideFlashMsg(dispatch, message)
  return data
})

export const doLogout = createAsyncThunk('auth/doLogout', async (_, { rejectWithValue, dispatch }) => {
  const response = await client.logout();
  const jsonResponse = await response.json()
  const { status, message } = jsonResponse
  if (status === 'ERR') return rejectWithValue(message)
  showHideFlashMsg(dispatch, message)
})

export default authSlice.reducer
