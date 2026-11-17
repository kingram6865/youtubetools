const axios = require('axios')
require('dotenv').config()
const color = require('./utilities/consoleColors')

// const playlistId = (process.argv[2]) ? process.argv[2] : null
const url_base="https://www.googleapis.com/youtube/v3/"
const url_resource_params="playlistItems?part=contentDetails,id,snippet,status&part=snippet&maxResults=50"

async function showPlayListItems(playlistId){
  let url=`${url_base}${url_resource_params}&playlistId=${playlistId}&key=${process.env.API_KEY2}`
  let response = await axios.get(url)

  return response.data
}

async function execute(playlistId) {
  let results = await showPlayListItems(playlistId)
  console.log(results)
}

// execute(process.argv[2]);

module.exports = {
  showPlayListItems
}