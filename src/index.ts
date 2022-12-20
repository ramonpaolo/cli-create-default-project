#!/usr/bin/env node

import yargs from 'yargs'
import { exec } from 'child_process'

const argv = yargs
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
    // Create basics folders
    exec('mkdir src')
    exec('mkdir src/controllers')
    exec('mkdir src/routes')
    exec('mkdir src/models')
    exec('mkdir src/settings')
    exec('mkdir src/services')
    exec('mkdir src/interfaces')
    exec('mkdir src/middlewares')
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

    exec(baseUrl + 'src/__tests__/index.spec.ts', () => {
        exec('mv index.spec.ts src/__tests__/index.spec.ts')
    })

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

    setTimeout(installOptionalPackages, 2000)
}

const installOptionalPackages = () => {
    for (const key of keysAvailables) {
        switch (key) {
            case 'database':
                for (const v of argv[key]) {
                    const value = v as Database

                    if (value === 'mongo') exec('yarn add mongoose')
                    if (value === 'postgres') { exec('yarn add pg sequelize'); exec('yarn add @types/pg @types/sequelize -D') }
                    if (value === 'redis') exec('yarn add ioredis')
                }
                break;
            case 'cloud':
                for (const v of argv[key]) {
                    const value = v as Cloud

                    if (value === 'aws') exec('yarn add aws-sdk')
                    if (value === 'firebase') exec('yarn add firebase-admin')
                }
                break;
            case 'docker':
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
                }

                // Create docker-compose files
                exec(baseUrl + 'docker-compose.yaml')
                exec(baseUrl + 'docker-compose-dev.yaml')
                exec(baseUrl + '.dockerignore')
                break;
            case 'http2':
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
    exec('yarn add express compression cors axios dotenv express-rate-limit eslint helmet')
    exec('yarn add typescript jest supertest @babel/preset-env @babel/preset-typescript @types/supertest @types/node @types/express @types/compression @types/cors @types/jest nodemon ts-node @typescript-eslint/eslint-plugin @typescript-eslint/parser @types/helmet -D', () => exec('yarn install', () => process.exit(0)))
}
