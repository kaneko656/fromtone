const CronJob = require('cron').CronJob

// onTick  Dateクラス
module.exports = (onTick, callback, start = true) => {
    let job = new CronJob({
        cronTime: onTick,
        onTick: () => {
            callback()
        },
        start: true,
        timeZone: 'Asia/Tokyo'
    })
}
