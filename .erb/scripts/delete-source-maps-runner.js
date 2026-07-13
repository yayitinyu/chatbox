const fs = require('node:fs')
const path = require('node:path')

function removeSourceMaps(directory) {
  if (!fs.existsSync(directory)) return

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      removeSourceMaps(entryPath)
    } else if (entry.isFile() && entry.name.endsWith('.map')) {
      fs.rmSync(entryPath)
    }
  }
}

const distDirectory = path.resolve(__dirname, '../../release/app/dist')
removeSourceMaps(path.join(distDirectory, 'main'))
removeSourceMaps(path.join(distDirectory, 'preload'))
removeSourceMaps(path.join(distDirectory, 'renderer'))
