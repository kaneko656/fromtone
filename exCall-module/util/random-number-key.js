// if 9999  ->  0000 ~ 9999
module.exports = (max) => {
    let num = Math.random() * (max + 1)
    let key = ('0000000000000000' + num).slice(-1 * String(max).length)
    return key
}
