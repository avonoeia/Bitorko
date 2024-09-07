function generateCode() {
    pass = ''
    for (let i = 0; i < 5; i++) {
        pass += Math.floor(Math.random() * 10).toString()
    }
    return pass
}

module.exports = {generateCode}