/**
 * Date: 2022 10 07
 * When calling this script the input should be a JSON object containing a key and value
 * 
 * The key is one of search, channel, playlist, the value is a search term, channelID, or videoID/playlistID
 * e.g.
 *    {"search": 'search term'}
 *    {"channel": "channelID"}
 *    {"playlist": "videoID"}
 * 
 */

require('dotenv').config()
const axios = require('axios')

const API_KEY = process.env.API_KEY2
const url_base="https://www.googleapis.com/youtube/v3"

let videoList = []

function setURL(action, param, nextPage='') {
  if (['search', 'channel', 'playlist'].includes(action)) {
    let url
    switch (action) {
      case 'search':
        url = `${url_base}/search?part=snippet&q=${param}&key=${API_KEY}`
        break;
      case 'channel':
        url = `${url_base}/channels?part=id,contentDetails,snippet,status,topicDetails,statistics&id=${param}&key=${API_KEY}`
        break;
      case 'playlist':
        if (nextPage) {
          url = `${url_base}/playlistItems?part=id,contentDetails,snippet,status&maxResults=50&order=date&playlistId=${param}&pageToken=${nextPage}&key=${API_KEY}`
        } else {
          url = `${url_base}/playlistItems?part=id,contentDetails,snippet,status&maxResults=50&playlistId=${param}&key=${API_KEY}`
        }
        break;
    }

    return url

  } else {
    console.log("No action type was given. Options: [search, channel, playlist]")
    return "No action type was given. [search, channel, playlist]"
  }

}

async function searchYoutubeApi(term){
  const url = setURL('search', term)
  console.log(url)
  if (url) {
    const response = await axios.get(url)
    return response.data
  } else {
    return 'No channel name was provided. Please give a channel name. Check the "About" tab.'
  }
}


async function getChannelData(id){
  console.log(id)
  const url = setURL('channel', id)
  console.log(url)
  if (url) {
    const response = await axios.get(url)
    return response.data
  } else {
    return `No channel ID was provided. Please give a channel ID. run this script with channelSearch search 'search term'.`
  }
}

async function getPlaylistData(id) {
  console.log(`PlaylistID: ${id}`)
  const url = setURL('playlist', id)
  console.log(url)

  if (url) {
    const response = await axios.get(url)
    return response.data
  } else {
    return `No playlist ID was provided. Please give a playlist ID. Run this script with '{"playlist": 'search term'}.`
  }
}

function execute() {
  const action = Object.keys(JSON.parse(process.argv[2]))[0]
  const param = JSON.parse(process.argv[2])
  console.log(action, param)
  switch (action) {
    case 'search':
      searchYoutubeApi(param.search)
        .then(x => {
          x.items.forEach(element => {
            (element.id.kind.match(/channel/)) ? console.log(element.id) : "No channel returned"
          });
        })
      break;
    case 'channel':
      getChannelData(param.channel)
        .then(x => {
          console.log(`\n${x.items[0].id}, ${x.items[0].snippet.title}, ${JSON.stringify(x.items[0].contentDetails.relatedPlaylists, null, 2)}`)
        })
      break;
    case 'playlist':
      const videoList = []
      getPlaylistData(param.playlist)
        .then(async (x) => {
          let pageToken = x.nextPageToken
          while(pageToken) {
            let url = setURL('playlist', param.playlist, pageToken)
            let response = await axios.get(url)

            response.data.items.forEach(record => {
              videoList.push({
                channelId: record.snippet.channelId,
                published: record.snippet.publishedAt,
                title: record.snippet.title,
                description: record.snippet.description,
                thumbnails: record.snippet.thumbnails,
                videoId: record.snippet.resourceId.videoId
              })
            })

            pageToken = response.data.nextPageToken
          }

          videoList.sort((a,b) => (a.published > b.published) ? 1 : -1)
          console.log(videoList)
        })
      break;
  }
}

execute()

// searchYoutubeApi(process.argv[2])
// getChannelData(process.argv[2])
//   .then(x => console.log(JSON.stringify(x, null, 2)))