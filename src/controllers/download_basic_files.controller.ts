import { execSync } from "child_process"

// Types
import { KeysAvailables } from "../types"

// Utils
import log from "../utils/logger.utils"

// Controllers
import { installPackages } from "./optional_files.controller"

const downloadFiles = (url: string, argv: any, keysAvailables: KeysAvailables[]) => {
    execSync(url + 'src/index.ts')
    execSync('mv index.ts src/index.ts')

    execSync(url + 'script.sh')

    execSync(url + 'src/database/config/config.js')
    execSync('mv config.js src/database/config/config.js')
    execSync(url + 'src/database/models/index.ts')
    execSync('mv index.ts src/database/models/index.ts')

    execSync(url + 'src/settings/logger.settings.ts')
    execSync('mv logger.settings.ts src/settings/logger.settings.ts')

    execSync(url + 'src/utils/logger.utils.ts')
    execSync('mv logger.utils.ts src/utils/logger.utils.ts')

    execSync(url + 'src/settings/sequelize.settings.ts')
    execSync('mv sequelize.settings.ts src/settings/sequelize.settings.ts')
    execSync(url + 'src/settings/mongo.settings.ts')
    execSync('mv mongo.settings.ts src/settings/mongo.settings.ts')
    execSync(url + 'src/settings/redis.settings.ts')
    execSync('mv redis.settings.ts src/settings/redis.settings.ts')

    execSync(url + 'src/__tests__/e2e/index.spec.ts')
    execSync('mv index.spec.ts src/__tests__/e2e/index.spec.ts')

    log('Downloading basic files')

    // Download basic files of configuration
    execSync(url + '.editorconfig')
    execSync(url + '.gitignore')
    execSync(url + 'LICENSE')
    execSync(url + 'README-P.md')
    execSync('mv README-P.md README.md')
    execSync(url + 'tsconfig.json')
    execSync(url + 'environment.d.ts')
    execSync(url + '.czrc')
    execSync(url + 'jest.config.ts')
    execSync(url + 'babel.config.js')
    execSync(url + '.eslintrc.json')
    execSync(url + '.env')
    execSync(url + '.env.test')

    if (keysAvailables.includes('docker')) {
        execSync(url + '.dockerignore')
        execSync(url + 'docker-compose.yaml')
        execSync(url + 'docker-compose-dev.yaml')
    }

    installPackages(url, argv, keysAvailables)
}

export default downloadFiles
