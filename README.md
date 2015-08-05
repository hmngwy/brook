**Brook** is a linkboard heavily inspired by HN. It runs on Node.JS and MongoDB.

Written with both code brevity and page speed in mind, so beware the basic scripting in the frontend.

The ranking algorithm is based on Ken Shirrif's [findings](http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html) [(and here)](http://www.righto.com/2009/06/how-does-newsyc-ranking-work.html) on his research about HN ranking.

#### Roadmap

The app does not cover the following yet, but I plan to add them in soon.

<u>0. Banning</u>

<u>1. Filters</u>, like "New", "Show", or "Ask". Based on user input or moderation.

<u>2. Channels</u>, much like subreddits, except more streamlined, it should be able to house its own set of filters.

<u>2.a. Channel exclusive filters</u>

<u>3. Moderation UI</u>, may it be terminal based or web. Currently moderation can only be done directly to the persistence layer.

<u>3.a. User roles</u>

#### Usage

```
npm install
npm start
```

#### Moderation

Refer to `config.js` for flags. 

Push corresponding strings to Post.flags[] to moderate posts. 
