const axios = require('axios')
require('dotenv').config()
const fs = require('fs')
const color = require('./utilities/consoleColors')

async function getChannelId(data) {
  let response = await axios.get(data)
  return response.data.split('channel_id=')[1].slice(0,24) 
}

// getChannelId(process.argv[2])
//   .then(x => console.log(x))

module.exports = {
  getChannelId
}