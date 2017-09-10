let util = require('./../../util')
let Call = require('./../index.js').Call('exIO')


module.exports = () => {
    return new exIO()
}

function exIO() {
    this.exCall = require('./exCall.js')
    this.exCaller = require('./../index.js').Call('ex_' + util.randomNumberKey(999999))
    this.functions = {}
}

exIO.prototype.setFunctions = function(functions, name) {
    this.exCall.setFunctions(this.exCaller, functions, name)
}

exIO.prototype.getFunctions = function() {
    return this.functions
}

exIO.prototype.receiver = function(obj) {
    let receiveFunctions = this.exCall.receiver(this.exCaller, obj)
    if (receiveFunctions) {
        let f = receiveFunctions
        this.functions[f.name] = f.functions
        Call.emit('added', f)
    }
}

exIO.prototype.addedFunctions = function(callback = () => {}) {
    Call.on('added', (operator, f) => {
        callback(f)
    })
}

exIO.prototype.sender = function(sendMethod = () => {}) {
    this.exCall.sender(this.exCaller, sendMethod)
}
