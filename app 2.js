const holes = [
  {
    number: 1,
    pub: "The Brazen Head",
    par: 4,
    rule: "No phones at the table.",
    scoreGuide: [
      { label: "Bogey", detail: "Failed Par", icon: "⚠️" },
      { label: "Par", detail: "Pint of Guinness", icon: "🍺" },
      { label: "Birdie", detail: "Pint of Guinness + shot of Jager", icon: "🍺🥃" },
      { label: "Hole in 1", detail: "Pint of Guinness + 2 Baby Guinness", icon: "🍺🥃🥃" }
    ]
  },
  {
    number: 2,
    pub: "The Temple Bar Pub",
    par: 4,
    rule: "Accents only.",
    scoreGuide: [
      { label: "Bogey", detail: "Failed Par", icon: "⚠️" },
      { label: "Par", detail: "Pint of Lager", icon: "🍺" },
      { label: "Birdie", detail: "Pint of Lager + Tequila", icon: "🍺🥃" },
      { label: "Hole in 1", detail: "Pint of Lager + 2 Tequila shots", icon: "🍺🥃🥃" }
    ]
  },
  {
    number: 3,
    pub: "Porterhouse",
    par: 4,
    rule: "Left hand drinking only.",
    scoreGuide: [
      { label: "Bogey", detail: "Failed Par", icon: "⚠️" },
      { label: "Par", detail: "Pint of Guinness", icon: "🍺" },
      { label: "Birdie Task", detail: "Dirty Pint, made by another team of choosing", icon: "🍻" },
      { label: "Hole in 1", detail: "Pint of Guinness + 2 Whiskey shots", icon: "🍺🥃🥃" }
    ]
  },
  {
    number: 4,
    pub: "The Hairy Lemon",
    par: 4,
    rule: "Standing Only.",
    scoreGuide: [
      { label: "Bogey", detail: "Failed Par", icon: "⚠️" },
      { label: "Par", detail: "Pint of Lager", icon: "🍺" },
      { label: "Birdie", detail: "Pint of Lager + Sambuca", icon: "🍺🥃" },
      { label: "Hole in 1", detail: "Pint of Lager + 2 Sambucas", icon: "🍺🥃🥃" }
    ]
  },
  {
    number: 5,
    pub: "The Stags Head",
    par: 4,
    rule: "No pointing; use elbows.",
    scoreGuide: [
      { label: "Bogey", detail: "Failed Par", icon: "⚠️" },
      { label: "Par", detail: "Pint of Guinness", icon: "🍺" },
      { label: "Birdie", detail: "Skull", icon: "💀" },
      { label: "Hole in 1", detail: "Pint of Guinness + 2 Baby Guinness", icon: "🍺🥃🥃" }
    ]
  },
  {
    number: 6,
    pub: "The Long Hall",
    par: 4,
    rule: "No first names allowed.",
    scoreGuide: [
      { label: "Bogey", detail: "Failed Par", icon: "⚠️" },
      { label: "Par", detail: "Pint of Lager", icon: "🍺" },
      { label: "Birdie Task", detail: "Shoey", icon: "👟" },
      { label: "Hole in 1", detail: "Pint of Lager + 2 Vodkas", icon: "🍺🥃🥃" }
    ]
  },
  {
    number: 7,
    pub: "Bruxelles",
    par: 4,
    rule: "Anything goes.",
    scoreGuide: [
      { label: "Bogey", detail: "Failed Par", icon: "⚠️" },
      { label: "Par", detail: "Pint of Guinness", icon: "🍺" },
      { label: "Birdie", detail: "Pint of Guinness + Rum", icon: "🍺🥃" },
      { label: "Hole in 1", detail: "Pint of Guinness + 2 Rums", icon: "🍺🥃🥃" }
    ]
  },
  {
    number: 8,
    pub: "Kehoes Pub",
    par: 4,
    rule: "Question master.",
    scoreGuide: [
      { label: "Bogey", detail: "Failed Par", icon: "⚠️" },
      { label: "Par", detail: "Pint of Lager", icon: "🍺" },
      { label: "Birdie", detail: "Pint of Lager + Fireball", icon: "🍺🥃" },
      { label: "Hole in 1", detail: "Pint of Lager + 2 Fireballs", icon: "🍺🥃🥃" }
    ]
  },
  {
    number: 9,
    pub: "O'Donoghue's Bar",
    par: 4,
    rule: "Traditional closer.",
    scoreGuide: [
      { label: "Bogey", detail: "Failed Par", icon: "⚠️" },
      { label: "Par", detail: "Pint of Guinness", icon: "🍺" },
      { label: "Birdie", detail: "Pint of Guinness + Irish Whiskey", icon: "🍺🥃" },
      { label: "Hole in 1", detail: "Pint of Guinness + 2 Irish Whiskeys", icon: "🍺🥃🥃" }
    ]
  }
];

