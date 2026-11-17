require('dotenv').config()
const axios = require('axios')
const API_KEY = process.env.API_KEY2

async function getVideoData(id) {
  // let url = `https://youtube.googleapis.com/youtube/v3/videos?&part=snippet,contentDetails,status,liveStreamingDetails&id=${id}&key=${API_KEY}`
  let url = `https://youtube.googleapis.com/youtube/v3/videos?&part=snippet,contentDetails,status,liveStreamingDetails&id=${id}&key=${API_KEY}`
  let results = await axios.get(url)
  return results.data
}

async function execute(input) {
  let response = await getVideoData(input)
  // console.log(Object.keys(response))
  // console.log(response.items[0])
  if (response.items.length) {
    let output = {
      published: response.items[0].snippet.publishedAt,
      channelId: response.items[0].snippet.channelId,
      channelTitle: response.items[0].snippet.channelTitle,
      title: response.items[0].snippet.title,
      description: response.items[0].snippet.description,
      thumbnails: response.items[0].snippet.thumbnails.maxres.url,
      duration: (response.items[0].contentDetails.duration) ? response.items[0].contentDetails.duration : 0,
      scheduled: (response.items[0].liveStreamingDetails) ? response.items[0].liveStreamingDetails.scheduledStartTime : 0,
      status: response.items[0].status.privacyStatus
    }
    // console.log(response.items[0].snippet, response.items[0].contentDetails)
    console.log(output)
  } else {
    console.log(response)
  }
}

execute(process.argv[2])