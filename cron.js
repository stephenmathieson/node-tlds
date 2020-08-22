const isDirty = require('is-git-dirty');
const execa = require('execa');
const semver = require('semver');
const writeJsonFile = require('write-json-file');
const loadJsonFile = require('load-json-file');
const prependFile = require('prepend-file');
const update = require('./update');

const isoDate = new Date().toISOString().slice(0, 10);

const castArray = value => Array.isArray(value) ? value : [value];

const gitCommit = async (filepath, comment) => {
  await execa('git', ['add', ...castArray(filepath)]);
  await execa('git', ['commit', '-m', comment]);
};

(async () => {
  await update();
  if (isDirty()) {
    await gitCommit('index.json', 'Update list');

    const packageData = await loadJsonFile('package.json');
    packageData.version = semver.inc(packageData.version, 'minor');
    await writeJsonFile('package.json', packageData, {indent: 2});

    await prependFile('CHANGELOG.md', `${packageData.version} / ${isoDate}
====================

  * Update list

`);
    await gitCommit(['package.json', 'CHANGELOG.md'], `Release ${packageData.version}`);

    await execa('git', ['tag', packageData.version]);
    await execa('git', ['push']);
    await execa('npm', ['publish']);
  }
})();
