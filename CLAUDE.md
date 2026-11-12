# briandi.to-channels

Content for the channel TV on the portfolio site `thetinywisdom/briandi.to`: the KV-5200 portable, which has 14 channels (1–12, U1, U2). Channel 1 is the guide, built by the site; channels 2–12, U1 and U2 come from `channels.json` here.

Read `PLAN.md` in the `briandi.to` repository for what is done, what is open and what the owner has decided. `README.md` here is the owner's editing guide; keep it in step with the format.

## How the site uses this repository

The site fetches `channels.json` and the files in `media/` at run time from `https://raw.githubusercontent.com/thetinywisdom/briandi.to-channels/main/` (the `CHANNELS` constant in the script at the end of the site's `index.html`). The repository must stay public and the branch must stay `main`. Changes show on the site within a few minutes (GitHub's raw cache), with no copying step.

The owner's preview artifact cannot fetch from GitHub, so the preview build publishes `channels.json` and `media/` alongside the page and points `CHANNELS` at `channels/` (see the site's `PLAN.md`, Working notes).

## Format

```json
{ "channels": [ { "channel": 3, "title": "Studio tour", "youtube": "https://www.youtube.com/watch?v=..." } ] }
```

- `channel`: 2–12 or "U1" / "U2", each once.
- Exactly one of `youtube` (any normal YouTube link), `spotify` (an open.spotify.com link), `image` (a .gif or .webp path under `media/`) or `images` (a list of such paths, played in a loop: each runs its full animation once, then the next; the site reads the frame timings from the file). Or `scroll` (a list of .jpg / .png / .webp / .gif paths stacked top to bottom at the tube's width and scrolled at 30 px/s, drawn twice so the loop is seamless). Optional `audio` (.m4a / .mp3 / .aac / .ogg / .opus / .wav) with any picture source: fetched as a blob when the channel first comes on air (GitHub raw does not label audio), looped independently, paused off air by the TV. Paths may include folders, e.g. `bianconeri/x.gif`. Large pictures are stored as web copies (channel 5's are 960 px wide; the owner's originals were 2160 px).
- `title`: shown in the guide; about 12 characters fit.

`node scripts/check.mjs` validates it; the "Check channels" GitHub workflow runs it on every push. The site skips entries it cannot use, so a mistake never breaks the page.

## Conventions

- Do not invent media, titles or links: they come from the owner.
- Keep media files small (a few MB) so the TV starts quickly.
- Work is committed to `main` and pushed. Commit messages are a short imperative subject.
- After a change here, update the owner's preview of the site (see the site's `PLAN.md`).
