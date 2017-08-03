// const bodyParser = require('body-parser')
// const logger = require('morgan')
// const cookieParser = require('cookie-parser')
const express = require('express')
const route_test = require('./routes/test')
const webaudio = require('./routes/webaudio')
const syncmusic = require('./routes/syncmusic')
const syncmusic_surround = require('./routes/syncmusic-surround')
const touch_surround = require('./routes/touch-surround.js')
const demo_motivation = require('./routes/demo-motivation.js')
const demo_mention = require('./routes/demo-mention.js')
const demo_simple_notification = require('./routes/demo-simple-notification.js')
const demo_task_notification = require('./routes/demo-task-notification.js')
const demo_alarm = require('./routes/demo-alarm.js')

const demo_chat = require('./routes/demo-chat.js')
const demo_accel_sensor = require('./routes/demo-accel-sensor.js')
const demo_accel_notification = require('./routes/demo-accel-notification.js')
const demo_doppler_notification = require('./routes/demo-doppler-notification.js')
const demo_orchestra = require('./routes/demo-orchestra.js')
const board_game = require('./routes/board-game.js')
const board_game_player = require('./routes/board-game-player.js')
const demo = require('./routes/demo.js')

const home = require('./routes/home.js')


exports.init = (app) => {
    // view engine setup
    app.set('views', __dirname + '/views')
    app.set('view engine', 'ejs')

    //
    app.use('/test', route_test)
    app.use('/webaudio', webaudio)
    app.use('/syncmusic', syncmusic)
    app.use('/syncmusic-surround', syncmusic_surround)
    app.use('/touch-surround', touch_surround)
    app.use('/demo-motivation', demo_motivation)
    app.use('/demo-notification', demo_mention)
    app.use('/demo-simple-notification', demo_simple_notification)
    app.use('/demo-task-notification', demo_task_notification)

    app.use('/demo-chat', demo_chat)
    app.use('/demo-accel-sensor', demo_accel_sensor)
    app.use('/demo-accel-notification', demo_accel_notification)
    app.use('/demo-doppler-notification', demo_doppler_notification)
    app.use('/demo-orchestra', demo_orchestra)

    app.use('/game', board_game)
    app.use('/game-player', board_game_player)
    app.use('/demo', demo)

    app.use('/', home)

    // lib
    app.use('/lib', express.static(__dirname + '/public'))

}
