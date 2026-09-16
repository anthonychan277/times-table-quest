(function () {
  "use strict";

  var facts = [
    { a: 2, b: 2, answer: 4, story: "Two magic ribbons make four bright loops." },
    { a: 2, b: 3, answer: 6, story: "Two shadow skates glide past Gate 6." },
    { a: 2, b: 4, answer: 8, story: "Two bows sparkle into eight tiny stars." },
    { a: 2, b: 5, answer: 10, story: "Two high-fives make ten happy fingers." },
    { a: 2, b: 6, answer: 12, story: "Two treasure maps point to Chest 12." },
    { a: 2, b: 7, answer: 14, story: "Two capes fly across Tower 14." },
    { a: 2, b: 8, answer: 16, story: "Two magic teams charge to Level 16." },
    { a: 2, b: 9, answer: 18, story: "Two moon rockets land at Star 18." },
    { a: 3, b: 3, answer: 9, story: "Three treasure doors open to Room 9." },
    { a: 3, b: 4, answer: 12, story: "Three race cars zoom to Gate 12." },
    { a: 3, b: 6, answer: 18, story: "Three rockets blast toward Star 18." },
    { a: 3, b: 7, answer: 21, story: "Three purple slides land on Cloud 21." },
    { a: 3, b: 8, answer: 24, story: "Three drum teams march to Beat 24." },
    { a: 3, b: 9, answer: 27, story: "Three magic lifts stop at Floor 27." },
    { a: 4, b: 3, answer: 12, story: "Four treasure carts roll into Cave 12." },
    { a: 4, b: 4, answer: 16, story: "Four square windows light up House 16." },
    { a: 4, b: 6, answer: 24, story: "Four pizza plates spin toward Table 24." },
    { a: 4, b: 7, answer: 28, story: "Four trains race into Station 28." },
    { a: 4, b: 8, answer: 32, story: "Four game teams jump to Level 32." },
    { a: 4, b: 9, answer: 36, story: "Four spotlights shine on Stage 36." },
    { a: 5, b: 2, answer: 10, story: "Five pairs of shoes step to Door 10." },
    { a: 5, b: 3, answer: 15, story: "Five star charms glow at Rock 15." },
    { a: 5, b: 4, answer: 20, story: "Five music bands play Beat 20." },
    { a: 5, b: 5, answer: 25, story: "Five golden keys unlock Room 25." },
    { a: 5, b: 6, answer: 30, story: "Five snack boxes fill Shelf 30." },
    { a: 5, b: 7, answer: 35, story: "Five pink steps climb to Cloud 35." },
    { a: 5, b: 8, answer: 40, story: "Five race teams speed to Lap 40." },
    { a: 5, b: 9, answer: 45, story: "Five spotlights shine on Stage 45." },
    { a: 10, b: 2, answer: 20, story: "Ten coins drop into Jar 20." },
    { a: 10, b: 3, answer: 30, story: "Ten drum beats echo to Beat 30." },
    { a: 10, b: 4, answer: 40, story: "Ten balloons float to Sky 40." },
    { a: 10, b: 5, answer: 50, story: "Ten racers dash to Flag 50." },
    { a: 10, b: 6, answer: 60, story: "Ten fireworks sparkle at Star 60." },
    { a: 10, b: 7, answer: 70, story: "Ten treasure carts roll to Cave 70." },
    { a: 10, b: 8, answer: 80, story: "Ten heroes charge to Level 80." },
    { a: 10, b: 9, answer: 90, story: "Ten magic lifts stop at Floor 90." }
  ];

  var gear = [
    { id: "bow", name: "Pink Bow", cost: 0, className: "gear-bow" },
    { id: "wand", name: "Magic Wand", cost: 25, className: "gear-wand" },
    { id: "cape", name: "Star Cape", cost: 55, className: "gear-cape" },
    { id: "crown", name: "Moon Crown", cost: 95, className: "gear-crown" }
  ];

  var worlds = [
    { name: "Pink Forest", set: "starter", boss: "Mimi Shade", hp: 6, reward: "Forest Card" },
    { name: "Purple Castle", set: "threefour", boss: "Tower Wink", hp: 7, reward: "Castle Card" },
    { name: "Star Cave", set: "mixed", boss: "Glitter Gloom", hp: 8, reward: "Cave Card" },
    { name: "Boss Tower", set: "weak", boss: "Night Queen", hp: 9, reward: "Tower Card" }
  ];

  var state = loadState();
  var currentMode = "battle";
  var currentSet = state.selectedSet || "starter";
  var currentWorld = state.selectedWorld || 0;
  var round = null;
  var timerId = null;
  var questionStartedAt = 0;
  var audioContext = null;

  var screens = {
    home: document.getElementById("homeScreen"),
    game: document.getElementById("gameScreen"),
    results: document.getElementById("resultsScreen"),
    report: document.getElementById("reportScreen")
  };

  var els = {
    soundButton: document.getElementById("soundButton"),
    homeStars: document.getElementById("homeStars"),
    homeAccuracy: document.getElementById("homeAccuracy"),
    homeStreak: document.getElementById("homeStreak"),
    missionProgress: document.getElementById("missionProgress"),
    reviewCount: document.getElementById("reviewCount"),
    unlockRow: document.getElementById("unlockRow"),
    bossCards: document.getElementById("bossCards"),
    exitButton: document.getElementById("exitButton"),
    roundCounter: document.getElementById("roundCounter"),
    comboText: document.getElementById("comboText"),
    roundStars: document.getElementById("roundStars"),
    battleHud: document.getElementById("battleHud"),
    heartText: document.getElementById("heartText"),
    bossHpBar: document.getElementById("bossHpBar"),
    timerBar: document.getElementById("timerBar"),
    arena: document.getElementById("arena"),
    targetAvatar: document.getElementById("targetAvatar"),
    bossAvatar: document.getElementById("bossAvatar"),
    spellTrail: document.getElementById("spellTrail"),
    promptLabel: document.getElementById("promptLabel"),
    questionText: document.getElementById("questionText"),
    answers: document.getElementById("answers"),
    practicePanel: document.getElementById("practicePanel"),
    practiceStatus: document.getElementById("practiceStatus"),
    checkButton: document.getElementById("checkButton"),
    feedbackPop: document.getElementById("feedbackPop"),
    memoryCard: document.getElementById("memoryCard"),
    memoryTitle: document.getElementById("memoryTitle"),
    memoryFact: document.getElementById("memoryFact"),
    memoryStory: document.getElementById("memoryStory"),
    continueButton: document.getElementById("continueButton"),
    resultMedal: document.getElementById("resultMedal"),
    resultTitle: document.getElementById("resultTitle"),
    resultScore: document.getElementById("resultScore"),
    resultStars: document.getElementById("resultStars"),
    resultCombo: document.getElementById("resultCombo"),
    resultMessage: document.getElementById("resultMessage"),
    playAgainButton: document.getElementById("playAgainButton"),
    homeButton: document.getElementById("homeButton"),
    reportButton: document.getElementById("reportButton"),
    reportHomeButton: document.getElementById("reportHomeButton"),
    reportToday: document.getElementById("reportToday"),
    reportAccuracy: document.getElementById("reportAccuracy"),
    reportSpeed: document.getElementById("reportSpeed"),
    strongList: document.getElementById("strongList"),
    weakList: document.getElementById("weakList"),
    suggestionText: document.getElementById("suggestionText")
  };

  document.querySelectorAll("[data-mode]").forEach(function (button) {
    button.addEventListener("click", function () {
      startRound(button.dataset.mode);
    });
  });

  document.querySelectorAll("[data-set]").forEach(function (button) {
    button.addEventListener("click", function () {
      currentSet = button.dataset.set;
      state.selectedSet = currentSet;
      saveState();
      renderHome();
    });
  });

  document.querySelectorAll("[data-world]").forEach(function (button) {
    button.addEventListener("click", function () {
      currentWorld = Number(button.dataset.world);
      state.selectedWorld = currentWorld;
      currentSet = worlds[currentWorld].set === "weak" ? "mixed" : worlds[currentWorld].set;
      saveState();
      renderHome();
    });
  });

  els.soundButton.addEventListener("click", function () {
    state.sound = !state.sound;
    saveState();
    renderHome();
    playSound(state.sound ? "select" : "wrong");
  });

  els.exitButton.addEventListener("click", function () {
    clearTimer();
    showScreen("home");
    renderHome();
  });

  els.continueButton.addEventListener("click", function () {
    els.memoryCard.hidden = true;
    askQuestion(round.currentFact, true);
  });

  els.checkButton.addEventListener("click", function () {
    checkPracticeAnswer();
  });

  els.playAgainButton.addEventListener("click", function () {
    startRound(currentMode);
  });

  els.homeButton.addEventListener("click", function () {
    showScreen("home");
    renderHome();
  });

  els.reportButton.addEventListener("click", function () {
    renderReport();
    showScreen("report");
  });

  els.reportHomeButton.addEventListener("click", function () {
    showScreen("home");
    renderHome();
  });

  renderHome();

  function loadState() {
    var initial = {
      stars: 0,
      dailyStars: 0,
      lastDay: todayKey(),
      mistakes: {},
      history: [],
      sound: true,
      selectedGear: "bow",
      selectedSet: "starter",
      selectedWorld: 0,
      bossCards: {},
      bestCombo: 0
    };

    try {
      var saved = JSON.parse(localStorage.getItem("timesTableQuest") || "null");
      if (!saved) return initial;
      var merged = Object.assign(initial, saved);
      merged.history = Array.isArray(merged.history) ? merged.history.slice(-400) : [];
      merged.bossCards = merged.bossCards || {};
      if (merged.lastDay !== todayKey()) {
        merged.dailyStars = 0;
        merged.lastDay = todayKey();
      }
      return merged;
    } catch (error) {
      return initial;
    }
  }

  function saveState() {
    localStorage.setItem("timesTableQuest", JSON.stringify(state));
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.toggle("active", key === name);
    });
  }

  function renderHome() {
    var summary = buildSummary();
    els.homeStars.textContent = state.stars;
    els.soundButton.textContent = state.sound ? "Sound On" : "Sound Off";
    els.homeAccuracy.textContent = summary.total ? "Accuracy " + Math.round(summary.accuracy * 100) + "%" : "Accuracy --";
    els.homeStreak.textContent = "Best combo " + (state.bestCombo || 0);
    els.missionProgress.textContent = Math.min(state.dailyStars, 20) + "/20";

    document.querySelectorAll("[data-set]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.set === currentSet);
    });

    document.querySelectorAll("[data-world]").forEach(function (button) {
      var index = Number(button.dataset.world);
      var locked = index > 0 && state.stars < index * 18;
      button.classList.toggle("active", index === currentWorld);
      button.classList.toggle("locked", locked);
      button.disabled = locked;
    });

    var weakFacts = getWeakFacts(5);
    els.reviewCount.textContent = weakFacts.length ? weakFacts.length + " weak facts ready" : "No weak facts yet";

    els.unlockRow.innerHTML = "";
    gear.forEach(function (item) {
      var unlocked = state.stars >= item.cost;
      var node = document.createElement("button");
      node.type = "button";
      node.className = "unlock " + item.className + (unlocked ? "" : " locked");
      node.innerHTML = "<strong>" + item.name + "</strong><small>" + (unlocked ? "Unlocked" : item.cost + " stars") + "</small>";
      node.addEventListener("click", function () {
        if (!unlocked) return;
        state.selectedGear = item.id;
        saveState();
        renderHome();
      });
      node.classList.toggle("selected", state.selectedGear === item.id);
      els.unlockRow.appendChild(node);
    });

    els.bossCards.innerHTML = "";
    worlds.forEach(function (world, index) {
      var card = document.createElement("div");
      card.className = "boss-card" + (state.bossCards[world.reward] ? "" : " locked");
      card.innerHTML = "<strong>" + world.reward + "</strong><small>" + (state.bossCards[world.reward] ? "Collected" : "Beat " + world.name) + "</small>";
      els.bossCards.appendChild(card);
    });
  }

  function startRound(mode) {
    currentMode = mode;
    var pool = getPool(mode);
    if (!pool.length) {
      pool = getPool("battle");
    }

    var isBattle = mode === "battle";
    var world = worlds[currentWorld] || worlds[0];
    round = {
      mode: mode,
      world: world,
      queue: buildQueue(pool, isBattle ? 8 : 10),
      index: 0,
      correct: 0,
      stars: 0,
      combo: 0,
      bestCombo: 0,
      hearts: isBattle ? 3 : 99,
      maxHearts: isBattle ? 3 : 99,
      bossHp: isBattle ? world.hp : 0,
      bossMaxHp: isBattle ? world.hp : 0,
      revenge: [],
      currentFact: null,
      locked: false,
      selectedOption: null,
      selectedButton: null,
      practiceSwitches: 0
    };

    els.memoryCard.hidden = true;
    els.battleHud.hidden = !isBattle;
    showScreen("game");
    askNext();
  }

  function getPool(mode) {
    if (mode === "review") {
      var weak = getWeakFacts(10).map(function (item) { return findFact(item.key); }).filter(Boolean);
      return weak.length ? weak : facts.slice(0, 12);
    }

    if (mode === "battle" && worlds[currentWorld] && worlds[currentWorld].set === "weak") {
      var weakFacts = getWeakFacts(12).map(function (item) { return findFact(item.key); }).filter(Boolean);
      if (weakFacts.length) return weakFacts;
    }

    return facts.filter(function (fact) {
      var set = mode === "battle" ? worlds[currentWorld].set : currentSet;
      if (set === "starter") return fact.a === 2 || fact.a === 5 || fact.a === 10;
      if (set === "threefour") return fact.a === 3 || fact.a === 4;
      if (set === "three") return fact.a === 3;
      if (set === "four") return fact.a === 4;
      return true;
    });
  }

  function buildQueue(pool, count) {
    var queue = [];
    var shuffled = shuffle(pool.slice());
    while (queue.length < count) {
      queue = queue.concat(shuffle(shuffled.slice()));
    }
    return queue.slice(0, count);
  }

  function askNext() {
    if (round.mode === "battle" && (round.bossHp <= 0 || round.hearts <= 0)) {
      finishRound();
      return;
    }
    if (round.index >= round.queue.length) {
      finishRound();
      return;
    }
    askQuestion(round.queue[round.index], false);
  }

  function askQuestion(fact, retry) {
    clearTimer();
    round.locked = false;
    round.currentFact = fact;
    round.selectedOption = null;
    round.selectedButton = null;

    els.roundCounter.textContent = Math.min(round.index + 1, round.queue.length) + " / " + round.queue.length;
    els.comboText.textContent = "Combo x" + round.combo;
    els.roundStars.textContent = round.stars;
    els.promptLabel.textContent = getPromptLabel(retry);
    els.questionText.textContent = fact.a + " x " + fact.b + " = ?";
    els.answers.innerHTML = "";
    els.practicePanel.hidden = round.mode !== "practice";
    els.checkButton.disabled = true;
    els.practiceStatus.textContent = "Choose one answer first.";
    els.battleHud.hidden = round.mode !== "battle";
    updateBattleHud();

    makeOptions(fact.answer).forEach(function (option) {
      var button = document.createElement("button");
      button.className = "answer-button";
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", function () {
        chooseAnswer(option, button);
      });
      els.answers.appendChild(button);
    });

    questionStartedAt = performance.now();

    if (round.mode === "practice") {
      els.timerBar.style.transform = "scaleX(1)";
      return;
    }

    tickTimer();
    timerId = window.setInterval(tickTimer, 60);
  }

  function chooseAnswer(option, button) {
    if (round.locked) return;
    if (round.mode === "practice") {
      selectPracticeAnswer(option, button);
      return;
    }
    handleAnswer(option, button);
  }

  function selectPracticeAnswer(option, button) {
    if (round.selectedButton && round.selectedButton !== button) {
      round.practiceSwitches += 1;
    }

    document.querySelectorAll(".answer-button").forEach(function (item) {
      item.classList.toggle("selected", item === button);
    });

    round.selectedOption = option;
    round.selectedButton = button;
    els.checkButton.disabled = false;
    els.practiceStatus.textContent = "You chose " + option + ". Press Check when you are sure.";

    if (round.practiceSwitches >= 3) {
      slowPracticeTapping();
    }
  }

  function slowPracticeTapping() {
    round.locked = true;
    round.practiceSwitches = 0;
    round.selectedOption = null;
    round.selectedButton = null;
    els.checkButton.disabled = true;
    els.practiceStatus.textContent = "Pause and think first. The answers moved!";
    showFeedback("Think first");
    playSound("warn");

    var buttons = Array.prototype.slice.call(els.answers.children);
    shuffle(buttons).forEach(function (button) {
      button.classList.remove("selected");
      els.answers.appendChild(button);
    });

    setTimeout(function () {
      round.locked = false;
      els.practiceStatus.textContent = "Choose one answer first.";
    }, 900);
  }

  function checkPracticeAnswer() {
    if (round.locked || round.selectedOption === null || !round.selectedButton) return;
    handleAnswer(round.selectedOption, round.selectedButton);
  }

  function handleAnswer(option, button) {
    round.locked = true;
    clearTimer();
    els.checkButton.disabled = true;

    var fact = round.currentFact;
    var correct = option === fact.answer;
    var elapsed = Math.max(0.1, (performance.now() - questionStartedAt) / 1000);
    recordAttempt(fact, correct, elapsed, round.mode);

    if (correct) {
      handleCorrect(fact, elapsed, button);
    } else {
      handleWrong(fact, button);
    }
  }

  function handleCorrect(fact, elapsed, button) {
    var damage = round.combo >= 2 ? 2 : 1;
    button.classList.add("correct");
    round.correct += 1;
    round.combo += 1;
    round.bestCombo = Math.max(round.bestCombo, round.combo);
    state.bestCombo = Math.max(state.bestCombo || 0, round.bestCombo);

    if (round.mode === "battle") {
      round.bossHp = Math.max(0, round.bossHp - damage);
      animateAttack();
    }

    var earned = round.mode === "practice" ? 1 : elapsed <= getTimeLimit() ? 2 : 1;
    if (round.combo >= 3) earned += 1;
    if (round.revenge.indexOf(factKey(fact)) !== -1) earned += 1;
    round.stars += earned;
    state.stars += earned;
    state.dailyStars += earned;
    state.mistakes[factKey(fact)] = Math.max(0, (state.mistakes[factKey(fact)] || 0) - 1);
    saveState();

    updateBattleHud();
    showFeedback(round.combo >= 3 ? "Combo x" + round.combo : "Hit!");
    playSound(round.combo >= 3 ? "combo" : "correct");

    setTimeout(function () {
      round.index += 1;
      askNext();
    }, round.mode === "battle" ? 760 : 620);
  }

  function handleWrong(fact, button) {
    button.classList.add("wrong");
    round.combo = 0;
    state.mistakes[factKey(fact)] = (state.mistakes[factKey(fact)] || 0) + 1;
    round.revenge.push(factKey(fact));

    if (round.mode === "battle") {
      round.hearts = Math.max(0, round.hearts - 1);
      animateBossHit();
    }

    saveState();
    updateBattleHud();
    showFeedback(round.mode === "battle" ? "Boss hit!" : "Try again");
    playSound(round.hearts <= 1 && round.mode === "battle" ? "warn" : "wrong");
    showMemory(fact, round.mode === "battle" ? "Boss hint" : "Remember");
  }

  function tickTimer() {
    var elapsed = (performance.now() - questionStartedAt) / 1000;
    var limit = getTimeLimit();
    var remaining = Math.max(0, limit - elapsed);
    els.timerBar.style.transform = "scaleX(" + (remaining / limit).toFixed(3) + ")";

    if (remaining <= 0) {
      clearTimer();
      if (round.locked) return;
      round.locked = true;
      round.combo = 0;
      var fact = round.currentFact;
      recordAttempt(fact, false, limit, round.mode);
      state.mistakes[factKey(fact)] = (state.mistakes[factKey(fact)] || 0) + 1;
      round.revenge.push(factKey(fact));
      if (round.mode === "battle") {
        round.hearts = Math.max(0, round.hearts - 1);
        animateBossHit();
      }
      saveState();
      updateBattleHud();
      showFeedback("Time up");
      playSound("warn");
      showMemory(fact, "Time up");
    }
  }

  function updateBattleHud() {
    if (!round || round.mode !== "battle") return;
    els.heartText.textContent = round.hearts + " / " + round.maxHearts;
    els.bossHpBar.style.transform = "scaleX(" + (round.bossHp / round.bossMaxHp).toFixed(3) + ")";
  }

  function showMemory(fact, title) {
    els.memoryTitle.textContent = title;
    els.memoryFact.textContent = fact.a + " x " + fact.b + " = " + fact.answer;
    els.memoryStory.textContent = fact.story;
    els.memoryCard.hidden = false;
  }

  function getPromptLabel(retry) {
    if (round.mode === "practice") return retry ? "Try again, then Check!" : "Choose carefully, then Check!";
    if (round.mode === "battle") return retry ? "Strike back!" : round.world.boss + " is waiting!";
    if (round.combo >= 4) return "Fast mode: 4 seconds!";
    return retry ? "Try again!" : "Choose the answer!";
  }

  function getTimeLimit() {
    if (!round || round.mode === "practice") return 5;
    if (round.mode === "battle") return 8;
    if (round.combo >= 4) return 4;
    return 5;
  }

  function finishRound() {
    clearTimer();
    var wonBattle = round.mode === "battle" && round.bossHp <= 0;
    if (wonBattle) {
      state.bossCards[round.world.reward] = true;
      saveState();
      playSound("victory");
    }
    showScreen("results");

    els.resultScore.textContent = round.correct + " / " + round.queue.length;
    els.resultStars.textContent = round.stars;
    els.resultCombo.textContent = round.bestCombo;

    if (wonBattle) {
      els.resultTitle.textContent = "Boss defeated!";
      els.resultMessage.textContent = "You won " + round.world.reward + ".";
      els.resultMedal.textContent = "B";
    } else if (round.mode === "battle" && round.hearts <= 0) {
      els.resultTitle.textContent = "Battle lost";
      els.resultMessage.textContent = "Review the hint facts, then try again.";
      els.resultMedal.textContent = "R";
    } else if (round.correct === round.queue.length) {
      els.resultTitle.textContent = "Perfect run!";
      els.resultMessage.textContent = "Every fact was clear today.";
      els.resultMedal.textContent = "P";
    } else if (round.correct >= Math.ceil(round.queue.length * 0.8)) {
      els.resultTitle.textContent = "Great run!";
      els.resultMessage.textContent = "One more round can lock it in.";
      els.resultMedal.textContent = "S";
    } else {
      els.resultTitle.textContent = "Good practice!";
      els.resultMessage.textContent = "Weak facts are ready in Review.";
      els.resultMedal.textContent = "G";
    }
  }

  function makeOptions(answer) {
    var options = [answer];
    var candidates = facts.map(function (fact) { return fact.answer; })
      .concat([6, 8, 10, 14, 15, 20, 30, 40, 50, 60, 70, 80, 90]);

    candidates = shuffle(candidates.filter(function (value, index, array) {
      return value !== answer && array.indexOf(value) === index;
    }));

    candidates.forEach(function (value) {
      if (options.length < 4 && Math.abs(value - answer) <= 15) options.push(value);
    });

    candidates.forEach(function (value) {
      if (options.length < 4) options.push(value);
    });

    return shuffle(options);
  }

  function recordAttempt(fact, correct, elapsed, mode) {
    state.history.push({
      key: factKey(fact),
      a: fact.a,
      b: fact.b,
      answer: fact.answer,
      correct: !!correct,
      elapsed: Number(elapsed.toFixed(2)),
      mode: mode,
      day: todayKey(),
      time: Date.now()
    });
    state.history = state.history.slice(-400);
  }

  function buildSummary() {
    var history = state.history || [];
    var total = history.length;
    var correct = history.filter(function (item) { return item.correct; }).length;
    var speedItems = history.filter(function (item) { return item.correct; });
    var speed = speedItems.length ? speedItems.reduce(function (sum, item) { return sum + item.elapsed; }, 0) / speedItems.length : 0;
    return { total: total, correct: correct, accuracy: total ? correct / total : 0, speed: speed };
  }

  function getFactStats() {
    var stats = {};
    (state.history || []).forEach(function (item) {
      stats[item.key] = stats[item.key] || { key: item.key, total: 0, correct: 0, elapsed: 0 };
      stats[item.key].total += 1;
      stats[item.key].correct += item.correct ? 1 : 0;
      stats[item.key].elapsed += item.elapsed || 0;
    });
    return Object.keys(stats).map(function (key) {
      var item = stats[key];
      item.accuracy = item.total ? item.correct / item.total : 0;
      item.average = item.total ? item.elapsed / item.total : 0;
      return item;
    });
  }

  function getWeakFacts(limit) {
    var stats = getFactStats().filter(function (item) {
      return item.total >= 2 && item.accuracy < 0.85;
    });
    stats.sort(function (a, b) {
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
      return b.total - a.total;
    });

    var fromMistakes = Object.keys(state.mistakes || {})
      .filter(function (key) { return state.mistakes[key] > 0; })
      .map(function (key) { return { key: key, total: state.mistakes[key], correct: 0, accuracy: 0, average: 0 }; });

    var merged = stats.concat(fromMistakes).filter(function (item, index, array) {
      return array.findIndex(function (candidate) { return candidate.key === item.key; }) === index;
    });

    return merged.slice(0, limit);
  }

  function renderReport() {
    var summary = buildSummary();
    var todayItems = (state.history || []).filter(function (item) { return item.day === todayKey(); });
    var strong = getFactStats()
      .filter(function (item) { return item.total >= 2 && item.accuracy >= 0.85; })
      .sort(function (a, b) { return b.accuracy - a.accuracy || a.average - b.average; })
      .slice(0, 5);
    var weak = getWeakFacts(5);

    els.reportToday.textContent = todayItems.length + " questions";
    els.reportAccuracy.textContent = summary.total ? Math.round(summary.accuracy * 100) + "%" : "--";
    els.reportSpeed.textContent = summary.speed ? summary.speed.toFixed(1) + " sec" : "--";
    renderFactList(els.strongList, strong, "No strong facts yet.");
    renderFactList(els.weakList, weak, "No weak facts yet.");

    if (weak.length) {
      els.suggestionText.textContent = "Next: play Review for " + weak.map(function (item) { return item.key.replace("x", " x "); }).slice(0, 3).join(", ") + ".";
    } else if (summary.total < 10) {
      els.suggestionText.textContent = "Next: play one Pink Forest battle to collect more data.";
    } else {
      els.suggestionText.textContent = "Next: try Purple Castle or Star Cave for a bigger challenge.";
    }
  }

  function renderFactList(container, items, emptyText) {
    container.innerHTML = "";
    if (!items.length) {
      var empty = document.createElement("p");
      empty.className = "subtle";
      empty.textContent = emptyText;
      container.appendChild(empty);
      return;
    }
    items.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "fact-row";
      row.innerHTML = "<strong>" + item.key.replace("x", " x ") + "</strong><span>" + Math.round(item.accuracy * 100) + "%</span><small>" + item.total + " tries</small>";
      container.appendChild(row);
    });
  }

  function clearTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function showFeedback(text) {
    els.feedbackPop.textContent = text;
    els.feedbackPop.classList.remove("show");
    void els.feedbackPop.offsetWidth;
    els.feedbackPop.classList.add("show");
  }

  function animateAttack() {
    els.targetAvatar.classList.add("hit");
    els.bossAvatar.classList.add("boss-damaged");
    els.spellTrail.classList.add("cast");
    setTimeout(function () {
      els.targetAvatar.classList.remove("hit");
      els.bossAvatar.classList.remove("boss-damaged");
      els.spellTrail.classList.remove("cast");
    }, 420);
  }

  function animateBossHit() {
    els.bossAvatar.classList.add("boss-attack");
    els.targetAvatar.classList.add("hero-damaged");
    setTimeout(function () {
      els.bossAvatar.classList.remove("boss-attack");
      els.targetAvatar.classList.remove("hero-damaged");
    }, 420);
  }

  function playSound(type) {
    if (!state.sound) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      var patterns = {
        select: [[420, 0.05], [560, 0.06]],
        correct: [[660, 0.06], [880, 0.08]],
        combo: [[660, 0.05], [860, 0.05], [1080, 0.1]],
        wrong: [[220, 0.08], [160, 0.1]],
        warn: [[320, 0.08], [260, 0.08], [320, 0.08]],
        victory: [[520, 0.08], [660, 0.08], [880, 0.12], [1040, 0.18]]
      };
      var pattern = patterns[type] || patterns.select;
      var start = audioContext.currentTime;
      pattern.forEach(function (note, index) {
        chirp(note[0], note[1], start + index * 0.09);
      });
    } catch (error) {
      state.sound = false;
    }
  }

  function chirp(frequency, duration, startAt) {
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.08, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  }

  function factKey(fact) {
    return fact.a + "x" + fact.b;
  }

  function findFact(key) {
    return facts.find(function (fact) {
      return factKey(fact) === key;
    });
  }

  function shuffle(array) {
    for (var index = array.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(Math.random() * (index + 1));
      var temp = array[index];
      array[index] = array[swapIndex];
      array[swapIndex] = temp;
    }
    return array;
  }
}());
