const axios = require('axios')
const mysql = require('mysql')
require('dotenv').config()
const fs = require('fs')
const color = require('./utilities/consoleColors')
const { pool, formatSQL, executeSQL } = require('./db/connect')
const { formatDate } = require('./utilities/tools')
// let conn = pool('random_facts')
let conn = pool('test')

const playlistid = (process.argv[2]) ? process.argv[2] : null
const url_base="https://www.googleapis.com/youtube/v3/"
const url_resource_params="playlistItems?part=contentDetails,id,snippet,status&part=snippet&maxResults=50"
const playlist = []

async function retrievePlaylistItems() {
  if (playlistid) {
    let i = 0
    let url=`${url_base}${url_resource_params}&playlistId=${playlistid}&key=${process.env.API_KEY2}`
    let response = await axios.get(url)
    playlist.push(...response.data.items)
    // playlist = [...playlist, response.data]

    while(response.data.nextPageToken && i <= response.data.pageInfo.totalResults ){
      url = `${url_base}${url_resource_params}&playlistId=${playlistid}&pageToken=${response.data.nextPageToken}&key=${process.env.API_KEY2}`
      response = await axios.get(url)
      playlist.push(...response.data.items)
      // playlist = [...playlist, response.data]
    }

  //  verifyChannels(playlist)
    


    playlist.forEach(async (record, index) => {
      console.log(record.snippet.position, record.snippet.title);
    //   let isDupe, channelId
    //   // let item = JSON.stringify(record)
    //   // console.log(item)
    //   // console.log(index, record.contentDetails.videoId, record.snippet.publishedAt, record.snippet.title)
    //   // console.log(record.snippet.title, record.contentDetails.videoId)
    //   console.log("Line 36: ", record.snippet.position, record.snippet.title)

    //   // let channelIdCheck = await channelExists(record.snippet.channelId)
    //   // if (channelIdCheck[0]) {
    //   //   channelId = channelIdCheck[0].objid;
    //   //   console.log(channelId)
    //   //   isDupe = await checkForDupeVideo(record.contentDetails.videoId, channelId)
    //   // } else {
    //   //   console.log('Line 42: Need to Add Channel')
    //   //   channelId = await addChannel(record.snippet.channelId)
    //   //   // console.log("Line 44: ", channelId.message)
    //   //   isDupe = false
    //   // }
      
    //   videoData = {
    //     // published: dateUtils.formatPublishedDate(record.snippet.publishedAt),
    //     sequence: index,
    //     upload_date: record.snippet.publishedAt,
    //     channelId: record.snippet.channelId,
    //     channel_owner_id: channelId,
    //     channelTitle: record.snippet.channelTitle,
    //     title: record.snippet.title,
    //     description: record.snippet.description,
    //     thumbnail: record.snippet.thumbnails,
    //     keywords: record.snippet.tags,
    //     play_length: record.contentDetails.duration,
    //     url: `https://youtube.com/watch?v=${record.contentDetails.videoId}`,
    //     rewatch: 1,
    //     videoid: record.contentDetails.videoId
    //   }
    //   // console.log("Line 66: ", record.contentDetails.videoId, isDupe)
    //   // console.log(videoData)
    //   // console.log(record)
      
    //     // .then(x => console.log('Line 56: ', x))

    //   // if (!isDupe) {
    //   //   console.log(`Saving ${record.contentDetails.videoId}`)
    //   //   saveVideo({caption: record.snippet.title, videoid: record.contentDetails.videoId})
    //   // }
    })
    // // console.log(JSON.stringify(playlist,null,2))
    // // console.log(`Number of Playlist items ${playlist.length}`)
  } else {
    console.log("No playlist id given!")
  }
}

async function videoList(channel) {
  /** Look in the database and retrieve videos for the channel_owner_id = channnel 
   * return that list, and then feed that list to the videoDownloader, which will
   * parse the list and retrieve the data for any video not already in the database
  */
  const SQL = "SELECT videoid FROM youtube_downloads WHERE channel_owner_id = channel"

}

async function channelExists(channel) {
  let SQL = "SELECT objid, channel_id, owner_name FROM youtube_channel_owners WHERE channel_id = ?"
  SQL = formatSQL(SQL, [channel])
  try {
    const [rows, fields] = await executeSQL(conn, SQL);
    // console.log(rows.channelExists)
    // return rows[0].objid
    return rows
  } catch(err) {
    throw err;
  }
}

async function addChannel(input) {
  let SQL = "INSERT INTO youtube_channel_owners (owner_name, channel_id, description, joined, views, thumbnail_link, custom_url, keywords) VALUES (?,?,?,?,?,?,?,?)"

  let url = `${url_base}channels?part=snippet,contentDetails,statistics,brandingSettings,status,topicDetails&id=${input}&key=${process.env.API_KEY2}`
  // console.log(url)
  let response = await axios.get(url)
  // console.log(response.data)
  // let data = {
  //   owner_name: response.data.items[0].snippet.title,
  //   channel_id: input,
  //   description: response.data.items[0].snippet.description,
  //   joined: formatDate(response.data.items[0].snippet.publishedAt),
  //   views: response.data.items[0].statistics.viewCount,
  //   thumbnail_link: response.data.items[0].snippet.thumbnails.high.url,
  //   custom_url: response.data.items[0].snippet.customUrl,
  //   keywords: response.data.items[0].brandingSettings.channel.keywords
  // }
  
  let data = [
    response.data.items[0].snippet.title,
    input,
    response.data.items[0].snippet.description,
    formatDate(response.data.items[0].snippet.publishedAt),
    response.data.items[0].statistics.viewCount,
    response.data.items[0].snippet.thumbnails.high.url,
    response.data.items[0].snippet.customUrl,
    response.data.items[0].brandingSettings.channel.keywords
  ]

  SQL = formatSQL(SQL, data)
  try {
    const [rows, fields] = await executeSQL(conn, SQL)
    console.log(rows)
    return rows;    
  } catch(err) {
    console.log(err)
  }

  // return {message: `addChannel received ${input} as a parameter. Added channel`, objid:}
}

async function saveVideo(data) {
  let sql = `INSERT into youtube_downloads (channel_owner_id, upload_date, url, play_length, caption, description, sequence, videoid) VALUES ('${data.caption}', '${data.videoid}')`
  console.log(sql)
}

async function checkForDupeVideo(id, channel) {
  let result
  let sql=`SELECT count(*) AS dupe FROM youtube_downloads WHERE channel_owner_id = ${channel} AND videoid = '${id}'`
  try {
    const [rows, fields] = await executeSQL(conn, sql)
    return rows[0].dupe
  } catch(err) {
    console.log(err)
  }
}

async function verifyChannels(input) {
  for (i=0; i < input.length; i++) {
    let channelIdCheck = await channelExists(input[i].snippet.channelId)

    if (channelIdCheck[0]) {
      channelId = channelIdCheck[0].objid;
      console.log('Line 172: Channel Id', channelId)
      // isDupe = await checkForDupeVideo(input[i].contentDetails.videoId, channelId)
    } else {
      console.log('Line 42: Need to Add Channel')
      channelId = await addChannel(input[i].snippet.channelId)
      // console.log("Line 44: ", channelId.message)
      isDupe = false
    }

  }

}


retrievePlaylistItems()
setTimeout(() => {
  conn.end();
}, 4000)