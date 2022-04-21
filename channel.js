require('dotenv').config()
const axios = require('axios')
const mysql = require('mysql')
const channeluser = (process.argv[2]) ? process.argv[2] : null
const quantity = (process.argv[3]) ? process.argv[3] : null


const API_KEY = process.env.API_KEY1
const url_base="https://www.googleapis.com/youtube/v3/"
const url_resource_params = `channels?part=contentDetails,snippet`
// const url_param1 = `&forUsername=${channeluser}`
const url_param1 = `&id=${channeluser}`
const url_param2 = `&key=${API_KEY}`

let videoList = []

function setURL() {
  if (channeluser) {
    return `${url_base}${url_resource_params}${url_param1}${url_param2}`
  } else {
    return null
  }
}

async function getPlaylistId(){
  const url = setURL()
  console.log(url)
  if (url) {
    const response = await axios.get(url)
    console.log(JSON.stringify(response.data,null,2))
    // return getPlaylistItems(response.data)
  } else {
    return 'No channel name was provided. Please give a channel name. Check the "About" tab.'
  }
}

function getPlaylistItems(data){
  // const resource=`playlistId=UUVTyTA7-g9nopHeHbeuvpRA&maxResults=50&pageToken=`
  const resource=`playlistId=${data.items[0].contentDetails.relatedPlaylists.uploads}&maxResults=50&pageToken=`
  const results = {
    channel_name: data.items[0].snippet.title,
    // thumbnail: `<img src="${data.items[0].snippet.thumbnails.high.url}" width="${data.items[0].snippet.thumbnails.high.width}" height="${data.items[0].snippet.thumbnails.high.height}" alt="High Res Thumbnail">`,
    thumbnail: [data.items[0].snippet.thumbnails.high.url, data.items[0].snippet.thumbnails.high.width, data.items[0].snippet.thumbnails.high.height],
    playlist: data.items[0].contentDetails.relatedPlaylists.uploads
  }

  // console.log(`${JSON.stringify(data,null,2)}`)
  //console.log(`${JSON.stringify(data,null,2)}`)
  //// console.log(`Channel Name: ${data.items[0].snippet.title}`)
  //// console.log(`high: ${JSON.stringify(data.items[0].snippet.thumbnails.high, null, 2)}`)
  //// console.log(`uploads: ${data.items[0].contentDetails.relatedPlaylists.uploads}`)
  // return playList(data.items[0].contentDetails.relatedPlaylists.uploads)
  return playList(data.items[0].id)
  //// return results
}

async function playList(data){
  /**
   * The url passed forward from here will be  the videos playlist id for "uploads",
   * which is located in data.items[0].contentDetails.relatedPlaylists.uploads
   * Setting channnelId = data means the url in this function looks like:
   * https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${data}&maxResults=50&order=date&key=${API_KEY}
   * 
   * Then retrieve each page, grapping all the data with
   * 
   * https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channnnelid}&maxResults=50&pageToken={nextPageToken}&order=date&key=${API_KEY}
   * 
   * 
   * 
   */

  let resultsArray = []
  let i = 1
  const url_resource_params = `search?part=snippet&channelId=${data}&maxResults=50&order=date`
  let url = `${url_base}${url_resource_params}${url_param2}`
  let response = await axios.get(url)
  let maxpages = Math.ceil(response.data.pageInfo.totalResults/50)
  // console.log(`Total number of results: ${response.data.pageInfo.totalResults} => ${maxpages} pages`)
  response.data.items.forEach((x) => {
    resultsArray.push(x)
  }) 

  while (response.data.nextPageToken && (i < maxpages) ){
    url = `${url_base}${url_resource_params}&pageToken=${response.data.nextPageToken}${url_param2}`
    response = await axios.get(url)
    response.data.items.forEach((x) => {
        resultsArray.push(x)
    }) 
    i++
  }
    
  console.log(JSON.stringify(resultsArray,null,2))
  return resultsArray
}

getPlaylistId()

// getPlaylistId().then((x)=>{
//   // console.log(`getPlaylistId() results: ${JSON.stringify(x, null, 2)}`)
//   console.log(JSON.stringify(x, null, 2))
// })