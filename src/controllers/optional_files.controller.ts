import { exec } from "child_process"

// Types
import { Cloud, Database, KeysAvailables } from "../types"

// Utils
import log from "../utils/logger.utils"

const installOptionalPackages = (url: string, argv: any, keysAvailables: KeysAvailables[]) => {
    for (const key of keysAvailables) {
        switch (key) {
            case 'database':
                log(`Downloading ⤓ and Configuring ⚙️ databases`)

                for (const v of argv[key]) {
                    const value = v as Database

                    if (value === 'mongo') {
                        exec('yarn add mongoose')
                        exec(url + 'src/settings/mongo.settings.ts', () => {
                            exec('mv mongo.settings.ts src/settings/mongo.settings.ts')
                        })
                    }
                    if (value === 'postgres') {
                        exec('yarn add pg sequelize')
                        exec('yarn add @types/pg @types/sequelize -D')
                        exec(url + 'src/settings/sequelize.settings.ts', () => {
                            exec('mv sequelize.settings.ts src/settings/sequelize.settings.ts')
                        })
                    }
                    if (value === 'redis') {
                        exec('yarn add ioredis')
                        exec(url + 'src/settings/redis.settings.ts', () => {
                            exec('mv redis.settings.ts src/settings/redis.settings.ts')
                        })
                    }
                }
                break;
            case 'cloud':
                log(`Downloading ⤓ sdk of cloud providers`)

                for (const v of argv[key]) {
                    const value = v as Cloud

                    if (value === 'aws') exec('yarn add aws-sdk')
                    if (value === 'firebase') exec('yarn add firebase-admin')
                }
                break;
            case 'docker':
                log('Downloading ⤓ and Configuring ⚙️ dockerfiles')

                exec(url + 'docker/node-dev.dockerfile', () => exec('mv node-dev.dockerfile docker/node-dev.dockerfile'))

                if (keysAvailables.includes('http2')) {
                    // Create dockerfiles for http 2.0
                    exec(url + 'docker/node-http2.dockerfile', () => exec('mv node-http2.dockerfile docker/node.dockerfile'))
                    exec(url + 'docker/nginx-http2.dockerfile', () => exec('mv nginx-http2.dockerfile docker/nginx.dockerfile'))

                    // Create conf file for NGINX http 2.0
                    exec(url + 'docker/settings/nginx-http2.conf', () => exec('mv nginx-http2.conf docker/settings/nginx.conf'))
                } else {
                    // Create dockerfiles for http 1.1
                    exec(url + 'docker/node.dockerfile', () => exec('mv node.dockerfile docker/node.dockerfile'))
                    exec(url + 'docker/nginx.dockerfile', () => exec('mv nginx.dockerfile docker/nginx.dockerfile'))

                    // Create conf file for NGINX http 1.1
                    exec(url + 'docker/settings/nginx.conf', () => exec('mv nginx.conf docker/settings/nginx.conf'))

                    if (keysAvailables.includes('database')) configureOptionalsDockerComposeFiles(url, argv)
                }
                break;
            case 'http2':
                log('Downloading ⤓ and Configuring ⚙️ http2')
                exec('yarn add spdy')
                exec('yarn add @types/spdy -D')

                // Create example index using http 2.0
                exec(url + 'src/index-http2.ts', () => { exec('rm src/index.ts'); exec('mv index-http2.ts src/index.ts') })

                // Create certificate SSL for http 2.0
                exec('openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt')
                break;
            default:
                break;
        }
    }
    exec('yarn add express compression cors axios dotenv express-rate-limit eslint helmet winston')
    exec('yarn add typescript jest supertest @babel/preset-env @babel/preset-typescript @types/supertest @types/node @types/express @types/compression @types/cors @types/jest nodemon ts-node @typescript-eslint/eslint-plugin @typescript-eslint/parser @types/helmet -D', () => exec('yarn install', () => {
        log('Finalized with success')
        process.exit(0)
    }))
}

const configureOptionalsDockerComposeFiles = (url: string, argv: {database: Database[]}) => {
    const values = argv['database']

    log('Downloading ⤓ docker-compose files')

    if (values.includes('mongo') && values.includes('postgres') && values.includes('redis')) {
        exec(url + 'docker-compose-redis-mongo-postgresql.yaml')
        exec(url + 'docker-compose-dev-redis-mongo-postgresql.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-redis-mongo-postgresql.yaml docker-compose-dev.yml')
            exec('mv docker-compose-redis-mongo-postgresql.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('redis') && values.includes('mongo')) {
        exec(url + 'docker-compose-redis-mongo.yaml')
        exec(url + 'docker-compose-dev-redis-mongo.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-redis-mongo.yaml docker-compose-dev.yml')
            exec('mv docker-compose-redis-mongo.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('redis') && values.includes('postgres')) {
        exec(url + 'docker-compose-redis-postgresql.yaml')
        exec(url + 'docker-compose-dev-redis-postgresql.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-redis-postgresql.yaml docker-compose-dev.yml')
            exec('mv docker-compose-postgresql.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('mongo') && values.includes('postgres')) {
        exec(url + 'docker-compose-mongo-postgresql.yaml')
        exec(url + 'docker-compose-dev-mongo-postgresql.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-mongo-postgresql.yaml docker-compose-dev.yml')
            exec('mv docker-compose-mongo-postgresql.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('redis')) {
        exec(url + 'docker-compose-redis.yaml')
        exec(url + 'docker-compose-dev-redis.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-redis.yaml docker-compose-dev.yml')
            exec('mv docker-compose-redis.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('mongo')) {
        exec(url + 'docker-compose-mongo.yaml')
        exec(url + 'docker-compose-dev-mongo.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-mongo.yaml docker-compose-dev.yml')
            exec('mv docker-compose-mongo.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('postgres')) {
        exec(url + 'docker-compose-postgresql.yaml')
        exec(url + 'docker-compose-dev-postgresql.yaml')

        setTimeout(() => {
            exec('mv docker-compose-dev-postgresql.yaml docker-compose-dev.yml')
            exec('mv docker-compose-postgresql.yaml docker-compose.yml')
        }, 2000)
    }

}

export {
    installOptionalPackages,
    configureOptionalsDockerComposeFiles,
}