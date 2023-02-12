#!/usr/bin/env sh

node esbuild.mjs --production
echo "build success."
cp ./dist/syPicgo.js ../src-sy-post-publisher/public/lib/picgo/syPicgo.js
cp ./dist/syPicgo.js ../my-note-docker/workspace/SiYuan/data/widgets/sy-post-publisher/lib/picgo/syPicgo.js
echo "copy success."
