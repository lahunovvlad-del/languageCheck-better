let wordSets = {
    easy: [
        { en: "always", ua: "завжди" },
        { en: "never", ua: "ніколи" },
        { en: "dog", ua: "собака" },
        { en: "water", ua: "вода" },
        { en: "book", ua: "книга" },
        { en: "school", ua: "школа" },
        { en: "city", ua: "місто" },
        { en: "window", ua: "вікно" },
        { en: "bread", ua: "хліб" },
        { en: "table", ua: "стіл" }
    ],
    medium: [
        { en: "journey", ua: "подорож" },
        { en: "knowledge", ua: "знання" },
        { en: "weather", ua: "погода" },
        { en: "advice", ua: "порада" },
        { en: "decision", ua: "рішення" },
        { en: "purpose", ua: "мета" },
        { en: "memory", ua: "пам'ять" },
        { en: "freedom", ua: "свобода" },
        { en: "mistake", ua: "помилка" },
        { en: "success", ua: "успіх" }
    ],
    hard: [
        { en: "environment", ua: "довкілля" },
        { en: "responsibility", ua: "відповідальність" },
        { en: "achievement", ua: "досягнення" },
        { en: "opportunity", ua: "можливість" },
        { en: "consequence", ua: "наслідок" },
        { en: "requirement", ua: "вимога" },
        { en: "circumstance", ua: "обставина" },
        { en: "development", ua: "розвиток" },
        { en: "experience", ua: "досвід" },
        { en: "confidence", ua: "впевненість" }
    ]
};

let words = [];
let current = 0;
let rightCount = 0;
let wrongCount = 0;
let answered = 0;
let results = [];
let answers = [];

function mixWords() {
    for (let i = words.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = words[i];
        words[i] = words[j];
        words[j] = temp;
    }
}

function startGame() {
    let level = $("input[name='difficulty']:checked").val();
    if (!wordSets[level]) {
        level = "easy";
    }
    words = wordSets[level].slice();

    mixWords();
    current = 0;
    rightCount = 0;
    wrongCount = 0;
    answered = 0;
    results = [];
    answers = [];
    for (let i = 0; i < words.length; i++) {
        results[i] = null;
        answers[i] = "";
    }
    $("#right").text(0);
    $("#wrong").text(0);
    showCard();
}

function showCard() {
    $("#word").text(words[current].en);
    $("#step").text((current + 1) + "/" + words.length);
    $("#error").text("");
    $("#card").removeClass("right wrong");
    $("#answer").val(answers[current]);

    if (results[current] === null) {
        $("#answer").prop("disabled", false);
    } else {
        $("#answer").prop("disabled", true);
        if (results[current]) {
            $("#card").addClass("right");
        } else {
            $("#card").addClass("wrong");
        }
    }
}

function checkWord() {
    if (results[current] !== null) {
        return;
    }

    let text = $("#answer").val().trim().toLowerCase();

    // валідація
    if (text === "") {
        $("#error").text("Введіть переклад слова");
        return;
    }
    if (!/^[а-яіїєґ'’ -]+$/.test(text)) {
        $("#error").text("Використовуйте лише українські літери");
        return;
    }

    $("#error").text("");
    $("#answer").prop("disabled", true);
    answers[current] = text;
    answered++;

    if (text === words[current].ua) {
        results[current] = true;
        rightCount++;
        $("#card").addClass("right");
        $("#right").text(rightCount);
    } else {
        results[current] = false;
        wrongCount++;
        $("#card").addClass("wrong");
        $("#wrong").text(wrongCount);
    }

    if (answered === words.length) {
        setTimeout(showModal, 800);
    }
}

function showModal() {
    let percent = rightCount / words.length * 100;
    let level;

    if (percent >= 90) {
        level = "Високий";
    } else if (percent >= 70) {
        level = "Вище середнього";
    } else if (percent >= 40) {
        level = "Середній";
    } else {
        level = "Початковий";
    }

    $("#level").text(level);
    $("#result").text("Вірно: " + rightCount + " з " + words.length);
    $("#modal").fadeIn();
}

$(function () {
    startGame();

    $("input[name='difficulty']").change(function () {
        startGame();
    });

    $("#card").click(checkWord);

    $("#answer").keydown(function (e) {
        if (e.which === 13) {
            checkWord();
        }
    });

    $("#next").click(function () {
        if (current < words.length - 1) {
            current++;
            showCard();
        }
    });

    $("#prev").click(function () {
        if (current > 0) {
            current--;
            showCard();
        }
    });

    $("#again").click(function () {
        $("#modal").fadeOut();
        startGame();
    });
});