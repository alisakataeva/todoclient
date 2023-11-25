import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import { getUserData } from '../auth/authSlice';
import { showFlashMsg, hideFlashMsg } from '../flashMsg/msgSlice';
import { selectTaskById, addNewTask, updateTask, fetchTasks } from './tasksSlice';

export const TaskForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { taskId } = useParams();
  const task = useSelector(state => {
    if (taskId) return selectTaskById(state, taskId)
    return undefined
  })

  const userData = useSelector(getUserData)

  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const [error, setError] = useState(null)

  const [username, setUsername] = useState(task ? task.username : (userData.id ? userData.username : ''))
  const [email, setEmail] = useState(task ? task.email : (userData.id ? userData.email : ''))
  const [text, setText] = useState(task ? task.text : '')

  const onUsernameChanged = e => setUsername(e.target.value)
  const onEmailChanged = e => setEmail(e.target.value)
  const onTextChanged = e => setText(e.target.value)

  const isValidEmail = email => /\S+@\S+\.\S+/.test(email)

  const validateForm = () => {
    if (!username) {
      setError("Username is required");
      return false;
    } else if (!email) {
      setError("Email is required");
      return false;
    } else if (!text) {
      setError("Text is required");
      return false;
    } else if (!isValidEmail(email)) {
      setError("Email is invalid");
      return false;
    }
    return true;
  }

  const onSaveTaskClicked = async () => {
    if (validateForm() && addRequestStatus === 'idle') {
      try {
        setAddRequestStatus('pending')

        if (task) {
          await dispatch(updateTask({ id: task.id, text, username, email, status: task.status })).unwrap()
        } else {
          await dispatch(addNewTask({ text, username, email })).unwrap()
        }

        dispatch(fetchTasks())
        navigate("/")
      } catch (err) {
        const { message, code } = err
        if (code == '401') {
          dispatch(showFlashMsg({ message, type: "error" }))
          setTimeout(() => dispatch(hideFlashMsg()), 8000)
          navigate("/")
        }
        setError(message)
      }
    }
  }

  let errorContent;
  if (error) {
    errorContent = <div className="error-message">{error}</div>
  }

  return (
    <div className="new-task">
      {errorContent}
      <form className="form">
        <div className="field">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={onUsernameChanged}
            disabled={taskId || userData.id}
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onEmailChanged}
            disabled={taskId || userData.id}
          />
        </div>
        <div className="field">
          <label htmlFor="text">Text:</label>
          <textarea
            name="text"
            id="text"
            cols={40}
            rows={6}
            value={text}
            onChange={onTextChanged}
          ></textarea>
        </div>
        <button type="button" onClick={onSaveTaskClicked}>Save</button>
      </form>
    </div>
  )
}