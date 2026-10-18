#!/usr/bin/env bash
# Usage: bash scripts/extract.sh inbox/<name>.mp4 [diagram-second]
# Writes inbox/<name>/: sheet_N.jpg (one per 12 s, 4x3 frames), diagram_1..3.png
# (the frame at diagram-second, default 3, in three strips) and transcript.txt when
# there is speech. A screen recording of the Instagram web page also gets post_N.jpg
# (the post, every 2 s) and comments.jpg; a still image is copied to image.<ext>.
set -euo pipefail

usage="usage: bash scripts/extract.sh inbox/<name>.mp4 [diagram-second]; the sidecar inbox/<name>.yaml must exist"
if [ $# -lt 1 ] || [ $# -gt 2 ] || [ ! -f "$1" ] || [ ! -f "${1%.*}.yaml" ]; then
  echo "$usage" >&2
  exit 2
fi

src="$1"
at="${2:-3}"
out="${src%.*}"
mkdir -p "$out"

# A screenshot of the post saved under a video's name has a video stream of one frame
# and no duration. It has nothing to cut, so it is handed over as the image it is.
format=$(ffprobe -v error -show_entries format=format_name -of csv=p=0 "$src")
case "$format" in
  *_pipe | image2)
    ext=${format%_pipe}
    [ "$ext" = image2 ] && ext=jpg
    cp "$src" "$out/image.$ext"
    echo "a still image ($ext), not a video: read $out/image.$ext"
    exit 0
    ;;
esac

probe=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height:format=duration -of csv=p=0 "$src" | tr ',\n' '  ')
read -r W H duration <<< "$probe"
seconds=${duration%.*}

# One frame per second, a third of the width, twelve to a sheet. A sheet of a
# whole minute would be downsampled by the reader until the frames are illegible.
ffmpeg -y -v error -i "$src" -vf "fps=1,scale=$((W / 3)):-1,tile=4x3" "$out/sheet_%d.jpg"

# The diagram sits in the top part of the frame. Three overlapping strips
# (0-35%, 30-65%, 60-95% of the height) at full resolution keep the labels legible.
# Phone screen recordings are portrait (1180x2556 and the like). A second past the
# end of the video makes ffmpeg write nothing and exit 0, so the strips of an
# earlier run are removed first and their absence afterwards is the error.
h=$(( H * 35 / 100 ))
rm -f "$out"/diagram_*.png
ffmpeg -y -v error -ss "$at" -i "$src" -filter_complex \
  "split=3[a][b][c];[a]crop=${W}:${h}:0:0[s1];[b]crop=${W}:${h}:0:$(( H * 30 / 100 ))[s2];[c]crop=${W}:${h}:0:$(( H * 60 / 100 ))[s3]" \
  -map "[s1]" -frames:v 1 "$out/diagram_1.png" \
  -map "[s2]" -frames:v 1 "$out/diagram_2.png" \
  -map "[s3]" -frames:v 1 "$out/diagram_3.png"
if [ ! -f "$out/diagram_3.png" ]; then
  echo "no frame at second $at; the video is $seconds s long" >&2
  exit 1
fi

# A landscape frame is a screen recording of the Instagram web page: the post fills
# the left half and the caption and comments the right. Both halves at full resolution
# are what gets read; the strips above cut across them. Measured on recordings by
# offensive_guru and coachcarsonhart.
if [ "$W" -gt "$H" ]; then
  rm -f "$out"/post_*.jpg "$out"/comments.jpg
  ffmpeg -y -v error -i "$src" -vf "fps=1/2,crop=iw*49/100:ih*9/10:0:0" "$out/post_%d.jpg"
  ffmpeg -y -v error -ss "$at" -i "$src" -frames:v 1 -vf "crop=iw*51/100:ih*9/10:iw*49/100:0" \
    "$out/comments.jpg"
  echo "screen recording: post_N.jpg every 2 s and comments.jpg"
fi

# The transcript. faster-whisper reads the video itself; the model is fetched on
# first use, and when that fails the play is written without a transcript. A video
# with no audio track, as every screen recording so far, has nothing to transcribe.
if [ -z "$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$src")" ]; then
  rm -f "$out/transcript.txt" "$out/transcript.log"
  echo "no audio track; no transcript"
elif python3 - "$src" > "$out/transcript.txt" 2> "$out/transcript.log" <<'PY'
import sys
from faster_whisper import WhisperModel
segments, _ = WhisperModel("small", device="cpu", compute_type="int8").transcribe(sys.argv[1], vad_filter=True)
for segment in segments:
    print(f"[{segment.start:5.1f}] {segment.text.strip()}")
PY
then
  if [ -s "$out/transcript.txt" ]; then
    echo "transcript: $out/transcript.txt"
  else
    rm -f "$out/transcript.txt"
    echo "no speech found; no transcript"
  fi
else
  rm -f "$out/transcript.txt"
  echo "transcription failed (see $out/transcript.log); no transcript"
fi
echo "done: $out ($seconds s of video)"
