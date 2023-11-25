import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Signin from './Signin';
import NewTask from './NewTask';
import EditTask from './EditTask';
import reportWebVitals from './reportWebVitals';
import store from './store'
import { Provider } from 'react-redux'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Signin />,
  },
  {
    path: "/new",
    element: <NewTask />,
  },
  {
    path: "/edit/:taskId",
    element: <EditTask />,
  },
  {
    path: "/hello",
    element: <div>Hello world!</div>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
