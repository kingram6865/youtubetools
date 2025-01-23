# Youtube API

## Home Page
https://developers.google.com/youtube/v3/docs

## Youtube API Request and Response Examples

### Create a .env with access keys and passwords

API_KEY1=
API_KEY2= (optional)

DBHOST=
DBPORT=
DBPASS=
DBUSER=
DB=
DBTEST=test (optional)

### Video Information HTTP request

HTTP GET Request template
https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=[videoid]&key=[API_KEY]

Example HTTP GET Request
videoid: WYbteM7KLhI
https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&part=snippet&id=WYbteM7KLhI&key=[YOUR_API_KEY]'

Example Response Data
```json
{
  "kind": "youtube#videoListResponse",
  "etag": "0D0mvxA_d5Ei8iA39OaPmLTxOpE",
  "items": [
    {
      "kind": "youtube#video",
      "etag": "vt-T8Sn6Y6Ick_XWKjbb5P7T6RI",
      "id": "WYbteM7KLhI", 
      "snippet": {
        "publishedAt": "2020-11-21T05:38:47Z",
        "channelId": "UCy6kyFxaMqGtpE3pQTflK8A",
        "title": "New Rule: The Great Disappointment | Real Time with Bill Maher (HBO)",
        "description": "Subscribe to the Real Time YouTube: http://itsh.bo/10r5A1B\n\nIn his final New Rule of 2020, Bill explores the striking similarities between Donald Trump and other infamous cult leaders.\n\nConnect with Real Time Online:\nFind Real Time on Facebook: https://www.facebook.com/Maher\nFind Real Time on Twitter: https://twitter.com/RealTimers\nFind Real Time with Bill Maher Official Site: http://itsh.bo/HttKcM.\nFind Real Time with Bill Maher on HBO GO® http://itsh.bo/iioY87.\nFind Real Time with Bill Maher on Connect: http://connect.hbo.com/real-time-bill-maher\nFind Real Time on Instagram: http://instagram.com/realtimers\nThe Real Time blog: http://www.real-time-with-bill-maher-blog.com/\n\nIt's HBO.\n\nConnect with HBO Online\nFind HBO on Facebook: http://Facebook.com/HBO\nFollow @HBO on Twitter: http://Twitter.com/HBO\nFind HBO on Youtube: http://Youtube.com/HBO\nFind HBO Official Site: http://HBO.com\nFind HBO Connect: http://Connect.hbo.com\nFind HBO GO: http://HBOGO.com\nFind HBO on Instagram: http://Instagram.com/hbo\nFind HBO on Foursquare: http://Foursquare.com/hbo\n\nCheck out other HBO Channels\nHBO: http://www.youtube.com/hbo\nGame of Thrones: http://www.youtube.com/GameofThrones \nTrue Blood: http://www.youtube.com/trueblood \nHBO Sports: http://www.youtube.com/HBOsports \nHBO Documentary Films: http://www.youtube.com/HBODocs \nCinemax: http://www.youtube.com/Cinemax \nHBO Latino: http://www.youtube.com/HBOLatino",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/WYbteM7KLhI/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/WYbteM7KLhI/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/WYbteM7KLhI/hqdefault.jpg",
            "width": 480,
            "height": 360
          },
          "standard": {
            "url": "https://i.ytimg.com/vi/WYbteM7KLhI/sddefault.jpg",
            "width": 640,
            "height": 480
          },
          "maxres": {
            "url": "https://i.ytimg.com/vi/WYbteM7KLhI/maxresdefault.jpg",
            "width": 1280,
            "height": 720
          }
        },
        "channelTitle": "Real Time with Bill Maher",
        "tags": [
          "Michael Eric Dyson",
          "Distinguished Professor",
          "African American Studies and Ethics",
          "Vanderbilt University",
          "author",
          "Long Time Coming",
          "Reckoning with Race in America",
          "Alex Wagner",
          "The Atlantic",
          "Executive Producer",
          "Showtime",
          "The Circus",
          "Futureface",
          "A Family Mystery",
          "an Epic Quest",
          "and the Secret to Belonging",
          "Jon Meacham",
          "informal adviser",
          "President-Elect",
          "Joe Biden",
          "His Truth Is Marching On",
          "John Lewis and the Power of Hope"
        ],
        "categoryId": "1",
        "liveBroadcastContent": "none",
        "localized": {
          "title": "New Rule: The Great Disappointment | Real Time with Bill Maher (HBO)",
          "description": "Subscribe to the Real Time YouTube: http://itsh.bo/10r5A1B\n\nIn his final New Rule of 2020, Bill explores the striking similarities between Donald Trump and other infamous cult leaders.\n\nConnect with Real Time Online:\nFind Real Time on Facebook: https://www.facebook.com/Maher\nFind Real Time on Twitter: https://twitter.com/RealTimers\nFind Real Time with Bill Maher Official Site: http://itsh.bo/HttKcM.\nFind Real Time with Bill Maher on HBO GO® http://itsh.bo/iioY87.\nFind Real Time with Bill Maher on Connect: http://connect.hbo.com/real-time-bill-maher\nFind Real Time on Instagram: http://instagram.com/realtimers\nThe Real Time blog: http://www.real-time-with-bill-maher-blog.com/\n\nIt's HBO.\n\nConnect with HBO Online\nFind HBO on Facebook: http://Facebook.com/HBO\nFollow @HBO on Twitter: http://Twitter.com/HBO\nFind HBO on Youtube: http://Youtube.com/HBO\nFind HBO Official Site: http://HBO.com\nFind HBO Connect: http://Connect.hbo.com\nFind HBO GO: http://HBOGO.com\nFind HBO on Instagram: http://Instagram.com/hbo\nFind HBO on Foursquare: http://Foursquare.com/hbo\n\nCheck out other HBO Channels\nHBO: http://www.youtube.com/hbo\nGame of Thrones: http://www.youtube.com/GameofThrones \nTrue Blood: http://www.youtube.com/trueblood \nHBO Sports: http://www.youtube.com/HBOsports \nHBO Documentary Films: http://www.youtube.com/HBODocs \nCinemax: http://www.youtube.com/Cinemax \nHBO Latino: http://www.youtube.com/HBOLatino"
        },
        "defaultAudioLanguage": "en"
      },
      "contentDetails": {
        "duration": "PT9M19S",
        "dimension": "2d",
        "definition": "hd",
        "caption": "false",
        "licensedContent": true,
        "contentRating": {},
        "projection": "rectangular"
      }
    }
  ],
  "pageInfo": {
    "totalResults": 1,
    "resultsPerPage": 1
  }
}
```

