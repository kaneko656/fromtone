let value = {}
let call = {}
exports.set = (name, v) => {
    value[name] = v
    if (typeof call[name] == 'function') {
        call[name](v)
    }
}

exports.get = (name) => {
    return value[name]
}

exports.on = (name, callback) => {
    call[name] = callback
}
