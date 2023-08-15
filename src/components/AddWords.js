/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import FormWord from './_form_word'

const { ipcRenderer } = window.require('electron')

export default function AddWords({ openedVoc, escapeHandler }) {
  const [vocabulary, setVocabulary] = useState({
    name: '',
    firstLang: [],
    secLang: [],
  })

  const wordRef = useRef(null)
  const translRef = useRef(null)

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
      <h1>Adding words in: {vocabulary.name}</h1>
      <FormWord
        wordRef={wordRef}
        translRef={translRef}
        submit={() => {
          ipcRenderer.send(
            'add-word',
            vocabulary.id,
            wordRef.current.value,
            translRef.current.value
          )

          wordRef.current.focus()

          wordRef.current.value = ''
          translRef.current.value = ''
        }}
        escapeHandler={escapeHandler}
      />
    </main>
  )
}

AddWords.propTypes = {
  openedVoc: PropTypes.number,
  escapeHandler: PropTypes.func,
}
