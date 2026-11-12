# briandi.to channels

What plays on the channel TV at [briandi.to](https://github.com/thetinywisdom/briandi.to): the small portable TV on top of the orange one. It has 14 channels on its own keys: 2 to 13, U1 and U2. Channel 2 is always the channel guide; the other 13 come from this repository.

The site reads this repository straight from GitHub, so a change here shows on the site a few minutes after you commit it. Nothing has to be copied.

## Add or change a channel

Everything is in `channels.json`. Each channel is one line between the square brackets:

```json
{
  "channels": [
    { "channel": 3, "title": "Studio tour", "youtube": "https://www.youtube.com/watch?v=VIDEO_ID" },
    { "channel": 4, "title": "Drawing playlist", "spotify": "https://open.spotify.com/playlist/PLAYLIST_ID" },
    { "channel": 5, "title": "Sketch loop", "image": "sketch-loop.gif" },
    { "channel": "U1", "title": "Night walk", "image": "night-walk.webp" },
    { "channel": 10, "title": "Bianconeri", "images": ["bianconeri/clip-1.gif", "bianconeri/clip-2.gif"] }
  ]
}
```

| Field | What to put |
| --- | --- |
| `channel` | `3` to `13`, or `"U1"` / `"U2"` (with quotes). Each channel once |
| `title` | The name shown in the channel guide on channel 2. Short works best: about 12 characters fit |
| `youtube` | A normal YouTube link (watch, youtu.be, Shorts or live links all work). It starts playing with sound when a visitor tunes in, at the TV's volume; the TV's volume slider and the Sound key on the pager control it. A browser that blocks sound (Safari sometimes does) plays it silently until the visitor's next click |
| `spotify` | A normal Spotify link to a track, album, playlist, episode or show. Visitors press its play button; its volume is set in the Spotify player itself |
| `image` | The name of a GIF or WebP file you uploaded to the `media` folder |
| `images` | Several GIF or WebP files, in square brackets. They play one after another, round and round without stopping: each plays its whole animation once, then the next one comes on. A file in a folder inside `media` is written with the folder name, like `bianconeri/clip-1.gif` |

Give each channel one of `youtube`, `spotify`, `image` or `images`.

Separate the lines with commas, but put no comma after the last one. If something is wrong, GitHub shows a red cross on the commit and the "Check channels" run says what to fix; the site keeps working and shows the channels it can read.

A channel that is not listed shows static, like a real TV.

## Add a picture

Open the `media` folder on GitHub, choose **Add file → Upload files**, and drop in GIF or WebP files. Then use the file name as `image` in `channels.json`. To keep a set of files together, make a folder inside `media` (type `name/` in front of the file name when uploading). Keep files under about 5 MB each so the TV starts quickly. Wide pictures are shown whole, with black bars above and below, like a wide picture on an old TV. While a picture channel is on, the pager shows the file name as "now playing".

## Files

| File | What it is |
| --- | --- |
| `channels.json` | The channel list |
| `media/` | GIF and WebP files used by the channels |
| `scripts/check.mjs` | Checks `channels.json` (GitHub runs it on every change) |
