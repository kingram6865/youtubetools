const color = require('./utilities/consoleColors')
require('dotenv').config()
const axios = require('axios')
const API_KEY = process.env.API_KEY2


function convertDuration(input) {
  let time = input.replace('PT', '')
  let hour = (time.match(/\d+H/))? time.match(/\d+H/)[0].replace('H','') : '0'
  let minutes = (time.match(/\d+M/)) ? time.match(/\d+M/)[0].replace('M','') : '0'
  let seconds = (time.match(/\d+S/)) ? time.match(/\d+S/)[0].replace('S','') : '0'

  hour = (hour > 9) ? `${hour}` : `0${hour}`
  minutes = (minutes > 9) ? minutes : `0${minutes}`
  seconds = (seconds > 9) ? seconds : `0${seconds}`

  let timestamp = `${hour}${minutes}${seconds}`
  return timestamp;
}

async function apiResults(id) {
  url = `https://youtube.googleapis.com/youtube/v3/videos?&part=snippet&part=contentDetails&id=${id}&key=${process.env.API_KEY2}`
  results = await axios.get(url)
  // let source = Object.keys(results.data.items[0]) 
  // console.log(Object.keys(results.data.items[0]))
  Object.keys(results.data.items[0]).forEach(item => {
    console.log(JSON.stringify(results.data.items[0][item], null, 2))
  })
}

apiResults(process.argv[2])


