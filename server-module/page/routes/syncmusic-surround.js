var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
    let query = req.query || {}
    res.render('syncmusic-surround', {
        value: query.value,
        reset: query.reset ? true : false
    })
})

module.exports = router
