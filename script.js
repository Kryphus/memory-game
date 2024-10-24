const startGameContainer = document.querySelector(".startGame"),
    startGameCards = document.querySelectorAll(".startGame .card"),
    startGame = document.querySelector(".startGame button"),
    playground = document.querySelector(".playground"),
    faRepeat = document.querySelector(".new-game");
header = document.querySelector("header");
scoreBoard = document.querySelector(".scoreBoard");
winnerBanner = document.querySelector(".winner-banner")


let levels = 2,
    columns = 2,
    rows = 2,
    matched = 0,
    cardOne,
    cardTwo,
    IsPreventClick = true;

let timeElapsed = 0,
    moves = 0,
    timerInterval;

startGameCards.forEach((element) => {
    element.addEventListener("click", (e) => {
        startGameCards.forEach((el) => {
            el.classList.remove("active");
        })



        e.target.parentElement.classList.add("active");
        levels = e.target.parentElement.getAttribute("level");
        columns = e.target.parentElement.getAttribute("column");
        rows = e.target.parentElement.getAttribute("row");
        console.log(levels, columns, rows);
    });
});

startGame.addEventListener("click", (e) => {
    startGameContainer.style.display = "none";
    playground.style.display = "grid";
    playground.style.gridTemplateColumns = `repeat(${columns}, 150px)`;
    playground.style.gridTemplateRows = `repeat(${rows}, 180px)`;
    header.style.display = "none";
    scoreBoard.style.display = "flex";
    scoreBoard.classList.remove('hidden');

    moves = 0;
    document.getElementById('moves').textContent = moves;
    resetTimer();
    startTimer();

    createCards();
});

function createCards() {
    const cardArr = [
        "img/baron033.jpg",
        "img/chihiro019.jpg",
        "img/howl014.jpg",
        "img/kazetachinu014.jpg",
        "img/kimitachi015.jpg",
        "img/ponyo036.jpg",
        "img/totoro030.jpg",
        "img/umi002.jpg"
    ];
    shuffleArray(cardArr);
    shuffleCards([...cardArr.slice(0, levels), ...cardArr.slice(0, levels)])
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;


    }
}

function shuffleCards(cards) {
    playground.innerHTML = "";
    shuffleArray(cards);

    for (let i = 0; i < cards.length; i++) {
        playground.innerHTML += `
        <div class="card" onclick = 'flipCard(this)'>
            <div class="front">
                <img src="./img/back.png" alt="Card back" />
            </div>
            <div class="back">
                <img src="${cards[i]}" alt="Memory card" />
            </div>
        </div>
        `;
    }

    faRepeat.style.display = "block";
}

function flipCard(card) {
    if (cardOne != card && IsPreventClick) {
        card.classList.add('flip');

        if (!cardOne) {
            cardOne = card;
            return;
        }
        cardTwo = card;
        IsPreventClick = false;

        moves++;
        document.getElementById('moves').textContent = moves;

        let cardOneValue = cardOne.querySelector(".back").innerHTML,
            cardTwoValue = cardTwo.querySelector(".back").innerHTML
        matchCards(cardOneValue, cardTwoValue);

    }
}

function matchCards(cardOneValue, cardTwoValue) {
    if (cardOneValue == cardTwoValue) {

        matched++;
        if (matched == levels) {

            setTimeout(() => {
                winnerBanner.classList.remove('hidden');

                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }  // 0.6 is better than 1.2 as it starts from middle of screen
                });
            }, 500)
            clearInterval(timerInterval)

        }

        cardOne.classList.add("match");
        cardTwo.classList.add("match");

        cardOne.removeAttribute("onclick")
        cardTwo.removeAttribute("onclick");

        cardOne = "", cardTwo = "";
        IsPreventClick = true;
        return;
    }

    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 500)

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        (cardOne = ""), (cardTwo = "");
        IsPreventClick = true;
    }, 1200)
}

faRepeat.addEventListener("click", () => {
    startGameContainer.style.display = "grid";
    playground.style.display = "none";
    faRepeat.style.display = "none";
    header.style.display = "flex";
    scoreBoard.classList.add('hidden');
    winnerBanner.classList.add('hidden');

    clearInterval(timerInterval);
    moves = 0;
    timeElapsed = 0;
    document.getElementById('moves').textContent = moves;
    document.getElementById('time').textContent = "0:00";

    (matched = 0), (cardOne = ""), (cardTwo = ""), (IsPreventClick = true)
})

//Timer and moves functionality

function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        updateTimer();
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('time').textContent = formattedTime;
}

function resetTimer() {
    clearInterval(timerInterval);
    timeElapsed = 0;
    updateTimer();
}

