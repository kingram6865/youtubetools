#Youtube Tools

### Background:
Late in November 2018 I realized I was spending a lot of time watchinng youtube videos.
I would save them using the youtube functionality. 
My library of saved links had gotten really large.
Google removed youtubes sorting functionality so I was spending a ridiculous amount of time
trying to find a video I wanted to review for innformation, but I couldn't remember the name, category or title.
And then, there were the circumstances where chnnels disappeared for whatever reason, or video id's changed, and I had no idea what these missing files were.

So I decided to start saving links inn a spreadsheet.Good grief that became time consuming.
On top of that, I was distracted by search recommendations, getting lost in youtube-land. I had to figure out something different. Something more focused and efficient.

So I created a database to keep track, because, "Why am I not leveraging technology to reduce my workload?".

I realized I needed to do some coding to read th elink data from my spradsheet. There was a problem though, because at a certain point, I stopped recording titles or dates, they were just links, and I didn't know which were broken and which had disappeared altogether.

Then I realized there was an API for youtube.

I didn't know much about API's. I had heard the term quite a bit over the last 15 years but I was more focused on
building databases and atomizing books and figuring that out (now that I understand how to build an API, that book "atomizing" project is going to change quite a bit)

### Solution:

So after some toil and trouble and a few frustrating months, I've been able to create a set of tools that allow me to save a link to a table, with all the associated information I want, and also save channel info.

As well, I can update a channel's latest uploads.

The tools are CLI-based for now, which allows me to batch process, and to run cron jobs for my favorite youtube channnels.

In order to view the links in a way that works for me, I have a separate project where I created a playlist
compiler that allows me to watch the videos on a per channel basis or by searching keywords in the title.

Now that Rogan has moved to spotify, I have to do something different to track his podcast. Just a change of API really.

## Future:

I'm still doing the link gathering by hand, so next tool is a browser extension that allows me to save a youtube link directly from the browser.