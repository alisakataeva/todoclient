import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import client from '../../api/client'
import { showFlashMsg, hideFlashMsg } from '../flashMsg/msgSlice'

const initialState = {
  data: [],
  status: 'idle',
  error: null,
  sorting: {
    field: 'username',
    type: 'ASC',
  },
  pagination: {
    curPage: 1,
    itemsPerPage: 3,
    totalPages: null,
  }
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    sortingChanged(state, action) {
      const { fieldName, newValue } = action.payload
      state.sorting.field = fieldName
      state.sorting.type = newValue
    },
    curPageChanged(state, action) {
      state.pagination.curPage = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const { data, totalPages } = action.payload
        state.data = data
        state.pagination.totalPages = totalPages
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(markTaskAsDone.fulfilled, (state, action) => {
        const taskId = action.payload
        const existingTask = state.data.find(t => t.id === taskId)
        if (existingTask) {
          existingTask.status = 'DONE'
        }
      })
  }
})

export const { sortingChanged, curPageChanged } = tasksSlice.actions

export const selectAllTasks = state => state.tasks.data
export const selectTaskById = (state, taskId) => state.tasks.data.find(task => parseInt(task.id) === parseInt(taskId))
export const getSorting = state => state.tasks.sorting
export const getPagination = state => state.tasks.pagination

const showHideFlashMsg = (dispatch, message, type) => {
  dispatch(showFlashMsg({ message, type }))
  setTimeout(() => dispatch(hideFlashMsg()), 8000)
}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue, getState, dispatch }) => {
  const stateData = getState();
  const response = await client.getTasks({ sorting: stateData.tasks.sorting, pagination: stateData.tasks.pagination });
  const jsonResponse = await response.json()
  const { status, message, data, totalPages } = jsonResponse
  if (status === 'ERR') return rejectWithValue(message)
  return { data, totalPages }
})

export const addNewTask = createAsyncThunk('tasks/addNewTask', async (task, { rejectWithValue, dispatch }) => {
    const response = await client.createTask(task)
    const jsonResponse = await response.json()
    const { status, message, code } = jsonResponse
    if (status === 'ERR') return rejectWithValue({ message, code })
    showHideFlashMsg(dispatch, message)
  }
)

export const updateTask = createAsyncThunk('tasks/updateTask', async (task, { rejectWithValue, dispatch }) => {
    const response = await client.updateTask(task)
    const jsonResponse = await response.json()
    const { status, message, code } = jsonResponse
    if (status === 'ERR') return rejectWithValue({ message, code })
    showHideFlashMsg(dispatch, message)
  }
)

export const markTaskAsDone = createAsyncThunk('tasks/markTaskAsDone', async (taskId, { rejectWithValue, dispatch }) => {
    const response = await client.markTaskAsDone(taskId)
    const jsonResponse = await response.json()
    const { status, message, code } = jsonResponse
    if (status === 'ERR') return rejectWithValue({ message, code })
    showHideFlashMsg(dispatch, message)
    return taskId
  }
)

export default tasksSlice.reducer