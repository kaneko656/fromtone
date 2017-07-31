const CronJob = require('cron').CronJob

// onTick  Dateクラス
module.exports = (onTick, callback, start = true) => {
    console.log(onTick)
    if (typeof onTick != 'strings') {
        console.log(Date.now() + 1, onTick.getTime(), 'callback')
        if (Date.now() + 1 >= onTick.getTime()) {

            callback()
            return
        }
    }
    let job = new CronJob({
        cronTime: onTick,
        onTick: () => {
            console.log('onTick ')
            callback()
        },
        start: true,
        timeZone: 'Asia/Tokyo'
    })
}
