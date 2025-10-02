import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { doLogin } from './authSlice'

export const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const onUsernameChanged = e => setUsername(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)

  const validateForm = () => {
    if (!username) {
      setError("Username is required");
      return false;
    } else if (!password) {
      setError("Password is required");
      return false;
    }
    return true;
  }

  const onSignInClicked = async () => {
    if (validateForm()) {
      try {
        await dispatch(doLogin({ username, password })).unwrap()
        navigate("/")
      } catch (err) {
        setError(err)
      }
    }
  }

  let errorContent;
  if (error) {
    errorContent = <div className="error-message">{error}</div>
  }

  return (
    <div className="new-task">
      <div className="admin-credentials">
        <h3>admin credentials:</h3>
        <p><strong>Login:</strong> admin</p>
        <p><strong>Password:</strong> 123</p>
      </div>
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
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onPasswordChanged}
          />
        </div>
        <button type="button" onClick={onSignInClicked}>Sign in</button>
      </form>
    </div>
  )
}