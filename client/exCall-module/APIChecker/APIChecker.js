const toBoolean = require('./toBoolean.js')
const clone = require('./clone.js')
const uuid = require('node-uuid')
const parser = require('./parser.js')

module.exports = new APIChecker

let importList = {}
let importNameList = {}
let importSimpleList = {}

function APIChecker() {
    this.key = uuid.v4()
}


// 必要データをはじめから生成してチェック

APIChecker.prototype.check = function(data, define) {

    let link = define.link ? define.link : {}
    define = define.define ? define.define : define

    let typeOfData = replaceType(data)

    // linkデータの結合
    link = combineLinkData(link, link)
    let combine = combineLinkData(define, link)

    let res = constCheckData(combine)
    let constCheck = res.c
    let constSimple = res.sc

    // stringにして戻す
    let json = JSON.stringify(convertFunctionToString(constCheck))
    constCheck = jsonParse(json)

    let ok = apiDataChecker(data, typeOfData, constCheck, null)
    return {
        ok: ok,
        value: data,
        verify: constSimple
    }
}


// importデータを使う

APIChecker.prototype.checkToImport = function(data, apiName) {
    if (importList[this.key + apiName]) {
        let simple = importSimpleList[this.key + apiName]
        let typeOfData = replaceType(data)
        let onlyValue = {}
        let ok = apiDataChecker(onlyValue, data, typeOfData, clone(importList[this.key + apiName]), null)
        return {
            ok: ok,
            value: data,
            onlyValue: onlyValue,
            verify: simple,
            apiList: importNameList[this.key]
        }
    } else {
        return {
            ok: false,
            errorMessage: '「'　 + 　String(apiName) + '」はimportされていません'
        }
    }
}


// import
// { define: {}, link: {} }

APIChecker.prototype.importDefine = function(define, apiName) {
    if (typeof apiName != 'string' || typeof define != 'object') {
        return 'importDefine( { define: {}, link: {} }, apiName)が引数です'
    }

    //安全
    let link = define.link ? define.link : {}
    define = define.define ? define.define : define

    link = combineLinkData(link, link)
    let combine = combineLinkData(define, link)

    let res = constCheckData(combine)
    let constCheck = res.c
    let simple = res.sc

    // 安全のため一旦stringにして戻す
    // constCheckData を　
    // convertFunctionToString（残ったfunction） > JSON.stringify（全体をstring）
    // jsonParseで戻す

    let json = JSON.stringify(convertFunctionToString(constCheck))
    constCheck = jsonParse(json)

    importList[this.key + apiName] = constCheck
    importSimpleList[this.key + apiName] = simple

    if (!importNameList[this.key]) {
        importNameList[this.key] = []
    }
    importNameList[this.key].push(apiName)
}

// import
// { apiA: {}, apiB: {},..., link: {} }


APIChecker.prototype.importAllDefine = function(define) {
    if (typeof define != 'object') {
        return 'importAllDefine( { apiA: {}, apiB: {},..., link: {} } )が引数です'
    }

    let link = define.link ? define.link : {}
    for (let apiName in define) {
        if (apiName != 'link') {
            let defineData = {}
            defineData.define = define[apiName]
            defineData.link = link
            this.importDefine(defineData, apiName)
        }
    }
}


// functionがstring

APIChecker.prototype.exportConstDefine = function(apiName) {
    if (importList[this.key + String(apiName)]) {
        let toStr = convertFunctionToString(importList[this.key + String(apiName)])
        return JSON.stringify(toStr, null, '    ')
    }
    return null
}

APIChecker.prototype.getAPIList = function(){
    if (importNameList[this.key]) {
        return importNameList[this.key]
    }
    return null
}


// オブジェクトのデータの中をtypeofに置き換える

