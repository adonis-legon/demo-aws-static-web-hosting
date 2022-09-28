/*jslint es6 */

const selectGame = document.getElementById("selectGame");
const headerGame = document.getElementById("headerGame");
const spanStatus = document.getElementById("spanStatus");
const btnRoll = document.getElementById("btnRoll");
const divJenga = document.getElementById("divJenga");
const divCard = document.getElementById("divCard");

const RESET_CURRENT_MOVE = -1;

const nextMoveStrategies = {
  Simple_Random: 1,
  Disctint_Random: 2,
};

// Games
const games = {
  Jenga: {
    id: 1,
    name: "jenga",
    nameSpanish: "Jenga",
    nextMoveStrategy: nextMoveStrategies.Disctint_Random,
  },
  Dice1_6: {
    id: 2,
    name: "dice1_6",
    nameSpanish: "Dados 1-6",
    nextMoveStrategy: nextMoveStrategies.Simple_Random,
  },
};

var selectedGame = games.Jenga;

var rollingDice = false;

// Jenga
var currentJengaColor,
  emptyJengaColor = "white";
const jengaColors = [
  {
    name: "blue",
    nameSpanish: "Azul",
  },
  {
    name: "red",
    nameSpanish: "Rojo",
  },
  {
    name: "yellow",
    nameSpanish: "Amarillo",
  },
];

// Dice
var currentDice1To6Face = 0;
var currentDice1To6FaceEl = null;
const dices1To6 = [
  {
    nameSpanish: "Uno",
  },
  {
    nameSpanish: "Dos",
  },
  {
    nameSpanish: "Tres",
  },
  {
    nameSpanish: "Cuatro",
  },
  {
    nameSpanish: "Cinco",
  },
  {
    nameSpanish: "Seis",
  },
];

const init = () => {
  initMenu();

  changeGame(games.Jenga);
};

const initMenu = () => {
  option = document.createElement("option");
  option.setAttribute("disabled", true);
  option.setAttribute("selected", true);
  option.value = selectedGame.id;
  headerGame.innerHTML = option.innerHTML = selectedGame.nameSpanish;
  selectGame.appendChild(option);

  Object.entries(games).forEach((kv) => {
    option = document.createElement("option");
    option.value = kv[1].id;
    option.innerHTML = kv[1].nameSpanish;
    selectGame.appendChild(option);
  });
};

const getGameById = (id) => {
  return Object.entries(games).filter((kv) => kv[1].id === id)[0][1];
};

const changeGame = (game) => {
  spanStatus.innerHTML = "Lanza el dado";

  // Jenga
  divJenga.style.display = "none";

  // Dice 1-6
  document
    .querySelectorAll(".dice")
    .forEach((dice) => (dice.style.display = "none"));

  selectedGame = game;
  currentMove = RESET_CURRENT_MOVE;
  headerGame.innerHTML = selectedGame.nameSpanish;

  switch (selectedGame) {
    case games.Jenga:
      divJenga.style.display = "block";
      divJenga.classList.replace(currentJengaColor, emptyJengaColor);
      currentJengaColor = emptyJengaColor;
      break;
    case games.Dice1_6:
      currentDice1To6Face = 0;
      currentDice1To6FaceEl = document.getElementById(
        "diceFace" + currentDice1To6Face
      );
      currentDice1To6FaceEl.style.display = "block";
      break;
    default:
      break;
  }
};

var currentMove = RESET_CURRENT_MOVE;
const getNextMove = (maxMoves, game) => {
  switch (game.nextMoveStrategy) {
    case nextMoveStrategies.Disctint_Random:
      var availableMoves = [];
      for (let i = 0; i < maxMoves; i++) {
        if (i != currentMove) {
          availableMoves.push(i);
        }
      }

      currentMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      return currentMove;
    case nextMoveStrategies.Simple_Random:
    default:
      return Math.floor(Math.random() * maxMoves);
  }
};

const rollDice = (e) => {
  e.preventDefault();

  if (!startRollDice()) {
    return;
  }

  switch (selectedGame) {
    case games.Jenga:
      divJenga.classList.replace(currentJengaColor, emptyJengaColor);
      currentJengaColor = emptyJengaColor;

      setTimeout(() => {
        newColorPos = getNextMove(jengaColors.length, selectedGame);
        newColor = jengaColors[newColorPos].name;

        divJenga.classList.replace(currentJengaColor, newColor);
        spanStatus.innerText = jengaColors[newColorPos].nameSpanish;

        currentJengaColor = newColor;

        finishRollDice();
      }, 500);
      break;
    case games.Dice1_6:
      currentDice1To6FaceEl.style.display = "none";
      document.getElementById("diceFace0").style.display = "flex";

      setTimeout(() => {
        document.getElementById("diceFace0").style.display = "none";

        currentDice1To6Face = getNextMove(dices1To6.length, selectedGame);
        currentDice1To6FaceEl = document.getElementById(
          "diceFace" + (currentDice1To6Face + 1)
        );
        currentDice1To6FaceEl.style.display = "flex";
        spanStatus.innerText = dices1To6[currentDice1To6Face].nameSpanish;

        finishRollDice();
      }, 500);
      break;
    default:
      finishRollDice();
      break;
  }
};

const startRollDice = () => {
  if (!rollingDice) {
    rollingDice = true;
    spanStatus.innerText = "Lanzando...";
    btnRoll.classList.add("disabled");
    return true;
  }

  return false;
};

const finishRollDice = () => {
  if (rollingDice) {
    btnRoll.classList.remove("disabled");
    rollingDice = false;
  }
};

document.addEventListener("DOMContentLoaded", (e) => {
  init();
});

btnRoll.addEventListener("click", (e) => {
  rollDice(e);
});

divCard.addEventListener("click", (e) => {
  rollDice(e);
});

selectGame.addEventListener("change", (e) => {
  changeGame(getGameById(parseInt(e.target.value)));
});
