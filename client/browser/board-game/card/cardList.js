const Card = require('./object.js')

const cardList = {
    'アリバイ': 'lib/image/card/アリバイ.png',
    'いぬ': 'lib/image/card/いぬ.png',
    'うわさ': 'lib/image/card/うわさ.png',
    'たくらみ': 'lib/image/card/たくらみ.png',
    '一般人': 'lib/image/card/一般人.png',
    '取り引き': 'lib/image/card/取り引き.png',
    '情報交換': 'lib/image/card/情報交換.png',
    '第一発見者': 'lib/image/card/第一発見者.png',
    '犯人': 'lib/image/card/犯人.png',
    '探偵': 'lib/image/card/探偵.png',
    '目撃者': 'lib/image/card/目撃者.png',
    '裏': 'lib/image/card/裏.png'
}
// module.exports = () => {
//     let card = {}
//     for (let name in cardList) {
//         let icon = new Image(304, 430)
//         icon.src = cardList[name]
//         card[name] = Card(icon)
//         card[name].name = name
//         card[name].id = name
//         card[name].type = 'card'
//     }
//     return card
// }

module.exports = (cardName) => {
    let icon = new Image(304, 430)
    icon.src = cardList[cardName]
    let card = Card(icon)
    card.name = cardName
    card.id = cardName
    card.type = 'card'
    return card
}
