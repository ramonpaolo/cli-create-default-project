#!/usr/bin/env node

import { exec } from 'child_process'

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

exec('yarn init -y', () => {
    createFolders(keysAvailables)
    downloadBasicFiles(baseUrl, argv, keysAvailables)
})