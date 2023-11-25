import React,{ useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";

import { FlashMsg } from './features/flashMsg/FlashMsg';
import { getCredentials, getUserData, doLogout } from './features/auth/authSlice';

export default function Layout({ children, title, actionBtn }) {
  const dispatch = useDispatch()

  const userData = useSelector(getUserData);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getCredentials()).unwrap();
  }, []);

  const onLogoutClick = async () => {
    try {
      await dispatch(doLogout()).unwrap();
    } catch (err) {
      setError(err);
    } 
  }

  let curUserInfo;
  if (userData.id) {
    curUserInfo = <p>Hello, <strong>{userData.username}</strong> | <a href="#" onClick={onLogoutClick}>Sign out</a></p>
  } else {
    curUserInfo = <p>Hello, <strong>guest</strong> | <Link to="/login">Sign in</Link></p>
  }

  let errorContent;
  if (error) {
    errorContent = <div className="error-message">{error}</div>
  }

  return (
    <>
      <FlashMsg />
      <header className="welcome-text">
        <p>
          <Link to="/">To-Do App</Link>
        </p>
        {curUserInfo}
      </header>
      <main>
        {errorContent}
        <div className="control-panel">
          <h3>{title}</h3>
          {actionBtn}
        </div>
        {children}
      </main>
    </>
  );
}
