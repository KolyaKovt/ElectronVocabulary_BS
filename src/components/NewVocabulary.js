import FormVocabulary from './_form_vocabulary'
import PropTypes from 'prop-types'
import { useRef } from 'react'

const { ipcRenderer } = window.require('electron')

export default function NewVocabulary({ escapeHandler }) {
  const vocNameRef = useRef()

  return (
    <main>
      <h1>New vocabulary</h1>
      <FormVocabulary
        vocNameRef={vocNameRef}
        submit={() => {
          ipcRenderer.send('create-vocabulary', vocNameRef.current.value)
          vocNameRef.current.value = ''
        }}
        escapeHandler={escapeHandler}
      />
    </main>
  )
}

NewVocabulary.propTypes = {
  escapeHandler: PropTypes.func,
}
