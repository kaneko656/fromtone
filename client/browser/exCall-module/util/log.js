let util = require('util')
let call = require('./../../exCall-module/Call').Call('log')

module.exports = () => {
    return call
}

call.on('log', (o, ...arg) => {
    console.log(util.inspect(arg, {
        showHidden: true,
        colors: true,
        depth: null
    }))
})
