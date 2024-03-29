/**
 * @overview SystemProperty 計算能力を簡易的に測って，serverに送る
 * @module webSocket/spec
 * @see {@link module:webSocket/register}
 */

exports.init = (socket, socketRoot) => {

    let st = Date.now()
    let timeout = 500
    let max = 1000000
    let isFinish

    let finish = (n) => {
        if (isFinish) {
            return
        }
        isFinish = true
        let time = Date.now() - st
        let spec = time / n
        socket.emit(socketRoot + 'system/spec', {
            spec: spec
        })
    }

    setTimeout(() => {
        st = Date.now()
        for (let n = 1; n < max; n++) {
            // power
            let a = Math.pow(Math.sin(n))

            if (Date.now() - st > timeout) {
                finish(n)
                break
            }
        }
        finish(max)
    }, 500)
}
