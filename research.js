/**
 * Author: Ken Ingram
 * Date: 2021 02 04 1000
 * Purpose: Update youtube link database according to already saved channels
 * 
 * Notes: The final version of this script may be renamed to channelUpdater.js
 * TODO: Use flags to (show) or (store) the retrieved data.
 * TODO: Check the retrieved videoid and if it is already in the database, skip it for add.
 * TODO: Turn this script into object code.
 */

require('dotenv').config()
const axios = require('axios')
const mysql = require('mysql2')
const DATABASE = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DB
}

// let yourmom = require('./yourmom')

const flag = process.argv[2]
const search_term = process.argv[3]
const num_pages = (process.argv[4]) ? process.argv[4] : 1
const appendText = (process.argv[5]) ? ` [${process.argv[5]}]` : ""

function printObj(input) {
  return JSON.stringify(input, null, 2)
}


function formatDuration(input){
  /**
   * The duration data in the video data is in ISO 8601 format (https://www.w3.org/TR/NOTE-datetime)
   * E.g.: PT11M58S
   * 
   * This function converts it to a string of digits
   */

  let timeinfo = [];
  let timedata = input
  let matches =[/(\d+)H/,/(\d+)M/,/(\d+)S/];

  for (let k=0; k < matches.length; k++){
          timeinfo[k] = (timedata.match(matches[k])) ? timedata.match(matches[k])[1].padStart(2,'0') : '00';
  }

  return timeinfo.join("");
}

function setURL(type, videoid=null, channelid=null, nextpage=null) {
  const API_KEY = process.env.API_KEY1
  const url_base="https://www.googleapis.com/youtube/v3/"
  const url_api_key = `key=${API_KEY}`

  if (type === 'channel') {
    return `${url_base}channels?part=snippet,contentDetails&channel&id=${channelid}&${url_api_key}`
  } else if (type === 'video') {
    return `${url_base}videos?part=contentDetails,snippet&id=${videoid}&${url_api_key}`
  } else if (type === 'uploads') {
    return `${url_base}search?part=snippet&channelId=${channelid}&maxResults=50&order=date&${url_api_key}`
  } else if (type === 'nextpage') {
    return `${url_base}search?part=snippet&channelId=${channelid}&maxResults=50&order=date&pageToken=${nextpage}&${url_api_key}`
  }
}

async function getChannelID(channelname) {
  const connection = mysql.createConnection(DATABASE)
  let dbResults
  let SQL="SELECT objid, owner_name, channel_id FROM youtube_channel_owners WHERE lower(owner_name) LIKE lower(?)"
  const inserts = [`%${channelname}%`]
  SQL = mysql.format(SQL, inserts)
  console.log(SQL)
  try {
    dbResults = await connection.promise().query(SQL)
  } catch (e) {
    console.log(`(Line 79): ${e.sqlMessage} ${e}`)
  } finally {
    connection.end()
  }

  return dbResults[0]
}

async function getChannelInfo(channel, channel_dbid) {
  const channelData = []
  const url = setURL('channel', null, channel, null)
  const response = await axios.get(url)

  // console.log(response.data, url)
  response.data.items.forEach((item) => {
    channelData.push({
      channel_owner: channel_dbid,
      channel_id: item.id,
      published: item.snippet.publishedAt,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high
    })
  })
  return channelData
}

