function videoIds(file) {
  const data = require(`./${file}`)

  let episodes = data.episodeList.map(element => {
    if (element.id.videoId) {
      return {
        videoId: element.id.videoId,
        published: element.snippet.publishedAt,
        title: element.snippet.title
      }
    }
  }).filter(Boolean);  

  episodes.sort((a, b) => (a.published > b.published) ? 1 : (a.published < b.published) ? -1 : 0)

  return episodes
}

async function execute(input) {
  let videoList = videoIds(input)
  console.log(videoList.length)
  videoList.forEach(element => console.log(element.videoId, element.published, element.title))
}

// execute(process.argv[2])

module.exports = {
  videoIds
}