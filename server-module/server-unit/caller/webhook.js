let Call = require('./Call').Call('webhook')

let app

exports.init = (_app) => {
    app = _app
}

// Call
// Call.on('open', key)
// Call.emit(key, body, resObj(res)req)

exports.Call = () => {
    return Call
}

Call.on('open', (operator, key) => {
    if (typeof key == 'string') {
        module.exports.open(key)
    }
})

exports.open = (path) => {
    console.log('webhook.js open', path)
    app.post(path, (req, res) => {

        // ステータスコード200
        res.status(200)
        Call.emit(path, req.body, resObj(res), req)
        if (!res.finished) {
            res.send('{}')
        }
    })

    app.get(path, (req, res) => {
        // ステータスコード200
        res.status(200)
        Call.emit(path, req.query, resObj(res), req)
        if (!res.finished) {
            res.send('{}')
          }
    })
}

let resObj = (res) => {
    return {
        send: (obj) => {
            if (!res.finished) {
                res.send(obj)
            }
        },
        finished: () => {
            return res.finished
        },
        desist: () => {
            res.finished = true
        }
    }
}
