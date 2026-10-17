# The development container. npm dependencies are not installed here: they live in
# the node_modules volume of compose.yaml and `make install` fills it, so a change
# to package.json needs no rebuild of the image.
#
# NODE_VERSION comes from application/.node-version through the Makefile, so that
# CI and the container run the one version pinned there.
ARG NODE_VERSION
FROM node:${NODE_VERSION}-bookworm-slim

# ffmpeg cuts the frames out of a video and faster-whisper transcribes it
# (scripts/extract.sh). Two layers, so that a faster-whisper bump keeps the apt layer.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg python3 python3-pip \
  && rm -rf /var/lib/apt/lists/*

# Pinned by hand; nothing bumps a pip install in a Dockerfile. --break-system-packages
# is Debian's guard against pip writing into the system Python, which is what we
# want in a container that has no other Python.
RUN pip install --no-cache-dir --break-system-packages faster-whisper==1.2.1

WORKDIR /workspace/application
