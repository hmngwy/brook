[![Join the chat at https://gitter.im/hmngwy/brook](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hmngwy/brook?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**Brook** is a linkboard heavily inspired by HN. It runs on Node.JS and MongoDB.

Written with both frontend brevity and delivery speed in mind, so beware the basic scripting and vanilla CSS. *(gasp!)*

The ranking algorithm is based on Ken Shirrif's findings ([here](http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html) and [here](http://www.righto.com/2009/06/how-does-newsyc-ranking-work.html)) on his research about YCombinator's Hacker News ranking.

#### Features

- Registration, Login, Password reset
- Threaded comments
- Topic or comment upvoting
- Topic or comment response notification
- Karma (gist: received upvotes / submissions)
- Topic ranking (base on [this](http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html))
- Frontpage, shows all submissions regardless of channel
- Channels, like subreddits
- Frontpage and Channel filters, e.g. New, Show, Ask (last two in progress)
- Channel exclusive filters (in progress)

#### Roadmap

The app does not cover the following yet, but I plan to add them in soon.

**0. User Moderation**, freshman grace period, banning

**1. Remaining Filters**, "Show", and "Ask", New is done

**2. Channel exclusive filters**, defined by the editors

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


#### LICENSE : GNU GPL V3

Brook Message Board, social network for sharing and discussing
documents on the internet, supports submission upvotes,
and user "karma".
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
the source repository forum <https://github.com/hmngwy/brook/issues>, or at
the source repository chatroom <https://gitter.im/hmngwy/brook>
