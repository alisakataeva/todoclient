import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import tasksReducer from './features/tasks/tasksSlice'
import flashMsgReducer from './features/flashMsg/msgSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    msg: flashMsgReducer,
  }
})
