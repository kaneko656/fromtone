//  browserify js/main.js -o bundle.js
// watchify lib/index.js -o public/bundle.js -v
window.addEventListener('load', load, false);

function load(){
    let windowSize = require('./windowsize.js')()

    console.log(windowSize)

    let element = document.getElementById('test')
    console.log(element)
    element.innerHTML = 'javascript'

    let element_argment = document.getElementById('auth-argment')
    let value = element_argment.getAttribute('data-value')
    console.log(value)
    element.innerHTML += ' + ' + value

}
