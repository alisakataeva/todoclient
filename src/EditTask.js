import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import Layout from './Layout'
import { showFlashMsg, hideFlashMsg } from './features/flashMsg/msgSlice';
import { TaskForm } from './features/tasks/TaskForm'
import { getIsAdmin } from './features/auth/authSlice';

export default function Task() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAdmin = useSelector(getIsAdmin);

  if (!isAdmin) {
    dispatch(showFlashMsg({ message: "Access denied", type: "error" }))
    setTimeout(() => dispatch(hideFlashMsg()), 8000)
    navigate("/")
  }

  return (
    <Layout title="Edit task:">
      <TaskForm />
    </Layout>
  );
}