const playersPerTeam = 2;
const parTotal = holes.reduce((sum, hole) => sum + hole.par, 0) * playersPerTeam;
const fixedGameCode = "WESTIESPUBGOLF";
const gameName = "Westies Pub Golf";
const config = window.PUB_GOLF_CONFIG || {};
const hasSupabase = Boolean(config.supabaseUrl && config.supabaseAnonKey);
let supabase = null;
if (hasSupabase) {
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.45.4");
  supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
}
const app = document.querySelector("#app");
const template = document.querySelector("#app-template");

let state = {
  view: "home",
  gameCode: fixedGameCode,
  teamId: localStorage.getItem("pubGolfTeamId") || crypto.randomUUID(),
  teamName: "",
  scores: freshScores(),
  teams: [],
  channel: null
};

localStorage.setItem("pubGolfTeamId", state.teamId);
app.replaceChildren(template.content.cloneNode(true));

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const els = {
  teamName: $("#team-name"),
  adminPassword: $("#admin-password"),
  status: $("#connection-status"),
  holesList: $("#holes-list"),
  activeTeamName: $("#active-team-name"),
  teamTotal: $("#team-total"),
  summaryGameCode: $("#summary-game-code"),
  summaryPar: $("#summary-par"),
  summaryVsPar: $("#summary-vs-par"),
  playerLeaderboard: $("#player-leaderboard"),
  leaderboard: $("#leaderboard"),
  adminLeaderboard: $("#admin-leaderboard"),
  dialog: $("#leaderboard-dialog")
};

els.teamName.value = state.teamName;
renderStatus();
bindEvents();
renderHoles();
renderView();

function freshScores() {
  return holes.map((hole) => ({
    hole: hole.number,
    strokes: 0,
    penalties: 0,
    waterHazard: false,
    chunder: false
  }));
}

function bindEvents() {
  document.addEventListener("click", async (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;

    if (action === "home") {
      state.view = "home";
      renderView();
    }

    if (action === "share") {
      await copyShareLink();
    }

    if (action === "create-game") {
      state.gameCode = fixedGameCode;
      await ensureGame();
      renderStatus("Game created. Share the link with the teams.");
      await copyShareLink();
    }

    if (action === "join-team") {
      state.gameCode = fixedGameCode;
      const requestedTeamName = els.teamName.value.trim();
      if (!requestedTeamName) return renderStatus("Enter a team name before teeing off.");
      prepareTeamSession(requestedTeamName);
      await joinGame();
    }

    if (action === "admin-login") {
      const password = els.adminPassword.value.trim();
      if (password !== (config.adminPassword || "Westies1")) {
        return renderStatus("That caddy password is out of bounds.");
      }
      state.gameCode = fixedGameCode;
      await ensureGame();
      await loadTeams();
      state.view = "admin";
      renderView();
      subscribe();
    }

    if (action === "refresh-admin") {
      await loadTeams();
      renderLeaderboard(els.adminLeaderboard, { admin: true });
      renderStatus("Clubhouse scores refreshed.");
    }

    if (action === "remove-team") {
      const teamId = event.target.dataset.teamId;
      const teamName = event.target.dataset.teamName;
      if (!confirm(`Remove ${teamName} from this game?`)) return;
      await removeTeam(teamId);
      await loadTeams();
      renderStatus(`${teamName} removed from the game.`);
    }

    if (action === "show-leaderboard") {
      await loadTeams();
      renderLeaderboard(els.leaderboard);
      els.dialog.showModal();
    }

    if (action === "close-leaderboard") {
      els.dialog.close();
    }

    if (action === "score") {
      const hole = Number(event.target.dataset.hole);
      const field = event.target.dataset.field;
      const delta = Number(event.target.dataset.delta);
      updateScore(hole, field, delta);
      await saveScore();
    }

    if (action === "water") {
      const hole = Number(event.target.dataset.hole);
      const row = state.scores.find((score) => score.hole === hole);
      row.waterHazard = !row.waterHazard;
      renderHoles();
      renderSummary();
      await saveScore();
    }

    if (action === "chunder") {
      const hole = Number(event.target.dataset.hole);
      const row = state.scores.find((score) => score.hole === hole);
      row.chunder = !row.chunder;
      renderHoles();
      renderSummary();
      await saveScore();
    }
  });
}

function prepareTeamSession(teamName) {
  const previousTeamName = localStorage.getItem("pubGolfTeamName") || "";
  const isDifferentTeam = previousTeamName && previousTeamName.toLowerCase() !== teamName.toLowerCase();

  if (isDifferentTeam) {
    state.teamId = crypto.randomUUID();
    state.scores = freshScores();
    localStorage.setItem("pubGolfTeamId", state.teamId);
  }

  state.teamName = teamName;
}

