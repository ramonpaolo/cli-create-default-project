import { execSync } from "child_process"

// Types
import { Cloud, KeysAvailables } from "../types"

// Utils
import log from "../utils/logger.utils"

const installPackages = (url: string, argv: any, keysAvailables: KeysAvailables[]) => {
    console.log('ID: ', argv, keysAvailables)
    for (const key of keysAvailables) {
        switch (key) {
            case 'cloud':
                log(`Downloading ⤓ sdk of cloud providers`)

                for (const v of argv[key]) {
                    const value = v as Cloud

                    if (value === 'aws') execSync('yarn add aws-sdk')
                    if (value === 'firebase') execSync('yarn add firebase-admin')
                }
                break;
            case 'docker':
                log('Downloading ⤓ and Configuring ⚙️ dockerfiles')

                execSync(url + 'docker/node-dev.dockerfile')
                execSync('mv node-dev.dockerfile docker/node-dev.dockerfile')

                if (keysAvailables.includes('http2')) {
                    // Create dockerfiles for http 2.0
                    execSync(url + 'docker/node-http2.dockerfile')
                    execSync('mv node-http2.dockerfile docker/node.dockerfile')
                    execSync(url + 'docker/nginx-http2.dockerfile')
                    execSync('mv nginx-http2.dockerfile docker/nginx.dockerfile')

                    // Create conf file for NGINX http 2.0
                    execSync(url + 'docker/settings/nginx-http2.conf')
                    execSync('mv nginx-http2.conf docker/settings/nginx.conf')
                } else {
                    // Create dockerfiles for http 1.1
                    execSync(url + 'docker/node.dockerfile')
                    execSync('mv node.dockerfile docker/node.dockerfile')
                    execSync(url + 'docker/nginx.dockerfile')
                    execSync('mv nginx.dockerfile docker/nginx.dockerfile')

                    // Create conf file for NGINX http 1.1
                    execSync(url + 'docker/settings/nginx.conf')
                    execSync('mv nginx.conf docker/settings/nginx.conf')
                }
                break;
            case 'http2':
                log('Downloading ⤓ and Configuring ⚙️ http2')
                execSync('yarn add spdy')
                execSync('yarn add @types/spdy -D')

                // Create example index using http 2.0
                execSync(url + 'src/index-http2.ts')
                execSync('rm src/index.ts');
                execSync('mv index-http2.ts src/index.ts')

                // Create certificate SSL for http 2.0
                execSync('openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt')
                break;
            default:

                break
        }
        execSync('yarn add express compression cors axios dotenv express-rate-limit eslint helmet winston mongoose pg sequelize ioredis')
        execSync('yarn add typescript jest supertest @babel/preset-env @babel/preset-typescript @types/supertest @types/node @types/express @types/compression @types/cors @types/jest nodemon ts-node @typescript-eslint/eslint-plugin @typescript-eslint/parser @types/helmet @types/pg @types/sequelize -D')
        log('Finalized with success')
    }
}

export {
    installPackages,
}
