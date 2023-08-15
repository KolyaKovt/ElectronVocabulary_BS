/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormWord from './_form_word'

const { ipcRenderer } = window.require('electron')

export default function ChangeWords({ openedVoc, indexWord, escapeHandler }) {
  const [vocabulary, setVocabulary] = useState({
    name: '',
    firstLang: [],
    secLang: [],
  })

  const wordRef = useRef(null)
  const translRef = useRef(null)

  useEffect(() => {
    wordRef.current.value = vocabulary.firstLang[indexWord]
    translRef.current.value = vocabulary.secLang[indexWord]
  }, [vocabulary])

  const navigate = useNavigate()

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
      <h1>Changing words in: {vocabulary.name}</h1>
      <FormWord
        wordRef={wordRef}
        translRef={translRef}
        submit={() => {
          ipcRenderer.send(
            'change-word',
            vocabulary.wordsIds[indexWord],
            wordRef.current.value,
            translRef.current.value
          )

          wordRef.current.focus()

          navigate('/open')
        }}
        escapeHandler={escapeHandler}
      />
    </main>
  )
}

ChangeWords.propTypes = {
  openedVoc: PropTypes.number,
  escapeHandler: PropTypes.func,
  indexWord: PropTypes.number,
}
