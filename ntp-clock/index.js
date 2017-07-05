
let dateDiff = 0
let isReception = false
let receptionCallback = () => {}
module.exports = (callback = () => {}) => {
    if(!isReception){
        receptionCallback = () => {
            callback(dateDiff)
        }
    }else{
        callback(dateDiff)
    }
}


/**
 * Date.nowに対応していない場合、定義する
 * @link https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
 */
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime()
    }
}

// jsont( {
//  "id": "ntp-a1.nict.go.jp",
//  "it": 1232963971.248,
//  "st": 1232963971.920,
//  "leap": 33,
//  "next": 1230768000,
//  "step": 1
// } )
// サーバ時刻stと発信時刻it
// NTPサーバでの時刻生成からブラウザでの受信完了までにかかった時間は、(受信時刻−発信時刻)/2

/**
 * 受信用のjsont関数を定義
 */
window.jsont = function (data) {
    var nowDate = Date.now()

    /**
     * 取得した標準時とコンピュータ側の時間との差を取得
     * @link http://qiita.com/hashrock/items/ce686c5b38d82be16390
     */
    dateDiff = ((data.st * 1000) + (nowDate - (data.it * 1000)) / 2) - nowDate
    console.log('ntp-clock')
    console.log(dateDiff)
    console.log("latency: " + (nowDate - sendTime) / 2 + "ms")
    console.log(sendTime, data.st, nowDate)
    receptionCallback()
    isReception = true

    /**
     * jsont関数を削除
     */
    if (!(delete window.jsont)) {
        window.jsont = undefined
    }
}

/**
 * script要素を作成し、NTPサーバのデータを取得する
 * NTPサーバは複数の中からランダムに選択し、負荷分散を試みる
 * @link http://bashalog.c-brains.jp/14/03/05-100000.php
 */
var serverList = [
    'https://ntp-a1.nict.go.jp/cgi-bin/jsont',
    'http://ntp-a1.nict.go.jp/cgi-bin/jsont',
    'https://ntp-b1.nict.go.jp/cgi-bin/jsont',
    'http://ntp-b1.nict.go.jp/cgi-bin/jsont'
]
var scriptE = document.createElement('script')
// NTPサーバのURLに発信時刻を追加
var serverUrl = serverList[Math.floor(Math.random() * serverList.length)]
let sendTime = Date.now()
scriptE.src = serverUrl + '?' + (sendTime / 1000)
document.body.appendChild(scriptE)
