const CronJob = require('cron').CronJob

module.exports = (onTick, callback, start) => {
    let job = new CronJob({
        cronTime: onTick,
        onTick: () => {
            callback()
        },
        start: true,
        timeZone: 'Asia/Tokyo'
    })
}
