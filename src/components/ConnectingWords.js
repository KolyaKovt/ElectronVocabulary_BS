/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const countOfStrins = 7
let indecies = []
let countOfGuessedWords = 0

const { ipcRenderer } = window.require('electron')

export default function ConnectingWords({ openedVoc, escapeHandler }) {
  const [vocabulary, setVocabulary] = useState({
    firstLang: [],
    secLang: [],
    name: '',
  })

  const escapeRef = useRef(null)

  const [currIndFL, setCurrIndFL] = useState([])
  const [currIndSL, setCurrIndSL] = useState([])

  const [selectedFL, setSelectedFL] = useState(-1)
  const [selectedSL, setSelectedSL] = useState(-1)

  const [guessedIndFL, setGuessedIndFL] = useState([])
  const [guessedIndSL, setGuessedIndSL] = useState([])

  const [wrongAnswer, setWrongAnswer] = useState(false)

  useEffect(() => {
    const handler = e => escapeHandler(e, escapeRef)

    document.addEventListener('keydown', handler)

    ipcRenderer.on('get-vocabulary', (event, vocabulary) =>
      setVocabulary(vocabulary)
    )

    ipcRenderer.send('give-vocabulary', openedVoc)

    return () => {
      ipcRenderer.removeAllListeners('get-vocabulary')
      document.removeEventListener('keydown', handler)
    }
  }, [])

  useEffect(() => {
    restart()
  }, [vocabulary])

  useEffect(() => {
    if (selectedFL === -1 || selectedSL === -1) return

    if (currIndFL[selectedFL] === currIndSL[selectedSL]) {
      setGuessedIndFL(current => [...current, selectedFL])
      setGuessedIndSL(current => [...current, selectedSL])
      countOfGuessedWords++
      clearSelected()
    } else {
      setWrongAnswer(true)
      setTimeout(() => {
        setWrongAnswer(false)
        clearSelected()
      }, 500)
    }

    if (vocabulary.firstLang.length - countOfGuessedWords === 0)
      ipcRenderer.send('increment-countOfRepetitions', openedVoc)
  }, [selectedFL, selectedSL])

  useEffect(() => {
    if (guessedIndFL.length === countOfStrins) {
      clearButtons()
      fillCurrentWords()
    }
  }, [guessedIndFL, guessedIndSL])

  function clearSelected() {
    setSelectedFL(-1)
    setSelectedSL(-1)
  }

  function clearButtons() {
    setGuessedIndFL([])
    setGuessedIndSL([])
    clearSelected()
  }

  function restart() {
    countOfGuessedWords = 0
    clearButtons()
    getIndecies()
    fillCurrentWords()
  }

  function getIndecies() {
    indecies = vocabulary.firstLang.map((el, i) => i)
  }

  function fillCurrentWords() {
    let fl = []
    let sl = []

    let minimal = Math.min(countOfStrins, indecies.length)

    for (let i = 0; i < minimal; i++) {
      const rndIndex = getRandomNumber(0, indecies.length - 1)

      fl.push(indecies[rndIndex])
      sl.push(indecies[rndIndex])

      indecies.splice(rndIndex, 1)
    }

    shuffleArray(sl)

    setCurrIndFL(fl)
    setCurrIndSL(sl)
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function shuffleArray(array) {
    for (let i = 0; i < array.length; i++) {
      let element = array[i]
      let randomIndex = getRandomNumber(0, array.length - 1)
      let anotherElement = array[randomIndex]
      array[i] = anotherElement
      array[randomIndex] = element
    }
  }

  return (
    <main>
      <div className="h1-plus-buttons">
        <h1>Left words: {vocabulary.firstLang.length - countOfGuessedWords}</h1>
        <Link className="btn btn-secondary" to="/open" ref={escapeRef}>
          Cancel
        </Link>
        <button className="btn btn-success" onClick={restart}>
          Restart
        </button>
      </div>
      <div className="games-container">
        {currIndFL.map((wIndex, i) => {
          return (
            <div className="word-pairs game" key={i}>
              <div
                className={
                  'word ' +
                  (wrongAnswer && selectedFL === i
                    ? 'wrong'
                    : guessedIndFL.includes(i)
                    ? 'guessed'
                    : selectedFL === i
                    ? 'selected'
                    : '')
                }
                onClick={() => {
                  if (wrongAnswer) return
                  selectedFL === i ? setSelectedFL(-1) : setSelectedFL(i)
                }}
              >
                {vocabulary.firstLang[wIndex]}
              </div>
              <div
                className={
                  'word ' +
                  (wrongAnswer && selectedSL === i
                    ? 'wrong'
                    : guessedIndSL.includes(i)
                    ? 'guessed'
                    : selectedSL === i
                    ? 'selected'
                    : '')
                }
                onClick={() => {
                  if (wrongAnswer) return
                  selectedSL === i ? setSelectedSL(-1) : setSelectedSL(i)
                }}
              >
                {vocabulary.secLang[currIndSL[i]]}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

ConnectingWords.propTypes = {
  openedVoc: PropTypes.number,
  escapeHandler: PropTypes.func,
}
