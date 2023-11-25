import React from 'react'
import { useNavigate } from "react-router-dom";
import './App.css';
import Layout from './Layout'
import { TasksList } from './features/tasks/TasksList'

function App() {
  const navigate = useNavigate();

  const goToNewTaskPage = (e) => {
    e.preventDefault()
    navigate("/new")
  }

  const NewTaskBtn = () => {
    return <button onClick={goToNewTaskPage}>+ New Task</button>
  }

  return (
    <Layout title="Task List:" actionBtn={<NewTaskBtn />}>
      <TasksList />
    </Layout>
  );
}

export default App;
