var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
    let query = req.query || {}
    res.render('test', {
        value: query.value,
    })
})

module.exports = router
