const axios = require('axios')
const mysql = require('mysql')
require('dotenv').config()
const fs = require('fs')
const color = require('./utilities/consoleColors')
const { pool, formatSQL, executeSQL } = require('./db/connect')
let conn = pool('random_facts')

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

    playlist.forEach(async (record, index) => {
      // let item = JSON.stringify(record)
      // console.log(item)
      // console.log(index, record.contentDetails.videoId, record.snippet.publishedAt, record.snippet.title)
      // console.log(record.snippet.title, record.contentDetails.videoId)
      let isDupe = await checkForDupe(record.contentDetails.videoId)


      videoData = {
        // published: dateUtils.formatPublishedDate(record.snippet.publishedAt),
        published: record.snippet.publishedAt,
        channelId: record.snippet.channelId,
        channelObjid: await channelExists(record.snippet.channelId),
        channelTitle: record.snippet.channelTitle,
        title: record.snippet.title,
        description: record.snippet.description,
        thumbnail: record.snippet.thumbnails,
        keywords: record.snippet.tags,
        // duration: formatDuration(record.contentDetails.duration),
        duration: record.contentDetails.duration,
        url: `https://youtube.com/watch?v=${record.contentDetails.videoId}`,
        rewatch: 1,
        videoid: record.contentDetails.videoId
      }
      // console.log(record.contentDetails.videoId, isDupe)
      console.log(videoData)
      // console.log(record)
      
        // .then(x => console.log('Line 56: ', x))

      // if (!isDupe) {
      //   console.log(`Saving ${record.contentDetails.videoId}`)
      //   saveVideo({caption: record.snippet.title, videoid: record.contentDetails.videoId})
      // }
    })
    // console.log(JSON.stringify(playlist,null,2))
    // console.log(`Number of Playlist items ${playlist.length}`)
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
    return rows[0].objid
  } catch(err) {
    throw err;
  }
}


async function saveVideo(data) {
  let sql = `INSERT into youtube_downloads (caption, videoid) VALUES ('${data.caption}', '${data.videoid}')`
  console.log(sql)
}

async function checkForDupe(id) {
  let result
  let sql=`SELECT count(*) AS dupe FROM youtube_downloads WHERE videoid = '${id}'`
  try {
    const [rows, fields] = await executeSQL(conn, sql)
    return rows[0].dupe
    // console.log(rows[0].dupe)
  } catch(err) {
    console.log(err)
  }
}

retrievePlaylistItems()
setTimeout(() => {
  conn.end();
}, 4000)