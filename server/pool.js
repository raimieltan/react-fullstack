import pg from "pg"

const connectDatabase = () => {
    const pool = new pg.Pool( {
        user: 'postgres',
        password: 'postgres',
        database: 'jwt_tut',
        host: 'localhost'
    })

    return pool
} 

export { connectDatabase }