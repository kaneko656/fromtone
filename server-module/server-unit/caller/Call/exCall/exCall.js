const makeCall = require('./../../Call')
const uuid = require('node-uuid')
const log = require('./../../../exCall-module/util').log()

// setFuntions
//  convert functions -> call
//  convert call -> abstObj
//  -> exCaller.emit('sender', abstObj)

exports.setFunctions = (exCaller, functions, option) => {
    if(!functions){
      return
    }
    // origin = functions
    let call = convertToCall(functions, functions, option)
    let abstObj = abstract(exCaller, call)
    exCaller.emit('sender', abstObj)
}

// receiver
// obj  abstObj or argObj

exports.receiver = (exCaller, obj) => {
    // console.log('\nreceiver', obj, '\n')
    if (obj && obj.content && obj.content == 'ex') {
        if (obj.type && obj.type == 'arguments') {

            let argObj = obj

            argObj = argMount(exCaller, argObj)
            // console.log(argObj.arguments)

            // array [uuid, argObj]
            let array = []
            array.push(argObj.uuid)
            array.push(argObj)

            exCaller.emit.apply(exCaller, array)

        } else if (obj.type && obj.type == 'abstract') {

            let abstObj = obj
            let call = concrete(exCaller, 'sender', abstObj)

            return {
                name: abstObj.name,
                functions: convertToFunctions(call)
            }
        }
    }
}

// sender
// argObj, abstObj

exports.sender = (exCaller, callback = () => {}) => {

    exCaller.on('sender', (operator, obj) => {
        send(obj)
    })

    // Execution of function created by mount
    exCaller.on('mount', (operator, arg) => {
        send(arg)
    })

    let send = (obj, option) => {
        if (obj.content && obj.content == 'ex') {
            if (obj.type && obj.type == 'arguments') {

                obj = argMount(exCaller, obj)

                // console.log('\nsender arg', obj, '\n')
                obj = setStatusSent(obj)
                callback(obj)

            } else if (obj.type && obj.type == 'abstract') {

                // console.log('\nsender abst', obj, '\n')
                obj = setStatusSent(obj)
                callback(obj)
            }
        }
    }
}



// convertToCall  functions -> Call
// Call.on(key, (...arg) => {}) -> functions[key](...arg)

let convertToCall = (origin, originFunctions, option = {}) => {
    let name = option.name || 'ex'

    if (typeof originFunctions != 'object') {
        return
    }
    let Call = makeCall.Call(name)
    let functions = expandFunctions(originFunctions, option, null, null)
    for (let key in functions) {
        // console.log(key, typeof functions[key])

        // return
        let returnFire = () => {}
        let onReturn = (callback = () => {}) => {
            // Redefine returnFile
            returnFire = (result) => {
                // execute
                callback(result)
            }
        }

        // function
        if (typeof functions[key] == 'function') {
            Call.on(key, (operator, ...arg) => {
                let result = functions[key].apply(origin, arg)
                // console.log('result', result)
                returnFire(result)
            })
            // returnFunction  arg[0] is callback of onReturn
            if (key.indexOf('onReturn/') != 0 && key.indexOf('mount_') != 0) {
                Call.on('onReturn/' + key, (operator, ...arg) => {
                    if (typeof arg[0] == 'function') {
                        // regist callback function
                        onReturn(arg[0])
                    }
                })
            }
        }

        // staticValue
        else {
            Call.staticValue[key] = functions[key]
            // Call.on(key, () => {
            //     returnFire(functions[key])
            // })
        }

    }

    return Call
}

// expandFunctions
// example
// {
//   abc: {
//      methodA: () => {},
//      methodB: () => {}
//   },
//   methodC: () => {}
// }
// To
// {
//   abc/methodA: () => {},
//   abc/methodB: () => {},
//   methodC: () => {}
// }

let expandFunctions = (functions, option, root, exp) => {
    root = root ? root : ''
    exp = exp ? exp : {}
    for (let key in functions) {
        // remove  key == Object.prototype of default
        if (objProtoList.indexOf(key) >= 0) {
            continue
        }
        let type = typeof functions[key]
        if (type === 'function') {
            exp[root + key] = functions[key]
        }
        if (type === 'object') {
            expandFunctions(functions[key], option, root + key + '/', exp)
        }
        if (['undefined', 'boolean', 'number', 'string'].indexOf(type) >= 0) {
            exp[root + key] = functions[key]
        }
    }
    return exp
}

// convertToFunctions  Call -> Functions
// functions[key](...arg) -> Call.emit(key, ...arg)