const replaceType = (data) => {
    if (typeof data != 'object') {
        return typeof data
    }

    // 配列
    if (Array.isArray(data)) {
        let array = []
        data.forEach((d) => {
            array.push(replaceType(d))
        })
        return array
    }

    let type = {}
    for (let key in data) {

        // object
        if (typeof data[key] == 'object' && !Array.isArray(data[key])) {
            type[key] = replaceType(data[key])
        }

        // array
        else if (typeof data[key] == 'object' && Array.isArray(data[key])) {
            type[key] = []
            data[key].forEach((d) => {
                type[key].push(replaceType(d))
            })
        }

        // etc...
        else {
            type[key] = typeof data[key]
        }
    }

    return type
}

// checkDataにlinkデータを結合

const combineLinkData = (check, link) => {
    let com = {}

    // 単データ
    if (typeof check == 'string') {
        if (check in link) {
            com = link[check]
        } else {
            com = check
        }
        return com
    }

    if (typeof check == 'function') {
        return check
    }

    // オブジェクト
    for (let key in check) {
        let type = check[key]

        // prof
        if (key.indexOf('_') == 0) {
            com[key] = check[key]

            // transのfunctionはリンクできる
            if (key == '_trans' && typeof com[key] == 'object') {
                for (let k in com[key]) {
                    if (Array.isArray(com[key][k])) {
                        com[key][k].forEach((trans, i) => {
                            if (typeof trans.function == 'string' && link[trans.function]) {
                                com[key][k][i].function = link[trans.function].toString()
                            }
                        })
                    } else if (typeof com[key][k] == 'object') {
                        let trans = com[key][k]
                        let array = []
                        if (typeof trans.function == 'string' && link[trans.function]) {
                            array[0].if = trans.if
                            array[0].function = link[trans.function].toString()
                            com[key][k] = array
                        }
                    }
                }
            }
            continue
        }

        // 単データ
        if (typeof check[key] == 'string') {
            if (check[key] in link) {
                com[key] = link[check[key]]
            } else {
                com[key] = check[key]
            }
        }
        // 関数
        else if (typeof check[key] == 'function') {
            com[key] = check[key]
        }
        // array
        else if (Array.isArray(check[key])) {
            com[key] = []
            check[key].forEach((r) => {
                com[key].push(combineLinkData(r, link))
            })
        }
        // object
        else if (typeof check[key] == 'object') {
            com[key] = combineLinkData(check[key], link)
        }
    }
    return com
}


// checkDataを整形
// 内部でprofDataの整形を呼び出し

const constCheckData = (check) => {
    let con = {}
    let simpleCon = {}

    // string
    if (typeof check == 'string') {
        return {
            c: check,
            sc: check
        }
    }
    for (let key in check) {

        // prof
        if (key.indexOf('_') == 0) {
            let require = constProfData(key, check[key])
            con[key] = require
            simpleCon[key] = require ? require.ifText : ''
            continue
        }

        // type
        if (typeof check[key] == 'string') {
            con[key] = check[key]
            simpleCon[key] = check[key]
        }
        // array
        else if (Array.isArray(check[key])) {
            con[key] = []
            simpleCon[key] = []
            check[key].forEach((r) => {
                let res = constCheckData(r)
                con[key].push(res.c)
                simpleCon[key].push(res.sc)
            })
        }
        // object
        else {
            let res = constCheckData(check[key])
            con[key] = res.c
            simpleCon[key] = res.sc
        }
    }
    return {
        c: con,
        sc: simpleCon
    }
}


// profデータの整形
// constCheckData()内で呼び出し

const constProfData = (key, data) => {

    // _required
    if (key == '_required' && typeof data == 'string') {
        // requireList
        let requireList = []
        let requireValue = {}
        let preResult = toBoolean(data)
        preResult.value.forEach((v) => {
            if (requireList.indexOf(v) == -1) {
                requireList.push(v)
                requireValue[v] = false
            }
        })
        return {
            ifText: data,
            requireList: requireList,
            requireValue: requireValue,
            ok: false,
        }
    }

    // _trans
    else if (key == '_trans' && typeof data == 'object') {
        let trans = {}
        for (let key2 in data) {

            let array = Array.isArray(data[key2]) ? data[key2] : []

            // array
            array.forEach((ar) => {

                if (typeof ar.if == 'string') {
                    let func = null
                    if (typeof ar.function == 'function') {
                        func = ar.function.toString()
                    } else if (typeof ar.function == 'string') {
                        func = ar.function
                    }
                    if (func) {
                        if (!trans[key2]) {
                            trans[key2] = []
                        }
                        trans[key2].push({
                            if: ar.if,
                            function: func
                        })
                    }
                }
            })

        }
        return trans
    }

    // _defaults
    else if (key == '_defaults' && typeof data == 'object') {
        return data
    }
}


