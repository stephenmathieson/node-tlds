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
  git changelog
  $(NODE) -p "var fs = require('fs'); \
    var json = require('./package');\
    json.version = '$INCREMENT';\
    fs.writeFileSync('package.json', JSON.stringify(json, null, 2) + '\n');"
  git add History.md package.json
  git release $INCREMENT
  npm publish
fi;
