import { exec } from "child_process"

// Types
import { KeysAvailables } from "../types"

// Utils
import log from "../utils/logger.utils"

// Controllers
import { installOptionalPackages } from "./optional_files.controller"

const downloadBasicFiles = (url: string, argv: any, keysAvailables: KeysAvailables[]) => {
    exec(url + 'src/index.ts', () => {
        exec('mv index.ts src/index.ts')
    })

    exec(url + 'src/settings/logger.settings.ts', () => {
        exec('mv logger.settings.ts src/settings/logger.settings.ts')
    })

    exec(url + 'src/utils/logger_error.utils.ts', () => {
        exec('mv logger_error.utils.ts src/utils/logger_error.utils.ts')
    })

    exec(url + 'src/__tests__/e2/index.spec.ts', () => {
        exec('mv index.spec.ts src/__tests__/e2e/index.spec.ts')
    })

    log('Downloading basic files')

    // Download basic files of configuration
    exec(url + '.editorconfig')
    exec(url + '.gitignore')
    exec(url + 'LICENSE')
    exec(url + 'README-P.md', () => exec('mv README-P.md README.md'))
    exec(url + 'tsconfig.json')
    exec(url + 'environment.d.ts')
    exec(url + '.czrc')
    exec(url + 'jest.config.ts')
    exec(url + 'babel.config.js')
    exec(url + '.eslintrc.json')
    exec(url + '.env')

    if (keysAvailables.includes('docker'))
        exec(url + '.dockerignore')

    // Create docker-compose files
    if (keysAvailables.includes('docker') && !keysAvailables.includes('database')) {
        exec(url + 'docker-compose.yaml')
        exec(url + 'docker-compose-dev.yaml')
    }

    setTimeout(() => installOptionalPackages(url, argv, keysAvailables), 2000)
}

export default downloadBasicFiles