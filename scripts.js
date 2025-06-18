const teams = ["Chris", "Ndamburi", "GG", "Clemo", "Hajji", "Kevoh", "Johnte", "Symo"];
let standings = {};
let fixtures = [];

function initStandings() {
    teams.forEach(team => {
        standings[team] = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
    });
}

function generateFixtures() {
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            fixtures.push({ home: teams[i], away: teams[j], homeGoals: null, awayGoals: null });
        }
    }
    if (localStorage.getItem("fixtures")) {
        fixtures = JSON.parse(localStorage.getItem("fixtures"));
        standings = JSON.parse(localStorage.getItem("standings"));
    }
}

function updateStandings() {
    initStandings();
    fixtures.forEach(match => {
        if (match.homeGoals !== null && match.awayGoals !== null) {
            let h = match.home, a = match.away;
            let hg = parseInt(match.homeGoals), ag = parseInt(match.awayGoals);

            standings[h].P++; standings[a].P++;
            standings[h].GF += hg; standings[h].GA += ag;
            standings[a].GF += ag; standings[a].GA += hg;

            if (hg > ag) { standings[h].W++; standings[a].L++; standings[h].Pts += 3; }
            else if (hg < ag) { standings[a].W++; standings[h].L++; standings[a].Pts += 3; }
            else { standings[h].D++; standings[a].D++; standings[h].Pts++; standings[a].Pts++; }
        }
    });
    for (let team in standings) {
        standings[team].GD = standings[team].GF - standings[team].GA;
    }
    localStorage.setItem("fixtures", JSON.stringify(fixtures));
    localStorage.setItem("standings", JSON.stringify(standings));
}

function renderStandings() {
    let table = document.getElementById("table-body");
    if (!table) return;
    table.innerHTML = "";
    let sorted = Object.entries(standings).sort((a, b) => b[1].Pts - a[1].Pts || b[1].GD - a[1].GD);
    sorted.forEach(([team, stats], i) => {
        table.innerHTML += `<tr>
            <td>${i + 1}</td><td>${team}</td><td>${stats.P}</td><td>${stats.W}</td>
            <td>${stats.D}</td><td>${stats.L}</td><td>${stats.GF}</td><td>${stats.GA}</td>
            <td>${stats.GD}</td><td>${stats.Pts}</td>
        </tr>`;
    });
}

function renderFixtures() {
    let container = document.getElementById("fixture-list");
    if (!container) return;
    container.innerHTML = "";
    fixtures.forEach((match, i) => {
        container.innerHTML += `<div>
            ${match.home} vs ${match.away} —
            <input type="number" min="0" id="hg${i}" value="${match.homeGoals ?? ''}">
            -
            <input type="number" min="0" id="ag${i}" value="${match.awayGoals ?? ''}">
            <button onclick="submitScore(${i})">Submit</button>
        </div>`;
    });
}

function submitScore(index) {
    const hg = document.getElementById("hg" + index).value;
    const ag = document.getElementById("ag" + index).value;
    if (hg !== "" && ag !== "") {
        fixtures[index].homeGoals = parseInt(hg);
        fixtures[index].awayGoals = parseInt(ag);
        updateStandings();
        renderStandings();
        renderFixtures();
    }
}

function resetLeague() {
    if (confirm("Reset all league data?")) {
        localStorage.clear();
        location.reload();
    }
}

initStandings();
generateFixtures();
updateStandings();
renderStandings();
renderFixtures();
