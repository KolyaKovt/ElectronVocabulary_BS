/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import FormVocabulary from './_form_vocabulary'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const { ipcRenderer } = window.require('electron')

export default function RenameVocabulary({ openedVoc, escapeHandler }) {
  const [vocabulary, setVocabulary] = useState({ name: '' })

  const vocNameRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    vocNameRef.current.value = vocabulary.name
  }, [vocabulary])

  useEffect(() => {
    ipcRenderer.on('get-vocabulary', (event, vocabulary) =>
      setVocabulary(vocabulary)
    )

    ipcRenderer.send('give-vocabulary', openedVoc)

    return () => {
      ipcRenderer.removeAllListeners('get-vocabulary')
    }
  }, [])

  return (
    <main>
      <h1>Rename vocabulary</h1>
      <FormVocabulary
        vocNameRef={vocNameRef}
        submit={() => {
          ipcRenderer.send(
            'rename-vocabulary',
            openedVoc,
            vocNameRef.current.value
          )
          navigate('/')
        }}
        escapeHandler={escapeHandler}
      />
    </main>
  )
}

RenameVocabulary.propTypes = {
  openedVoc: PropTypes.number,
  escapeHandler: PropTypes.func,
}
