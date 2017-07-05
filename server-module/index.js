let app = require('./server-unit/app.js')
let page = require('./page/index.js')

app.initialize(8001)

page.init(app.app())

module.exports = app

// api
app.api().emit('open', '/api')
app.api().on('/api', (opeartor, body, res) => {
    console.log('/api', body)
    res.send('ok')
})

// webhook
app.webhook().emit('open', '/webhook')
app.webhook().on('/webhook', (opeartor, body, res) => {
    console.log('/webhook', body)
    res.send('ok')
})