### Channel Data

https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC1xkO4uuHm-mckIjzS03fMA&maxResults=50&order=date&key=[YOUR_API_KEY]'

channelId: UCy6kyFxaMqGtpE3pQTflK8A
// https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=[from video channelid]&key=[YOUR_API_KEY]
https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=UCy6kyFxaMqGtpE3pQTflK8A&key=[YOUR_API_KEY]'

#### Search for a channel by name

`${url_base}search?part=snippet&q=${term}&maxResults=50&order=date&${url_api_key}`

{
  kind: 'youtube#searchListResponse',
  etag: 'Agx5SsUaDWexhXdf53kFDdz9IXM',
  nextPageToken: 'CDIQAA',
  regionCode: 'US',
  pageInfo: { totalResults: 177677, resultsPerPage: 50 },
  items: []

#### Channel Info
https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=UC_x5XG1OV2P6uZZ5FSM9Ttw&key=[YOUR_API_KEY]'

##### Response object
```json
{
  "kind": "youtube#channelListResponse",
  "etag": etag,
  "nextPageToken": string,
  "prevPageToken": string,
  "pageInfo": {
    "totalResults": integer,
    "resultsPerPage": integer
  },
  "items": [
    channel Resource
  ]
}
```

##### Channel Resource
```json
{
  "kind": "youtube#channel",
  "etag": etag,
  "id": string,
  "snippet": {
    "title": string,
    "description": string,
    "customUrl": string,
    "publishedAt": datetime,
    "thumbnails": {
      (key): {
        "url": string,
        "width": unsigned integer,
        "height": unsigned integer
      }
    },
    "defaultLanguage": string,
    "localized": {
      "title": string,
      "description": string
    },
    "country": string
  },
  "contentDetails": {
    "relatedPlaylists": {
      "likes": string,
      "favorites": string,
      "uploads": string
    }
  },
  "statistics": {
    "viewCount": unsigned long,
    "subscriberCount": unsigned long,  // this value is rounded to three significant figures
    "hiddenSubscriberCount": boolean,
    "videoCount": unsigned long
  },
  "topicDetails": {
    "topicIds": [
      string
    ],
    "topicCategories": [
      string
    ]
  },
  "status": {
    "privacyStatus": string,
    "isLinked": boolean,
    "longUploadsStatus": string,
    "madeForKids": boolean,
    "selfDeclaredMadeForKids": boolean
  },
  "brandingSettings": {
    "channel": {
      "title": string,
      "description": string,
      "keywords": string,
      "trackingAnalyticsAccountId": string,
      "unsubscribedTrailer": string,
      "defaultLanguage": string,
      "country": string
    },
    "watch": {
      "textColor": string,
      "backgroundColor": string,
      "featuredPlaylistId": string
    }
  },
  "auditDetails": {
    "overallGoodStanding": boolean,
    "communityGuidelinesGoodStanding": boolean,
    "copyrightStrikesGoodStanding": boolean,
    "contentIdClaimsGoodStanding": boolean
  },
  "contentOwnerDetails": {
    "contentOwner": string,
    "timeLinked": datetime
  },
  "localizations": {
    (key): {
      "title": string,
      "description": string
    }
  }
}
```

#### List Playlists for a channel
https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&channelId=UC_x5XG1OV2P6uZZ5FSM9Ttw&maxResults=25&key=[YOUR_API_KEY]'

##### Response object
```json
{
  "kind": "youtube#playlistListResponse",
  "etag": etag,
  "nextPageToken": string,
  "prevPageToken": string,
  "pageInfo": {
    "totalResults": integer,
    "resultsPerPage": integer
  },
  "items": [
    playlist Resource
  ]
}
```

#### Playlists resource

```json
{
  "kind": "youtube#playlist",
  "etag": etag,
  "id": string,
  "snippet": {
    "publishedAt": datetime,
    "channelId": string,
    "title": string,
    "description": string,
    "thumbnails": {
      (key): {
        "url": string,
        "width": unsigned integer,
        "height": unsigned integer
      }
    },
    "channelTitle": string,
    "defaultLanguage": string,
    "localized": {
      "title": string,
      "description": string
    }
  },
  "status": {
    "privacyStatus": string,
    "podcastStatus": enum
  },
  "contentDetails": {
    "itemCount": unsigned integer
  },
  "player": {
    "embedHtml": string
  },
  "localizations": {
    (key): {
      "title": string,
      "description": string
    }
  }
}
```

### Playlist items
https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=[playlist id]&key=[YOUR_API_KEY]' \

https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2C%20contentDetails%2C%20id%2C%20status&playlistId=PLLhe2t7JgNQrcmCiRc0YxFi33Yi-leIuD&key=[YOUR_API_KEY]' \
