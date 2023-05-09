const axios = require('axios')
const mysql = require('mysql')
require('dotenv').config()
const fs = require('fs')


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

    playlist.forEach((record, index) => {
      // let item = JSON.stringify(record)
      // console.log(item)
      // console.log(index, record.contentDetails.videoId, record.snippet.publishedAt, record.snippet.title)
      console.log(record.contentDetails.videoId)
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

retrievePlaylistItems()