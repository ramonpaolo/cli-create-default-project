#!/usr/bin/env node

import { exec } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

// Utils
import log from './utils/logger.utils'
import argv from './utils/yarg.utils'

// Types
import { KeysAvailables } from './types'

// Controllers
import createFolders from './controllers/create_folders.controller'
import downloadBasicFiles from './controllers/download_basic_files.controller'

log('Initializing Project ⚙️')

const keysAvailables = Object.keys(argv) as KeysAvailables[]

const baseUrl = 'wget https://raw.githubusercontent.com/ramonpaolo/default-files-script-automation/master/'

const packageJsonTemplate = {
    "version": "0.0.1",
    "main": "dist/index.js",
    "scripts": {
      "dev": "nodemon -r dotenv/config src/index.ts",
      "test": "NODE_ENV=test jest --verbose --coverage --forceExit",
      "start": "node dist/index.js",
      "build": "tsc"
    },
}

exec('yarn init -y', () => {
    const packageBuffer = readFileSync('./package.json', {
        encoding: 'utf-8',
    })

    const packageJson = JSON.parse(packageBuffer)

    packageJson['main'] = packageJsonTemplate.main
    packageJson['scripts'] = packageJsonTemplate.scripts
    packageJson['version'] = packageJsonTemplate.version

    writeFileSync('./package.json', Buffer.from(JSON.stringify(packageJson)))

    createFolders(keysAvailables)
    downloadBasicFiles(baseUrl, argv, keysAvailables)
})