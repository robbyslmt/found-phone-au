# Found Phone AU Library (beta)

Interactive found phone fan fiction: three playable phones (Taekook "Do Not Disturb", MaHae "Two Time Zones", Haechan x Ningning "Duet, Take 7") plus a partner POV phone and a seasonal epilogue.

Unofficial fan fiction. All chats, photos, calls and stories here are invented. This project is not affiliated with or endorsed by the artists or their agencies. Character portraits are fictional stand-ins: the people pictured are not the artists named in the stories. Every image and video is sourced from free licence libraries and credited inside the app under Credits & About.

## How this package works
GitHub's connector pushes text only, so the media ships as a data store split across store-1.js to store-7.js. A small service worker (sw.js) loads those chunks, intercepts requests to assets/ and serves the decoded image and video bytes, caching them after first use. index.html registers the worker on first load and refreshes once so every asset resolves through it.
