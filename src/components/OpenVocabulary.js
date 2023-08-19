/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Question from './Question'
import Search from './Search'

const { ipcRenderer } = window.require('electron')

export default function OpenVocabulary({
  selectedWords,
  setSelectedWords,
  escapeHandler,
  openedVoc,
}) {
  const [vocabulary, setVocabulary] = useState({
    firstLang: [],
    secLang: [],
    name: '',
    countOfRepetitions: 0,
  })

  const escapeRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    ipcRenderer.send('give-vocabulary', openedVoc)
  })
  
  useEffect(() => {
    searchRef.current.focus()
    
    const handler = e => escapeHandler(e, escapeRef)
    
    document.addEventListener('keydown', handler)
    
    ipcRenderer.on('get-vocabulary', (event, vocabulary) =>
      setVocabulary(vocabulary)
    )

    setSelectedWords([])

    return () => {
      ipcRenderer.removeAllListeners('get-vocabulary')
      document.removeEventListener('keydown', handler)
    }
  }, [])

  function deleteSelectedWords() {
    selectedWords.forEach(index => {
      ipcRenderer.send('remove-word', vocabulary.wordsIds[index])
    })

    setSelectedWords([])
  }

  function selectElement(index, addToSelection, removeFromSelection) {
    if (addToSelection) {
      setSelectedWords(curr => [...curr, index])
    } else if (removeFromSelection) {
      setSelectedWords(curr => curr.filter(item => item !== index))
    }
  }

  function handleElementClick(index, ctrlKey, shiftKey) {
    if (ctrlKey) {
      selectElement(index, !selectedWords.includes(index), false)
    } else if (shiftKey && selectedWords.length > 0) {
      const startIndex = selectedWords[selectedWords.length - 1]
      const endIndex = index
      const rangeSelection = []

      for (
        let i = Math.min(startIndex, endIndex);
        i <= Math.max(startIndex, endIndex);
        i++
      ) {
        rangeSelection.push(i)
      }

      setSelectedWords(rangeSelection)
    }
    if (!ctrlKey && !shiftKey) setSelectedWords([index])
  }

  function searchWords(e) {
    e.preventDefault()

    let indecies = []

    const voc = vocabulary
    const word = searchRef.current.value
    for (let j = 0; j < voc.firstLang.length; j++) {
      const firstLangWord = voc.firstLang[j]
      const secLangWord = voc.secLang[j]

      if (
        firstLangWord.toLowerCase().includes(word.toLowerCase().trim()) ||
        secLangWord.toLowerCase().includes(word.toLowerCase().trim())
      ) {
        indecies.push(j)
        break
      }
    }

    setSelectedWords(indecies)
  }

  return (
    <main>
      <div className="vocSearchPan">
        <Search searchRef={searchRef} action={searchWords} />
        <div>
          <div className="countT">
            CW: {vocabulary.firstLang.length} CR:{' '}
            {vocabulary.countOfRepetitions}
          </div>
        </div>
      </div>
      <Link className="btn btn-secondary" to="/" ref={escapeRef}>
        Cancel
      </Link>
      <Link className="btn btn-success" to="/words/add">
        Add words
      </Link>
      <Link className="btn btn-primary" to="/play/connecting-words">
        Play connecting words
      </Link>
      <Link className="btn btn-dark" to="/play/guessing-words">
        Play guessing word
      </Link>
      {selectedWords.length > 0 && (
        <>
          <Link className="btn btn-success" to="/words/move">
            Move
          </Link>
          <Question action={deleteSelectedWords} />
        </>
      )}
      <div className="words-in-voc">
        {vocabulary.firstLang.map((word, index) => {
          return (
            <div className="container-for-word-pairs" key={index}>
              <div
                className="word-pairs"
                onClick={event => {
                  const { ctrlKey, shiftKey } = event
                  handleElementClick(index, ctrlKey, shiftKey)
                }}
              >
                <div
                  className={
                    selectedWords.includes(index) ? 'selected-word' : 'word'
                  }
                >
                  {word}
                </div>
                <div
                  className={
                    selectedWords.includes(index) ? 'selected-word' : 'word'
                  }
                >
                  {vocabulary.secLang[index]}
                </div>
              </div>
              <div className="links">
                <Link
                  to="/words/change"
                  className="btn btn-primary"
                  onClick={() => setSelectedWords([index])}
                >
                  Change
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
