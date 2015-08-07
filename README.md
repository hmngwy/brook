[![Join the chat at https://gitter.im/hmngwy/brook](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hmngwy/brook?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**Brook** is a linkboard heavily inspired by HN. It runs on Node.JS and MongoDB.

Written with both frontend brevity and delivery speed in mind, so beware the basic scripting and vanilla CSS. *(gasp!)*

The ranking algorithm is based on Ken Shirrif's [findings](http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html) [(and here)](http://www.righto.com/2009/06/how-does-newsyc-ranking-work.html) on his research about YCombinator's Hacker News ranking.

#### Roadmap

The app does not cover the following yet, but I plan to add them in soon.

**0. User Functions**, <strike>notifications, listing submissions and comments, basic karma (non formulaic)</strike>, banning

**1. Filters**, like <strike>"New"</strike>, "Show", or "Ask". Based on user input or moderation.

<strike>**2. Channels**, much like subreddits, except more streamlined.</strike>

**2.a. Channel exclusive filters**

**3. Moderation UI**, may it be terminal based or web. Currently moderation can only be done directly to the database. This may be an entirely separate project.

**3.a. User roles**

**4 Search**, though I am not sure if this is something I want, keyword indexing is expensive

#### Usage

```
npm install
npm start
```

#### Moderation

Refer to `config.js` for flags.

Push corresponding strings to Post.flags[] to moderate posts.

#### Demo

Soon. I plan to actually run it more than as a demo.

#### Screenshots

Very soon.
