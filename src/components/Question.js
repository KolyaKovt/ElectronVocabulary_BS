import React, { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Question = ({ action }) => {
  const [toastShown, setToastShown] = useState(false)

  const handleContinueClick = () => {
    if (!toastShown) {
      const toastId = toast.info('Do you want to continue?', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        closeButton: (
          <div>
            <button onClick={() => handleConfirm(toastId)}>Yes</button>
            <button onClick={() => handleCancel(toastId)}>No</button>
          </div>
        ),
      })
      setToastShown(true)
    }
  }

  const handleConfirm = toastId => {
    toast.dismiss(toastId)
    action()
    setToastShown(false)
  }

  const handleCancel = toastId => {
    toast.dismiss(toastId)
    setToastShown(false)
  }

  return (
    <button className="btn btn-danger" onClick={handleContinueClick}>
      Delete
    </button>
  )
}

export default Question
