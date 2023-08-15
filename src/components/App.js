//importing dependencies
import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

//importing other components
import ListVocabularies from './ListVocabularies'
import NewVocabulary from './NewVocabulary'
import OpenVocabulary from './OpenVocabulary'
import RenameVocabulary from './RenameVocabulary'
import AddWords from './AddWords'
import ChangeWords from './ChangeWords'
import ConnectingWords from './ConnectingWords'
import GuessingWords from './GuessingWords'
import MoveWords from './MoveWords'

export default function App() {
  const [openedVoc, setOpenedVoc] = useState(() => {
    const lsOpenedVoc = localStorage.getItem('openedVoc')

    if (lsOpenedVoc) return parseInt(lsOpenedVoc)
    else return -1
  })
  const [selectedWords, setSelectedWords] = useState(() => {
    const lsSelectedWords = JSON.parse(localStorage.getItem('selectedWords'))

    if (lsSelectedWords) {
      return lsSelectedWords
    } else return []
  })

  useEffect(() => {
    localStorage.setItem('openedVoc', openedVoc.toString())
  }, [openedVoc])
  useEffect(() => {
    localStorage.setItem('selectedWords', JSON.stringify(selectedWords))
  }, [selectedWords])

  function escapeHandler(e, escapeRef) {
    if (e.key === 'Escape' || e.key === 'Esc') escapeRef.current.click()
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<ListVocabularies setOpenedVoc={setOpenedVoc} />}
      />
      <Route
        path="/new"
        element={<NewVocabulary escapeHandler={escapeHandler} />}
      />
      <Route
        path="/open"
        element={
          <OpenVocabulary
            selectedWords={selectedWords}
            setSelectedWords={setSelectedWords}
            openedVoc={openedVoc}
            escapeHandler={escapeHandler}
          />
        }
      />
      <Route
        path="/rename"
        element={
          <RenameVocabulary
            escapeHandler={escapeHandler}
            openedVoc={openedVoc}
          />
        }
      />
      <Route
        path="/words/add"
        element={
          <AddWords openedVoc={openedVoc} escapeHandler={escapeHandler} />
        }
      />
      <Route
        path="/words/change"
        element={
          <ChangeWords
            openedVoc={openedVoc}
            escapeHandler={escapeHandler}
            indexWord={selectedWords[0]}
          />
        }
      />
      <Route
        path="/words/move"
        element={
          <MoveWords
            selectedWords={selectedWords}
            openedVoc={openedVoc}
            escapeHandler={escapeHandler}
          />
        }
      />
      <Route
        path="/play/connecting-words"
        element={
          <ConnectingWords
            openedVoc={openedVoc}
            escapeHandler={escapeHandler}
          />
        }
      />
      <Route
        path="/play/guessing-words"
        element={
          <GuessingWords openedVoc={openedVoc} escapeHandler={escapeHandler} />
        }
      />
    </Routes>
  )
}
