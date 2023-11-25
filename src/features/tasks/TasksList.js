import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import {
  selectAllTasks, fetchTasks, getSorting, 
  getPagination, sortingChanged, curPageChanged,
  markTaskAsDone
} from './tasksSlice'

import { getIsAdmin } from '../auth/authSlice'

function RowTemplate({ id, username, email, text, status, actions, updated_at }) {
  return (
    <>
      <div className="task-cell task-no">{id}</div>
      <div className="task-cell task-username">{username}</div>
      <div className="task-cell task-email">{email}</div>
      <div className="task-cell task-text">
        <p>{text}</p>
        <small><i>{updated_at ? '(edited by admin)' : ''}</i></small>
      </div>
      <div className="task-cell task-status">{status}</div>
      <div className="task-cell task-actions">{actions}</div>
    </>
  )
}

export const TasksList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null)

  const tasks = useSelector(selectAllTasks);
  const sorting = useSelector(getSorting);
  const pagination = useSelector(getPagination);
  const isAdmin = useSelector(getIsAdmin);

  const taskStatus = useSelector(state => state.tasks.status)

  useEffect(() => {
    if (taskStatus === 'idle') {
      try {
        dispatch(fetchTasks()).unwrap()
      } catch (err) {
        setError(err)
      }
    }
  }, [taskStatus, dispatch]);
  
  // useEffect(() => {
  //   if (taskStatus === 'idle') {
  //     const fetchData = async () => {
  //       try {
  //         await dispatch(fetchTasks()).unwrap()
  //       } catch (err) {
  //         setError(err)
  //       }
  //     }
  //     fetchData()
  //   }
  // }, [taskStatus, dispatch]);

  const onEditTaskClicked = (taskId) => {
    navigate(`/edit/${taskId}`);
  }

  const EditTaskBtn = ({ taskId }) => {
    return <button onClick={() => onEditTaskClicked(taskId)}>Edit</button>
  }

  const onMarkTaskAsDoneClicked = (taskId) => {
    dispatch(markTaskAsDone(taskId))
  }

  const MarkTaskAsDoneBtn = ({ taskId }) => {
    return <button className="btn-success" onClick={() => onMarkTaskAsDoneClicked(taskId)}>Done!</button>
  }

  let content;

  if (taskStatus === 'loading') {
    content = "Loading..."
  } else if (taskStatus === 'succeeded') {
    const renderedTasks = tasks.map(task => {
      if (task) {
        return <div className="task" key={task.id}>
          <RowTemplate
            id={task.id}
            username={task.username}
            email={task.email}
            text={task.text}
            status={task.status}
            updated_at={task.updated_at}
            actions={ isAdmin ?
              <>
                <EditTaskBtn taskId={task.id} />
                { task.status === 'DONE' ? <></> : <MarkTaskAsDoneBtn taskId={task.id} />}
              </> : <></>
            }
          />
        </div>
      }
    })

    const onSortChange = async (fieldName, newValue) => {
      dispatch(sortingChanged({ fieldName, newValue }))
      try {
        await dispatch(fetchTasks()).unwrap()
      } catch (err) {
      } finally {
      }
    }

    const SortableTableHeader = ({ name, fieldName }) => {
      return (
        <>
          <span>{name}</span>
          <div className="sort-container">
            <div
              className={`sort-btn ${sorting.field === fieldName && sorting.type === 'ASC' ? ' active' : ''}`}
              onClick={() => onSortChange(fieldName, "ASC")}
            >&#x25B2;</div>
            <div
              className={`sort-btn ${sorting.field === fieldName && sorting.type === 'DESC' ? ' active' : ''}`}
              onClick={() => onSortChange(fieldName, "DESC")}
            >&#x25BC;</div>
          </div>
        </>
      )
    }

    const Pagination = () => {
      const { curPage, totalPages }= pagination
      const firstPage = 1;
      const lastPage = totalPages;

      const goToPrevPage = () => {
        if (curPage > firstPage) onPaginationBtnClick(curPage - 1)
      }

      const goToNextPage = () => {
        if (lastPage > curPage) onPaginationBtnClick(curPage + 1)
      }

      const onPaginationBtnClick = async (page) => {
        dispatch(curPageChanged(page))
        try {
          await dispatch(fetchTasks()).unwrap()
        } catch (err) {
        } finally {
        }
      }

      return (
        <>
          <p>Pagination:</p>
          <div className="pagination">
            <div
              className={`pag-btn ${curPage == firstPage ? 'disabled' : ''}`}
              onClick={goToPrevPage}
            >&lsaquo;</div>
            {Array(totalPages).fill(0).map((_, iter) => {
              const pageNum = iter + 1;
              return (
                <div
                  key={pageNum}
                  className={`pag-btn ${curPage == (pageNum) ? 'active' : ''}`}
                  onClick={() => onPaginationBtnClick(pageNum)}
                >
                  {pageNum}
                </div>
              )
            })}
            <div
              className={`pag-btn ${curPage == lastPage ? 'disabled' : ''}`}
              onClick={goToNextPage}
            >&rsaquo;</div>
          </div>
        </>
      )
    }
    
    content = <>
      <div className="task-header">
        <RowTemplate
          id="#"
          username={<SortableTableHeader name="Username" fieldName="username" />}
          email={<SortableTableHeader name="Email" fieldName="email" />}
          text="Text"
          status={<SortableTableHeader name="Status" fieldName="status" />}
          actions="Actions"
        />
      </div>
      <div className="task-list">
        {renderedTasks}
      </div>
      <div className="task-footer">
        {<Pagination />}
      </div>
    </>
  } else if (taskStatus === 'failed') {
    content = <div className='error-message'>{error}</div>
  }

  return (
    <div className='tasks'>
      {content}
    </div>
  )
}