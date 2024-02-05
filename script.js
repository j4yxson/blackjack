/*
Rules of Blackjack
- deck must be shuffled after every round
- card values are num values until face cards at which point they are 10, a = 1 or 11
- dealer stands at 17 or above
- splitting is allowed
- cards are dealt top down
*/




// deck of cards values
const deckOfCards = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'JACK': 10, // Jack
    'QUEEN': 10, // Queen
    'KING': 10, // King
    'ACE': [1, 11] // Ace can be 1 or 10 if you make value [1,10];
};


//get 2 cards

// initializing the dealerCards and playerCards area
dealerCards = document.querySelector(".dealerCards");
playerCards = document.querySelector(".playerCards");
placeholderCard = document.querySelector(".placeholder");

//initiailzing messages
loseMessage = document.querySelector(".lose");
winMessage = document.querySelector(".win");
blackjackMessage = document.querySelector(".blackjack");
pushMessage = document.querySelector(".push");
dealerBust = document.querySelector('.dealerBust')

let deck_id;
let playerChoice;
let cards = [1];
hitButton = document.querySelector(".hit");
standButton = document.querySelector(".stand");
playAgainButton = document.querySelector(".playAgain")

//totals section
playerTotal = document.querySelector(".playerTotal");
dealerTotal = document.querySelector(".dealerTotal");
finalTotal = document.querySelector(".finalTotal")
pTotalArray = [];
dTotalArray = [];
pulledCards = [];
test = [1, 2];

fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        deck_id = data.deck_id; // Assign the deck_id from the response
    })
    .then(() => {
        // Use the obtained deck_id to draw cards
        fetch(`https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=52`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                cards = data['cards'];


                dealerCard = document.createElement("img"); // creating the dealer card img element
                dealerCard.src = (cards[0]['image']); // adding the image to the img element

                // pushing card values into an array to track for "ACE"
                pulledCards.push(cards[0]['value']);
                pulledCards.push(cards[1]['value']);
                pulledCards.push(cards[2]['value']);

                playerCard1 = document.createElement("img"); // creating first player card
                playerCard1.src = (cards[1]['image']); // assigning the image to the card element

                playerCard2 = document.createElement("img"); //  creating the 2nd player card
                playerCard2.src = (cards[2]['image']); // assigning the image to the card element

                // total value section of playerCards
                if ((pulledCards[1] == "ACE" && pulledCards[2] !== "ACE")) {

                    playerChoice1 = (1 + deckOfCards[cards[2]['value']]);
                    playerChoice2 = (11 + deckOfCards[cards[2]['value']]);
                    playerTotal.innerHTML = playerChoice1 + " or " + playerChoice2;
                    if (playerTotal.innerHTML == '11 or 21') {
                        playerTotal.innerHTML = 21;
                    }

                } else if ((pulledCards[2] == "ACE" && pulledCards[1] !== "ACE")) {

                    playerChoice1 = (1 + deckOfCards[cards[1]['value']]);
                    playerChoice2 = (11 + deckOfCards[cards[1]['value']]);
                    playerTotal.innerHTML = playerChoice1 + " or " + playerChoice2;

                    if (playerTotal.innerHTML == '11 or 21') {
                        playerTotal.innerHTML = 21;
                    }

                } else if (pulledCards[1] && pulledCards[2] == "ACE") {
                    playerChoice = 12;
                    playerTotal.innerHTML = playerChoice;
                }
                else {
                    pTotalArray.push(deckOfCards[cards[1]['value']]);
                    pTotalArray.push(deckOfCards[cards[2]['value']]);

                    playerChoice = pTotalArray.reduce((a, c) => a + c); // adding the values in the array
                    playerTotal.innerHTML = playerChoice;
                }




                // total value section of dealerCards
                if (pulledCards[0] == "ACE") {
                    dTotalArray.push(deckOfCards[cards[0]['value']]);
                    dealerTotal.innerHTML = "1 or 11";
                } else {
                    dealerPulledCard = deckOfCards[cards[0]['value']];
                    dTotalArray.push(deckOfCards[cards[0]['value']]); // pushing the value of the dealers card into the dealer array
                    dealerTotal.innerHTML = dealerPulledCard;
                }



                // appending the initial hand state of the game
                dealerCards.prepend(dealerCard); // appending it as the first child for aesthetics
                playerCards.appendChild(playerCard1);
                playerCards.appendChild(playerCard2);

                // removing the first 3 from the cards array (cards array has all the cards from the deck randomized)
                cards.splice(0, 3); // from index 0, remove the next 3 cards



                if (playerTotal.innerHTML == 21) {
                    blackjackMessage.style.display = "initial";
                    // location.reload();
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });

hitButton.addEventListener("click", () => {
    playerCard = document.createElement("img"); // creating player card
    playerCard.src = (cards[0]['image']); // assigning the image to the card element

    playerCards.appendChild(playerCard); //appending the card to the playerCard area

    if (pulledCards[1] == "ACE" || pulledCards[2] == "ACE") {
        playerChoice1 = playerChoice1 + deckOfCards[cards[0]['value']];
        playerChoice2 = playerChoice2 + deckOfCards[cards[0]['value']];
        playerTotal.innerHTML = playerChoice1 + " or " + playerChoice2
    } else if (cards[0]['value'] == "ACE" && (pulledCards[1] == "ACE" || pulledCards[2] == "ACE")) {
        playerChoice1 = playerChoice1 + deckOfCards[cards[0]['value']];
        playerChoice2 = playerChoice2 + deckOfCards[cards[0]['value']];
        playerTotal.innerHTML = playerChoice1 + " or " + playerChoice2
    }
    else {
        playerChoice = playerChoice + deckOfCards[cards[0]['value']];
        playerTotal.innerHTML = playerChoice;

        cards.splice(0, 1); // removing the used card from the remaining deck
    }

    if (playerTotal.innerHTML > 21) {
        finalTotal.innerHTML = "YOU LOST :C";
        standButton.style.display = "none";
        hitButton.style.display = 'none';
        playAgainButton.style.display = "initial";
    }
});

standButton.addEventListener("click", () => {
    hitButton.style.display = "none";
    standButton.style.display = 'none';

    if (playerTotal.innerHTML == "21") {
        finalTotal.innerHTML = "You stood at 21";
    } else
        finalTotal.innerHTML = "You stood at " + playerTotal.innerHTML;
    secondDealerCard = document.querySelector('.placeholder');
    secondDealerCard.remove();
    dealerDraws();

    if (dealerTotal.innerHTML < 22 && dealerTotal.innerHTML > playerTotal.innerHTML) {
        loseMessage.style.display = "initial";
        playAgainButton.style.display = "initial";
    }
    if (playerTotal.innerHTML < 22 && playerTotal.innerHTML > dealerTotal.innerHTML) {
        winMessage.style.display = "initial";
        playAgainButton.style.display = "initial";
    }
    if (playerTotal.innerHTML === dealerTotal.innerHTML) {
        pushMessage.style.display = "initial";
        playAgainButton.style.display = "initial";
    }
    if (finalTotal.innerHTML == "You Lost! :c") {
        loseMessage.style.display = "initial";
        playAgainButton.style.display = "initial";
    }
    if (dealerTotal > 21) {
        playAgainButton.style.display = "initial";
        dealerBust.style.display = "initial";
    }

});

playAgainButton.addEventListener("click", () => {
    window.location.reload();
})

function dealerDraws() {
    newDealerCard = document.createElement("img");
    newDealerCard.src = (cards[0]['image']);
    dealerCards.appendChild(newDealerCard);

    dealerTotal.innerHTML = (deckOfCards[cards[0]['value']] + parseInt(dealerTotal.innerHTML));
    cards.splice(0, 1);

    if (dealerTotal.innerHTML < 17) {
        dealerDraws();
    }
};
