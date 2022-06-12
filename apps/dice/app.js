const selectGame = document.getElementById("selectGame");
const headerGame = document.getElementById("headerGame");
const spanStatus = document.getElementById("spanStatus");
const btnRoll = document.getElementById("btnRoll");
const divJenga = document.getElementById("divJenga");

var selectedGame = 1;
const games = [
  {
    name: "jenga",
    nameSpanish: "Jenga",
    value: 1,
  },
  {
    name: "dice1_6",
    nameSpanish: "Dados 1-6",
    value: 2,
  },
];

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
var currentDice16Face = 0;
var currentDice16FaceEl = null;
const dices16 = [
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

  changeGame(1);
};

const initMenu = () => {
  option = document.createElement("option");
  option.setAttribute("disabled", true);
  option.setAttribute("selected", true);
  option.value = games[selectedGame - 1].value;
  headerGame.innerHTML = option.innerHTML = games[selectedGame - 1].nameSpanish;
  selectGame.appendChild(option);

  games.forEach((game) => {
    option = document.createElement("option");
    option.value = game.value;
    option.innerHTML = game.nameSpanish;
    selectGame.appendChild(option);
  });
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
  headerGame.innerHTML = games[selectedGame - 1].nameSpanish;

  switch (selectedGame) {
    case 1:
      divJenga.style.display = "block";
      divJenga.classList.replace(currentJengaColor, emptyJengaColor);
      currentJengaColor = emptyJengaColor;
      break;
    case 2:
      currentDice16Face = 0;
      currentDice16FaceEl = document.getElementById(
        "diceFace" + currentDice16Face
      );
      currentDice16FaceEl.style.display = "block";
      break;
    default:
      break;
  }
};

const rollDice = () => {
  spanStatus.innerText = "Lanzando...";
  switch (selectedGame) {
    case 1:
      divJenga.classList.replace(currentJengaColor, emptyJengaColor);
      currentJengaColor = emptyJengaColor;

      setTimeout(() => {
        newColorPos = Math.floor(Math.random() * jengaColors.length);
        newColor = jengaColors[newColorPos].name;

        divJenga.classList.replace(currentJengaColor, newColor);
        spanStatus.innerText = jengaColors[newColorPos].nameSpanish;

        currentJengaColor = newColor;
      }, 500);
      break;
    case 2:
      currentDice16FaceEl.style.display = "none";
      document.getElementById("diceFace0").style.display = "flex";

      setTimeout(() => {
        document.getElementById("diceFace0").style.display = "none";

        currentDice16Face = Math.floor(Math.random() * 6) + 1;
        currentDice16FaceEl = document.getElementById(
          "diceFace" + currentDice16Face
        );
        currentDice16FaceEl.style.display = "flex";
        spanStatus.innerText = dices16[currentDice16Face - 1].nameSpanish;
      }, 500);
      break;
    default:
      break;
  }
};

document.addEventListener("DOMContentLoaded", (e) => {
  init();
});

btnRoll.addEventListener("click", (e) => {
  e.preventDefault();
  rollDice();
});

selectGame.addEventListener("change", (e) => {
  changeGame(parseInt(e.target.value));
});
