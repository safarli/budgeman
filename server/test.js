const programStart = Date.now()

while(Date.now() - programStart < 1500) {
    // console.log(Date.now())
}

setTimeout(
    () => {
        const delay = Date.now() - programStart
        console.log(delay)
    },
    300
)
