#!/bin/sh

BIN=$(npm bin)
NODE="node"
SEMVER="$NODE $BIN/semver"

# update `index.js`
node update

# check if the working tree is "dirty"
git diff-files --quiet
DIRTY=$?

npm test
TESTS_PASS=$?

if [ DIRTY=1 ] && [ TESTS_PASS=0 ]; then
  git add index.js
  git commit -m "index: update list from ICANN"
  VERSION=$($NODE -p "require('./package').version")
  INCREMENT=$($SEMVER --increment minor $VERSION)
  git release $INCREMENT
  npm publish
fi;
