let Call = require('./Call').Call('api')

let app

let timeout = 3000

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
    Call.noticeEmit(path)
    console.log('api.js open', path)

    app.get(path, (req, res) => {
        // ステータスコード200
        res.status(200)
        Call.emit(key, req.query, resObj(res), req)
        setTimeout(() => {
            if (!res.finished) {
                res.send('{}')
            }
        }, timeout)
    })

    app.post(path, (req, res) => {
        // ステータスコード200
        res.status(200)
        Call.emit(key, req.body, resObj(res), req)
        setTimeout(() => {
            if (!res.finished) {
                res.send('{}')
            }
        }, timeout)
    })

    return {
        ok: true,
        key: path,
        sec: new Date().getSeconds()
    }
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
        },
        render: (...arg) => {
            res.render.apply(res, arg)
        }
    }
}
