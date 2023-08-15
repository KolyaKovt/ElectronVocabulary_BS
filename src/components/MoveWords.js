/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const { ipcRenderer } = window.require('electron')

export default function MoveWords({ selectedWords, openedVoc, escapeHandler }) {
  const [vocabularies, setVocabularies] = useState([])
  const navigate = useNavigate()

  const escapeRef = useRef(null)

  useEffect(() => {
    const handler = e => escapeHandler(e, escapeRef)

    document.addEventListener('keydown', handler)

    ipcRenderer.on('get-vocabularies', (event, vocabularies) =>
      setVocabularies(vocabularies)
    )

    return () => {
      ipcRenderer.removeAllListeners('get-vocabularies')
      document.removeEventListener('keydown', handler)
    }
  }, [])

  useEffect(() => {
    ipcRenderer.send('give-vocabularies')
  })

  function moveTo(idTo) {
    ipcRenderer.send('move-words', openedVoc, idTo, selectedWords)

    navigate('/open')
  }

  return (
    <main>
      <h1>Where?</h1>
      <Link className="btn btn-secondary" to="/open" ref={escapeRef}>
        Cancel
      </Link>
      <div className="vocabularies">
        {vocabularies.map(vocabulary => {
          return (
            <section
              className="vocabulary"
              key={vocabulary.id}
              onDoubleClick={() => moveTo(vocabulary.id)}
            >
              <div className="voc-name">
                <section>{vocabulary.name}</section>
                <section className="count-of-rep-sec">
                  {vocabulary.countOfRepetitions}
                </section>
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
