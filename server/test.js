const bcryptjs = require('bcryptjs')

function test_1() {
    try {
        setTimeout(() => {
            throw new Error('JUST ERROR')
        }, 4000)
    } catch (e) {
        console.log(`ERROR OCCURED ${e}`)
    }
}

const mystr = "safarlee"

const salt = bcryptjs.genSaltSync(10)
const hash = bcryptjs.hashSync(mystr)

const compareResult = bcryptjs.compareSync(mystr, hash)

console.log(hash)
console.log(compareResult)