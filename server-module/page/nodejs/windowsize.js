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
