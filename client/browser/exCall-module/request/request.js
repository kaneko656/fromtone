const request = require('request')

exports.post = (url, query, callback) => {
    callback = typeof callback == 'function' ? callback : () => {}
    request.post({
        url: url,
        json: query
    }, (error, response, body) => {
        callback(error, response, body)
    })
}

exports.get = (url, argument, callback) => {
    callback = typeof callback == 'function' ? callback : () => {}
    let arg = ''
    let head = true
    for (let key in argument) {
        let content = argument[key]
        if (typeof argument[key] == 'object') {
            content = JSON.stringify(argument[key])
        }
        if (!head) {
            arg += encodeURI('&')
        }
        arg += encodeURIComponent(key) + encodeURI('=') + encodeURIComponent(content)
        head = false
    }
    url = encodeURI(url + '?') + arg
    let options = {
        url: url
    }
    request.get(options, (error, response, body) => {
        callback(error, response, body)
    })
}
