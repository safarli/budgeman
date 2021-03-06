require('dotenv').config()
const bcryptjs = require('bcryptjs')

module.exports = {
    secretKey: 'applejuice',
    salt: bcryptjs.genSaltSync(10),
    APP_PORT: process.env.APP_PORT,
    PG_CONFIG: function(db='postgres') {
        return {
            host: 'database-1.cd5r1pmmefjf.eu-west-3.rds.amazonaws.com',
            port: 5432,
            user: 'postgres',
            password: 'gello99a3',
            database: db
        }
    },
}