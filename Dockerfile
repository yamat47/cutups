# The development container. Dependencies are not installed here: they live in the
# node_modules volume of compose.yaml and `make install` fills it, so a change to
# package.json needs no rebuild of the image.
#
# NODE_VERSION comes from application/.node-version through the Makefile, so that
# CI and the container run the one version pinned there.
ARG NODE_VERSION
FROM node:${NODE_VERSION}-bookworm-slim

WORKDIR /workspace/application
