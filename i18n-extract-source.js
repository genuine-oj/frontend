const fs = require('fs')
const glob = require('glob')
const dir = './?(layouts|components|pages)/**/*.?(vue|js)'
const target = './i18n/en-US.json'
const pattern = /\$t\(['"](?<slug>.+?)['"].*\)/g
const files = glob.sync(dir)

const sources = require(target)
const slugs = new Set()
const getValue = (obj, is, value) => {
  if (typeof is === 'string') return getValue(obj, is.split('.'), value)
  else if (is.length === 1 && value !== undefined) {
    if (obj[is[0]] === undefined) obj[is[0]] = value
    return obj[is[0]] === value
  } else if (is.length === 0) return obj
  else return getValue(obj[is[0]], is.slice(1), value)
}

files.forEach(path => {
  const data = fs.readFileSync(path).toString()
  let result
  while ((result = pattern.exec(data)) !== null)
    if (result.groups) slugs.add(result.groups.slug)
})

let missing = 0

slugs.forEach(slug => {
  const result = getValue(sources, slug, 'NO_TRANSLATION')
  missing += result
})

fs.writeFileSync(target, JSON.stringify(sources, null, '  '))

// eslint-disable-next-line no-console
console.log(`Translate unfinished: ${missing}`)
