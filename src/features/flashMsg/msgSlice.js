import { createSlice } from '@reduxjs/toolkit'

export const msgSlice = createSlice({
  name: 'msg',
  initialState: {
    isVisible: false,
    text: null,
    type: "success",
  },
  reducers: {
    showFlashMsg: (state, action) => {
      const { message, type } = action.payload
      state.text = message;
      state.type = type ? type : "success";
      state.isVisible = true;
    },
    hideFlashMsg: state => {
      state.isVisible = false;
    }
  }
})

export const { showFlashMsg, hideFlashMsg } = msgSlice.actions

export const getVisibility = state => state.msg.isVisible
export const getText = state => state.msg.text
export const getType = state => state.msg.type

export default msgSlice.reducer