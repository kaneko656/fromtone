const CronJob = require('cron').CronJob

// onTick  Dateクラス
module.exports = (onTick, callback, start = true) => {
    if (typeof onTick != 'string') {
        if (Date.now() + 1 >= onTick.getTime()) {
            callback()
            return
        }
    }
    let job = new CronJob({
        cronTime: onTick,
        onTick: () => {
            callback()
        },
        start: true,
        timeZone: 'Asia/Tokyo'
    })
}