// 定義に沿っているかを判定
// prof処理も行う
// 整形したデータを入れる

const apiDataChecker = (value, apiData, typeOfApiData, constCheckData, nullData) => {
    let data = apiData
    let type = typeOfApiData
    let check = constCheckData

    // 各データのjudgeデータを適用、その後最終判断
    let require = check['_required'] ? check['_required'] : {}

    // judgeの前にデータ変換
    let trans = check['_trans'] ? check['_trans'] : {}

    //　judge == falseだった時、このデータを入れる（judgeはtrueになる）
    let defaults = check['_defaults'] ? check['_defaults'] : {}


    // stringだったらすぐ返す（再帰の先でそうなる場合がある）
    if (typeof check == 'string') {
        value = apiData
        return typeCheck(apiData, type, check)
    }

    // typeCheck
    for (let key in check) {

        let prof = key.indexOf('_') == 0
        let judge = false

        // trans処理
        if (!prof && trans[key]) {
            data[key] = applyTrans(data[key], type[key], trans[key])
            type[key] = replaceType(data[key])
        }

        // string
        // →　typeCheck
        // ←  true or false
        if (!prof && typeof check[key] == 'string') {
            judge = !type ? false : typeCheck(apiData[key], type[key], check[key])
            if (judge) {
                value[key] = apiData[key]
            }
        }


        // array
        // if ['number']
        //   →　typeCheck
        //      そぐわないデータは削ぎ落とす
        //   ←  true 一つでも正しいのが残っていたら
        //   ←　false 一つもない ot 配列でない
        // if [{}, {},...] or [[],[],[]...]
        //   →　再帰
        //   ←  true or false
        else if (!prof && Array.isArray(check[key])) {
            data[key] = Array.isArray(data[key]) ? data[key] : []
            type[key] = Array.isArray(type[key]) ? type[key] : []
            value[key] = []

            // [string/number]
            if (check[key].length >= 1 && typeof check[key][0] == 'string') {
                for (let i = 0; i < data[key].length; i++) {
                    let jd = typeCheck(data[key][i], type[key][i], check[key][0])
                    judge = jd ? true : judge
                    if (!jd) {
                        type[key].splice(i, 1)
                        data[key].splice(i, 1)
                        i--
                    } else {
                        value[key].push(data[key][i])
                    }
                }
            }

            // [{},{}]
            for (let i = 0; i < data[key].length; i++) {
                if (typeof c == 'object') {
                    // 配列以下で再帰
                    let jd = apiDataChecker(value[key][i], data[key][i], type[key][i], check[key][0], nullData)
                    judge = jd ? true : judge

                    // defaluts処理
                    if (!jd && defaults[key]) {
                        data[key][i] = defaults[key]
                        jd = true
                    }
                    if (!jd) {
                        data[key].splice(i, 1)
                        tupe[key].splice(i, 1)
                        i--
                    } else {
                        value[key].push(data[key][i])
                    }
                }
            }
        }

        // object
        // →　再帰
        // ←  true or false
        else if (!prof && typeof check[key] == 'object') {
            data[key] = data[key] ? data[key] : {}
            type[key] = type[key] ? type[key] : {}
            value[key] = {}
            judge = apiDataChecker(value[key], data[key], type[key], check[key], nullData)
        }

        // defaluts処理
        if (!prof && !judge && defaults[key]) {
            data[key] = defaults[key]
            value[key] = defaults[key]
            judge = true
        }

        // requireに各judgeを入れる
        if (!prof && judge && require && require['requireValue'] && typeof require['requireValue'][key] == 'boolean') {
            require['requireValue'][key] = true
        }

        // requireでなければtrueに
        if (!prof && (!require || !require['requireValue'] || typeof require['requireValue'][key] == 'undefined')) {
            judge = true
        }

        // judgeがfalseだったらnullDataを入れる
        if　 (!prof && !judge) {
            data[key] = nullData
            value[key] = nullData
        }


    }

    // requiredの条件式を判定
    if (require) {
        let b = toBoolean(require.ifText, require.requireValue)
        return b.judge
    } else {
        return true
    }
}