async function joinGame() {
  localStorage.setItem("pubGolfTeamName", state.teamName);
  localStorage.setItem("pubGolfTeamId", state.teamId);
  await ensureGame();
  await loadTeamScore();
  renderHoles();
  await saveScore();
  await loadTeams();
  subscribe();
  state.view = "scorecard";
  renderView();
  updateUrl();
}

async function ensureGame() {
  if (!state.gameCode) return;
  if (!hasSupabase) {
    saveLocalGame();
    return;
  }
  const { error } = await supabase.from("games").upsert({
    code: state.gameCode,
    course_name: gameName,
    par_total: parTotal,
    updated_at: new Date().toISOString()
  });
  if (error) renderStatus(error.message);
}

async function loadTeamScore() {
  if (!hasSupabase) {
    const local = readLocalGame();
    const team = local.teams.find((item) => item.id === state.teamId);
    if (team) state.scores = normalizeScores(team.scores);
    return;
  }

  const { data, error } = await supabase
    .from("teams")
    .select("id, name, scores")
    .eq("game_code", state.gameCode)
    .eq("id", state.teamId)
    .maybeSingle();

  if (error) return renderStatus(error.message);
  if (data) {
    state.teamName = data.name;
    state.scores = normalizeScores(data.scores);
  }
}

async function saveScore() {
  const team = {
    id: state.teamId,
    game_code: state.gameCode,
    name: state.teamName,
    scores: state.scores,
    total: calculateTotal(state.scores),
    updated_at: new Date().toISOString()
  };

  if (!hasSupabase) {
    saveLocalTeam(team);
    await loadTeams();
    return;
  }

  const { error } = await supabase.from("teams").upsert(team);
  if (error) renderStatus(error.message);
}

async function loadTeams() {
  if (!state.gameCode) return;
  if (!hasSupabase) {
    state.teams = readLocalGame().teams;
    renderAllLeaderboards();
    return;
  }

  const { data, error } = await supabase
    .from("teams")
    .select("id, name, scores, total, updated_at")
    .eq("game_code", state.gameCode)
    .order("total", { ascending: true });

  if (error) return renderStatus(error.message);
  state.teams = data || [];
  renderAllLeaderboards();
}

async function removeTeam(teamId) {
  if (!hasSupabase) {
    removeLocalTeam(teamId);
    return;
  }

  const { error } = await supabase
    .from("teams")
    .delete()
    .eq("game_code", state.gameCode)
    .eq("id", teamId);

  if (error) renderStatus(error.message);
}

