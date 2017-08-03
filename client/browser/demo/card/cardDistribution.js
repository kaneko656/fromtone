const Card = require('./cardList.js')

let cardID = {}

exports.distribution = (playerNum) => {
    this.init()
    let card = []

    // デバックモード
    if (playerNum == 1) {
        randomPop(card, 3)
    }

    if (playerNum == 2) {
        randomPop(card, 4)
    }


    for (let n = 3; n <= playerNum; n++) {
        if (n == 3) {
            pop(card, '第一発見者_1')
            pop(card, '犯人_1')
            pop(card, '探偵_1')
            pop(card, 'アリバイ_1')
        }
        if (n == 4) {
            pop(card, 'たくらみ_1')
        }
        if (n == 5) {
            pop(card, 'アリバイ_2')
        }
        if (n == 6) {
            pop(card, '探偵_2')
            pop(card, 'たくらみ_2')
        }
        if (n == 7) {
            pop(card, 'アリバイ_3')
        }
    }
    if (playerNum == 3) {
        randomPop(card, 8)
    }
    if (playerNum == 4) {
        randomPop(card, 11)
    }
    if (playerNum == 5) {
        randomPop(card, 14)
    }
    if (playerNum == 6) {
        randomPop(card, 16)
    }
    if (playerNum == 7) {
        randomPop(card, 19)
    }
    if (playerNum == 6) {
        randomPop(card, 23)
    }
    suffle(card)
    let cards = []
    let cardNum = card.length / playerNum
    for (let n = 0; n < playerNum; n++) {
        cards[n] = []
        for (let cn = 0; cn < cardNum; cn++) {
            cards[n].push(card[n * cardNum + cn])
        }
    }
    return cards
}

let pop = (card, id) => {
    card.push(cardID[id])
    delete cardID[id]
}


let randomPop = (card, num) => {
    let list = []
    for (id in cardID) {
        list.push(cardID[id])
    }
    for (let n = 0; n < num; n++) {
        let rand = Math.floor(Math.random() * (list.length - 1))
        card.push(list[rand])
        delete cardID[list[rand].id]
        list.splice(rand, 1)
    }
}

let suffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var r = Math.floor(Math.random() * (i + 1))
        var tmp = array[i]
        array[i] = array[r]
        array[r] = tmp
    }
    return array
}

exports.init = () => {
    cardSet('第一発見者', 1)
    cardSet('犯人', 1)
    cardSet('アリバイ', 5)
    cardSet('たくらみ', 2)
    cardSet('探偵', 4)
    cardSet('目撃者', 3)
    cardSet('一般人', 2)
    cardSet('いぬ', 1)
    cardSet('情報交換', 4)
    cardSet('うわさ', 5)
    cardSet('取り引き', 4)
}

let cardSet = (name, num) => {
    for (let n = 1; n <= num; n++) {
        let id = name + '_' + n
        cardID[id] = Card(name)
        cardID[id].id = id
    }
}
