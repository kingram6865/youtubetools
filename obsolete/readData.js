const data = require(`./${process.argv[2]}`)

data.episodeList.forEach(element => {
  console.log(element.id.videoId, element.snippet.publishedAt, element.snippet.channelId, element.snippet.title)  
});
