#!/bin/sh

BIN=$(npm bin)
NODE="node"
SEMVER="$NODE $BIN/semver"

# update `index.js`
node update

# check if the working tree is "dirty"
git diff-files --quiet
DIRTY=$?

if [ DIRTY=1 ]; then
  git add index.js
  git commit -m "index: update list from ICANN"
  VERSION=$(node -p "require('./package').version")
  INCREMENT=$(semver --increment minor $VERSION)
  git release $INCREMENT
  npm publish
fi;
