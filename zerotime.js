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
  // let sql = `SELECT count(*) FROM youtube_downloads WHERE play_length='00:00:00'`
  // let sql = 'show tables'
  try {
    const [rows, fields] = await executeSQL(sql)
    return rows;
  } catch {
    console.log(err)
  }
}

async function setPlayTime() {
  let source  = await getZeroTimes();
  let newTimes = {
    videoid: '', playLength: ''
  }

  let max = 100
  
  if (source.length > 0) {
    let updateList = ''
    console.log('Line 55:', source)
    for (let i = 0; i < max; i++) {
      let sql, url, results
      if (source[i]) {
        url = `https://youtube.googleapis.com/youtube/v3/videos?&part=snippet&part=contentDetails&id=${source[i].videoid}&key=${process.env.API_KEY2}`
        results = await axios.get(url)
        console.log(`${color.brightGreen}[Line  61] Updating Play Length for: ${color.Reset}`, results.data.items[0].snippet.channelTitle, results.data.items[0].snippet.title)
      // }

        if (results.data && results.data.items.length > 0) {
          let actualPlayTime, data
          if (results.data.items.length) {
            actualPlayTime = convertDuration(results.data.items[0].contentDetails.duration)
            // data = [actualPlayTime, results.data.items[0].snippet.title, source[i].objid]
            // sql = `UPDATE youtube_downloads SET play_length=?, caption = ? WHERE objid = ?`
            data = [actualPlayTime, source[i].objid]
            sql = `UPDATE youtube_downloads SET play_length=? WHERE objid = ?`
            console.log(`[Line  72]: ${source[i].videoid} ${color.brightBlue}${results.data.items[0].contentDetails.duration}${color.Reset}/${color.brightGreen}${actualPlayTime}${color.Reset} ${results.data.items[0].snippet.title}`)
          // } else {
          //   actualPlayTime ='00:00:00'
          //   data = [source[i].objid]
          //   sql = `UPDATE youtube_downloads SET status = 0 WHERE objid = ?`
          //   console.log(`${source[i].videoid} ${color.brightBlue}${results.data.items}${color.Reset}/${color.brightGreen}${actualPlayTime}${color.Reset} ${results.data.items}`)
          }
          
          

          // sql = `UPDATE youtube_downloads SET play_length ='${actualPlayTime}', caption = '${results.data.items[0].snippet.title}' WHERE objid = ${source[i].objid}\n`
          
          sql = formatSQL(sql, data)
          console.log('[Line  85]: ', sql, '\n-----------------------------------')
          updateList = updateList + `${source[i].objid} `
        // } else {
        //   if (source[i]) {
        //     console.log(`${color.FgRed}${source[i].videoid} No data set status = 0${color.Reset}`)
        //     sql = `UPDATE youtube_downloads SET status=0 WHERE objid = ${source[i].objid}`
        //     console.log(sql, '\n')
        //     updateList = updateList + `${source[i].objid} `
        //   } else {

        //   }
        }
      }

      

      if (sql) {
        executeSQL(sql)
      }
    }
    console.log(`[Line 100] Updated: `, updateList)
  }

  setTimeout(() => {
    conn.end()
  }, 2000)
}

// setPlayTime(process.argv[2])
// getZeroTimes()
//   .then(x => console.log(x.length))
setPlayTime()


