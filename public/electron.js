const { app, BrowserWindow, ipcMain } = require('electron')
const db = require('./vocDb/db')

let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadURL(`file://${app.getAppPath()}/build/index.html`)
})

//interacting with the db
ipcMain.on('give-vocabularies', async () => {
  mainWindow.webContents.send('get-vocabularies', await db.getVocabularies())
})
ipcMain.on('give-vocabulary', async (event, id) => {
  mainWindow.webContents.send('get-vocabulary', await db.getVocabulary(id))
})
ipcMain.on('create-vocabulary', async (event, name) => {
  await db.createVocabulary(name.trim())
})
ipcMain.on('rename-vocabulary', async (event, id, name) => {
  await db.renameVocabulary(id, name.trim())
})
ipcMain.on('delete-vocabulary', async (event, id) => {
  await db.deleteVocabulary(id)
})
ipcMain.on('add-word', async (event, vocabulary_id, word, translation) => {
  await db.addWordToVocabulary(vocabulary_id, word.trim(), translation.trim())
})
ipcMain.on('remove-word', async (event, wordId) => {
  await db.removeWordFromVocabulary(wordId)
})
ipcMain.on('change-word', async (event, wordId, word, translation) => {
  await db.changeWordInVocabulary(wordId, word.trim(), translation.trim())
})
ipcMain.on('increment-countOfRepetitions', async (event, id) => {
  await db.incrementCountOfRepetitionsInVocabulary(id)
})
ipcMain.on('move-words', async (event, idFrom, idTo, indeciesWords) => {
  const vocFrom = await db.getVocabulary(idFrom)

  indeciesWords.sort()

  indeciesWords.forEach(async ind => {
    await db.addWordToVocabulary(
      idTo,
      vocFrom.firstLang[ind],
      vocFrom.secLang[ind]
    )
  })

  indeciesWords.sort(compareDescending)

  indeciesWords.forEach(async ind => {
    await db.removeWordFromVocabulary(vocFrom.wordsIds[ind])
  })

  function compareDescending(a, b) {
    return b - a
  }
})
ipcMain.on('give-names-who-has', async (event, word) => {
  const vocs = await db.getVocabularies()
  let names = []

  for (let i = 0; i < vocs.length; i++) {
    const voc = vocs[i];
    
    for (let j = 0; j < voc.firstLang.length; j++) {
      const firstLangWord = voc.firstLang[j];
      const secLangWord = voc.secLang[j];
      
      if (firstLangWord.toLowerCase().includes(word.toLowerCase().trim()) || 
      secLangWord.toLowerCase().includes(word.toLowerCase().trim())) {
        names.push(voc.name)
        break
      }
    }
  }

  mainWindow.webContents.send('get-names-who-has', names)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
