var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
    let query = req.query || {}
    let user = query.user || 'unknown'
    res.render('demo-doppler-notification', {
        value: query.value,
        reset: query.reset ? true : false,
        user: user
    })
})

module.exports = router