var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
    let query = req.query || {}
    res.render('webaudio', {
        value: query.value
    })
})

module.exports = router
