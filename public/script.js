const initialTeamsMap = {
  nhl: {
    round1: [
      ['Bruins', 'Panthers'],
      ['Maple Leafs', 'Lightning'],
      ['Hurricanes', 'Islanders'],
      ['Devils', 'Rangers'],
      ['Golden Knights', 'Jets'],
      ['Oilers', 'Kings'],
      ['Avalanche', 'Kraken'],
      ['Stars', 'Wild']
    ]
  }
};

let selectedSport = localStorage.getItem('selectedSport') || 'nhl';
let bracketData = JSON.parse(JSON.stringify(initialTeamsMap[selectedSport]));
const rounds = ['round1', 'round2', 'round3', 'finals', 'champion'];

function saveBracket() {
  localStorage.setItem("nhlBracket", JSON.stringify(bracketData));
  localStorage.setItem("selectedSport", selectedSport);
}

function loadBracket() {
  const saved = localStorage.getItem("nhlBracket");
  if (saved) {
    bracketData = JSON.parse(saved);
  }
}

function createBracket() {
  const bracket = document.getElementById('bracket');
  bracket.innerHTML = '';

  rounds.forEach((round, index) => {
    const roundDiv = document.createElement('div');
    roundDiv.className = 'round';

    const matchups = bracketData[round] || [];

    // Ensure the round has correct number of matchups
    const expectedMatchups = Math.pow(2, 3 - index);
    for (let i = 0; i < expectedMatchups; i++) {
      if (!matchups[i]) {
        matchups[i] = [null, null];
      }
    }

    bracketData[round] = matchups;

    matchups.forEach((pair, matchIndex) => {
      const matchupContainer = document.createElement('div');
      matchupContainer.className = 'matchup-container';

      if (Array.isArray(pair)) {
        pair.forEach(team => {
          const div = document.createElement('div');
          div.className = 'matchup';
          if (team) {
            div.textContent = team;
            div.onclick = () => selectWinner(round, matchIndex, team);
          } else {
            div.textContent = "TBD";
          }
          matchupContainer.appendChild(div);
        });
      } else if (pair) {
        const div = document.createElement('div');
        div.className = 'matchup selected';
        div.textContent = pair;
        matchupContainer.appendChild(div);
      }

      roundDiv.appendChild(matchupContainer);
    });

    bracket.appendChild(roundDiv);
  });
}

function selectWinner(round, matchIndex, team) {
  const currentMatchups = bracketData[round];
  const nextRound = rounds[rounds.indexOf(round) + 1];

  if (!bracketData[nextRound]) {
    bracketData[nextRound] = [];
  }

  bracketData[nextRound][Math.floor(matchIndex / 2)] =
    bracketData[nextRound][Math.floor(matchIndex / 2)] || [];

  bracketData[nextRound][Math.floor(matchIndex / 2)][matchIndex % 2] = team;
  currentMatchups[matchIndex] = team;

  saveBracket();
  createBracket();
}

function resetBracket() {
  bracketData = JSON.parse(JSON.stringify(initialTeamsMap[selectedSport]));
  localStorage.removeItem("nhlBracket");
  createBracket();
}

document.addEventListener("DOMContentLoaded", () => {
  const controls = document.querySelector(".controls");

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset";
  resetBtn.onclick = resetBracket;

  controls.appendChild(resetBtn);

  loadBracket();
  createBracket();
});