async function getChannelUploadsList(channel, channel_dbid, pages=null) {
  let maxpages
  let i = 1
  let url = setURL('uploads', null, channel, null)
  // console.log(`[Line 110] ${url}`)
  let response = await axios.get(url)
  const videoList = []
  const playLists = []
  //console.log(`(Line 112): ${url}\n`)
  pages = (pages === '*') ? pages : parseInt(pages)
  /**
   * If a channel has a lot of uploads, there will be a lot of pages
   * returned in this API call. We want to have the option is seeing farther back
   * in the channel history, or limit the view to more recent uploads so
   * this section needs a while loop to make a new call to the subsequent pages
   * 
   */

  if (pages === '*') {
    maxpages = Math.ceil(response.data.pageInfo.totalResults/50)  
  } else {
    maxpages = pages
  }

  // console.log(`[Line 130] pages: ${pages} maxPages: ${maxpages} ${response.data.pageInfo.totalResults} ${response.data.pageInfo.totalResults/50}`)
  response.data.items.forEach((item) => {
    if (Object.keys(item.id).includes('videoId')){
      videoList.push({
        videoid: item.id.videoId,
        title: item.snippet.title,
        published: item.snippet.publishedAt,
        channel_owner: channel_dbid
      })
    }

    if (Object.keys(item.id).includes('publishedAt')){
      playLists.push()
    }
  })

  while (response.data.nextPageToken && (i < maxpages)) {
    url = setURL('nextpage', null, channel, response.data.nextPageToken)
    // console.log(`(Line 145): ${url}`)
    response = await axios.get(url)
    response.data.items.forEach((item) => {
      if (Object.keys(item.id).includes('videoId')){
        videoList.push({
          videoid: item.id.videoId,
          title: item.snippet.title,
          published: item.snippet.publishedAt,
          channel_owner: channel_dbid
        })
      }      

      if (Object.keys(item.id).includes('publishedAt')){
        playLists.push()
      }
    }) 
    i++    
  }

  // console.log(`(Line 151): ${printObj(playLists)}`)
  videoList.sort((a, b) =>  (a.published > b.published) ? 1 : -1 )

  return videoList
}

async function retrieveData(data) {
  /**
   * Input is an array of objects containing 
   * {
   *  videoid: string
   *  title: string
   *  published: date string
   *  channel_owner: integer
   * }
   * 
   * This function loops through that array
   * retrieves the data from the API for that videoid, forms an object, stores that object
   * data in an array and returns that array.
   * 
   * API URL: https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoid}&key=${API_KEY}
   * 
   */
  
  const videoDataURL = 'videos?part=snippet%2CcontentDetails%2Cstatistics'
  let record = {}
  const objectList = []
  
  for (let i = 0; i < data.length; i++) {
    try {
      let url = setURL('video', data[i].videoid, null, null)
      let response = await axios.get(url)
      // console.log(response.data.items[0].snippet.title, x.channel_owner, response.data.items[0].contentDetails.duration)

      record = {
        tags: null,
        published: new Date(response.data.items[0].snippet.publishedAt).toLocaleString().replace(',',''),
        title: response.data.items[0].snippet.title,
        description: response.data.items[0].snippet.description,
        thumbnail: response.data.items[0].snippet.thumbnails.default.url,
        duration: formatDuration(response.data.items[0].contentDetails.duration),
        url: `https://www.youtube.com/watch?v=${response.data.items[0].id}`,
        channel_owner_id: data[i].channel_owner
      }    
    } catch (e) {
      console.log(`(Line 209): ${JSON.stringify(e, null, 2)}`)
    } finally {
      objectList.push(record)
    }
  }

  return objectList
}

