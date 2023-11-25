import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { hideFlashMsg, getVisibility, getText, getType } from './msgSlice'

export function FlashMsg() {
  const dispatch = useDispatch();

  const isVisible = useSelector(getVisibility)
  const text = useSelector(getText)
  const type = useSelector(getType)

  const onHideBtnClick = () => {
    dispatch(hideFlashMsg())
  }

  if (isVisible) {
    return (
      <div className="flash-wrapper">
        <div className={`flash-msg ${type}`}>
          <p className="flash-msg-content">{text}</p>
          <p
            className="flash-msg-action"
            onClick={onHideBtnClick}
          >Got it!</p>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
