#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

// Utils
import log from './utils/logger.utils'
import argv from './utils/yarg.utils'

// Types
import { KeysAvailables } from './types'

// Controllers
import createFolders from './controllers/create_folders.controller'
import downloadFiles from './controllers/download_basic_files.controller'

log('Initializing Project ⚙️')

const keysAvailables = Object.keys(argv) as KeysAvailables[]

const baseUrl = 'wget https://raw.githubusercontent.com/ramonpaolo/default-files-script-automation/master/'

const packageJsonTemplate = {
    'version': '0.0.1',
    'main': 'dist/index.js',
    'scripts': {
      'dev': 'yarn migration && nodemon -r dotenv/config src/index.ts',
      'migration': 'sleep 5 && cd ./src/database && sequelize-cli db:migrate',
      'test': 'NODE_ENV=test jest --verbose --coverage --forceExit',
      'start': 'node dist/index.js',
      'prestart': 'cd ./dist/database && sequelize-cli db:migrate',
      'build': 'tsc',
      'test:prod': 'jest --verbose --colors --ci --reporters=default --reporters=jest-junit --detectOpenHandles --coverage --forceExit',
      'test:dev': 'jest --verbose --watchAll --colors --detectOpenHandles',
      'test:dev:e2e': 'jest ./src/__tests__/e2e --verbose --watchAll --colors --detectOpenHandles',
      'test:dev:unit': 'jest ./src/__tests__/unit --verbose --watchAll --colors --detectOpenHandles',
      'test:dev:integration': 'jest ./src/__tests__/integration --verbose --watchAll --colors --detectOpenHandles',
      'linter': 'yarn eslint ./src/**'
    },
}

execSync('yarn init -y')

const packageBuffer = readFileSync('./package.json', {
    encoding: 'utf-8',
})

const packageJson = JSON.parse(packageBuffer)

packageJson['main'] = packageJsonTemplate.main
packageJson['scripts'] = packageJsonTemplate.scripts
packageJson['version'] = packageJsonTemplate.version

writeFileSync('./package.json', Buffer.from(JSON.stringify(packageJson)))

createFolders(keysAvailables)
downloadFiles(baseUrl, argv, keysAvailables)
