/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const countOfStrins = 6
let indecies = []
let countOfGuessedWords = 0

const { ipcRenderer } = window.require('electron')

export default function GuessingWords({ openedVoc, escapeHandler }) {
  const [vocabulary, setVocabulary] = useState({
    firstLang: [],
    secLang: [],
    name: '',
  })

  const escapeRef = useRef(null)

  const [correctInd, setCorrectInd] = useState(-1)
  const [buttonsInds, setButtonsInds] = useState([])

  const [wrongInds, setWrongInds] = useState([])

  useEffect(() => {
    ipcRenderer.on('get-vocabulary', (event, vocabulary) =>
      setVocabulary(vocabulary)
    )

    ipcRenderer.send('give-vocabulary', openedVoc)

    const handler = e => escapeHandler(e, escapeRef)

    document.addEventListener('keydown', handler)

    return () => {
      ipcRenderer.removeAllListeners('get-vocabulary')
      document.removeEventListener('keydown', handler)
    }
  }, [])

  useEffect(() => {
    restart()
  }, [vocabulary])

  function restart() {
    countOfGuessedWords = 0
    setWrongInds([])
    getIndecies()
    fillButtonsInds()
  }

  function getIndecies() {
    indecies = vocabulary.firstLang.map((el, i) => i)
  }

  function fillButtonsInds() {
    if (indecies.length === 0) return

    const rndIndex = getRandomNumber(0, indecies.length - 1)
    const corrInd = indecies[rndIndex]
    setCorrectInd(corrInd)
    let l = [corrInd]

    indecies.splice(rndIndex, 1)

    let minimal = Math.min(countOfStrins, vocabulary.firstLang.length)

    const leftIndecies = []
    for (let i = 0; i < vocabulary.firstLang.length; i++) {
      if (corrInd !== i) leftIndecies.push(i)
    }

    for (let i = 1; i < minimal; i++) {
      const rndIndexForButtns = getRandomNumber(0, leftIndecies.length - 1)

      l.push(leftIndecies[rndIndexForButtns])

      leftIndecies.splice(rndIndexForButtns, 1)
    }

    shuffleArray(l)

    setButtonsInds(l)
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

  function checkTheAnswer(i) {
    if (buttonsInds[i] === correctInd) {
      countOfGuessedWords++
      setWrongInds([])
      fillButtonsInds()
    } else {
      if (!wrongInds.includes(i)) setWrongInds(current => [...current, i])
    }

    if (vocabulary.firstLang.length - countOfGuessedWords === 0) {
      setButtonsInds([])
      setCorrectInd(-1)
      ipcRenderer.send('increment-countOfRepetitions', openedVoc)
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
      <div className="word-to-guess">{vocabulary.firstLang[correctInd]}</div>
      <div className="games-container">
        {buttonsInds.map((bIndex, i) => {
          return (
            <div
              className={
                'word words-variants ' + (wrongInds.includes(i) ? 'wrong' : '')
              }
              onClick={() => checkTheAnswer(i)}
              key={i}
            >
              {vocabulary.secLang[bIndex]}
            </div>
          )
        })}
      </div>
    </main>
  )
}

GuessingWords.propTypes = {
  openedVoc: PropTypes.number,
  escapeHandler: PropTypes.func,
}
