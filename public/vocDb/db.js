const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('voc.db')

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS vocabularies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      countOfRepetitions INTEGER DEFAULT 0
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT,
      translation TEXT,
      vocabulary_id INTEGER
    )
  `)
})

function executeQueryAsync(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err)
      resolve(rows)
    })
  })
}

async function getWordsForVocabulary(vocabulary) {
  const query = `SELECT * FROM words WHERE vocabulary_id = ?;`
  const words = await executeQueryAsync(query, [vocabulary.id])

  vocabulary.firstLang = []
  vocabulary.secLang = []
  vocabulary.wordsIds = []

  for (let j = 0; j < words.length; j++) {
    const wordObj = words[j]
    vocabulary.firstLang.push(wordObj.word)
    vocabulary.secLang.push(wordObj.translation)
    vocabulary.wordsIds.push(wordObj.id)
  }

  return vocabulary
}

async function getVocabularies() {
  const query = `SELECT * FROM vocabularies;`
  const vocabularies = await executeQueryAsync(query)

  for (let i = 0; i < vocabularies.length; i++) {
    await getWordsForVocabulary(vocabularies[i])
  }

  return vocabularies
}

async function getVocabulary(id) {
  const query = `SELECT * FROM vocabularies WHERE id = ?;`
  const vocabularies = await executeQueryAsync(query, [id])

  if (vocabularies.length === 0) return

  await getWordsForVocabulary(vocabularies[0])

  return vocabularies[0]
}

async function createVocabulary(name) {
  const query = `INSERT INTO vocabularies (name) VALUES (?);`
  await executeQueryAsync(query, [name])
}

async function renameVocabulary(id, name) {
  const query = `UPDATE vocabularies
  SET name = ?
  WHERE id = ?;`
  await executeQueryAsync(query, [name, id])
}

async function deleteVocabulary(id) {
  const queryWords = `DELETE FROM words
  WHERE vocabulary_id = ?;`

  const queryVocs = `DELETE FROM vocabularies
  WHERE id = ?;`

  await executeQueryAsync(queryWords, [id])
  await executeQueryAsync(queryVocs, [id])
}

async function addWordToVocabulary(vocabularyId, word, translation) {
  const query = `INSERT INTO words (word, translation, vocabulary_id)
  VALUES (?, ?, ?);`
  await executeQueryAsync(query, [word, translation, vocabularyId])
}

async function removeWordFromVocabulary(wordId) {
  const query = `DELETE FROM words
  WHERE id = ?;`
  await executeQueryAsync(query, [wordId])
}

async function changeWordInVocabulary(id, word, translation) {
  const query = `UPDATE words
  SET word = ?, translation = ?
  WHERE id = ?;`
  await executeQueryAsync(query, [word, translation, id])
}

async function incrementCountOfRepetitionsInVocabulary(id) {
  const query = `UPDATE vocabularies
  SET countOfRepetitions = countOfRepetitions + 1
  WHERE id = ?;`
  await executeQueryAsync(query, [id])
}

module.exports = {
  getVocabularies,
  getVocabulary,
  createVocabulary,
  renameVocabulary,
  deleteVocabulary,
  addWordToVocabulary,
  changeWordInVocabulary,
  removeWordFromVocabulary,
  incrementCountOfRepetitionsInVocabulary,
}