function subscribe() {
  if (!hasSupabase || state.channel) return;

  state.channel = supabase
    .channel(`pub-golf-${state.gameCode}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "teams", filter: `game_code=eq.${state.gameCode}` },
      async () => {
        await loadTeams();
        renderSummary();
      }
    )
    .subscribe();
}

function updateScore(hole, field, delta) {
  const row = state.scores.find((score) => score.hole === hole);
  row[field] = Math.max(0, row[field] + delta);
  renderHoles();
  renderSummary();
}

function normalizeScores(scores) {
  const incoming = Array.isArray(scores) ? scores : [];
  return holes.map((hole) => ({
    hole: hole.number,
    strokes: Number(incoming.find((score) => score.hole === hole.number)?.strokes || 0),
    penalties: Number(incoming.find((score) => score.hole === hole.number)?.penalties || 0),
    waterHazard: Boolean(incoming.find((score) => score.hole === hole.number)?.waterHazard),
    chunder: Boolean(incoming.find((score) => score.hole === hole.number)?.chunder)
  }));
}

function calculateTotal(scores) {
  return scores.reduce((sum, score) => {
    return sum + score.strokes + score.penalties + (score.waterHazard ? 2 : 0) + (score.chunder ? 3 : 0);
  }, 0);
}

function renderHoles() {
  els.holesList.innerHTML = holes.map((hole) => {
    const score = state.scores.find((item) => item.hole === hole.number);
    return `
      <article class="hole-card">
        <div class="hole-header">
          <div>
            <p class="eyebrow">Hole ${hole.number}</p>
            <h3>${escapeHtml(hole.pub)}</h3>
            <span>Par ${hole.par}</span>
          </div>
          <span aria-hidden="true">☘</span>
        </div>
        <p class="rule">${escapeHtml(hole.rule)}</p>
        ${scoreGuideTemplate(hole.scoreGuide)}
        <div class="score-controls">
          ${counterTemplate(hole.number, "strokes", "Strokes", score.strokes)}
          ${counterTemplate(hole.number, "penalties", "Penalties (+)", score.penalties)}
          <button class="water-button ${score.waterHazard ? "active" : ""}" data-action="water" data-hole="${hole.number}">
            🏃 Water Hazard (+2)
          </button>
          <button class="chunder-button ${score.chunder ? "active" : ""}" data-action="chunder" data-hole="${hole.number}">
            🤮 Chunder (+3)
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function scoreGuideTemplate(scoreGuide = []) {
  if (!scoreGuide.length) return "";
  return `
    <div class="score-guide">
      ${scoreGuide.map((item) => `
        <div>
          <span aria-hidden="true">${item.icon}</span>
          <strong>${escapeHtml(item.label)}</strong>
          <small>${escapeHtml(item.detail)}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function counterTemplate(hole, field, label, value) {
  return `
    <div class="counter">
      <p>${label}</p>
      <div class="counter-row">
        <button data-action="score" data-hole="${hole}" data-field="${field}" data-delta="-1" aria-label="Decrease ${label}">−</button>
        <span>${value}</span>
        <button data-action="score" data-hole="${hole}" data-field="${field}" data-delta="1" aria-label="Increase ${label}">+</button>
      </div>
    </div>
  `;
}

function renderSummary() {
  const total = calculateTotal(state.scores);
  els.activeTeamName.textContent = state.teamName || "No team";
  els.teamTotal.textContent = total;
  els.summaryGameCode.textContent = gameName;
  els.summaryPar.textContent = parTotal;
  els.summaryVsPar.textContent = total - parTotal > 0 ? `+${total - parTotal}` : `${total - parTotal}`;
}

function renderAllLeaderboards() {
  renderLeaderboard(els.playerLeaderboard);
  renderLeaderboard(els.adminLeaderboard, { admin: true });
}

function renderLeaderboard(target, options = {}) {
  if (!target) return;
  const rows = [...state.teams].sort((a, b) => calculateTotal(a.scores) - calculateTotal(b.scores));
  target.innerHTML = rows.length ? rows.map((team, index) => {
    const scores = normalizeScores(team.scores);
    const total = calculateTotal(scores);
    const vsPar = total - parTotal;
    const updated = team.updated_at ? new Date(team.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now";
    const adminControls = options.admin ? `
      <button class="danger-button" data-action="remove-team" data-team-id="${team.id}" data-team-name="${escapeHtml(team.name)}">Remove</button>
      <div class="hole-strip">${scores.map((score) => {
        const holeTotal = score.strokes + score.penalties + (score.waterHazard ? 2 : 0) + (score.chunder ? 3 : 0);
        return `<span>H${score.hole}: ${holeTotal}</span>`;
      }).join("")}</div>
      <small>Updated ${updated}</small>
    ` : "";
    return `
      <div class="leader-row">
        <span>#${index + 1}</span>
        <strong>${escapeHtml(team.name)}</strong>
        <span>${total}</span>
        <small>${vsPar > 0 ? "+" : ""}${vsPar}</small>
        ${adminControls}
      </div>
    `;
  }).join("") : `<p>No teams have teed off yet.</p>`;
}

function renderView() {
  $$("[data-view]").forEach((view) => {
    view.hidden = view.dataset.view !== state.view;
  });
  renderSummary();
  renderAllLeaderboards();
}

function renderStatus(message) {
  const mode = hasSupabase ? "Supabase realtime ready." : "Local preview mode. Add Supabase config for public realtime.";
  els.status.textContent = message || mode;
}

function updateUrl() {
  const url = new URL(location.href);
  url.searchParams.delete("game");
  history.replaceState({}, "", url);
}

async function copyShareLink() {
  const url = new URL(location.href);
  url.searchParams.delete("game");
  try {
    await navigator.clipboard.writeText(url.toString());
    renderStatus("Game link copied.");
  } catch {
    renderStatus(url.toString());
  }
}

function readLocalGame() {
  const key = `pubGolf:${state.gameCode}`;
  return JSON.parse(localStorage.getItem(key) || `{"teams":[]}`);
}

function saveLocalGame() {
  const key = `pubGolf:${state.gameCode}`;
  if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ teams: [] }));
}

function saveLocalTeam(team) {
  const key = `pubGolf:${state.gameCode}`;
  const game = readLocalGame();
  const index = game.teams.findIndex((item) => item.id === team.id);
  if (index >= 0) {
    game.teams[index] = team;
  } else {
    game.teams.push(team);
  }
  localStorage.setItem(key, JSON.stringify(game));
}

function removeLocalTeam(teamId) {
  const key = `pubGolf:${state.gameCode}`;
  const game = readLocalGame();
  game.teams = game.teams.filter((team) => team.id !== teamId);
  localStorage.setItem(key, JSON.stringify(game));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}
