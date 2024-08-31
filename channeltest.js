require('dotenv').config()
const axios = require('axios')
const mysql = require('mysql2')
const connection = require('./connection')
const DATABASE = {
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.DBUSER,
  password: process.env.DBPW,
  database: process.env.DB
}

// console.log(`USER: ${process.env.USER}\nDB USER: ${process.env.DBUSER}`)

const pool = mysql.createPool(DATABASE)

function closeMySQL() {
  connection.end()
}
// console.log(`process.argv: ${JSON.stringify(process.argv)}`)
let channelid, channeluser, url_param1
let db_data


if (process.argv[2] === 'x'){
  channelid = process.argv[3]
  url_param1 = `&id=${channelid}`
} else if (process.argv[2] === 'y') {
  channeluser = process.argv[3]
  url_param1 = `&forUsername=${channeluser}`
} else if (process.argv[2] == '0') {
  // console.log("No action called")
  getChannelID(process.argv[3])
}

const API_KEY = process.env.API_KEY1
const url_base="https://www.googleapis.com/youtube/v3/"
const url_resource_params = `channels?part=contentDetails,snippet,id`
const url_video_params = 'videos?part=snippet%2CcontentDetails%2Cstatistics&id='
// const url_param1 = `&forUsername=${channeluser}`
// const url_param1a = `&id=${channelid}`
const url_api_key = `&key=${API_KEY}`

let videoList = []

function setURL() {
  return `${url_base}${url_resource_params}${url_param1}${url_api_key}`
}

async function dataCheck(url) {
  let count
  try {
    const response = await axios.get(url)
    count = response.data.pageInfo.totalResults
    // return (count) ? count : null
  } catch (err) {
    console.log(`Axios Error: ${err.isAxiosError}`)
    count = null
  }

  return count
}

async function getPlaylistId(){
  let url = setURL()
  let response
  if (url) {
    console.log(`getPlaylistId(): ${url}`)
    dataCheck(url).then( async (check_result) => {
      try {
        response = await axios.get(url)
        listItems(response.data.items[0].id)
      } catch (err) {
        console.log(`Axios Error: ${err.isAxiosError}`)
      }

    })
  } else {
    return 'No channel name was provided. Please give a channel name. Check the "About" tab.'
  }
}

async function getChannelID(channelname) {
  pool.getConnection(function(err, conn) {
    let SQL="SELECT objid, owner_name, channel_id FROM youtube_channel_owners WHERE lower(owner_name) LIKE lower(?)"
    const inserts = [`%${channelname}%`]
    SQL = mysql.format(SQL, inserts)
    let response = conn.query(SQL, function(error, results, fields) {
      console.log(`getChannelID(): ${results[0].objid}, ${results[0].owner_name}, ${results[0].channel_id}`)
      url_channel_param = `&id=${results[0].channel_id}`
      let url = setURL()
      listItems(results[0].channel_id, results[0].objid)
    })
  })
}

async function listItems(data, db_channel_id) { 
  const videoList = []
  // let id = data.items[0].id
  let id = data
  const url_resource_params = `search?part=snippet&channelId=${id}&maxResults=50&order=date`
  let url = `${url_base}${url_resource_params}${url_api_key}`
  console.log(`listItems(data): ${url}`)
  let response = await axios.get(url)
  // response.data.items.forEach((x) => {
  //   resultsArray.push(x)
  // }) 
  response.data.items.forEach((item) => {
    videoList.push({
      videoId: item.id.videoId,
      published: item.snippet.publishedAt,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high
    })
    // console.log(`https://www.youtube.com/watch?v=${item.id.videoId} ${item.snippet.publishedAt} ${item.snippet.title}`)
  })
  
  videoList.sort((a, b) => (a.published - b.published) ? 1 : -1)

  // videoList.forEach((x) => {
  //   console.log(`${x.published} ${x.title}`)
  // })
  
  getVideoData(videoList, db_channel_id)
  
  // console.log(`videoList length: ${videoList.length}`)
}



function getPlaylistItems(data){
  // const resource=`playlistId=UUVTyTA7-g9nopHeHbeuvpRA&maxResults=50&pageToken=`
  // const resource=`playlistId=${data.items[0].contentDetails.relatedPlaylists.uploads}&maxResults=50&pageToken=`
  let resource
  if (x) {
    resource=`playlistId=${data}&maxResults=50&pageToken=`
  }


  // const results = {
  //   channel_name: data.items[0].snippet.title,
  //   // thumbnail: `<img src="${data.items[0].snippet.thumbnails.high.url}" width="${data.items[0].snippet.thumbnails.high.width}" height="${data.items[0].snippet.thumbnails.high.height}" alt="High Res Thumbnail">`,
  //   thumbnail: [data.items[0].snippet.thumbnails.high.url, data.items[0].snippet.thumbnails.high.width, data.items[0].snippet.thumbnails.high.height],
  //   playlist: data.items[0].contentDetails.relatedPlaylists.uploads
  // }
  // return playList(data.items[0].id)
}

