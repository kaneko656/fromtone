exports.Call = (key) => {
    return require('./Call.js')(key)
}

exports.MultiCall = (...Call) => {
    return require('./MultiCall.js')(Call)
}

// exports.exCall = () => {
//     return require('./exCall')()
// }
