const resolveIn = (t = 2000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('first resolve')
        }, t)
    })
}

resolveIn(1000)
    .then((r) => {
        console.log(r)
        return resolveIn(500)
    }
    )
    .then((r) => {
        console.log(r)
        return resolveIn(1000)
    }
    )
    .then((r) => {
        console.log(r)
        return resolveIn(1500)
    }
    )
