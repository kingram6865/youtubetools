/**
 * Author: Ken Ingram
 * Date: 2021 02 09 2000
 * Purpose: Retrive info on a given youtube channel.
 *          flag 'w' => update the youtube_channel_owners table with the data.
 *          flag '0' => just show the data.
 */

const axios = require('axios')
const mysql = require('mysql2')
require('dotenv').config()

const flag = (process.argv[2]) ? process.argv[2] : null
const channelid = (process.argv[3]) ? process.argv[3] : null

if ((!flag) || (!channelid)) {
  console.log(`Usage: node channel_test.js [0 <list results>|w <write results to database>] <channelId>`)
}

/**
 * https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=UCy6kyFxaMqGtpE3pQTflK8A&key={API_KEY}
 * 
 */

const API_KEY = process.env.API_KEY1
const url_base="https://www.googleapis.com/youtube/v3/"
const url_resource_params = `channels?part=contentDetails,snippet`
const url_param1 = `&id=${channelid}`
const url_param2 = `&key=${API_KEY}`

const DATABASE = {
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.DBUSER,
  password: process.env.PW,
  database: process.env.DB
}

function setURL() {
  if (!(url_param1 === 'all')) {
    let url = `${url_base}${url_resource_params}${url_param1}${url_param2}`
    return url
  } else {
    return false
  }
}

function formChannelUrl(id) {
  let url = `https://www.youtube.com/channel/${id}`
  return url
}

async function retrieveYoutubeData() {
  const source = setURL()
  if (source) {
    let response = await axios.get(source)
    return response.data
  } else {
    return {items: 'None'}
  }
}

async function retrieveDbData(info) {
  let dbResults, SQL
  const conn = mysql.createConnection(DATABASE)

  if (info === 'all') {
    SQL = "SELECT * FROM youtube_channel_owners"
  } else {
    SQL = "SELECT * FROM youtube_channel_owners WHERE channel_id = ?"
    const params = [info]
    SQL = mysql.format(SQL, params)
  }

  try {
    dbResults = await conn.promise().query(SQL)
    console.log(`First Record: ${JSON.stringify(dbResults[0][0], null, 2)}\n Number of records returned: ${dbResults[0].length}`)

  } catch (e) {
    console.log(e)
  } finally {
    conn.end()
  }
  
  return dbResults[0]
}

async function updateChannelData(data) {
  let dbresults
  let SQL = ""
  const conn = mysql.createConnection(DATABASE)
  const params = [data]
  mysql.format(SQL, params)

  try {
    dbresults = await conn.promise().query(SQL)
  } catch (e) {
    console.log(e)
  } finally {
    // connection.end()
  }
}

async function reportResults() {
  const { items } = await retrieveYoutubeData()
  const dbdata = await retrieveDbData(items[0].id)
  const channeldata = {
    id: items[0].id,
    title: items[0].snippet.title,
    description: items[0].snippet.description,
    joined: new Date(items[0].snippet.publishedAt).toLocaleString().replace(",", ""),
    thumbnail: items[0].snippet.thumbnails.default.url,
    channel_url: formChannelUrl(items[0].id)
  }

  console.log(`\n[${channeldata.id}] ${channeldata.title}, ${channeldata.joined}`)
  console.log(`[${dbdata[0].objid}] ${dbdata[0].owner_name} ${dbdata[0].channel_link} ${dbdata[0].channel_id}`)
  console.log(`https://www.youtube.com/channel/${items[0].id}\n`)
}

async function runthis() {
  if (flag == '0') {
    await reportResults()
  } else if (flag == 'w') {
    console.log(`Will write the data regarding ${channelid} to database`)
  } else if (flag == 'a') {
    let info = await retrieveDbData('all')
    console.log("process all the channel info", info.length)
  }
}

runthis()