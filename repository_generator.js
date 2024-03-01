const fs = require('fs');
const path = require('path');
const script = require('./src/script');

const dir = './sources';

const sourceFiles = fs.readdirSync(dir).map(filename => {
  return path.join(dir, filename);
});

const sources = [];
for (const file of sourceFiles) {
  if (!fs.statSync(file).isFile) continue;
  const meta = script.parseMeta(fs.readFileSync(file, 'utf8'));
  if (meta.status === 'obsolete') continue;

  sources.push({
    format: 'javascript',
    type: meta.type,
    name: meta.name,
    locale: meta.locale,
    domain: meta.domain,
    homepage: meta.homepage,
    icon: meta.icon,
    description: meta.description,
    version: meta.version,
    changelog: meta.changelog,
  });
}
const repository = {
  author: 'Open Book Source',
  homepage: 'https://github.com/open-source-scripts/book-scripts',
  sources: sources,
};

fs.writeFileSync('./repository.json', JSON.stringify(repository, undefined, 2));
