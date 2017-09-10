exports.userNameCheck = (user, callback = () => {}) => {
    if (!user || typeof user != 'string' || user == 'unknown') {
        module.exports.userNameInput(callback)
    }else{
        callback(user)
    }
}

exports.userNameInput = (callback = () => {}, caution = '') => {

    // 入力ダイアログを表示 ＋ 入力内容を user に代入
    // let user = window.prompt('ユーザー名を入力してください．slackでの名前を推奨（連携できます）' + caution, '')
    let user = window.prompt('ユーザー名を入力してください．' + caution, '')

    if (typeof user == 'string' && user.trim().length >= 1) {
        let href = window.location.href
        location.href = href + '?user=' + user
        callback(user)
    } else if (user != "" && user != null) {
        caution = '\n入力しないと進めません'
        module.exports.userNameInput(callback, caution)
    } else {
        caution = '\n入力しないと進めません'
        // module.exports.userNameInput(callback, caution)
    }

}
