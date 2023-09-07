import yargs from 'yargs'

const argv = yargs
    .example('create-project', 'create project with express')
    .example('create-project --docker --http2 --cloud aws', 'create a project with docker, http2, nginx and aws-sdk')
    .option('http2', {
        type: 'boolean',
        description: 'Configure the project to use http 2.0(sdpy)'
    })
    .option('docker', {
        type: 'boolean',
        description: 'Create default docker files'
    })
    .option('cloud', {
        type: 'array',
        description: 'Install the sdk for the cloud choosed'
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .argv as any

export default argv