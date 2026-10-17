# inbox

Drop a video and its sidecar here, then run `/ingest-play` in a local Claude Code. Everything here except this file is gitignored. Or run `make inbox` and let the page on http://localhost:4322 write both files from the video and its URL.

```
inbox/
  bills-rams-bunch-trail.mp4
  bills-rams-bunch-trail.yaml
```

The sidecar has the same name as the video and the keys of the play's `video` block, plus a note:

```yaml
url: https://www.instagram.com/reel/XXXX/
author: playdesignerpro
caption: |
  (the caption, verbatim; empty when there is none)
note: |
  (optional, your own note: "came right after the counter in the first half", and so on)
```

`make extract NAME=bills-rams-bunch-trail` (from the repository root; see `make help`) writes the material the skill reads into `inbox/<name>/`. It can be run by hand to look at a video.
