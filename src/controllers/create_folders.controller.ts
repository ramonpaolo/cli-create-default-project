import { execSync } from 'child_process'

// Utils
import log from "../utils/logger.utils"

const createFolders = (keysAvailables: string[]) => {
    log('Creating folders 📁')

    // Create basics folders
    execSync('mkdir src')
    execSync('mkdir src/controllers')
    execSync('mkdir src/routes')
    execSync('mkdir src/models')
    execSync('mkdir src/settings')
    execSync('mkdir src/services')
    execSync('mkdir src/interfaces')
    execSync('mkdir src/middlewares')
    execSync('mkdir src/utils')
    execSync('mkdir src/__tests__')
    execSync('mkdir src/__tests__/e2e')
    execSync('mkdir src/__tests__/integration')
    execSync('mkdir src/__tests__/unit')
    

    if (keysAvailables.includes('docker')) {
        execSync('mkdir docker')
        execSync('mkdir docker/settings')
    }
}

export default createFolders