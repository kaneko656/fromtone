/**
 * @overview SystemProperty serverとのやりとりで決定する
 * @module webSocket/property
 * @see {@link module:webSocket/register}
 */

// 参照渡しなので更新されたら渡した先も変わる
let property = {}
exports.init = (socket, socketRoot) => {
    socket.on(socketRoot + 'system/property/receive', (prop) => {
        // console.log('system/property/receive', prop)
        for (let key in prop) {
            property[key] = prop[key]
        }
    })
}

/**
 * [get description]
 * @param  {string} key          [description]
 * @param  {} defaultValue  値がない場合，この値を返す　参照渡しにするので更新されたら変わる
 */
exports.get = (key, defaultValue = null) => {
    if (key in property) {
        return property[key]
    } else {
        property[key] = defaultValue
        return property[key]
    }
}

exports.set = (key, value) => {
    // console.log('property', key, value)
    property[key] = value
}
