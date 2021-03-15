const { Client } = require('pg')
const { PG_CONFIG } = require('./configs.js')

const client = new Client(PG_CONFIG('ofisapi'))

const signUpUser = async (req, res) => {
    const { username, password } = req.body
    try {
        await client.connect()
        const {rows} = await client.query(`SELECT * FROM uers WHERE username=$1`, [username])
        console.log(rows)

    } catch (e) {
        console.log(`ERROR OCCURED ${e}`)
    }
    finally {
        res.status(200).send('aksdjfksf')
        client.end()
    }

}

const loginUser = (req, res) => {

}
