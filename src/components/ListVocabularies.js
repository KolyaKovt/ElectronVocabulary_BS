/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Question from './Question'
import Search from './Search'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const { ipcRenderer } = window.require('electron')

export default function ListVocabularies({ setOpenedVoc }) {
  const [vocabularies, setVocabularies] = useState([])
  const searchRef = useRef(null)

  useEffect(() => {
    ipcRenderer.on('get-vocabularies', (event, vocabularies) =>
      setVocabularies(vocabularies)
    )

    ipcRenderer.on('get-names-who-has', (event, names) => {
      let str = ''

      for (let i = 0; i < names.length; i++) {
        const name = names[i]
        str += name

        if (i !== names.length - 1) str += ', '
        else str += '.'
      }

      showNotification(str)
    })

    return () => {
      ipcRenderer.removeAllListeners('get-vocabularies')
      ipcRenderer.removeAllListeners('get-names-who-has')
    }
  }, [])

  useEffect(() => {
    ipcRenderer.send('give-vocabularies')
    searchRef.current.focus()
  })

  function showNotification(message) {
    toast(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    })
  }

  function searchWords(e) {
    e.preventDefault()
    ipcRenderer.send('give-names-who-has', searchRef.current.value)
  }

  return (
    <main>
      <Search searchRef={searchRef} action={searchWords} />
      <Link className="btn btn-success" to="/new">
        New vocabulary
      </Link>
      <div className="vocabularies">
        {vocabularies.map(vocabulary => {
          return (
            <section className="vocabulary" key={vocabulary.id}>
              <div className="voc-name">
                <section>{vocabulary.name}</section>
                <section className="count-of-rep-sec">
                  CW: {vocabulary.firstLang.length} CR:{' '}
                  {vocabulary.countOfRepetitions}
                </section>
              </div>
              <Link
                className="btn btn-secondary"
                onClick={() => setOpenedVoc(vocabulary.id)}
                to="/open"
              >
                Open
              </Link>
              <Link
                className="btn btn-primary"
                to="/rename"
                onClick={() => setOpenedVoc(vocabulary.id)}
              >
                Rename
              </Link>
              <Question
                action={() =>
                  ipcRenderer.send('delete-vocabulary', vocabulary.id)
                }
              />
            </section>
          )
        })}
      </div>
    </main>
  )
}
