#!/usr/bin/env node

import yargs from 'yargs'
import { exec } from 'child_process'
import chalk from 'chalk'

const log = (message: string) => console.log(chalk.green(message))

console.clear()

log('Initializing Project ⚙️')

const argv = yargs
    .example('create-project', 'create project with express')
    .example('create-project --docker --http2 --cloud aws --database redis', 'create a project with docker, http2, nginx and install redis and aws-sdk')
    .option('http2', {
        type: 'boolean',
        description: 'Configure the project to use http 2.0(sdpy)'
    })
    .option('docker', {
        type: 'boolean',
        description: 'Create default docker files'
    })
    .option('database', {
        type: 'array',
        description: 'Install the library for the database choosed'
    })
    .option('cloud', {
        type: 'array',
        description: 'Install the sdk for the cloud choosed'
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .argv as any

type Database = 'redis' | 'postgres' | 'mongo'
type Cloud = 'aws' | 'firebase'

type KeysAvailables = 'database' | 'cloud' | 'http2' | 'docker'

const keysAvailables = Object.keys(argv) as KeysAvailables[]

const baseUrl = 'wget https://raw.githubusercontent.com/ramonpaolo/default-files-script-automation/master/'

exec('yarn init -y', () => {
    createFolders()
    downloadBasicFiles()
})

const createFolders = () => {
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

    if (keysAvailables.includes('docker')) {
        exec('mkdir docker')
        exec('mkdir docker/settings')
    }
}

const downloadBasicFiles = () => {
    exec(baseUrl + 'src/index.ts', () => {
        exec('mv index.ts src/index.ts')
    })

    exec(baseUrl + 'src/settings/logger.settings.ts', () => {
        exec('mv logger.settings.ts src/settings/logger.settings.ts')
    })

    exec(baseUrl + 'src/utils/logger_error.utils.ts', () => {
        exec('mv logger_error.utils.ts src/utils/logger_error.utils.ts')
    })

    exec(baseUrl + 'src/__tests__/index.spec.ts', () => {
        exec('mv index.spec.ts src/__tests__/index.spec.ts')
    })

    log('Downloading basic files')

    // Download basic files of configuration
    exec(baseUrl + '.editorconfig')
    exec(baseUrl + '.gitignore')
    exec(baseUrl + 'LICENSE')
    exec(baseUrl + 'README-P.md', () => exec('mv README-P.md README.md'))
    exec(baseUrl + 'tsconfig.json')
    exec(baseUrl + 'environment.d.ts')
    exec(baseUrl + '.czrc')
    exec(baseUrl + 'jest.config.ts')
    exec(baseUrl + 'babel.config.js')
    exec(baseUrl + '.eslintrc.json')
    exec(baseUrl + '.env')

    if (keysAvailables.includes('docker'))
        exec(baseUrl + '.dockerignore')

    // Create docker-compose files
    if (keysAvailables.includes('docker') && !keysAvailables.includes('database')) {
        exec(baseUrl + 'docker-compose.yaml')
        exec(baseUrl + 'docker-compose-dev.yaml')
    }

    setTimeout(installOptionalPackages, 2000)
}

const installOptionalPackages = () => {
    for (const key of keysAvailables) {
        switch (key) {
            case 'database':
                log(`Downloading ⤓ and Configuring ⚙️ databases`)

                for (const v of argv[key]) {
                    const value = v as Database

                    if (value === 'mongo') {
                        exec('yarn add mongoose')
                        exec(baseUrl + 'src/settings/mongo.settings.ts', () => {
                            exec('mv mongo.settings.ts src/settings/mongo.settings.ts')
                        })
                    }
                    if (value === 'postgres') {
                        exec('yarn add pg sequelize')
                        exec('yarn add @types/pg @types/sequelize -D')
                        exec(baseUrl + 'src/settings/sequelize.settings.ts', () => {
                            exec('mv sequelize.settings.ts src/settings/sequelize.settings.ts')
                        })
                    }
                    if (value === 'redis') {
                        exec('yarn add ioredis')
                        exec(baseUrl + 'src/settings/redis.settings.ts', () => {
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

                exec(baseUrl + 'docker/node-dev.dockerfile', () => exec('mv node-dev.dockerfile docker/node-dev.dockerfile'))

                if (keysAvailables.includes('http2')) {
                    // Create dockerfiles for http 2.0
                    exec(baseUrl + 'docker/node-http2.dockerfile', () => exec('mv node-http2.dockerfile docker/node.dockerfile'))
                    exec(baseUrl + 'docker/nginx-http2.dockerfile', () => exec('mv nginx-http2.dockerfile docker/nginx.dockerfile'))

                    // Create conf file for NGINX http 2.0
                    exec(baseUrl + 'docker/settings/nginx-http2.conf', () => exec('mv nginx-http2.conf docker/settings/nginx.conf'))
                } else {
                    // Create dockerfiles for http 1.1
                    exec(baseUrl + 'docker/node.dockerfile', () => exec('mv node.dockerfile docker/node.dockerfile'))
                    exec(baseUrl + 'docker/nginx.dockerfile', () => exec('mv nginx.dockerfile docker/nginx.dockerfile'))

                    // Create conf file for NGINX http 1.1
                    exec(baseUrl + 'docker/settings/nginx.conf', () => exec('mv nginx.conf docker/settings/nginx.conf'))

                    if (keysAvailables.includes('database')) configureOptionalsDockerComposeFiles()
                }
                break;
            case 'http2':
                log('Downloading ⤓ and Configuring ⚙️ http2')
                exec('yarn add spdy')
                exec('yarn add @types/spdy -D')

                // Create example index using http 2.0
                exec(baseUrl + 'src/index-http2.ts', () => { exec('rm src/index.ts'); exec('mv index-http2.ts src/index.ts') })

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

const configureOptionalsDockerComposeFiles = () => {
    const values = argv['database'] as Database[]

    log('Downloading ⤓ docker-compose files')

    if (values.includes('mongo') && values.includes('postgres') && values.includes('redis')) {
        exec(baseUrl + 'docker-compose-redis-mongo-postgresql.yaml')
        exec(baseUrl + 'docker-compose-dev-redis-mongo-postgresql.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-redis-mongo-postgresql.yaml docker-compose-dev.yml')
            exec('mv docker-compose-redis-mongo-postgresql.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('redis') && values.includes('mongo')) {
        exec(baseUrl + 'docker-compose-redis-mongo.yaml')
        exec(baseUrl + 'docker-compose-dev-redis-mongo.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-redis-mongo.yaml docker-compose-dev.yml')
            exec('mv docker-compose-redis-mongo.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('redis') && values.includes('postgres')) {
        exec(baseUrl + 'docker-compose-redis-postgresql.yaml')
        exec(baseUrl + 'docker-compose-dev-redis-postgresql.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-redis-postgresql.yaml docker-compose-dev.yml')
            exec('mv docker-compose-postgresql.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('mongo') && values.includes('postgres')) {
        exec(baseUrl + 'docker-compose-mongo-postgresql.yaml')
        exec(baseUrl + 'docker-compose-dev-mongo-postgresql.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-mongo-postgresql.yaml docker-compose-dev.yml')
            exec('mv docker-compose-mongo-postgresql.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('redis')) {
        exec(baseUrl + 'docker-compose-redis.yaml')
        exec(baseUrl + 'docker-compose-dev-redis.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-redis.yaml docker-compose-dev.yml')
            exec('mv docker-compose-redis.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('mongo')) {
        exec(baseUrl + 'docker-compose-mongo.yaml')
        exec(baseUrl + 'docker-compose-dev-mongo.yaml')
        setTimeout(() => {
            exec('mv docker-compose-dev-mongo.yaml docker-compose-dev.yml')
            exec('mv docker-compose-mongo.yaml docker-compose.yml')
        }, 2000)
    } else if (values.includes('postgres')) {
        exec(baseUrl + 'docker-compose-postgresql.yaml')
        exec(baseUrl + 'docker-compose-dev-postgresql.yaml')

        setTimeout(() => {
            exec('mv docker-compose-dev-postgresql.yaml docker-compose-dev.yml')
            exec('mv docker-compose-postgresql.yaml docker-compose.yml')
        }, 2000)
    }

}