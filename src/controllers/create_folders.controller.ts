import { exec } from 'child_process'

// Utils
import log from "../utils/logger.utils"

const createFolders = (keysAvailables: string[]) => {
    log('Creating folders 📁')

    // Create basics folders
    exec('mkdir src')
    exec('mkdir src/controllers')
    exec('mkdir src/routes')
    exec('mkdir src/models')
    exec('mkdir src/settings')
    exec('mkdir src/services')
    exec('mkdir src/interfaces')
    exec('mkdir src/middlewares')
    exec('mkdir src/utils')
    exec('mkdir src/__tests__')
    exec('mkdir src/__tests__/e2e')
    

    if (keysAvailables.includes('docker')) {
        exec('mkdir docker')
        exec('mkdir docker/settings')
    }
}

export default createFolders