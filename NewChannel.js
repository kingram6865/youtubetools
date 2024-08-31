const io = require('./utilities/io')
require('dotenv').config()
const axios = require('axios')
const mysql = require('mysql2')
const DATABASE = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DB
}

function setURL(term, nextpage=null) {
  const API_KEY = process.env.API_KEY1
  const url_base="https://www.googleapis.com/youtube/v3/"
  const url_api_key = `key=${API_KEY}`

  if (!nextpage) {
    return `${url_base}search?part=snippet&q=${term}&maxResults=50&order=date&${url_api_key}`
  } else {
    return `${url_base}search?part=snippet&q=${term}&maxResults=50&order=date&pageToken=${nextpage}&${url_api_key}`
  }
}

function washResults(data, searchTerm) {
  regex = new RegExp(`${searchTerm}`, 'i')
  let output = data.items.map(element => {
    if (element.snippet.channelTitle.match(regex)) {
      return element
    }
  }).filter(Boolean);

  return output
}

async function retrieveData(url, searchTerm) {
  let output, results, allData
  allData = []

  try {
    results = await axios.get(url)
    output = washResults(results.data, searchTerm)
    allData = [...allData, ...output]

    while(results.data.nextPageToken) {
      let nextPageUrl = setURL(searchTerm, results.data.nextPageToken)
      console.log(nextPageUrl)
      results = await axios.get(nextPageUrl)
      output = washResults(results.data, searchTerm)
      allData = [...allData, ...output]
    }

  } catch(err) {
    console.log(err)
  }

  return allData
}

async function organizeData(input) {
  let url = setURL(input)
  let filename = input.replace(/\ /g, "_")
  let output = await retrieveData(url, input)
  let data = {
    podcast: input,
    apiUrl: url.replace(/\&key=.*$/, "\&key="),
    episodeList: output
  }

  let file = await io.writeData(JSON.stringify(data), filename, 'data')
  return file
}

async function execute(input) {
  let results = await organizeData(input)
  console.log(results)
}

execute(process.argv[2])
