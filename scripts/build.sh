#!/usr/bin/env sh

node esbuild.mjs --production
echo "build success."
cp ./dist/extension.js ../src-sy-post-publisher/public/lib/picgo/picgo.js
cp ./dist/extension.js ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/lib/picgo/picgo.js
echo "copy success."
