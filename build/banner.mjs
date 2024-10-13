import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const pkgJson = path.join(__dirname, '../package.json')
const pkg = JSON.parse(await fs.readFile(pkgJson, 'utf8'))

const year = new Date().getFullYear()

function getBanner(pluginFilename) {
  return `/*!
  * Bootstrap${pluginFilename ? ` ${pluginFilename}` : ''} v${pkg.version} (${pkg.homepage}) - CHANRYCZ (https://chanrycz.com)
  * Copyright 2011-${year} ${pkg.author}, Ryan C.
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */`
}

export default getBanner
