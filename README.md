[![Join the chat at https://gitter.im/hmngwy/brook](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hmngwy/brook?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**Brook** is a linkboard heavily inspired by HN. It runs on Node.JS and MongoDB.

Written with both frontend brevity and delivery speed in mind, so beware the basic scripting and vanilla CSS. *(gasp!)*

The ranking algorithm is based on Ken Shirrif's findings ([here](http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html) and [here](http://www.righto.com/2009/06/how-does-newsyc-ranking-work.html)) on his research about YCombinator's Hacker News ranking.

#### Features

- Registration, Login, Password reset
- Threaded comments
- Topic and comment upvoting
- Topic and comment response notification
- Karma (gist: received upvotes / submissions)
- Topic ranking (base on [this](http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html))
- Frontpage, shows all submissions regardless of channel
- Channels, like subreddits
- Frontpage and Channel filters, e.g. New, Show, Ask
- Configurable filters, add, remove, etc.

#### Technical features

- Does not use skip to paginate
- Single sort parameter to rank submissions by score
- Minimal scheduled jobs, minimal inconsistency from subset-processing
- Maximum of two explicit nested DB queries (rough approx.)

#### Roadmap
###### These are not final, and may change during implementation usually for performance reasons

**0. User Moderation**, freshman grace period, banning, hellban

**1. Channel exclusive filters**, defined by the editors

**2. Moderation UI**, may it be terminal based or web. Currently moderation can only be done directly to the database. This may be an entirely separate project.

**2.A. User roles**

**3. Rate limiting**

**4. Search**, though I am not sure if this is something I want, keyword indexing is expensive

#### Usage

```
npm install
npm start
```

#### Moderation

Refer to `config.js` for flags.

Push corresponding strings to Post.flags[] to moderate posts.

#### Demo

The demo can be found here: [brooknews.herokuapp.com](http://brooknews.herokuapp.com/)

Please take note, I nerf the DB from time to time.

#### Screenshots

Very soon.

#### LICENSE : GNU GPL V3

Brook Message Board, social network for sharing and discussing
documents on the internet, supports "upvotes", and user "karma".
Copyright (C) 2015 Conrado Patricio Ambrosio

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. You should be able to review the full license
at ./LICENSE, or online under the program source repository at:
<https://github.com/hmngwy/brook/blob/master/LICENSE>
If not, see <http://www.gnu.org/licenses/>.

You can contact the original contributor of this program at
cp.ambrosio@gmail.com, on Twitter <https://twitter.com/patambrosio>, at
the source repository forum <https://github.com/hmngwy/brook/issues>, or
at the source repository chatroom <https://gitter.im/hmngwy/brook>
