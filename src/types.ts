type Database = 'redis' | 'postgres' | 'mongo'
type Cloud = 'aws' | 'firebase'

type KeysAvailables = 'database' | 'cloud' | 'http2' | 'docker'

export {
    Database,
    Cloud,
    KeysAvailables
}