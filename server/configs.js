
module.exports = {
    secretKey: 'sifre2021',
    APP_PORT: process.env.APP_PORT,
    PG_CONFIG: function(db='postgres') {
        return {
            host: 'wavevo.com',
            port: 9999,
            user: 'psqadmin',
            password: 'psadmin01',
            database: db
        }
    },
}