(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//  browserify js/main.js -o bundle.js

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

},{"./windowsize.js":2}],2:[function(require,module,exports){
module.exports = () => {
    return {
        screen: {
            w: screen.width,
            h: screen.height,
            explain: 'モニターの解像度'
        },
        availWidth: {
            w: screen.availWidth,
            h: screen.availHeight,
            explain: 'モニターの利用可能領域'
        },
        innerWindow: {
            w: window.innerWidth,
            h: window.innerHeight,
            explain: "ウィンドウビューポート（スクロールバーを含む）"
        },
        outerWindow: {
            w: window.outerWidth,
            h: window.outerHeight,
            explain: "ウィンドウ外観"
        },
        documentBody: {
            w: document.body ? document.body.clientWidth : 0,
            h: document.body ? document.body.clientHeight : 0,
            explain: "ドキュメント全体"
        },
        documentView: {
            w: document.documentElement.clientWidth,
            h: document.documentElement.clientHeight,
            explain: "ドキュメントの表示領域"
        },
        scrool: {
            x: window.scrollX,
            y: window.scrollY
        }
    }
}

},{}]},{},[1]);