let convertToFunctions = (Call) => {
    let list = Call.list()
    let functions = {}

    for (let key in list) {
        let target = null
        let returnFunction = null

        // aaa/bbb  ->  aaa.bbb


        let keyArray = key.split('/')
        keyArray.forEach((k, i) => {
            if (i == 0) {
                target = functions
            }
            target[k] = target[k] ? target[k] : {}

            // last
            if (i == keyArray.length - 1) {

                // toFunction
                target[k] = (...arg) => {

                    // Promise  returnValue
                    let promise = new Promise(function(resolve, reject) {
                        if (('onReturn/' + key) in list) {
                            // console.log('onReturn/' + key)
                            Call.emit('onReturn/' + key, (returnValue) => {
                                resolve(returnValue)
                            })
                        } else {
                            // reject('none return value')
                        }
                    })

                    // emit
                    arg.unshift(key)
                    Call.emit.apply(Call, arg)
                    return promise
                }
            }
            // not last
            else {
                target = target[k]
            }
        })
    }

    // staticValue
    let value = Call.staticValue
    for (let key in value) {
        let target = null

        // aaa/bbb  ->  aaa.bbb

        let keyArray = key.split('/')
        keyArray.forEach((k, i) => {
            if (i == 0) {
                target = functions
            }
            target[k] = target[k] ? target[k] : {}

            // last
            if (i == keyArray.length - 1) {
                // setStaticValue
                target[k] = value[key]
            }
            // not last
            else {
                target = target[k]
            }
        })
    }

    return functions
}

// abstract  Call -> abstract
// exCaller.on(uuid, (argObj) => {}) -> execute Call.emit(key, ...arg))

let abstract = (exCaller, Call) => {
    let abst = abstObj(Call)
    exCaller.on(abst.uuid, (operator, argObj) => {

        // argObj.arguments [key, arg1, arg2, ...]
        argObj.arguments.unshift(argObj.key)

        Call.emit.apply(Call, argObj.arguments)
    })
    return abst
}

// concrete abstract -> Call
// Call.on(key, (...arg)) => {}) -> exCaller.emit('sender', argObj)

let concrete = (exCaller, sendKey, abst) => {
    let Call = makeCall.Call(abst.name)
    for (let key in abst.list) {
        Call.on(key, (operator, ...arg) => {
            exCaller.emit(sendKey, argObj(abst.uuid, key, arg))
        })
    }
    Call.staticValue = abst.value
    return Call
}


// argumentsの中の関数はexContentに変換

// decode abstObj to function

let argMount = (exCaller, argObj) => {
    if (argObj && argObj.content && argObj.content == 'ex' &&
        argObj.type && argObj.type == 'arguments') {

        argObj.arguments.forEach((a, i) => {
            if (a && a.sent == true && a.content && a.content == 'ex' &&
                a.type && a.type == 'abstract') {

                let abst = a
                let call = concrete(exCaller, 'mount', abst)
                let functions = convertToFunctions(call)

                // console.log('abst -> functions', functions)

                argObj.arguments[i] = functions[abst.name]
            }
            if (typeof a == 'function') {

                let uuid_v4 = uuid.v4()
                let keyName = 'mount_' + uuid_v4

                let origin = a
                let functions = {}
                functions[keyName] = a

                // call.on(keyName)
                let call = convertToCall(origin, functions, {
                    name: keyName
                })
                let abstObj = abstract(exCaller, call)

                // console.log('function -> abst', abstObj)

                argObj.arguments[i] = abstObj
            }
            else if (typeof a == 'object' && searchFunction(a)) {

                let uuid_v4 = uuid.v4()
                let keyName = 'mount_' + uuid_v4

                let origin = a
                let obj = {}
                obj[keyName] = a

                let call = convertToCall(a, obj, {
                    name: keyName
                })
                let abstObj = abstract(exCaller, call)

                //console.log('object -> abst', abstObj)

                argObj.arguments[i] = abstObj
            }
        })
    }
    return argObj
}

let setStatusSent = (obj) => {

    if (obj && obj.content && obj.content == 'ex') {
        obj.sent = true
        if (obj.type && obj.type == 'arguments') {
            obj.arguments.forEach((a, i) => {
                if (a && a.content && a.content == 'ex') {
                    obj.arguments[i] = setStatusSent(a)
                }
            })
        }
    }
    return obj
}

// encode function to abstObj

let argMountSender = (exCaller, argObj) => {
    if (argObj && argObj.content && argObj.content == 'ex' &&
        argObj.type && argObj.type == 'arguments') {

        argObj.arguments.forEach((a, i) => {

            // else if (typeof a == 'object' && searchFunction(a)) {
            //     let obj = a
            //     let call = convertToCall(obj, {
            //         name: 'objectMount'
            //     })
            //     let abstObj = abstract(exCaller, call)
            //
            //     console.log('object -> abst', abstObj)
            //
            //     argObj.arguments[i] = abstObj
            // }
        })

    }
    return argObj
}

let argObj = (uuid, key, arg) => {
    return {
        content: 'ex',
        type: 'arguments',
        uuid: uuid,
        key: key,
        arguments: arg,
        sent: false
    }
}

let abstObj = (Call) => {
    return {
        content: 'ex',
        type: 'abstract',
        uuid: uuid.v4(),
        name: Call.getName(),
        list: Call.list(),
        value: Call.staticValue,
        sent: false
    }
}

let searchFunction = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] == 'function') {
            return true
        }
        if (typeof obj[key] == 'object') {
            let bool = searchFunction(obj[key])
            if (bool) {
                return true
            }
        }
    }
    return false
}


// Object.ptorotype属性はエラーになるので除く

let propProtoList = () => {
    let dummyObj = {}
    let obj = Object.create(dummyObj)
    let propNames = []
    while (obj) {
        propNames = propNames.concat(Object.getOwnPropertyNames(obj))
        obj = Object.getPrototypeOf(obj)
    }
    return propNames
}

let objProtoList = propProtoList()
