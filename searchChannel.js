const axios = require('axios')
require('dotenv').config()
const { getChannelId } = require('./getChannelId')
const APIKEY = process.env.API_KEY2
const color = require('./utilities/consoleColors')
let baseUrl = "https://youtube.googleapis.com/youtube/v3"


async function getNextPage(token, playlist) {
  let results
  let url = `${baseUrl}/playlistItems?part=contentDetails,id,snippet,status&maxResults=50&playlistId=${playlist}&key=${APIKEY}&pageToken=${token}`
  try {
    results = await axios.get(url)
    console.log(results.data)
  } catch {
    console.log(err.message)
  }

  return results.data
}

async function playListItems(input) {
  let result, nextPage, previousPage
  let i = 1
  let url = `${baseUrl}/playlistItems?part=contentDetails,id,snippet,status&maxResults=50&playlistId=${input}&key=${APIKEY}`
  // console.log(url)
  result = await axios.get(url)
  // console.log()
  // result.data.items.forEach(item => console.log(item.contentDetails.videoPublishedAt, item.snippet.title, `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`))
  // result.data.items.forEach(item => console.log(item.contentDetails.videoPublishedAt, item.status))
  // console.log("Line 15: ", input, Object.keys(result.data.items.length))
  console.log(`====== ${input} ======`)
  nextPage = result.data.nextPageToken
  if (nextPage) {
    console.log(`Line 20: Next Page Token is ${nextPage}`)
    while (nextPage) {
      newurl = `${url}&pageToken=${nextPage}`
      // response = await axios.get(newurl)
      response = await getNextPage(nextPage, input)
      // console.log(`Line 25: Next Page Token is ${response.data.nextPageToken}`)
      console.log(`Line 25: Next Page Token is ${response.nextPageToken}. Current data has ${response.items.length} items`)
      nextPage = response.data.nextPageToken
      // response.data.items.forEach(item => console.log("Line 22", item.title, item.contentDetails))
    }
  } else {
    result.data.items.forEach(item => {
      console.log("\t", item.snippet.publishedAt, color.brightBlue, item.snippet.title, color.Reset, `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`)
    })
  }

}

function playLists(input) {
  let playLists = input.items.map(item => item.id) 
  // if (input.items.length) {
  //   input.items.forEach(item => {
  //     console.log(item.id)
  //   })
  // }
  // console.log(playLists)
  return playLists;
}

async function channelPlaylists(input) {
  let url = `${baseUrl}/playlists?part=snippet&contentDetails&key=${APIKEY}&maxResults=50&channelId=${input}`
  let result = await axios.get(url)
  // console.log(result.data)
  return result.data
}

async function execute(input) {
  let channelid = await getChannelId(input)
  let channelData = await channelPlaylists(channelid)
  console.log(JSON.stringify(channelData, null, 2)) 
  // let playListIds = playLists(channelData)
  // console.log(`${playListIds.length } playlists`)
  // playListIds.forEach(async element => {
  //   let details = await playListItems(element)
  //   // console.log(details)
  // });
}

execute(process.argv[2])