async function addData(data) {
  /**
   * Takes an array of objects as input and for each element converts it to
   * database ready values for insert into the table.
   * 
   * object format {
   *  tags: string,         => keywords
   *  published: date,           => upload_date
   *  title: string,            => title
   *  description: string,      => description
   *  thumbnail: string,         => thumbnail
   *  duration: string,         => play_length
   *  url: string,              => url
   *  channel_owner: integer  => channel_owner_id
   * }
   * 
   * 
   */

  // try {
    connection = mysql.createConnection(DATABASE)
    /**
     * In this try block we prepare the SQL and then executes it.
     * Then we close the connection when we're done inserting.
     */
    // const columns = "keywords, channel_owner_id, play_length, url, title, description, upload_date"
    const columns = "keywords, upload_date, caption, description, thumbnail, play_length, url, channel_owner_id, status"
    const values = [
      (data.tags) ? JSON.stringify(data.tags).replace(/"/g,'').replace(/\[|\]/g,'') : null, 
      data.published,
      `${data.title}${appendText}`,
      data.description,
      data.thumbnail,
      data.duration,
      data.url,
      data.channel_owner_id,
      1
    ]

    SQL = `INSERT INTO youtube_downloads (${columns}) VALUES (?,date_format(str_to_date(?,'%m/%d/%Y %r'), '%Y-%m-%d %r'),?,?,?,?,?,?,?)`
    connection.query(SQL, values, function(error, results, fields) {
      if (error) {
        console.log(error)
      }
      console.log(`(Line 266): /Channel: ${values[7]}/ New Row Objid: ${results.insertId} ${data.title} [${data.published}] ${data.duration}`)
    })

    connection.end()
}

async function dataCheck(data) {
  /**
   * Are these items already in the database?
   * 
   * Instead of making multiple database calls for each item, grab all of them
   * and see if there are any not in the database. Whichever videoid's are not
   * in the database are saved to ann array, so they can be passed to the function
   * that retrievs their data from the API.
   * 
   * dataCheck() sends back an array of id's which is a list of video data we want to download
   * 
   */
  const connection = mysql.createConnection(DATABASE)
  const API_KEY = process.env.API_KEY1
  let results = []
  let leftovers = []
  let test = []

  const videos = data.map((x) => {
    // console.log(`dataCheck() line 285: ${JSON.stringify(x, null, 2)}`)
    return `'${x.videoid}'`
  }).join(",")

  // console.log(`(Line 289): ${videos}`)

  SQL = `select videoid FROM youtube_downloads WHERE videoid IN (${videos})`
  // console.log(`Line 292: ${SQL}`)
  try {
    results = await connection.promise().query(SQL)

    // results[0].forEach((x) => {
    //   // console.log(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${x.videoid}&key=${API_KEY}`)
    // })
  } catch (e) {
    console.log(e)
  } finally {
    connection.end()
  }

  // console.log(`\nLine 305: ${results[0].length}\n`)

  if (results[0].length === 0) {
    /** Edit note 2021 02 10 1124
     * This branch was producing an array of 'videoid' strings when all of 
     * the checked values were not in the database. This was causing the 
     * addData() to break because it expects the array elements to be objects 
     * and not string values.
     * */ 
    data.forEach((x) => {
      leftovers.push(x)
    })
  } else if (results[0].length > 0 && results[0].length <= videos.length) {
    test = results[0].map((x) => {
      return `'${x.videoid}'`
    }).join(",")

    // console.log(`(Line 280): ${JSON.stringify(test, null, 2)}`)

    data.forEach((x) => {
      if (!(test.includes(x.videoid))) {
        // console.log(`(Line 326): ${x.videoid} ${x.title} is NOT in the database`)
        leftovers.push(x)
      }
    })
  }

  // console.log(`(Line 332): ${JSON.stringify(leftovers, null, 2)}`)
  return leftovers
}

async function updateChannel() {
  const result = await getChannelID(search_term)
  result.forEach(x => {
    console.log(x.owner_name, x.channel_id)
  })
  const channelData = await getChannelInfo(result[0].channel_id, result[0].objid)
  const videoData = await getChannelUploadsList(result[0].channel_id, result[0].objid, num_pages)
  
  // console.log(`(Line 241): ${JSON.stringify(videoData, null, 2)}`)
  videoData.forEach((x) => {
    let date = new Date(x.published).toLocaleString().replace(",","")
    //console.log(`(Line 344):${x.channel_owner} -- (${date}) [${x.videoid}] ${x.title}`)
  })

  // Pass the array of objects into the check function 
  let test = await dataCheck(videoData)
  // console.log(test)
  const finalresult = await retrieveData(test)

  console.log('\n')
  finalresult.forEach((x) => {
    addData(x)
  })
}

updateChannel()
