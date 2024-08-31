# Youtube API request examples

## PlaylistItems: list 

https://developers.google.com/youtube/v3/docs/playlistItems/list

Returns a collection of playlist items that match the API request parameters. You can retrieve all of the playlist items in a specified playlist or retrieve one or more playlist items by their unique IDs.

### Required request parameters:
  | parameter name | data type | explanation                                                                                                                                                                                                                                                                                 | values                                                                     |
  | -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
  | part           | string    | The part parameter specifies a comma-separated list of one or more playlist resource properties that the API response will include.                                                                                                                                                         | <ul><li>contentDetails</li><li>id</li><li>snippet</li><li>status</li></ul> |
  | playlistId     | string    | The playlistId parameter specifies the unique ID of the playlist for which you want to retrieve playlist items. Note that even though this is an optional parameter, every request to retrieve playlist items must specify a value for either the id parameter or the playlistId parameter. | [playlist id]                                                              |
  | id             | string    | The id parameter specifies a comma-separated list of one or more unique playlist item IDs.                                                                                                                                                                                                  | [channel id, channel id, ...]                                              |

### Sample request and response

#### Request:
https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails%2Cid&playlistId=[PLAYLIST_ID]&key=[YOUR_API_KEY]

https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,id&playlistId=UUDc9FUfyWthckJmbSL-5fIA&key=AIzaSyCBiOj7sX034db9zKbtT7wUmTGZAO7A9dY


#### Response

```json

```


## Playlists: list

Returns a collection of playlists that match the API request parameters. For example, you can retrieve all playlists that the authenticated user owns, or you can retrieve one or more playlists by their unique IDs. 

### Required request parameters:
  | parameter name | data type | explanation                                                                                                                                                                                                         | values                                                                                                          |
  | -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
  | part           | string    | The part parameter specifies a comma-separated list of one or more playlist resource properties that the API response will include.                                                                                 | <ul><li>contentDetails</li><li>id</li><li>localizations</li><li>player</li><li>snippet</li><li>status</li></ul> |
  | channelId      | string    | This value indicates that the API should only return the specified channel's playlists.                                                                                                                             | [channel id]                                                                                                    |
  | id             | string    | The id parameter specifies a comma-separated list of the YouTube playlist ID(s) for the resource(s) that are being retrieved. In a playlist resource, the id property specifies the playlist's YouTube playlist ID. | [channel id, channel id, ...]                                                                                   |
  
### Sample request and response

#### Request URL

https://youtube.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails,id&channelId=UCDc9FUfyWthckJmbSL-5fIA&key=AIzaSyCBiOj7sX034db9zKbtT7wUmTGZAO7A9dY

#### response JSON

```json
{
  "kind": "youtube#playlistListResponse",
  "etag": "3tPQteNAAWmO7GJFjtBKHM6Vk74",
  "pageInfo": {
    "totalResults": 3,
    "resultsPerPage": 5
  },
  "items": [
    {
      "kind": "youtube#playlist",
      "etag": "hi2S2rZ3y9smUR7hJHtGH-XZofM",
      "id": "PLDSgFfBVlWCPwuIduOscBmXyAATTmjvYr",
      "snippet": {
        "publishedAt": "2021-12-30T05:46:08Z",
        "channelId": "UCDc9FUfyWthckJmbSL-5fIA",
        "title": "Harlem Breakdowns (The Foolishness)",
        "description": "Harlem is an American comedy television series created and executive produced by Tracy Oliver. It premiered on Amazon Prime Video on December 3, 2021. The 10-episode series follows four girlfriends who met while attending New York University and are now in their thirties, living in Harlem, as they try to balance love, life, and their careers as working professionals.",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/tmZNuEA7owM/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/tmZNuEA7owM/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/tmZNuEA7owM/hqdefault.jpg",
            "width": 480,
            "height": 360
          },
          "standard": {
            "url": "https://i.ytimg.com/vi/tmZNuEA7owM/sddefault.jpg",
            "width": 640,
            "height": 480
          },
          "maxres": {
            "url": "https://i.ytimg.com/vi/tmZNuEA7owM/maxresdefault.jpg",
            "width": 1280,
            "height": 720
          }
        },
        "channelTitle": "Manosphere Highlights Daily",
        "localized": {
          "title": "Harlem Breakdowns (The Foolishness)",
          "description": "Harlem is an American comedy television series created and executive produced by Tracy Oliver. It premiered on Amazon Prime Video on December 3, 2021. The 10-episode series follows four girlfriends who met while attending New York University and are now in their thirties, living in Harlem, as they try to balance love, life, and their careers as working professionals."
        }
      },
      "contentDetails": {
        "itemCount": 5  
      }
    },
    {
      "kind": "youtube#playlist",
      "etag": "TIy6QLOkyALHGxocnhT961qlR7M",
      "id": "PLDSgFfBVlWCO_rvEQhYbD5ERNRNtZ4sI2",
      "snippet": {
        "publishedAt": "2021-08-31T08:03:43Z",
        "channelId": "UCDc9FUfyWthckJmbSL-5fIA",
        "title": "How Much Proof Do You Need?",
        "description": "",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/O-TVuPDRQ0w/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/O-TVuPDRQ0w/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/O-TVuPDRQ0w/hqdefault.jpg",
            "width": 480,
            "height": 360
          },
          "standard": {
            "url": "https://i.ytimg.com/vi/O-TVuPDRQ0w/sddefault.jpg",
            "width": 640,
            "height": 480
          },
          "maxres": {
            "url": "https://i.ytimg.com/vi/O-TVuPDRQ0w/maxresdefault.jpg",
            "width": 1280,
            "height": 720
          }
        },
        "channelTitle": "Manosphere Highlights Daily",
        "localized": {
          "title": "How Much Proof Do You Need?",
          "description": ""
        }
      },
      "contentDetails": {
        "itemCount": 7
      }
    },
    {
      "kind": "youtube#playlist",
      "etag": "DALmnX4Nz6-dvVKZ1NCimazvKOY",
      "id": "PLDSgFfBVlWCNwHhoU52q9tgp2nW2m0sgs",
      "snippet": {
        "publishedAt": "2021-02-09T10:32:17Z",
        "channelId": "UCDc9FUfyWthckJmbSL-5fIA",
        "title": "Manosphere Comment of the Day",
        "description": "The Mansophere Comment of the Day is where we highlight one of the comments in our comment sections on a daily basis. 

        The videos are usually between 2 to 3 minutes long! Easy to binge-watch!",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/hTZtnyJdPpQ/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/hTZtnyJdPpQ/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/hTZtnyJdPpQ/hqdefault.jpg",
            "width": 480,
            "height": 360
          },
          "standard": {
            "url": "https://i.ytimg.com/vi/hTZtnyJdPpQ/sddefault.jpg",
            "width": 640,
            "height": 480
          },
          "maxres": {
            "url": "https://i.ytimg.com/vi/hTZtnyJdPpQ/maxresdefault.jpg",
            "width": 1280,
            "height": 720
          }
        },
        "channelTitle": "Manosphere Highlights Daily",
        "localized": {
        "title": "Manosphere Comment of the Day",
        "description": "The Mansophere Comment of the Day is where we highlight one of the comments in our comment sections on a daily basis. 

        The videos are usually between 2 to 3 minutes long! Easy to binge-watch!"
        }
      },
      "contentDetails": {
        "itemCount": 26
      }
    }
  ]
}
```