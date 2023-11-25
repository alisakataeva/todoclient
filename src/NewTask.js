import React from 'react'
import Layout from './Layout'
import { TaskForm } from './features/tasks/TaskForm'

export default function Task() {
  return (
    <Layout title="New task:">
      <TaskForm />
    </Layout>
  );
}
