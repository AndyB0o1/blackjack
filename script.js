const instructions = document.querySelector('.instructions')
const hideInstructions = document.querySelector('.hideInstructions')
const showInstructions = document.querySelector('.showInstructions')
const deal = document.querySelector('.deal')
const playerCards = document.querySelector('.drawnCards')
const dealer = document.querySelector('.dealer')
const dealerAddCard = document.querySelector('.dealerAddCard')
const addCard = document.querySelector('.twisted')
const twist = document.querySelector('.twist')
const stick = document.querySelector('.stick')
const twistAgain = document.querySelector('.twistAgain')
const finish = document.querySelector('.finish')
const result = document.querySelector('.result')
const newGame = document.querySelector('.newGame')

hideInstructions.addEventListener('click', function () {
    instructions.classList.add('hidden')
    showInstructions.classList.remove('hidden')
})

showInstructions.addEventListener('click', function () {
    instructions.classList.remove('hidden')
    showInstructions.classList.add('hidden')
})

deal.addEventListener('click', function () {
    playerCards.classList.remove('hidden')
    dealer.classList.remove('hidden')
    addCard.classList.remove('hidden')
    stick.classList.remove('hidden')
    document.getElementById("deal").disabled = true
})

fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=8').then(function (res) {
    return res.json()
}).then(function (data) {

    const cards = [
        data.cards[0].value,
        data.cards[1].value,
        data.cards[2].value,
        data.cards[3].value,
        data.cards[4].value,
        data.cards[5].value,
        data.cards[6].value,
        data.cards[7].value
    ]

    let cardScores = []
    for (let i = 0; i < cards.length; i++) {
        let score = 0
        if (cards[i] === 'JACK' || cards[i] === 'QUEEN' || cards[i] === 'KING') {
            score = 10
        }

        else if (cards[i] === 'ACE') {
            score = 11
        }

        else { score = Number(cards[i]) }

        cardScores.push(score)
    }

    playerTotal = cardScores[0] + cardScores[1]
    dealerTotal = cardScores[2] + cardScores[3]
    let playerTotalTwist = cardScores[0] + cardScores[1] + cardScores[4]
    if ((playerTotalTwist > 21 || playerTotalTwist <= 16) && (cardScores[0] === 11 || cardScores[1] === 11 || cardScores[4] === 11)) {
        playerTotalTwist = playerTotalTwist - 10
    }
    let dealerTotalTwist = cardScores[2] + cardScores[3] + cardScores[5]
    if ((dealerTotalTwist > 21 || dealerTotalTwist <= 16) && (cardScores[2] === 11 || cardScores[3] === 11 || cardScores[5] === 11)) {
        dealerTotalTwist = dealerTotalTwist - 10
    }

    let playerTotalFour = cardScores[0] + cardScores[1] + cardScores[4] + cardScores[6]
    if (playerTotalFour > 21 && (cardScores[2] === 11 || cardScores[3] === 11 || cardScores[5] === 11 || cardScores[6] === 11)) {
        playerTotalFour = playerTotalFour - 10
    }
    let dealerTotalFour = cardScores[2] + cardScores[3] + cardScores[5] + cardScores[7]
    if (dealerTotalFour > 21 && (cardScores[2] === 11 || cardScores[3] === 11 || cardScores[5] === 11 || cardScores[7] === 11)) {
        dealerTotalFour = dealerTotalFour - 10
    }

    let playerScore = playerTotal
    let dealerScore = dealerTotal

    playerCards.innerHTML += `
        <div class="playerCards">
            <img src="${data.cards[0].image}" alt="${data.cards[0].value} of ${data.cards[0].suit}" class="max-w-48">
        </div>
        <div class="playerCards">
            <img src="${data.cards[1].image}" alt="${data.cards[1].value} of ${data.cards[1].suit}" class="max-w-48">
        </div>
        <div class="thirdCard hidden">
            <img src="${data.cards[4].image}" alt="${data.cards[4].value} of ${data.cards[4].suit}" class="max-w-48">
        </div>
        <div class="fourthCard hidden">
            <img src="${data.cards[6].image}" alt="${data.cards[6].value} of ${data.cards[6].suit}" class="max-w-48">
        </div>`

    dealer.innerHTML += `
        <div>
            <img src="${data.cards[2].image}" alt="${data.cards[2].value} of ${data.cards[2].suit}" class="mt-11 max-w-48">
        </div>
        <div>
            <img src="${data.cards[3].image}" alt="${data.cards[3].value} of ${data.cards[3].suit}" class="mt-11 max-w-48">
        </div>
        <div class="dealerThirdCard hidden">
            <img src="${data.cards[5].image}" alt="${data.cards[5].value} of ${data.cards[5].suit}" class="mt-11 max-w-48">
        </div>
        <div class="dealerFourthCard hidden">
            <img src="${data.cards[7].image}" alt="${data.cards[7].value} of ${data.cards[7].suit}" class="mt-11 max-w-48">
        </div>`

    stick.addEventListener('click', function () {
        stick.classList.add('hidden')
        twisted.classList.add('hidden')
        finish.classList.remove('hidden')
        if (dealerTotal <= 16) {
            document.querySelector('.dealerThirdCard').classList.remove('hidden')
            dealerScore = dealerTotalTwist
        }
        else { dealerScore = dealerTotal }
    })

    twisted.addEventListener('click', function () {
        document.querySelector('.thirdCard').classList.remove('hidden')
        twisted.classList.add('hidden')
        stick.classList.add('hidden')
        finish.classList.remove('hidden')
        twistAgain.classList.remove('hidden')
        playerScore = playerTotalTwist

        if (dealerTotal <= 16) {
            document.querySelector('.dealerThirdCard').classList.remove('hidden')
            dealerScore = dealerTotalTwist
        }
        else { dealerScore = dealerTotal }
    })

    twistAgain.addEventListener('click', function () {
        document.querySelector('.fourthCard').classList.remove('hidden')
        playerScore = playerTotalFour
    })

    finish.addEventListener('click', function () {
        result.classList.remove('hidden')
        newGame.classList.remove('hidden')
        twistAgain.classList.add('hidden')
        finish.classList.add('hidden')

        if (dealerScore <= 16 && playerScore <= 21) {
            document.querySelector('.dealerFourthCard').classList.remove('hidden')
            dealerScore = dealerTotalFour
        }

        return finalScore()
    })

    function finalScore() {

        if (playerScore > 21 && dealerScore <= 21) {
            return result.innerHTML += `
        <p>You scored ${playerScore}</p>
                <p>Dealer scored ${dealerScore}</p>
                <h6 class="p-2 text-8xl font-bold text-amber-400">
                You've gone bust, dealer wins</h6>`
        }

        if (dealerScore > 21 && playerScore <= 21) {
            return result.innerHTML += `
                <p>You scored ${playerScore}</p>
                <p>Dealer scored ${dealerScore}</p>
                <h6 class="p-2 text-8xl font-bold text-amber-400">
                Dealer is bust, you win!</h6>`
        }

        if (dealerScore > 21 && playerScore > 21) {
            return result.innerHTML += `
                <p>You scored ${playerScore}</p>
                <p>Dealer scored ${dealerScore}</p>
                <h6 class="p-2 text-8xl font-bold text-amber-400">
                You're both bust, no one wins!</h6>`
        }

        if (playerScore > dealerScore) {
            return result.innerHTML += `
        <p>You scored ${playerScore}</p>
                <p>Dealer scored ${dealerScore}</p>
                <h6 class="p-2 text-8xl font-bold text-amber-400">
                Player wins!</h6>`
        }
        else if (playerScore < dealerScore) {
            return result.innerHTML += `
        <p>You scored ${playerScore}</p>
                <p>Dealer scored ${dealerScore}</p>
                <h6 class="p-2 text-8xl font-bold text-amber-400">
                Dealer wins!</h6>`
        }
        else {
            return result.innerHTML += `
        <p>You scored ${playerScore}</p>
                <p>Dealer scored ${dealerScore}</p>
                <h6 class="p-2 text-8xl font-bold text-amber-400">
                It's a draw!</h6>`
        }
    }
})
