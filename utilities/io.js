const { stat } = require('fs')

const fs = require('fs').promises

async function isFileExists(path) {
  try {
    return (await fs.stat(path)).isFile()
  } catch (e) {
    return false
  }
}

async function isDirExists(path) {
  try {
    return (await fs.stat(path))
  } catch (e) {
    return false
  }
}

function timeStamp(option=1) {
  let date = new Date()
  let year = date.getFullYear()
  let month = (date.getMonth()+1 < 10) ? `0${date.getMonth()+1}` : date.getMonth()+1
  let day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate()
  let hour = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours()
  let minutes = (date.getMinutes()) ? `0${date.getMinutes()}` : date.getMinutes()
  let seconds = (date.getSeconds() < 10) ? `0${date.getSeconds()}` : date.getSeconds()

  switch(option){
    case 0:
      return `${year}_${month}_${day}`;
    case 1:
      return `${year}_${month}_${day}_${hour}${minutes}${seconds}`
  }
}

async function isDirExists(dest) {
  let message = {
    status: "",
    text: ""
  }
  try {
    await fs.stat(dest)
    message.status = true
    message.text = "Directory exists"
  } catch (err) {
    if (err.code === "ENOENT") {
      try {
        await fs.mkdir(dest)
        message.text = `...Created directory ${dest}.`
        message.status = true
      } catch (error) {
        console.error(error.message)
        message.status = "false"
        message.text = error.message
      }
    }
  } finally {
    return message
  }
}

async function writeData (data, name, dirName) {
  let results, dataFile, folder
  let dataFileDestination = `./${dirName}/${timeStamp()}_${name}.json`

  // Check if the file already exists at the dataFile Destination
  folder = await isDirExists(dirName)
  dataFile = await isFileExists(dataFileDestination)
  

  if (!dataFile.status) {
    // If it does not already exist, create the file and write the data to it
    try {
      await fs.writeFile(dataFileDestination, data)
      results = {message: "Write successful.", filename: `${dataFileDestination}`}
    } catch (err) {
      console.log('Error writing file', err);
      results = {message: "Write failed.", filename: `${dataFileDestination}`}
    }
  } else {
    // If the file already exists, append the data to it
    try {
      await fs.appendFile(dataFileDestination, data)
      results = {message: "Append successful.", filename: `${dataFileDestination}`}
    } catch (err) {
      console.log('Error appending data to file', err);
      results = {message: "Append failed.", filename: `${dataFileDestination}`}
    }
  }
  return results
}

async function readData (file) {
  let results, temp
  try {
    temp = await fs.readFile(file)
    results = JSON.parse(temp)
  } catch(err) {
    console.log(err)
  }
  return results
}

module.exports = {
  writeData,
  readData, 
  timeStamp
}