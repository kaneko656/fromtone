var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
    let query = req.query || {}
    res.render('syncmusic', {
        value: query.value
    })
})

module.exports = router