async function playList(data){
  /**
   * The url passed forward from here will be the videos playlist id for "uploads",
   * which is located in data.items[0].contentDetails.relatedPlaylists.uploads
   * Setting channnelId = data means the url in this function looks like:
   * https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${data}&maxResults=50&order=date&key=${API_KEY}
   * 
   * Then retrieve each page, grapping all the data with
   * 
   * https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelid}&maxResults=50&pageToken={nextPageToken}&order=date&key=${API_KEY}
   * 
   * 
   * 
   */

  let resultsArray = []
  let i = 1
  const url_resource_params = `search?part=snippet&channelId=${data}&maxResults=50&order=date`
  let url = `${url_base}${url_resource_params}${url_api_key}`
  let response = await axios.get(url)
  let maxpages = Math.ceil(response.data.pageInfo.totalResults/50)
  // console.log(`Total number of results: ${response.data.pageInfo.totalResults} => ${maxpages} pages`)
  response.data.items.forEach((x) => {
    resultsArray.push(x)
  }) 

  // while (response.data.nextPageToken && (i < maxpages) ){
  //   url = `${url_base}${url_resource_params}&pageToken=${response.data.nextPageToken}${url_api_key}`
  //   response = await axios.get(url)
  //   response.data.items.forEach((x) => {
  //       resultsArray.push(x)
  //   }) 
  //   i++
  // }
    
  console.log(JSON.stringify(resultsArray,null,2))
  return resultsArray
}



async function listAPIChannelInfo(channelname){

}

async function getVideoData(data, channel) {
  /** compare the database info to the API info. 
   * If the videoid is already in the db, skip it 
   * Otherwise call the database add function to store the value from the API
   * 
   * */
  
  const videoData = []
    
  data.forEach(async (x) => {
    url = (x.videoId) ? `${url_base}${url_video_params}${x.videoId}${url_api_key}` : null
    if (url) {
      const response = await axios.get(url)
      const apiData = response.data.items[0]
      // console.log(channel, apiData.snippet.title, apiData.contentDetails.duration, `https://www.youtube.com/watch?v=${apiData.id}`)
      let record = {
        channel_owner_id: channel,
        keywords: apiData.snippet.tags,
        published: (new Date (apiData.snippet.publishedAt)).toLocaleString().replace(',',''),
        title: apiData.snippet.title,
        description: apiData.snippet.description,
        duration: apiData.contentDetails.duration,
        url: `https://www.youtube.com/watch?v=${apiData.id}`
      }

      /**
       * Now want to submit the record as input data to the database
       * The database has a trigger which checks for dupicates returning '45000' error
       * if the url is already recorded. so a new function addData() should take
       * 'record' as input and complete the process.
      */
      // console.log (`${record.published} ${record.channel_owner_id} ${record.title}`)
      addData(record)
    }

      // let SQL = "SELECT videoid FROM youtube_downloads WHERE videoid = ?"
      // let inserts = [x.videoId]
      // SQL = mysql.format(SQL, inserts)
      // let thisone = await connection.query(SQL, function(error, results, fields) {
      //   if (error) throw error
      //     if (results.length === 0){
      //       console.log(` Add ${x.title} to database`)
      //     }
      //   connection.release()
      // })
    })
  // pool.end()
}

async function addData(data) {
  let cols = 'keywords, channel_owner_id, play_length, url, caption, description, upload_date, status'
  let values = [
    (data.keywords) ? JSON.stringify(data.keywords).replace(/"/g,'').replace(/\[|\]/g,'') : null,
    data.channel_owner_id,
    formatDuration(data.duration),
    data.url,
    data.title,
    data.description,
    data.published,
    1 
  ]

  console.log(values[1], values[2], values[4], values[6], `https://www.youtube.com/watch?v=${values[3]}` )

  let SQL = `INSERT INTO youtube_downloads (${cols}) VALUES (?, ?, ?, ?, ?, ?, date_format(str_to_date(?,'%m/%d/%Y %r'), '%Y-%m-%d %r'), ?)`
  SQL = mysql.format(SQL, values)
  // console.log(SQL)
  // pool.getConnection(function(err, conn) {
  //   conn.query(SQL, function(error, results, fields) {
  //     if (error) {
  //       console.log(`${error.sqlState, error.sqlMessage}`)
  //     } else {
  //       console.log(results)
  //     }
  //   })
  // })

  await pool.query(SQL, function(error, results, fields) {
    /**
     *  Error data if duplicate:
     *    sqlState: '45000'
     *    sqlMessage: 'Already have that url'
     */
    
    // if (error) throw error
     // if (error.sqlState == '45000') {
    //   console.log(error.sqlMessage)
    // } else {
    //   console.log(`Rows Affected: ${results.affectedRows}, New Row ID: ${results.insertId}`)
    // }

    try {
      console.log(`Rows Affected: ${results.affectedRows}, New Row ID: ${results.insertId}`)
    } catch (error) {
      console.log(`${error.sqlState, error.sqlMessage}`)
    }
  })

  pool.release()
}

function formatDuration(input){
  /**
   * The duration data is in 
   */

  let timeinfo = [];
  let timedata = input
  let matches =[/(\d+)H/,/(\d+)M/,/(\d+)S/];

  for (let k=0; k < matches.length; k++){
          timeinfo[k] = (timedata.match(matches[k])) ? timedata.match(matches[k])[1].padStart(2,'0') : '00';
  }

  return timeinfo.join("");
}



/** Notes: 2021 01 19 0227
 * Currently retrieves channel info by channelID. Name is inconsistent.
 * This means the channelID is needed in order to check the channel.
 * 
 * Once the channel is checked the script should retrieve all the videoID's 
 * that are not in the database, based on the upload date of the latest video
 * retrieved for that channel.
 * 
 * The SQL:
 * "select caption, upload_date from youtube_downloads where upload_date = (select max(upload_date) from youtube_downloads where channel_owner_id = 3);"
 * This retrieves a single record.
 * 
 * So when checking the channel, any publishedAt date which is greater than this date means that videos info should be 
 * retrieved and stored in the database.
 * 
 * Since the channelID already exists, there is no need to insert channel info with this file.
 * 
 * 
 * Another channge to make to this script is to allow for retrival by name, leveraging the existing database, which containns the channelID.
 * 
 * So the script should have a flag for channnelID or name. First it should be changed to retrieve the latest video(s)
 * from the given channel.
 * 
 */