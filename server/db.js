const bcryptjs = require('bcryptjs')
const salt = bcryptjs.genSaltSync(10)

const hashPass = (pass) => {
    return bcryptjs.hashSync(pass, salt)
}

const users = [
    {
        id: 4003001,
        username: 'safarli',
        hashedPassword: hashPass('ben12345')
    },
    {
        id: 4003002,
        username: 'berry',
        hashedPassword: hashPass('mocha99')
    },
    {
        id: 4003003,
        username: 'waffle',
        hashedPassword: hashPass('rekka4a')
    }
]

const getUsers = function () {
    return users
}

const addUser = function (username, hashedPassword) {
    const lastIndex = users.length - 1
    const lastId = users[lastIndex].id

    users.push(
        {
            id: lastId + 1,
            username: username,
            hashedPassword: hashedPassword
        }
    )

    return lastId
}

module.exports = {
    addUser,
    getUsers
}