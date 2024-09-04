const color = require('./utilities/consoleColors')
require('dotenv').config()
const axios = require('axios')
const API_KEY = process.env.API_KEY2
const { pool, formatSQL } = require('./db/connect')
let conn = pool('random_facts')

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

async function executeSQL(sql) {
  let results
  try {
    results = await conn.promise().query(sql);
  } catch(err) {
    console.log(err)
  }

  return results;
}

async function getZeroTimes() {
  let sql = `SELECT objid, videoid FROM youtube_downloads WHERE play_length='00:00:00' AND status = 1`
  try {
    const [rows, fields] = await executeSQL(sql)
    return rows;
  } catch {
    console.log(err)
  }
}

async function setPlayTime() {
  let max = 100
  let source  = await getZeroTimes();
  let newTimes = {
    videoid: '', playLength: ''
  }
  
  if (source.length > 0) {
    let updateList = ''
    console.log('Line 52:', source)
    for (let i = 0; i < max; i++) {
      let sql, url, results
      if (source[i]) {
        url = `https://youtube.googleapis.com/youtube/v3/videos?&part=snippet&part=contentDetails&id=${source[i].videoid}&key=${process.env.API_KEY2}`
        results = await axios.get(url)
        // console.log(`${color.brightGreen}[Line  59] Updating Play Length for: ${color.Reset}`, results.data.items[0].snippet.channelTitle, results.data.items[0].snippet.title)
        console.log(`${color.brightGreen}Updating Play Length for: ${color.Reset}`, results.data.items[0].snippet.channelTitle, results.data.items[0].snippet.title)
      // }

        if (results.data && results.data.items.length > 0) {
          let actualPlayTime, data
          if (results.data.items.length) {
            actualPlayTime = convertDuration(results.data.items[0].contentDetails.duration)
            data = [actualPlayTime, source[i].objid]
            sql = `UPDATE youtube_downloads SET play_length=? WHERE objid = ?`
            // console.log(`[Line  72]: ${source[i].videoid} ${color.brightBlue}${results.data.items[0].contentDetails.duration}${color.Reset}/${color.brightGreen}${actualPlayTime}${color.Reset} ${results.data.items[0].snippet.title}`)
            console.log(`${source[i].videoid} ${color.brightBlue}${results.data.items[0].contentDetails.duration}${color.Reset} => ${color.brightGreen}${actualPlayTime}${color.Reset} ${results.data.items[0].snippet.title}`)
          }
          
          sql = formatSQL(sql, data)
          // console.log('[Line  87]: ', sql, '\n-----------------------------------')
          console.log(sql, '\n-----------------------------------')
          updateList = updateList + `${source[i].objid} `
        }
      }

      if (sql) {
        executeSQL(sql)
      }
    }
    console.log(`Updated: `, updateList)
  }

  setTimeout(() => {
    conn.end()
  }, 2000)
}

setPlayTime()