// 変換処理を適応

const applyTrans = (data, type, trans) => {
    let isTrans = false
    let transValue = null
    let typeOf = typeof data
    if (typeOf == 'object') {
        typeOf = Array.isArray(data) ? 'array' : 'object'
    }
    for (let i = 0; i < trans.length; i++) {
        let ifType = typeof trans[i].if == 'string' ? trans[i].if : ''
        if (ifType.indexOf('/') > 0) {
            ifType.split('/').forEach((t) => {
                if (type == t.trim() || typeOf == t.trim()) {
                    if (typeof trans[i].function == 'function') {
                        try {
                            transValue = trans[i].function(data)
                            data = transValue
                        } catch (e) {
                            console.log('\r\n********\r\n')
                            console.log(e)
                            console.log('\r\n********\r\n')
                            transValue = data
                        }
                        typeOf = typeof transValue
                        if (typeOf == 'object') {
                            typeOf = Array.isArray(transValue) ? 'array' : 'object'
                        }
                        isTrans = true
                        // console.log(data, ' => ', transValue)
                        // console.log(typeOf)
                    }
                }
            })
        } else {
            if (type == ifType.trim() || typeOf == ifType.trim()) {
                if (typeof trans[i].function == 'function') {
                    try {
                        transValue = trans[i].function(data)
                        data = transValue
                    } catch (e) {
                        console.log('\r\n********\r\n')
                        console.log(e)
                        console.log('\r\n********\r\n')
                        transValue = data
                    }
                    typeOf = typeof transValue
                    if (typeOf == 'object') {
                        typeOf = Array.isArray(transValue) ? 'array' : 'object'
                    }
                    isTrans = true
                }
            }
        }
    }
    if (isTrans) {
        return transValue
    }
    return data
}


// 型判定

const typeCheck = (data, dataType, correctType) => {
    // ワイルドカード
    if (correctType == '*') {
        return true
    }
    let type = dataType
    if (typeof dataType != 'string') {
        type = typeof dataType
    }
    if (correctType.indexOf('/') > 0) {
        let check = false
        correctType.split('/').forEach((t) => {
            if (type.toLowerCase() === t.trim().toLowerCase()) {
                if (t == 'number' && Number.isNaN(data)) {} else {
                    check = true
                }
            }
        })
        return check
    } else if (type.toLowerCase() === correctType.toLowerCase()) {
        if (correctType == 'number' && Number.isNaN(data)) {
            return false
        } else {
            return true
        }
    }
    return false
}


// functionをstringに変換

const convertFunctionToString = (obj) => {

    if (typeof obj == 'function') {
        return obj.toString()
    }
    if (typeof obj != 'object') {
        return obj
    }

    let con = {}

    for (key in obj) {
        if (typeof obj[key] == 'function') {
            con[key] = obj[key].toString()
        } else if (typeof obj[key] == 'object') {
            if (Array.isArray(obj[key])) {
                let array = []
                let k = key
                obj[key].forEach((ob) => {
                    array.push(convertFunctionToString(ob))
                })
                con[k] = array
            } else {
                con[key] = convertFunctionToString(obj[key])
            }
        } else {
            con[key] = obj[key]
        }
    }
    return con
}



let jsonParse = (json) => {
    return JSON.parse(json, parser)
}
