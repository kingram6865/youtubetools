const axios = require('axios')
const mysql = require('mysql2');
const datasource = require('./connection.js');
require('dotenv').config()

/**
 * Returns the videoid extracted from the url
 */
function videoId(data){
	const rePattern = /=/;
	index = rePattern.exec(data)['index'] + 1;
	result = data.substring(index);
	return result;
}

/**
 * Reformats 'HH:MM:SS' to "HHMMSS". Prepends 0 for digits [0-9]
 */
function formatDuration(input, version=null){
	let timeinfo = [];
	let timedata = input
	let matches =[/(\d+)H/,/(\d+)M/,/(\d+)S/];

	for (let k=0; k < matches.length; k++){
		timeinfo[k] = (timedata.match(matches[k])) ? timedata.match(matches[k])[1].padStart(2,'0') : '00';
	}

  if (!version) {
    return timeinfo.join("");
  } else {
    return timeinfo.join(":")
  }
}

function formatDate(data) {
  let newDate = new Date(data)
  const year = newDate.getFullYear()
  const month = (newDate.getMonth() < 10) ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1
  const day = (newDate.getDate() < 10) ? `0${newDate.getDate()}` : newDate.getDate()
  const hours = (newDate.getHours() < 10) ? `0${newDate.getHours()}` : newDate.getHours()
  const minutes = (newDate.getMinutes() < 10) ? `0${newDate.getMinutes()}` : newDate.getMinutes()
  const seconds = (newDate.getSeconds() < 10) ? `0${newDate.getSeconds()}` : newDate.getSeconds()

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * Wrapper for MySQl calls
 * @param {*} stmt 
 * @returns 
 */
async function dbCall(stmt) {
  let results
  const conn = mysql.createConnection(datasource);

  try {
    results = await conn.promise().query(stmt)
  } catch(err) {
    results = {"error_stack": err.stack, "message": err.message}
  }

  conn.end()
  return results
}

async function dbInfo(dbObjid, table) {
  let answer, sql
  let values = [dbObjid]

  switch (table) {
    case 'channel':
      sql = `SELECT * from youtube_channel_owners WHERE objid = ?`
      break;
    case 'video':
      sql = `SELECT * from youtube_downloads WHERE objid = ?`
      break;
  }
  
  sql = mysql.format(sql, values)

  try {
    answer = await dbCall(sql)
  } catch(err) {
    console.log(err)
  }

  return answer
}


/**
 * Check for channel record in youtube_channel_owners table
 * @param {*} value
 */
async function channelExists(channelid) {
  let answer
  let sql = "SELECT objid, entry_date, channel_id, owner_name, count(*) as channel_exists FROM youtube_channel_owners WHERE channel_id = ?";
  sql = mysql.format(sql, [channelid]);
  answer = await dbCall(sql)
  return answer
}

async function videoExists(id) {
  let answer
  let values=[id]
  let sql = `SELECT CONCAT("{""entry_date"": """, entry_date, """, ""objid"": ", objid, ", ""url"": """ , url, """, ""title"": """ , caption ,"""}") as video_exists FROM youtube_downloads WHERE videoid = ?`
  sql = mysql.format(sql, values);

  try {
    answer = await dbCall(sql)
  } catch (err) {
    console.log(err.stack)
    answer = err
  }

  return answer
}

async function addChannel(data) {
  let answer
  let values = [data.name, data.channelId, data.description, data.created, data.views, data.thumbnail]
  let sql = `INSERT INTO youtube_channel_owners
  (owner_name, channel_id, description, joined, views, thumbnail_link) VALUES (?, ?, ?, str_to_date(?, '%Y-%m-%d %H:%i:%s'), ?, ?)`;

  sql = mysql.format(sql, values);
  answer = await dbCall(sql)
  return {"dbInfo": answer[0].insertId}
}

async function addVideo(data, channel=null, opt=null) {
  let check = await videoExists(data.videoid) 
  let result = (check[0][0]) ? JSON.parse(check[0][0].video_exists) : {"entry_date": null, "objid": null, "url": null, "title": null, "status": null}

  if (result.objid) {
    answer = {"objid": result.objid, "entry_date": result.entry_date, "url": result.url , "title":  result.title , "message": `already entered`}
  } else {
    let keywords = (data.keywords) ? data.keywords.join(",") : ""
    let values = [keywords, data.published, data.title, data.description, data.duration, data.url, data.channelObjid, data.rewatch ]
    let sql = `INSERT INTO youtube_downloads (keywords, upload_date, caption, description, play_length, url, channel_owner_id, status, rewatch)
    VALUES (?, date_format(str_to_date(?,'%m/%d/%Y %r'), '%Y-%m-%d %r'), ?, ?, ?, ?, ?, 1, ?)`;
    sql = mysql.format(sql, values);
console.log(sql)
    let value = await dbCall(sql)
    answer = {"objid": value[0].insertId}
  }

  return answer
}



async function getChannelData(channelId) {
  let results
  const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${process.env.AUTH2}`
  try {
    results = await axios.get(url)
  } catch (err) {
    console.log(err)
  } finally {
    return results.data
  }
}

async function getVideoData(videoId) {
  let results
	const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${process.env.AUTH2}`
  try {
    results = await axios.get(url)
  } catch (err) {
    console.log(err)
  } finally {
    return results.data
  }
}

async function execute() {
  let videoData, channelData
  let rewatch = (process.argv[3] === 'r') ? 1 : 0
  let vidid = videoId(process.argv[2])
  let video = await getVideoData(vidid)
  let channelId = video.items[0].snippet.channelId
  let channel = await getChannelData(channelId)
  let channel_status = await channelExists(channelId)

  // console.log(video.items[0].snippet.thumbnails)

  videoData = {
    published: formatDate(video.items[0].snippet.publishedAt),
    channelObjid: channel_status[0][0].objid,
    channelTitle: video.items[0].snippet.channelTitle,
    title: video.items[0].snippet.title,
    description: video.items[0].snippet.description,
    thumbnail: (video.items[0].snippet.thumbnails.maxres) ? video.items[0].snippet.thumbnails.maxres.url : video.items[0].snippet.thumbnails.high.url,
    keywords: video.items[0].snippet.tags,
    duration: formatDuration(video.items[0].contentDetails.duration),
    url: process.argv[2],
    rewatch,
    videoid: vidid
  }

  channelData = {
    objid: channel_status[0][0].objid,
    channelId,
    customUrl: channel.items[0].snippet.customUrl,
    name: ((channel.items[0].snippet.name) ? channel.items[0].snippet.name : channel.items[0].snippet.title),
    description: channel.items[0].snippet.description,
    created: formatDate(channel.items[0].snippet.publishedAt),
    thumbnail: channel.items[0].snippet.thumbnails.high.url,
    views: channel.items[0].statistics.viewCount
  }

  if (channel_status[0][0].channel_exists) {
    /**
     * If the channel exists in 'youtube_channel_owners' table, add the objid to videoData
     * and then addVideo info to 'youtube_downloads' table
     *
     */
    console.log(`\n\x1b[42m\x1b[1m\x1b[37mAdding to channel\x1b[0m \x1b[36m\x1b[1m"${channel_status[0][0].owner_name}"\x1b[0m \x1b[31m\x1b[1m[${channel_status[0][0].objid}]\x1b[0m video: [${vidid}] (${formatDuration(video.items[0].contentDetails.duration, 1)}) \x1b[1m\x1b[32m"${videoData.title}"\x1b[0m`)
    let results = await addVideo(videoData)

    if (results.entry_date) {
      console.log(`Video [${results.objid}] \x1b[40m\x1b[1m\x1b[37m${results.url}\x1b[0m \x1b[40m\x1b[33m\x1b[1m${results.title}\x1b[0m already added on ${results.entry_date}\n`)
    } else {
      let check = await dbInfo(results.objid, 'video')
      // console.log(`Added video [${results.objid}] ${check.objid}, ${check.title}, ${check.play_length}`)
      console.log(`Added video [${results.objid}] ${check[0][0].caption} [${check[0][0].play_length}]`)
    }

    // console.log(`\x1b[47m\x1b[1m\x1b[31m${resultsMessage.message} on ${resultsMessage.entry_date} \x1b[0m [${resultsMessage.objid}] [${resultsMessage.duration}] \n`)
  // }
    } else {
    /**
     * If the channel does not exist in the 'youtube_channel_owners' table, add it to the table and return
     * the objid of the newly inserted record.
     */


      // console.log(channelData)
    let channelAddedResponse = await addChannel(channelData)
    let addChannelResponse = await dbInfo(channelAddedResponse.dbInfo, 'channel')
    // console.log(`Line 246: Added channel ${JSON.stringify(addChannelResponse[0][0], null, 2)}`)
    // console.log('Line 247: ', channelAddedResponse.dbInfo)
    videoData = { ...videoData, channelObjid: channelAddedResponse.dbInfo }
    // console.log(videoData)
    let addVideoResponse = await addVideo(videoData)
    // console.log('Line 251: video added - ', addVideoResponse)
    let videoAddedResponse = await dbInfo(addVideoResponse.objid, 'video')
    // console.log('Line 253: video record data', videoAddedResponse[0][0])
    let channelMessage = `Added channel \x1b[32m\x1b[1m${addChannelResponse[0][0].owner_name}\x1b[0m \x1b[36m\x1b[1m[${addChannelResponse[0][0].objid}]\x1b[0m {${addChannelResponse[0][0].channel_id}}`
    let videoMessage = `Added video \x1b[32m\x1b[1m[${videoAddedResponse[0][0].objid}]\x1b[0m \x1b[33m\x1b[1m${videoAddedResponse[0][0].caption}\x1b[0m (\x1b[36m\x1b[1m${videoAddedResponse[0][0].play_length}\x1b[0m) ${(videoAddedResponse[0][0].rewatch) ? "for rewatching" : ""}`
    console.log(`${channelMessage}\n${videoMessage}`)
    // console.log(`Added video \x1b[32m\x1b[1m${videoAddedResponse[0][0].objid}\x1b[0m ${videoAddedResponse[0][0].caption} ${videoAddedResponse[0][0].play_length} ${(videoAddedResponse[0][0].rewatch) ? "for rewatching" : ""}`)
  }
}

execute()
