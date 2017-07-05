module.exports = (k, v) => {
    if (v.toString().indexOf('=>') >= 0 || v.toString().indexOf('function') == 0) {
        try {
            //return eval('(' + v + ')')
            return new Function('return ' + v)()
        } catch (e) {
            //console.log(e)
            return (data) => {
                return data
            }
        }
    } else {
        return v
    }
}
