const fs = require('fs')
const glob = require('glob')
const dir = './?(layouts|components|pages)/**/*.?(vue|js)'
const target = './i18n/source.json'
const pattern = /\$t\(['"](?<slug>.+?)['"].*\)/g

const files = glob.sync(dir)

const slugs = new Set()
files.forEach(path => {
  const data = fs.readFileSync(path).toString()
  let result
  while ((result = pattern.exec(data)) !== null)
    if (result.groups) slugs.add(result.groups.slug)
})

const result = {}

slugs.forEach(slug => {
  const parts = slug.split('.')
  let part
  let obj = result
  let lastObj, lastPart
  while ((part = parts.shift())) {
    if (typeof obj[part] !== 'object') obj[part] = {}
    lastObj = obj
    lastPart = part
    obj = obj[part]
  }
  lastObj[lastPart] = slug
})

fs.writeFileSync(target, JSON.stringify(result, null, '  '))
